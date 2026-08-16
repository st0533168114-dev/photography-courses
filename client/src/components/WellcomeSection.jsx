import { useEffect, useState } from "react";
import styles from "../CSS/components/WellcomeSection.module.css";

// אוסף התמונות המופיע בגלריה.
//   משתמשים ב-import.meta.glob כדי לייבא את כל התמונות מתיקיית assets.
const images = Object.values(
  import.meta.glob("../assets/*.{jpg,jpeg,png,webp}", {
    eager: true,
    import: "default",
  })
);

// קומפוננטת מקטע הפתיחה של האתר
export default function WellcomeSection() {
  // מאחסן את התמונה הנוכחית בגלריה.
  const [currentImage, setCurrentImage] = useState(0);

  // משנה תמונה באופן אוטומטי בכל כמה שניות.
  useEffect(() => {
    // מגדיר טיימר שמריץ פאנקשן כל שלוש שניות
    const interval = setInterval(() => {
      // מקדם לאינדקס התמונה הבאה, וחוזר להתחלה בסוף המערך
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    // מחזיר פונקציה שמנקה את הטיימר כדי למנוע זליגת זיכרון
    return () => clearInterval(interval);
  }, []);

  // מציג את המקטע עם התמונה הנוכחית.
  return (
    <section
      className={styles.section}
      style={{
        // קובע את תמונת הרקע לפי האינדקס הנוכחי
        backgroundImage: `url(${images[currentImage]})`,
      }}
    >
      <div className={styles.overlay}>
        <h2 className={styles.title}>
          בואי להגשים את החלום שלך
          <br />
          עם קורס דיגיטלי לצילום
        </h2>
      </div>
    </section>
  );
}