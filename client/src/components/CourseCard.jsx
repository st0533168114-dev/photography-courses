
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import styles from "../CSS/components/CourseCard.module.css";
export default function CourseCard(props) {
  //זה נכון ככה?
  const { course } = props;
  const navigate=useNavigate();
  if (!course) return <p className={styles.loading}>טוען נתונים...</p>;
  return (



    <div className={styles.card} onClick={()=>{
    if(course.price>0){
         navigate(`/course/${course._id}`)
    }else{
      window.open(course.youtubeLink, "_blank")//פותח בחלון חדש
    }
   }}>
      <img className={styles.image} src={course.courseImage} alt={course.courseName} />
      <div className={styles.body}>
        <h2 className={styles.title}>{course.courseName}</h2>
        <div className={styles.priceRow}>
          <p className={styles.price}>מחיר: {course.price}</p>
          { course.price>0 &&(<AddToCartButton courseId={course._id} />)}
        </div>
      </div>
    </div>
  );
}
