import DeleteFromCartButton from "./DeleteFromCartButton";
import styles from "../CSS/components/CourseCartItem.module.css";
export default function CourseCartItem(props) {

  const { course } = props;
  const isUnavailable = course.isAvailable === false;
  const itemClass = isUnavailable ? `${styles.item} ${styles.unavailable}` : styles.item;

  return (
    <div className={itemClass}>
      <img className={styles.image} src={course.courseImage} alt={course.courseName} />
      <div className={styles.details}>
        <h2 className={styles.name}>{course.courseName}</h2>
        {isUnavailable && <p className={styles.unavailableNote}>הקורס אינו זמין לרכישה כעת</p>}
        {course.previousPrice !== undefined && (
          <p className={styles.priceChanged}>המחיר עודכן מ-{course.previousPrice} ₪</p>
        )}
      </div>
      <p className={styles.price}>{course.price} ₪</p>
      <DeleteFromCartButton courseId={course.courseId} />
    </div>
  );
}
