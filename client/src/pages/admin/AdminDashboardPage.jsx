import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getUsers } from "../../API/userApi";
import { getOrders } from "../../API/orderApi";
import { getCourses } from "../../redux/slices/coursesSlice";
import styles from "../../CSS/pages/admin/AdminDashboardPage.module.css";

const quickActions = [
  { to: "/admin/courses/new/paid", label: "הוספת קורס בתשלום" },
  { to: "/admin/courses/new/free", label: "הוספת קורס חינמי" },
  { to: "/admin/categories/new", label: "הוספת קטגוריה" },
];

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const coursesLoading = useSelector((state) => state.courses.isLoading);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [usersList, ordersList] = await Promise.all([getUsers(), getOrders()]);
        setUsers(usersList);
        setOrders(ordersList);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת נתוני לוח הבקרה");
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
    if (coursesList.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  const activeCoursesCount = coursesList.filter((course) => course.status === "available").length;

  const stats = [
    { key: "users", label: "מספר משתמשים", value: users.length, loading: isLoading },
    { key: "orders", label: "סך הזמנות", value: orders.length, loading: isLoading },
    { key: "courses", label: "קורסים פעילים", value: activeCoursesCount, loading: coursesLoading },
    { key: "inquiries", label: "פניות חדשות", value: "—", hint: "יתווסף בהמשך" },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title="לוח בקרה" />

      {loadError && <p className={styles.error}>שגיאה: {loadError}</p>}

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.key} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <strong className={styles.statValue}>{stat.loading ? "..." : stat.value}</strong>
            {stat.hint && <span className={styles.statHint}>{stat.hint}</span>}
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>פעולות מהירות</h3>
        <div className={styles.actionsRow}>
          {quickActions.map((action) => (
            <Link key={action.to} className={styles.actionButton} to={action.to}>
              + {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
