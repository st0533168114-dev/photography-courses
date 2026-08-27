import { useState } from "react";
import styles from "../CSS/components/FAQItem.module.css";

export default function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!faq) return null;

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.question}>{faq.question}</span>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>＋</span>
      </button>

      {/* התשובה תמיד ברינדור והמחלקה open חושפת אותה, כדי לאפשר אנימציית פתיחה ב-CSS */}
      <div className={`${styles.answerBox} ${isOpen ? styles.open : ""}`}>
        <p className={styles.answer}>{faq.answer}</p>
      </div>
    </div>
  );
}
