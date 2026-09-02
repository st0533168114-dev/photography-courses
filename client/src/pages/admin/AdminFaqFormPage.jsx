import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFaqById, addFaq, updateFaq } from "../../API/faqApi";
import styles from "../../CSS/pages/admin/AdminFaqFormPage.module.css";

export default function AdminFaqFormPage() {
  const { faqId } = useParams();
  const navigate = useNavigate();
  const isEditMode = faqId !== undefined && faqId !== "";

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;

    const loadFaq = async () => {
      try {
        const faq = await getFaqById(faqId);
        setFormData({
          question: faq.question || "",
          answer: faq.answer || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "השאלה לא נמצאה");
      } finally {
        setIsLoading(false);
      }
    };
    loadFaq();
  }, [faqId, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateFaq(faqId, formData);
      } else {
        await addFaq(formData);
      }
      navigate("/admin/faq/list");
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בשמירת השאלה");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>טוען נתונים...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>{isEditMode ? "עריכת שאלה" : "הוספת שאלה"}</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="question">שאלה</label>
          <input
            type="text"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            placeholder="הכנס את השאלה"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="answer">תשובה</label>
          <textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleInputChange}
            placeholder="הכנס את התשובה"
            rows={6}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isSaving} className={styles.submitBtn}>
            {isSaving ? "שומר..." : isEditMode ? "עדכן" : "הוסף"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/faq/list")}
            className={styles.cancelBtn}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}