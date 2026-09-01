import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getUserById, updateUser } from "../../API/userApi";
import styles from "../../CSS/pages/admin/AdminUserFormPage.module.css";

export default function AdminUserFormPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "user",
    status: "active",
  });
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isSelf = authUser?._id === userId;
  const detailsPath = `/admin/users/${userId}`;

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const user = await getUserById(userId);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          role: user.role || "user",
          status: user.status || "active",
        });
        setUserName(user.userName || "");
        setLoadError(null);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת פרטי המשתמש");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      // נשלחים רק שדות הטופס ולא אובייקט המשתמש המלא - כל ערך שיישלח ב-password יוצפן מחדש וישבור את ההתחברות
      await updateUser(userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        status: formData.status,
      });
      navigate(detailsPath);
    } catch (err) {
      setSaveError(err.response?.data?.message || "שגיאה בשמירת המשתמש");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}>טוען נתונים...</div>;
  }

  if (loadError) {
    return <div className={styles.container}>שגיאה: {loadError}</div>;
  }

  return (
    <div className={styles.container}>
      <AdminPageHeader title="עריכת פרטי משתמש" />

      <div className={styles.formCard}>
        {userName && <p className={styles.subtitle}>שם משתמש: {userName}</p>}

        {saveError && <div className={styles.error}>{saveError}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="firstName">שם פרטי *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName">שם משפחה *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">אימייל *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phoneNumber">טלפון *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="role">תפקיד *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={isSelf}
              title={isSelf ? "לא ניתן לשנות את התפקיד של החשבון שלך" : undefined}
            >
              <option value="user">לקוח</option>
              <option value="admin">מנהל</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="status">סטטוס *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={isSelf}
              title={isSelf ? "לא ניתן לשנות את הסטטוס של החשבון שלך" : undefined}
            >
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
            </select>
          </div>

          {isSelf && <p className={styles.selfNote}>זהו החשבון שלך — שינוי תפקיד וסטטוס אינם זמינים.</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={isSaving}>
              {isSaving ? "שומר..." : "שמור"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate(detailsPath)}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
