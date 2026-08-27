import { EditIcon, DeleteIcon } from "./admin/AdminIcons";
import styles from "../CSS/components/AdminTable.module.css";

export default function AdminTable(props) {
  const { columns, rows, loading, error, emptyMessage, onEdit, onDelete } = props;

  // עמודת הפעולות נבנית לפי מה שהעמוד סיפק, כדי שטבלה לקריאה בלבד לא תציג עמודה ריקה
  const hasActions = Boolean(onEdit || onDelete);

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
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.align === "center" ? styles.centered : ""}>
                {col.label}
              </th>
            ))}
            {hasActions && <th className={styles.actionsHeader}>פעולות</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                // render אופציונלי כדי שהעמוד יוכל להמיר ערך גולמי לתצוגה, למשל מזהה קטגוריה לשמה
                <td key={col.key} className={col.align === "center" ? styles.centered : ""}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {hasActions && (
                <td className={styles.actions}>
                  {onEdit && (
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => onEdit(row._id)}
                      title="עריכה"
                      aria-label="עריכה"
                    >
                      <EditIcon />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => onDelete(row._id)}
                      title="מחיקה"
                      aria-label="מחיקה"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
