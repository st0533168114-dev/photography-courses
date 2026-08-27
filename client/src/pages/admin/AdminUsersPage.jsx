import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminTable from "../../components/AdminTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { ViewIcon, EditIcon, DeleteIcon } from "../../components/admin/AdminIcons";
import { getUsers, updateUser, deleteUser } from "../../API/userApi";
import styles from "../../CSS/pages/admin/AdminUsersPage.module.css";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersList = await getUsers();
        setUsers(usersList);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת המשתמשים");
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // הסטטוס מתעדכן בטבלה לפני תשובת השרת כדי שהמתג יגיב מיד, ומוחזר לערך הקודם אם העדכון נכשל
  const handleToggleStatus = async (user) => {
    const previousStatus = user.status;
    const newStatus = previousStatus === "active" ? "inactive" : "active";
    setUsers((prevUsers) => prevUsers.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
    setActionError(null);
    try {
      await updateUser(user._id, { status: newStatus });
    } catch (err) {
      setUsers((prevUsers) => prevUsers.map((u) => (u._id === user._id ? { ...u, status: previousStatus } : u)));
      setActionError(err.response?.data?.message || "שגיאה בעדכון הסטטוס");
    }
  };

  const handleConfirmDelete = async () => {
    const deletedId = userToDelete._id;
    setUserToDelete(null);
    try {
      await deleteUser(deletedId);
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== deletedId));
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה במחיקת המשתמש");
    }
  };

  const columns = [
    {
      key: "firstName",
      label: "שם מלא",
      render: (value, row) => (
        <Link className={styles.nameLink} to={`/admin/users/${row._id}`} title="מעבר לעמוד ניהול המשתמש">
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    { key: "email", label: "אימייל" },
    { key: "phoneNumber", label: "טלפון" },
    { key: "role", label: "תפקיד", render: (value) => (value === "admin" ? "מנהל" : "לקוח") },
    {
      key: "status",
      label: "סטטוס",
      render: (value, row) => {
        const isActive = value === "active";
        const isSelf = authUser?._id === row._id;
        return (
          <div className={styles.statusCell}>
            <button
              type="button"
              className={`${styles.toggle} ${isActive ? styles.toggleOn : ""}`}
              onClick={() => handleToggleStatus(row)}
              disabled={isSelf}
              title={isSelf ? "לא ניתן לשנות את הסטטוס של החשבון שלך" : isActive ? "הפוך ללא פעיל" : "הפוך לפעיל"}
              aria-label="שינוי סטטוס"
            >
              <span className={styles.knob}></span>
            </button>
            <span className={isActive ? styles.activeText : styles.inactiveText}>
              {isActive ? "פעיל" : "לא פעיל"}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "פעולות",
      align: "center",
      render: (value, row) => {
        const isSelf = authUser?._id === row._id;
        return (
          <div className={styles.actionsCell}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => navigate(`/admin/users/${row._id}`)}
              title="מעבר לעמוד ניהול המשתמש"
              aria-label="מעבר לעמוד ניהול המשתמש"
            >
              <ViewIcon />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => navigate(`/admin/users/${row._id}/edit`)}
              title="עריכת פרטים"
              aria-label="עריכת פרטים"
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
              onClick={() => setUserToDelete(row)}
              disabled={isSelf}
              title={isSelf ? "לא ניתן למחוק את החשבון שלך" : "מחיקה לצמיתות"}
              aria-label="מחיקה לצמיתות"
            >
              <DeleteIcon />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title="ניהול משתמשים" />

      {actionError && <div className={styles.error}>{actionError}</div>}

      <AdminTable
        columns={columns}
        rows={users}
        loading={isLoading}
        error={loadError}
        emptyMessage="אין משתמשים"
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="מחיקת משתמש לצמיתות"
        message={
          userToDelete
            ? `מחיקת ${userToDelete.firstName} ${userToDelete.lastName} אינה מוחקת את ההזמנות והתשלומים שלו — הם יישארו במסד ללא משתמש משויך. אם המטרה היא רק לחסום גישה, עדיף להפוך את המשתמש ללא פעיל. למחוק בכל זאת?`
            : ""
        }
        confirmLabel="מחק לצמיתות"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
        isDangerous={true}
      />
    </div>
  );
}
