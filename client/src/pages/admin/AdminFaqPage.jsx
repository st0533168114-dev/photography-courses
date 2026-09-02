import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTable from "../../components/AdminTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { getFaqs, deleteFaq } from "../../API/faqApi";
import styles from "../../CSS/pages/admin/AdminFaqPage.module.css";

export default function AdminFaqPage() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const faqList = await getFaqs();
        setFaqs(faqList);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת השאלות");
      } finally {
        setIsLoading(false);
      }
    };
    loadFaqs();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await deleteFaq(selectedFaqId);
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== selectedFaqId));
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה במחיקת השאלה");
    } finally {
      setSelectedFaqId(null);
    }
  };

  const columns = [
    { key: "question", label: "שאלה" },
    { key: "answer", label: "תשובה", render: (value) => <span className={styles.answer}>{value}</span> },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader
        title="ניהול שאלות ותשובות"
        addLabel="הוסף שאלה"
        onAdd={() => navigate("/admin/faq/new")}
      />

      {actionError && <div className={styles.error}>{actionError}</div>}

      <AdminTable
        columns={columns}
        rows={faqs}
        loading={isLoading}
        error={loadError}
        emptyMessage="אין שאלות ותשובות"
        onEdit={(faqId) => navigate(`/admin/faq/${faqId}/edit`)}
        onDelete={(faqId) => setSelectedFaqId(faqId)}
      />

      <ConfirmDialog
        open={Boolean(selectedFaqId)}
        title="מחיקת שאלה"
        message="האם בטוח שברצונך למחוק את השאלה?"
        confirmLabel="מחק"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedFaqId(null)}
        isDangerous={true}
      />
    </div>
  );
}