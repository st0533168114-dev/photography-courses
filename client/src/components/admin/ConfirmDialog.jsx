import styles from "../../CSS/components/admin/ConfirmDialog.module.css";

export default function ConfirmDialog(props) {
  const { open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, isDangerous } = props;

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      {/* עצירת ההתפשטות כדי שלחיצה בתוך הדיאלוג לא תיספר כלחיצה על הרקע ותסגור אותו */}
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelLabel || "ביטול"}
          </button>
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
