import styles from "../../CSS/components/admin/ConfirmDialog.module.css";

// דיאלוג אישור לפעולות מסוכנות כמו מחיקה
export default function ConfirmDialog(props) {
  const { open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, isDangerous } = props;

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      {/* לחיצה על הדיאלוג עצמו לא תסגור אותו, רק לחיצה בחוץ */}
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelLabel || "ביטול"}
          </button>
          {/* אם isDangerous, הכפתור יהיה אדום (מחיקה) */}
          <button
            className={`${styles.confirmBtn} ${isDangerous ? styles.dangerous : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel || "אישור"}
          </button>
        </div>
      </div>
    </div>
  );
}
