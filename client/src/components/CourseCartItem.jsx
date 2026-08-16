import DeleteFromCartButton from "./DeleteFromCartButton";
import styles from "../CSS/components/CourseCartItem.module.css";
export default function CourseCartItem(props) {
  //לא בדקתי אם נכון ועובדדדד

  const { course } = props;
  return (
    <div className={styles.item}>
      <img className={styles.image} src={course.courseImage} alt={course.courseName} />
      <h2 className={styles.name}>{course.courseName}</h2>
      <p className={styles.price}>{course.price} ₪</p>
      <DeleteFromCartButton courseId={course.courseId} />
    </div>
  );
}
