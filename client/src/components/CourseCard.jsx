import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import styles from "../CSS/components/CourseCard.module.css";

export default function CourseCard(props) {
  const { course } = props;
  const navigate = useNavigate();

  if (!course) return <p className={styles.loading}>טוען נתונים...</p>;

  const isAvailable = course.status === "available";
  const isPaid = course.price > 0;
  const isClickable = isPaid || isAvailable;
  const cardClass = [
    styles.card,
    !isAvailable && styles.unavailable,
    !isClickable && styles.notClickable,
  ].filter(Boolean).join(" ");

  // קורס חינמי אינו נמכר ולכן אין לו עמוד פרטים - הלחיצה פותחת ישירות את הסרטון ביוטיוב
  const handleCardClick = () => {
    if (isPaid) {
      navigate(`/course/${course._id}`);
    } else if (isAvailable) {
      window.open(course.youtubeLink, "_blank");
    }
  };

  // הכפתורים יושבים בתוך הכרטיס הלחיץ - עצירת ההתפשטות מונעת הפעלה כפולה
  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/course/${course._id}`);
  };

  const handleWatchNow = (e) => {
    e.stopPropagation();
    window.open(course.youtubeLink, "_blank");
  };

  return (
    <div className={cardClass} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={course.courseImage} alt={course.courseName} />
        {!isAvailable && <div className={styles.unavailableBanner}>לא זמין כעת</div>}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{course.courseName}</h2>
        <p className={styles.price}>מחיר: {course.price}</p>
        <div className={styles.actions}>
          {isPaid ? (
            <>
              <AddToCartButton courseId={course._id} isAvailable={isAvailable} />
              {!isAvailable && (
                <button type="button" className={styles.actionButton} onClick={handleViewDetails}>
                  לצפייה בפרטי הקורס
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              className={styles.actionButton}
              disabled={!isAvailable}
              onClick={handleWatchNow}
            >
              היכנסו לצפייה מיידית
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
