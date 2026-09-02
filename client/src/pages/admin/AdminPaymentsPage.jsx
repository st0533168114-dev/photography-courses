import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminTable from "../../components/AdminTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getPayments } from "../../API/paymentApi";
import styles from "../../CSS/pages/admin/AdminPaymentsPage.module.css";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const paymentsList = await getPayments();
        setPayments(paymentsList);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת התשלומים");
      } finally {
        setIsLoading(false);
      }
    };
    loadPayments();
  }, []);

  const columns = [
    {
      key: "paymentDate",
      label: "תאריך תשלום",
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
    {
      key: "orderId",
      label: "הזמנה",
      render: (value) => (
        <Link className={styles.orderLink} to={`/admin/orders/${value}`} title="מעבר לעמוד ההזמנה">
          הזמנה #{value.slice(-6)}
        </Link>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title="ניהול תשלומים" />

      <p className={styles.note}>
        התשלומים נוצרים אוטומטית בעת ביצוע הזמנה — הרשימה היא לצפייה בלבד.
      </p>

      {/* טבלה לקריאה בלבד - בלי onEdit/onDelete, ולכן AdminTable לא יציג עמודת פעולות */}
      <AdminTable
        columns={columns}
        rows={payments}
        loading={isLoading}
        error={loadError}
        emptyMessage="אין תשלומים"
      />
    </div>
  );
}