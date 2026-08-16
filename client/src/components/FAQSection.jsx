import { useEffect, useState } from "react";
import FAQItem from "./FAQItem";
import { getFaqs } from "../API/faqApi";
import styles from "../CSS/components/FAQSection.module.css";

export default function FAQSection() {
  const [faqsList, setFaqsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqsData = async () => {
      try {
        setIsLoading(true);
        const data = await getFaqs();
        setFaqsList(Array.isArray(data) ? data : []);//בדיקה אם הנתונים שהתקבלו הם מערך, אם לא, מחזירים מערך ריק
      } catch (err) {
        setError(err.message || "נכשלה טעינת השאלות והתשובות");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqsData();
  }, []);//רק בהתחלה נטען-פעם אחת

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>שאלות נפוצות</h2>

      {isLoading && <p>טוען שאלות ותשובות...</p>}
      {error && <p className={styles.error}>שגיאה: {error}</p>}

      {!isLoading && !error && (
        <div className={styles.list}>
          {faqsList.map((faq) => (
            <FAQItem key={faq._id} faq={faq} />
          ))}
        </div>
      )}
    </div>
  );
}
