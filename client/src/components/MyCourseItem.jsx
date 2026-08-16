import styles from "../CSS/components/MyCourseItem.module.css";

export default function MyCourseItem(props) {
  const { course } = props;
  if (!course) return (<p className={styles.loading}>טוען נתונים...</p>
    
  );


  

  return (
    <div className={styles.card}  style={{ cursor: 'pointer' }}>
      <img className={styles.image} src={course.courseImage} alt={course.courseName} />
      <div className={styles.body}>
        <h2 className={styles.title}>{course.courseName}</h2>
        <button type="button" className={styles.button}>
         כניסה לקורס
        </button>
      </div>
    </div>
  );
}