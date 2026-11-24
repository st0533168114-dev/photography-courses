import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { updateUser } from "../api/userApi";
import { getUserOrders } from "../api/orderApi";
import { updateUserDetails } from "../redux/slices/authSlice";
import styles from "../css/pages/ProfilePage.module.css";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phoneNumber: "",
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isLoggedIn) {
        return;
      }
      setOrdersLoading(true);
      try {
        const ordersList = await getUserOrders();
        setOrders(ordersList);
        setOrdersError(null);
      } catch (err) {
        setOrdersError(err.response?.data?.message || "שגיאה בטעינת היסטוריית הרכישות");
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [isLoggedIn]);

  const handleStartEditing = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateUser(user._id, formData);
      dispatch(updateUserDetails(updatedUser));
      setIsEditing(false);
      setSaveError(null);
    } catch (err) {
      setSaveError(err.response?.data?.message || "שגיאה בשמירת הפרטים");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  const renderPurchaseHistory = () => {
    if (ordersLoading) {
      return <p className={styles.message}>טוען נתונים...</p>;
    }
    if (ordersError) {
      return <p className={styles.error}>שגיאה: {ordersError}</p>;
    }
    if (orders.length === 0) {
      return (
        <p className={styles.message}>
          עדיין לא ביצעת רכישות.{" "}
          <Link className={styles.catalogLink} to="/courses">
            לקטלוג הקורסים
          </Link>
        </p>
      );
    }
    // שם הקורס מגיע מהעותק שנשמר בהזמנה, כך שמוצג השם שבו הקורס נקנה
    return (
      <ul className={styles.historyList}>
        {orders.map((order) => (
          <li key={order._id} className={styles.historyItem}>
            <div className={styles.historyHeader}>
              <span className={styles.historyDate}>{new Date(order.orderDate).toLocaleDateString("he-IL")}</span>
              <span className={styles.historyTotal}>₪{order.totalAmount}</span>
            </div>
            <ul className={styles.historyCourses}>
              {order.coursesList.map((course) => (
                <li key={course.courseId}>{course.courseName}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>האזור האישי</h1>

        <div className={styles.card}>
          {isEditing ? (
            <form className={styles.form} onSubmit={handleSave}>
              {saveError && <p className={styles.error}>{saveError}</p>}

              <label className={styles.field}>
                <span className={styles.label}>שם פרטי</span>
                <input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>שם משפחה</span>
                <input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>שם משתמש</span>
                <input
                  className={styles.input}
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>אימייל</span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>טלפון</span>
                <input
                  className={styles.input}
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFieldChange}
                  required
                />
              </label>

              <div className={styles.actions}>
                <button className={styles.saveBtn} type="submit" disabled={isSaving}>
                  {isSaving ? "שומר..." : "שמירה"}
                </button>
                <button
                  className={styles.cancelBtn}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  ביטול
                </button>
              </div>
            </form>
          ) : (
            <>
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
              </div>

              <div className={styles.actions}>
                <button className={styles.editBtn} type="button" onClick={handleStartEditing}>
                  עריכת הפרטים שלי
                </button>
              </div>
            </>
          )}
        </div>

        <section className={styles.historyCard}>
          <h2 className={styles.sectionTitle}>היסטוריית רכישות</h2>
          {renderPurchaseHistory()}
        </section>
      </main>
      <Footer />
    </>
  );
}
