import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/DataTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { EditIcon, DeleteIcon } from "../../components/admin/AdminIcons";
import {
  getCourses,
  changeCourseStatus,
  deleteCourse,
  clearCoursesError,
} from "../../redux/slices/coursesSlice";
import { getCategories } from "../../redux/slices/categoriesSlice";
import styles from "../../CSS/pages/admin/AdminCoursesPage.module.css";

const statusLabels = {
  draft: "טיוטה",
  available: "זמין",
  notAvailable: "לא זמין",
  archived: "בארכיון",
};

const actionConfig = {
  publish: {
    title: "פרסום קורס",
    message: "הקורס יוצג בקטלוג ויהיה זמין לרכישה.",
    confirmLabel: "פרסם",
    action: "publish",
  },
  markAvailable: {
    title: "סימון כזמין",
    message: "הקורס יחזור להיות זמין לרכישה בקטלוג.",
    confirmLabel: "סמן כזמין",
    action: "publish",
  },
  markUnavailable: {
    title: "סימון כלא זמין",
    message: 'הקורס יישאר מוצג בקטלוג עם התווית "לא זמין", ולא ניתן יהיה לרכוש אותו.',
    confirmLabel: "סמן כלא זמין",
    action: "markUnavailable",
  },
  archive: {
    title: "העברה לארכיון",
    message: "הקורס לא יוצג יותר בקטלוג. לקוחות שרכשו אותו ימשיכו לראות אותו.",
    confirmLabel: "העבר לארכיון",
    action: "archive",
  },
  restore: {
    title: "שחזור מארכיון",
    message: "הקורס יחזור להיות מוצג בקטלוג וזמין לרכישה.",
    confirmLabel: "שחזר",
    action: "publish",
  },
  delete: {
    title: "מחיקת קורס",
    message: "הקורס יימחק לצמיתות ולא ניתן יהיה לשחזר אותו.",
    confirmLabel: "מחק",
    isDangerous: true,
  },
};

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categoriesList || []);
  const courses = useSelector((state) => state.courses.coursesList || []);
  const loading = useSelector((state) => state.courses.isLoading);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  // שגיאת שליפה מקומית ולא מהסטור - רק כישלון בטעינה מצדיק להחליף את הטבלה בהודעת שגיאה
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      // שגיאה ממוטציה שנכשלה נשארת בסטור הגלובלי ולא מתנקה לבד
      dispatch(clearCoursesError());
      try {
        if (courses.length === 0) {
          await dispatch(getCourses()).unwrap();
        }
      } catch (err) {
        setLoadError(err || "שגיאה בטעינת הקורסים");
      }
    };
    loadCourses();
  }, [dispatch]);

  // שליפת קטגוריות רק אם עדיין לא נשלפו - נדרשות להצגת שם הקטגוריה בטבלה
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : "-";
  };

  const handleEdit = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;

    // אין שדה סוג במסד, ולכן הסוג נגזר מהמחיר בלבד
    const courseType = course.price === 0 ? "free" : "paid";
    navigate(`/admin/courses/${courseId}/edit/${courseType}`);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    const { type, courseId } = pendingAction;
    setActionError(null);
    setPendingAction(null);

    try {
      // unwrap כדי שכישלון של ה-thunk יגיע ל-catch
      if (type === "delete") {
        await dispatch(deleteCourse(courseId)).unwrap();
      } else {
        await dispatch(
          changeCourseStatus({ courseId, action: actionConfig[type].action })
        ).unwrap();
      }
    } catch (err) {
      setActionError(err || "הפעולה נכשלה");
    }
  };

  const displayedCourses = showArchived
    ? courses
    : courses.filter((course) => course.status !== "archived");

  const columns = [
    { key: "courseName", label: "שם הקורס" },
    { key: "categoryId", label: "קטגוריה", render: (value) => getCategoryName(value) },
    { key: "price", label: "מחיר" },
    {
      key: "courseType",
      label: "סוג קורס",
      render: (value, row) => (row.price === 0 ? "חינמי" : "בתשלום"),
    },
    { key: "status", label: "סטטוס", render: (value) => statusLabels[value] || value },
    {
      key: "actions",
      label: "פעולות",
      align: "center",
      render: (value, row) => (
        <div className={styles.actionsCell}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => handleEdit(row._id)}
            title="עריכה"
            aria-label="עריכה"
          >
            <EditIcon />
          </button>
          {row.status === "draft" && (
            <>
              <button
                type="button"
                className={styles.textBtn}
                onClick={() => setPendingAction({ type: "publish", courseId: row._id })}
              >
                פרסם
              </button>
              <button
                type="button"
                className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                onClick={() => setPendingAction({ type: "delete", courseId: row._id })}
                title="מחיקה"
                aria-label="מחיקה"
              >
                <DeleteIcon />
              </button>
            </>
          )}
          {row.status === "available" && (
            <button
              type="button"
              className={styles.textBtn}
              onClick={() => setPendingAction({ type: "markUnavailable", courseId: row._id })}
            >
              סמן כלא זמין
            </button>
          )}
          {row.status === "notAvailable" && (
            <button
              type="button"
              className={styles.textBtn}
              onClick={() => setPendingAction({ type: "markAvailable", courseId: row._id })}
            >
              סמן כזמין
            </button>
          )}
          {(row.status === "available" || row.status === "notAvailable") && (
            <button
              type="button"
              className={styles.textBtn}
              onClick={() => setPendingAction({ type: "archive", courseId: row._id })}
            >
              העבר לארכיון
            </button>
          )}
          {row.status === "archived" && (
            <button
              type="button"
              className={styles.textBtn}
              onClick={() => setPendingAction({ type: "restore", courseId: row._id })}
            >
              שחזר
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title="ניהול קורסים" />

      <div className={styles.buttonGroup}>
        <button className={styles.addPaidBtn} onClick={() => navigate("/admin/courses/new/paid")}>
          + הוסף קורס בתשלום
        </button>
        <button className={styles.addFreeBtn} onClick={() => navigate("/admin/courses/new/free")}>
          + הוסף קורס חינמי
        </button>
      </div>

      <label className={styles.archiveFilter}>
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        הצג קורסים בארכיון
      </label>

      {actionError && <div className={styles.error}>{actionError}</div>}

      {/* loading מוגבל לטעינה ראשונית - אחרת כל מחיקה מעלימה את הטבלה */}
      <DataTable
        columns={columns}
        rows={displayedCourses}
        loading={loading && courses.length === 0}
        error={loadError}
        emptyMessage="אין קורסים"
      />

      <ConfirmDialog
        open={pendingAction !== null}
        title={pendingAction ? actionConfig[pendingAction.type].title : ""}
        message={pendingAction ? actionConfig[pendingAction.type].message : ""}
        confirmLabel={pendingAction ? actionConfig[pendingAction.type].confirmLabel : ""}
        cancelLabel="ביטול"
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
        isDangerous={pendingAction ? Boolean(actionConfig[pendingAction.type].isDangerous) : false}
      />
    </div>
  );
}
