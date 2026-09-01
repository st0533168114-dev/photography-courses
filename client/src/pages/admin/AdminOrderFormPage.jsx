import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getOrderById, updateOrder } from "../../API/orderApi";
import styles from "../../CSS/pages/admin/AdminOrderFormPage.module.css";

export default function AdminOrderFormPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("incomplete");
  const [orderSummary, setOrderSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const detailsPath = `/admin/orders/${orderId}`;

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        const order = await getOrderById(orderId);
        setStatus(order.status || "incomplete");
        setOrderSummary({
          orderDate: order.orderDate,
          totalAmount: order.totalAmount,
          customerName: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : "משתמש שנמחק",
        });
        setLoadError(null);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת ההזמנה");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      // נשלח רק status - הטופס עורך שדה אחד, ושליחת ההזמנה המלאה תכתוב חזרה למסד נתונים שנטענו קודם
      await updateOrder(orderId, { status });
      navigate(detailsPath);
    } catch (err) {
      setSaveError(err.response?.data?.message || "שגיאה בשמירת ההזמנה");
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
      <AdminPageHeader title={`עדכון סטטוס הזמנה #${orderId.slice(-6)}`} />

      <div className={styles.formCard}>
        {orderSummary && (
          <p className={styles.subtitle}>
            {orderSummary.customerName} · {new Date(orderSummary.orderDate).toLocaleDateString("he-IL")} · ₪
            {orderSummary.totalAmount}
          </p>
        )}

        {saveError && <div className={styles.error}>{saveError}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="status">סטטוס הזמנה *</label>
            <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="incomplete">לא הושלמה</option>
              <option value="completed">הושלמה</option>
            </select>
          </div>

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
