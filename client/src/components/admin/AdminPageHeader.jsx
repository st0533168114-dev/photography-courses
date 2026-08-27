import { useNavigate } from "react-router-dom";
import styles from "../../CSS/components/admin/AdminPageHeader.module.css";

export default function AdminPageHeader(props) {
  const { title, onAdd, addPath, addLabel } = props;
  const navigate = useNavigate();

  // onAdd גובר על addPath, כדי שעמוד יוכל לפתוח דיאלוג במקום לנווט לטופס נפרד
  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else if (addPath) {
      navigate(addPath);
    }
  };

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {/* הכפתור מוצג רק אם יש לו פעולה, כדי שלא יופיע כפתור מת */}
      {(onAdd || addPath) && (
        <button className={styles.addButton} onClick={handleAdd}>
          + {addLabel || "הוסף"}
        </button>
      )}
    </div>
  );
}
