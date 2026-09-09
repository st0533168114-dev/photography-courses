import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import DataTable from "../components/DataTable";
import { updateUser } from "../API/userApi";
import { getUserOrders } from "../API/orderApi";
import { getCourses } from "../redux/slices/coursesSlice";
import { updateUserDetails } from "../redux/slices/authSlice";
import styles from "../CSS/pages/ProfilePage.module.css";

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
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const coursesLoading = useSelector((state) => state.courses.isLoading);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [coursesLoadError, setCoursesLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
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
        setOrdersError(err.response?.data?.message || "שגיאה בטעינת ההזמנות שלך");
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [isLoggedIn]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (coursesList.length === 0) {
          await dispatch(getCourses()).unwrap();
        }
      } catch (err) {
        setCoursesLoadError(err || "שגיאה בטעינת הקורסים");
      }
    };
    loadCourses();
  }, [dispatch]);

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

  const purchasedCourseIds = (user.courseIds || []).map((id) => String(id));
  const userCourses = coursesList.filter((course) => purchasedCourseIds.includes(String(course._id)));

  const userPayments = orders.flatMap((order) => order.paymentsList || []);

  const orderColumns = [
    { key: "_id", label: "מס' הזמנה", render: (value) => `#${value.slice(-6)}` },
    { key: "orderDate", label: "תאריך", render: (value) => new Date(value).toLocaleDateString("he-IL") },
    { key: "coursesList", label: "מס' קורסים", align: "center", render: (value) => value?.length || 0 },
    { key: "totalAmount", label: "סכום כולל", render: (value) => `₪${value}` },
    {
      key: "status",
      label: "סטטוס",
      render: (value) => {
        const isCompleted = value === "completed";
        return (
          <span className={isCompleted ? styles.successBadge : styles.failedBadge}>
            {isCompleted ? "הושלמה" : "לא הושלמה"}
          </span>
        );
      },
    },
  ];

  const paymentColumns = [
    {
      key: "paymentDate",
      label: "תאריך",
      render: (value) => (value ? new Date(value).toLocaleDateString("he-IL") : "—"),
    },
    { key: "paymentNumber", label: "מס' תשלום", align: "center" },
    { key: "paymentMethod", label: "אמצעי תשלום" },
    {
      key: "status",
      label: "סטטוס",
      render: (value) => {
        const isSuccess = value === "success";
        return (
          <span className={isSuccess ? styles.successBadge : styles.failedBadge}>
            {isSuccess ? "הצליח" : "נכשל"}
          </span>
        );
      },
    },
  ];

  const courseColumns = [
    {
      key: "courseName",
      label: "שם הקורס",
      render: (value, row) => (
        <Link className={styles.courseLink} to={`/course/${row._id}`} title="מעבר לעמוד הקורס">
          {value}
        </Link>
      ),
    },
    { key: "courseDescription", label: "תיאור", render: (value) => value || "—" },
  ];

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

        <div className={styles.tabsCard}>
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "orders"}
              className={`${styles.tab} ${activeTab === "orders" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              ההזמנות שלי
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "payments"}
              className={`${styles.tab} ${activeTab === "payments" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              התשלומים שלי
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "courses"}
              className={`${styles.tab} ${activeTab === "courses" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("courses")}
            >
              הקורסים שלי
            </button>
          </div>

          <div className={styles.tabPanel}>
            {activeTab === "orders" && (
              <DataTable
                columns={orderColumns}
                rows={orders}
                loading={ordersLoading}
                error={ordersError}
                emptyMessage="עדיין לא ביצעת הזמנות"
              />
            )}

            {activeTab === "payments" && (
              <DataTable
                columns={paymentColumns}
                rows={userPayments}
                loading={ordersLoading}
                error={ordersError}
                emptyMessage="אין תשלומים להצגה"
              />
            )}

            {activeTab === "courses" && (
              <DataTable
                columns={courseColumns}
                rows={userCourses}
                loading={coursesLoading}
                error={coursesLoadError}
                emptyMessage="עדיין אין לך קורסים"
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
