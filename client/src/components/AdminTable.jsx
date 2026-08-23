import styles from "../CSS/components/AdminTable.module.css";

// קומפוננטה גנרית לתצוגת טבלת נתונים עם עמודות דינמיות, פעולות עריכה/מחיקה וכפתור הוסף
export default function AdminTable(props) {
  const { columns, rows, loading, error, emptyMessage, onEdit, onDelete, onAdd, addButtonText } = props;

  if (loading) {
    return <div className={styles.loading}>טוען נתונים...</div>;
  }

  if (error) {
    return <div className={styles.error}>שגיאה: {error}</div>;
  }

  if (rows.length === 0) {
    return <div className={styles.empty}>{emptyMessage || "לא נמצאו נתונים"}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      {onAdd && (
        <button className={styles.addButton} onClick={() => onAdd()}>
          {addButtonText || "הוסף חדש"}
        </button>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                // render מאפשר לעמודה לעצב את הערך (למשל המרת מזהה לשם קטגוריה)
                <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
              ))}
              <td className={styles.actions}>
                <button className={styles.editBtn} onClick={() => onEdit?.(row._id)}>
                  עריכה
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete?.(row._id)}>
                  מחיקה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
