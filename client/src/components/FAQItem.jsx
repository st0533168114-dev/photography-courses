import { useState } from "react";
import styles from "../CSS/components/FAQItem.module.css";

export default function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!faq) return null;

  return (
    <div className={styles.item}>
      {/*  שבלחיצה מחליף את המצב מפתיחה לסגירה ולהפך */}
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {/* סוג של מיכל לחלוקת הרכיבים בתוך הכפתור */}
        <span className={styles.question}>{faq.question}</span>
        {/*  אם פתוח שינוי של הפלוס*/}
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>＋</span>
      </button>
      {/*  מוצג רק אם פתוח*/}

      <div className={`${styles.answerBox} ${isOpen ? styles.open : ""}`}>
        <p className={styles.answer}>{faq.answer}</p>
      </div>
    </div>
  );
}
