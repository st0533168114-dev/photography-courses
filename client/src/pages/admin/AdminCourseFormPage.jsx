import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCourseById, addCourse, updateCourse } from "../../redux/slices/coursesSlice";
import { getCategories } from "../../redux/slices/categoriesSlice";
import styles from "../../CSS/pages/admin/AdminCourseFormPage.module.css";

export default function AdminCourseFormPage() {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categoriesList || []);

const isEditMode = courseId !== undefined && courseId !== "";  
  const isPaid = courseType === "paid";

  const [formData, setFormData] = useState({
    courseName: "",
    categoryId: "",
    price: "",
    status: "available",
    courseImage: "",
    courseDescription: "",
    courseContent: [],
    youtubeLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentInput, setContentInput] = useState("");

  // טעינת קטגוריות
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch]);

  // טעינת הקורס בעריכה
  useEffect(() => {
    if (isEditMode) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      // unwrap() משחרר את התוצאה או זורק exception אם נכשל
      const course = await dispatch(getCourseById(courseId)).unwrap();
      setFormData({
        courseName: course.courseName || "",
        categoryId: course.categoryId || "",
        price: course.price || 0,
        status: course.status || "available",
        courseImage: course.courseImage || "",
        courseDescription: course.courseDescription || "",
        courseContent: course.courseContent || [],
        youtubeLink: course.youtubeLink || "",
      });
    } catch (err) {
      setError(err || "שגיאה בטעינת הקורס");
    } finally {
      setLoading(false);
    }
  };

  // מעדכן את ערכי שדות הקלט הכלליים ב-State של הטופס
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,//פורס את הערכים הקודמים של הטופס ורק משנה את השדה שהשתנה
      [name]: value,
    }));
  };

  // מוסיף שיעור/נושא חדש לרשימת התוכן של הקורס
  const handleAddContent = () => {
    if (contentInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        courseContent: [...prev.courseContent, contentInput],
      }));
      setContentInput("");
    }
  };

  // מוחק שיעור/נושא מרשימת התוכן לפי האינדקס שלו
  const handleRemoveContent = (index) => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.filter((_, i) => i !== index),
    }));
  };

  // מטפל בשליחת הטופס, עדכון/הוספת קורס בשרת וניווט חזרה
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        courseName: formData.courseName,
        categoryId: formData.categoryId,
        price: isPaid ? Number(formData.price) : 0,
        status: formData.status,
        courseImage: formData.courseImage || "ImagesOutImages0738_-canon_600.jpeg",
        courseDescription: isPaid ? formData.courseDescription : "",
        courseContent: isPaid ? formData.courseContent : [],
        youtubeLink: !isPaid ? formData.youtubeLink : "",
      };

      if (isEditMode) {
        await dispatch(updateCourse({ courseId, course: submitData })).unwrap();
      } else {
        await dispatch(addCourse(submitData)).unwrap();
      }

      navigate("/admin/courses/list");
    } catch (err) {
      setError(err || "שגיאה בשמירת הקורס");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className={styles.container}>טוען נתונים...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>
          {isEditMode ? "עריכת קורס" : "קורס חדש"} - {isPaid ? "בתשלום" : "חינמי"}
        </h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>שם הקורס *</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              required
              placeholder="הכנס שם קורס"
            />
          </div>

          <div className={styles.field}>
            <label>קטגוריה *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">בחר קטגוריה</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {isPaid && (
            <div className={styles.field}>
              <label>מחיר *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="הכנס מחיר"
              />
            </div>
          )}

          <div className={styles.field}>
            <label>סטטוס *</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="available">זמין</option>
              <option value="notAvailable">לא זמין</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>תמונה (שם הקובץ)</label>
            <input
              type="text"
              name="courseImage"
              value={formData.courseImage}
              onChange={handleInputChange}
              placeholder="שם התמונה (דיפולט: ImagesOutImages0738_-canon_600.jpeg)"
            />
          </div>

          {isPaid ? (
            <>
              <div className={styles.field}>
                <label>תיאור הקורס</label>
                <textarea
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleInputChange}
                  placeholder="תיאור הקורס"
                  rows="4"
                />
              </div>

              <div className={styles.field}>
                <label>תוכן הקורס</label>
                <div className={styles.contentInputGroup}>
                  <input
                    type="text"
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="הוסף שיעור/נושא"
                    // מאפשר הוספה בלחיצה על Enter
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddContent())}                  />
                  <button type="button" onClick={handleAddContent} className={styles.addContentBtn}>
                    הוסף
                  </button>
                </div>
                {/* בדיקה: הרשימה תרונדר רק אם יש לפחות איבר אחד במערך */}
                {formData.courseContent.length > 0 && (
                  <ul className={styles.contentList}>
                 {/* מעבר בלולאה על כל פריט במערך התכנים */} 
                    {formData.courseContent.map((item, index) => (
                      <li key={index} className={styles.contentItem}>
                        {item}
                        {/* כפתור למחיקת הפריט הספציפי מהרשימה לפי האינדקס שלו */}
                        <button
                          type="button"
                          onClick={() => handleRemoveContent(index)}
                          className={styles.removeBtn}
                        >
                          הסר
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className={styles.field}>
              <label>קישור יוטיוב</label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "שמור..." : "שמור"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/admin/courses/list")}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}