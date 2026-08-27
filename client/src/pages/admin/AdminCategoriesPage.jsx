import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminTable from "../../components/AdminTable";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getCategories, deleteCategory, clearCategoriesError } from "../../redux/slices/categoriesSlice";
import { getCourses } from "../../redux/slices/coursesSlice";
import styles from "../../CSS/pages/admin/AdminCategoriesPage.module.css";

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categoriesList || []);
  const isLoading = useSelector((state) => state.categories.isLoading);
  // רשימת הקורסים נדרשת כדי לחסום מחיקת קטגוריה שיש קורסים המשויכים אליה
  const courses = useSelector((state) => state.courses.coursesList || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // שגיאת שליפה מקומית ולא מהסטור - רק כישלון בטעינה מצדיק להחליף את הטבלה בהודעת שגיאה
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      // שגיאה ממוטציה שנכשלה נשארת בסטור הגלובלי ולא מתנקה לבד
      dispatch(clearCategoriesError());
      try {
        if (categories.length === 0) {
          await dispatch(getCategories()).unwrap();
        }
      } catch (err) {
        setLoadError(err || "שגיאה בטעינת הקטגוריות");
      }
    };
    loadCategories();
  }, [dispatch]);

  // שליפת קורסים רק אם עדיין לא נשלפו - נדרשים לבדיקת שיוך לפני מחיקת קטגוריה
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  const handleEdit = (categoryId) => {
    navigate(`/admin/categories/${categoryId}/edit`);
  };

  const handleDeleteClick = (categoryId) => {
    // חסימה מוקדמת בלקוח כדי לחסוך פנייה שהשרת ידחה בכל מקרה
    const linkedCourses = courses.filter((course) => course.categoryId === categoryId);
    if (linkedCourses.length > 0) {
      alert(`לא ניתן למחוק קטגוריה זו כי משויכים אליה ${linkedCourses.length} קורסים`);
      return;
    }

    setSelectedCategoryId(categoryId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategoryId) return;
    try {
      // unwrap כדי שכישלון של ה-thunk יגיע ל-catch
      await dispatch(deleteCategory(selectedCategoryId)).unwrap();
      setDialogOpen(false);
      setSelectedCategoryId(null);
    } catch (err) {
      alert("שגיאה במחיקה: " + (err || "נסה שוב"));
    }
  };

  const columns = [{ key: "categoryName", label: "שם קטגוריה" }];

  return (
    <div className={styles.container}>
      <AdminPageHeader
        title="ניהול קטגוריות"
        addLabel="הוסף קטגוריה"
        onAdd={() => navigate("/admin/categories/new")}
      />

      {/* loading מוגבל לטעינה ראשונית - אחרת כל מחיקה מעלימה את הטבלה */}
      <AdminTable
        columns={columns}
        rows={categories}
        rowKey="_id"
        loading={isLoading && categories.length === 0}
        error={loadError}
        emptyMessage="אין קטגוריות"
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmDialog
        open={dialogOpen}
        title="מחיקת קטגוריה"
        message="האם בטוח שברצונך למחוק את הקטגוריה?"
        confirmLabel="מחוק"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
        isDangerous={true}
      />
    </div>
  );
}
