import { useNavigate } from "react-router-dom";
import styles from "../../CSS/components/admin/AdminPageHeader.module.css";

// כותרת עמוד admin עם כפתור הוסף שמנווט לטופס יצירה חדשה
export default function AdminPageHeader(props) {
  const { title, onAddClick, addLabel } = props;
  const navigate = useNavigate();

  const handleAdd = () => {

//הכפתור מפעיל את פונקציה אם היא ניתנה או מנווט לנתיב אם הוא נמסר
    if (onAddClick) {
      onAddClick();
    } else if (addLabel) {
      navigate(addLabel);
    }
  };

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      <button className={styles.addButton} onClick={handleAdd}>
        + הוסף
      </button>
    </div>
  );
}
