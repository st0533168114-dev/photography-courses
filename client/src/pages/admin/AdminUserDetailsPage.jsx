import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { getUserById, updateUser, deleteUser } from "../../API/userApi";
import styles from "../../CSS/pages/admin/AdminUserDetailsPage.module.css";

export default function AdminUserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isSelf = authUser?._id === userId;

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserById(userId);
        setUser(userData);
        setLoadError(null);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת פרטי המשתמש");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleToggleStatus = async () => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateUser(userId, { status: newStatus });
      setUser((prevUser) => ({ ...prevUser, status: newStatus }));
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה בעדכון הסטטוס");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userId);
      setDialogOpen(false);
      navigate("/admin/users/list");
    } catch (err) {
      setDialogOpen(false);
      setActionError(err.response?.data?.message || "שגיאה במחיקת המשתמש");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>טוען נתונים...</div>;
  }

  if (loadError) {
    return <div className={styles.error}>שגיאה: {loadError}</div>;
  }

  if (!user) {
    return <div className={styles.error}>המשתמש לא נמצא</div>;
  }

  const isActive = user.status === "active";

  return (
    <div className={styles.container}>
      <AdminPageHeader title={`ניהול משתמש: ${user.firstName} ${user.lastName}`} />

      {actionError && <div className={styles.error}>{actionError}</div>}

      <div className={styles.card}>
        <div className={styles.detailsGrid}>
          <span className={styles.label}>שם מלא</span>
          <span className={styles.value}>
            {user.firstName} {user.lastName}
          </span>

          <span className={styles.label}>שם משתמש</span>
          <span className={styles.value}>{user.userName}</span>

          <span className={styles.label}>אימייל</span>
          <span className={styles.value}>{user.email}</span>

          <span className={styles.label}>טלפון</span>
          <span className={styles.value}>{user.phoneNumber}</span>

          <span className={styles.label}>תפקיד</span>
          <span className={styles.value}>{user.role === "admin" ? "מנהל" : "לקוח"}</span>

          <span className={styles.label}>סטטוס</span>
          <span className={styles.value}>
            <span className={isActive ? styles.activeBadge : styles.inactiveBadge}>
              {isActive ? "פעיל" : "לא פעיל"}
            </span>
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => navigate(`/admin/users/${userId}/edit`)}>
            עריכת פרטים
          </button>

          {!isSelf && (
            <>
              <button className={styles.statusBtn} onClick={handleToggleStatus}>
                {isActive ? "הפוך ללא פעיל" : "הפוך לפעיל"}
              </button>
              <button className={styles.deleteBtn} onClick={() => setDialogOpen(true)}>
                מחיקה לצמיתות
              </button>
            </>
          )}
        </div>

        {isSelf && <p className={styles.selfNote}>זהו החשבון שלך — שינוי סטטוס ומחיקה אינם זמינים.</p>}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title="מחיקת משתמש לצמיתות"
        message="מחיקת המשתמש אינה מוחקת את ההזמנות והתשלומים שלו — הם יישארו במסד ללא משתמש משויך. אם המטרה היא רק לחסום גישה, עדיף להפוך את המשתמש ללא פעיל. למחוק בכל זאת?"
        confirmLabel="מחק לצמיתות"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
        isDangerous={true}
      />
    </div>
  );
}
