import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getCategoryById,
  addCategory,
  updateCategory,
} from "../../redux/slices/categoriesSlice";
import styles from "../../CSS/pages/admin/AdminCategoryFormPage.module.css";

// טופס יצירה/עריכה קטגוריה עם שדה בודד: categoryName
export default function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = categoryId !== undefined && categoryId !== "";

  const [formData, setFormData] = useState({
    categoryName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // טעינת הקטגוריה בעריכה
  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      // unwrap() משחרר את התוצאה או זורק exception אם נכשל
      const result = await dispatch(getCategoryById(categoryId)).unwrap();
      setFormData({
        categoryName: result.categoryName || "",
      });
    } catch (err) {
      setError(err || "שגיאה בטעינת הקטגוריה");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await dispatch(updateCategory({ categoryId, categoryToUpdate: formData })).unwrap();
      } else {
        await dispatch(addCategory(formData)).unwrap();
      }
      navigate("/admin/categories/list");
    } catch (err) {
      setError(err || "שגיאה בשמירת הקטגוריה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{isEditMode ? "עריכת קטגוריה" : "הוספת קטגוריה"}</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="categoryName">שם קטגוריה</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleInputChange}
            placeholder="הכנס שם קטגוריה"
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "שומר..." : isEditMode ? "עדכן" : "הוסף"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories/list")}
            className={styles.cancelBtn}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
