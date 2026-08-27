import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminTable from "../../components/AdminTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getCourses, deleteCourse, clearCoursesError } from "../../redux/slices/coursesSlice";
import { getCategories } from "../../redux/slices/categoriesSlice";
import styles from "../../CSS/pages/admin/AdminCoursesPage.module.css";

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categoriesList || []);
  const courses = useSelector((state) => state.courses.coursesList || []);
  const loading = useSelector((state) => state.courses.isLoading);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
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

  const handleDeleteClick = (courseId) => {
    setSelectedCourseId(courseId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCourseId) return;

    try {
      // unwrap כדי שכישלון של ה-thunk יגיע ל-catch
      await dispatch(deleteCourse(selectedCourseId)).unwrap();
      setDialogOpen(false);
      setSelectedCourseId(null);
    } catch (err) {
      // הדיאלוג נשאר פתוח בכוונה, כדי שהמשתמש יוכל לנסות שוב בלי לפתוח אותו מחדש
      alert("שגיאה במחיקת קורס: " + (err || "נסה שוב"));
    }
  };

  const columns = [
    { key: "courseName", label: "שם הקורס" },
    { key: "categoryId", label: "קטגוריה", render: (value) => getCategoryName(value) },
    { key: "price", label: "מחיר" },
    {
      key: "courseType",
      label: "סוג קורס",
      render: (value, row) => (row.price === 0 ? "חינמי" : "בתשלום"),
    },
    { key: "status", label: "סטטוס" },
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

      {/* loading מוגבל לטעינה ראשונית - אחרת כל מחיקה מעלימה את הטבלה */}
      <AdminTable
        columns={columns}
        rows={courses}
        loading={loading && courses.length === 0}
        error={loadError}
        emptyMessage="אין קורסים"
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmDialog
        open={dialogOpen}
        title="מחיקת קורס"
        message="האם בטוח שברצונך למחוק את הקורס?"
        confirmLabel="מחוק"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
        isDangerous={true}
      />
    </div>
  );
}
