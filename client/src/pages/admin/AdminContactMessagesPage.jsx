import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { getContactMessages, changeContactMessageStatus, deleteContactMessage } from "../../api/contactMessageApi";
import styles from "../../css/pages/admin/AdminContactMessagesPage.module.css";

export default function AdminContactMessagesPage() {
  const [contactMessages, setContactMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [selectedContactMessageId, setSelectedContactMessageId] = useState(null);
  const [updatingContactMessageId, setUpdatingContactMessageId] = useState(null);

  useEffect(() => {
    const loadContactMessages = async () => {
      try {
        const contactMessageList = await getContactMessages();
        setContactMessages(contactMessageList);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת הפניות");
      } finally {
        setIsLoading(false);
      }
    };
    loadContactMessages();
  }, []);

  const handleToggleHandled = async (contactMessage) => {
    try {
      setUpdatingContactMessageId(contactMessage._id);
      const updatedContactMessage = await changeContactMessageStatus(contactMessage._id, !contactMessage.isHandled);
      setContactMessages((prevContactMessages) =>
        prevContactMessages.map((item) => (item._id === updatedContactMessage._id ? updatedContactMessage : item))
      );
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה בעדכון הפנייה");
    } finally {
      setUpdatingContactMessageId(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContactMessage(selectedContactMessageId);
      setContactMessages((prevContactMessages) =>
        prevContactMessages.filter((item) => item._id !== selectedContactMessageId)
      );
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה במחיקת הפנייה");
    } finally {
      setSelectedContactMessageId(null);
    }
  };

  const columns = [
    { key: "createdAt", label: "תאריך", render: (value) => new Date(value).toLocaleDateString("he-IL") },
    { key: "firstName", label: "שם", render: (value, row) => `${value} ${row.lastName}` },
    { key: "phone", label: "טלפון" },
    { key: "email", label: "אימייל" },
    { key: "message", label: "הודעה", render: (value) => <span className={styles.message}>{value || "—"}</span> },
    {
      key: "isHandled",
      label: "סטטוס",
      align: "center",
      render: (value, row) => (
        <button
          type="button"
          className={`${styles.statusButton} ${value ? styles.handled : ""}`}
          onClick={() => handleToggleHandled(row)}
          disabled={updatingContactMessageId === row._id}
        >
          {updatingContactMessageId === row._id ? "מעדכן..." : value ? "טופל" : "סמן כטופל"}
        </button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title="פניות" />

      {actionError && <div className={styles.error}>{actionError}</div>}

      <DataTable
        columns={columns}
        rows={contactMessages}
        loading={isLoading}
        error={loadError}
        emptyMessage="אין פניות"
        onDelete={(contactMessageId) => setSelectedContactMessageId(contactMessageId)}
      />

      <ConfirmDialog
        open={Boolean(selectedContactMessageId)}
        title="מחיקת פנייה"
        message="האם בטוח שברצונך למחוק את הפנייה?"
        confirmLabel="מחק"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedContactMessageId(null)}
        isDangerous={true}
      />
    </div>
  );
}
