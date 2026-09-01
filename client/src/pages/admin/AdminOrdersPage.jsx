import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminTable from "../../components/AdminTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getOrders } from "../../API/orderApi";
import styles from "../../CSS/pages/admin/AdminOrdersPage.module.css";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersList = await getOrders();
        setOrders(ordersList);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת ההזמנות");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const columns = [
    {
      key: "_id",
      label: "מס' הזמנה",
      render: (value) => (
        <Link className={styles.orderLink} to={`/admin/orders/${value}`} title="מעבר לעמוד ההזמנה">
          #{value.slice(-6)}
        </Link>
      ),
    },
    {
      key: "orderDate",
      label: "תאריך הזמנה",
      render: (value) => new Date(value).toLocaleDateString("he-IL"),
    },
    {
      key: "userId",
      label: "שם המשתמש",
      render: (value) =>
        value ? (
          <Link className={styles.userLink} to={`/admin/users/${value._id}`} title="מעבר לעמוד ניהול המשתמש">
            {value.firstName} {value.lastName}
          </Link>
        ) : (
          <span className={styles.missingUser}>משתמש שנמחק</span>
        ),
    },
    { key: "coursesList", label: "מס' קורסים", align: "center", render: (value) => value?.length || 0 },
    { key: "totalAmount", label: "סכום כולל", render: (value) => `₪${value}` },
    {
      key: "status",
      label: "סטטוס",
      render: (value) => {
        const isCompleted = value === "completed";
        return (
          <span className={isCompleted ? styles.completedBadge : styles.incompleteBadge}>
            {isCompleted ? "הושלמה" : "לא הושלמה"}
          </span>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title="ניהול הזמנות" />

      <AdminTable
        columns={columns}
        rows={orders}
        loading={isLoading}
        error={loadError}
        emptyMessage="אין הזמנות"
        onEdit={(orderId) => navigate(`/admin/orders/${orderId}/edit`)}
      />
    </div>
  );
}
