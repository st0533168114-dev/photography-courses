import { useEffect, useState } from "react";
import styles from "../CSS/components/WellcomeSection.module.css";

// import.meta.glob מייבא את כל התמונות מהתיקייה, כך שהוספת תמונה לגלריה לא דורשת שינוי בקוד
const images = Object.values(
  import.meta.glob("../assets/*.{jpg,jpeg,png,webp}", {
    eager: true,
    import: "default",
  })
);

export default function WellcomeSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={styles.section}
      style={{
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
