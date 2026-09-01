import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminTable from "../../components/AdminTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getOrderById } from "../../API/orderApi";
import { getCourses } from "../../redux/slices/coursesSlice";
import styles from "../../CSS/pages/admin/AdminOrderDetailsPage.module.css";

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const coursesLoading = useSelector((state) => state.courses.isLoading);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [coursesLoadError, setCoursesLoadError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        setLoadError(null);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת ההזמנה");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

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

  if (isLoading) {
    return <div className={styles.loading}>טוען נתונים...</div>;
  }

  if (loadError) {
    return <div className={styles.error}>שגיאה: {loadError}</div>;
  }

  if (!order) {
    return <div className={styles.error}>ההזמנה לא נמצאה</div>;
  }

  const isCompleted = order.status === "completed";
  const customer = order.userId;

  const orderCourses = (order.coursesList || []).map((item) => ({
    _id: item._id,
    courseName: coursesList.find((course) => course._id === item.courseId)?.courseName ?? "קורס שנמחק",
    price: item.price,
  }));

  const courseColumns = [
    { key: "courseName", label: "שם הקורס" },
    { key: "price", label: "מחיר בעת הרכישה", render: (value) => `₪${value}` },
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
    { key: "transactionId", label: "מזהה עסקה", render: (value) => <span className={styles.mono}>{value}</span> },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title={`הזמנה #${order._id.slice(-6)}`} />

      <div className={styles.card}>
        <div className={styles.detailsGrid}>
          <span className={styles.label}>מס' הזמנה</span>
          <span className={styles.value}>{order._id}</span>

          <span className={styles.label}>תאריך הזמנה</span>
          <span className={styles.value}>{new Date(order.orderDate).toLocaleString("he-IL")}</span>

          <span className={styles.label}>סכום כולל</span>
          <span className={styles.value}>₪{order.totalAmount}</span>

          <span className={styles.label}>סטטוס</span>
          <span className={styles.value}>
            <span className={isCompleted ? styles.completedBadge : styles.incompleteBadge}>
              {isCompleted ? "הושלמה" : "לא הושלמה"}
            </span>
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => navigate(`/admin/orders/${orderId}/edit`)}>
            עדכון סטטוס
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>המשתמש</h3>
        {customer ? (
          <div className={styles.detailsGrid}>
            <span className={styles.label}>שם מלא</span>
            <span className={styles.value}>
              <Link className={styles.userLink} to={`/admin/users/${customer._id}`} title="מעבר לעמוד ניהול המשתמש">
                {customer.firstName} {customer.lastName}
              </Link>
            </span>

            <span className={styles.label}>אימייל</span>
            <span className={styles.value}>{customer.email}</span>
          </div>
        ) : (
          <p className={styles.note}>המשתמש נמחק לצמיתות — ההזמנה נשארה במערכת ללא משתמש משויך.</p>
        )}
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>הקורסים בהזמנה</h3>
        <p className={styles.note}>המחיר המוצג הוא המחיר ששולם בעת הרכישה, ולא בהכרח המחיר הנוכחי בקטלוג.</p>
        <AdminTable
          columns={courseColumns}
          rows={orderCourses}
          loading={coursesLoading}
          error={coursesLoadError}
          emptyMessage="אין קורסים בהזמנה"
        />
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>תשלומים</h3>
        <AdminTable
          columns={paymentColumns}
          rows={order.paymentsList || []}
          loading={false}
          error={null}
          emptyMessage="אין תשלומים להזמנה"
        />
      </div>
    </div>
  );
}
