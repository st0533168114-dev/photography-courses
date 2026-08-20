import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminTable from "../../components/AdminTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import * as coursesApi from "../../API/coursesApi";
import { getCategories } from "../../redux/slices/categoriesSlice";
import styles from "../../CSS/pages/admin/AdminCoursesPage.module.css";

// עמוד רשימת קורסים עם אפשרויות הוספה/עריכה/מחיקה וייצוג סוג קורס (חינמי/בתשלום)
export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categoriesList || []);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // טעינה ראשונית של רשימת הקורסים
  useEffect(() => {
    fetchCourses();
  }, []);

  // שליפת קטגוריות אם עדיין לא נשלפו
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await coursesApi.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message || "שגיאה בטעינת קורסים");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : "-";
  };

  const handleEdit = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;

    // זיהוי סוג הקורס לפי מחיר: 0 = חינמי, >0 = בתשלום
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
      await coursesApi.deleteCourse(selectedCourseId);
      // הסרת הקורס מה-state אחרי מחיקה מוצלחת
      setCourses(courses.filter((c) => c._id !== selectedCourseId));
      setDialogOpen(false);
      setSelectedCourseId(null);
    } catch (err) {
      alert("שגיאה במחיקת קורס: " + (err.message || "נסה שוב"));
    }
  };

  // עמודות לטבלה
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

      <AdminTable
        columns={columns}
        rows={courses}
        loading={loading}
        error={error}
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
