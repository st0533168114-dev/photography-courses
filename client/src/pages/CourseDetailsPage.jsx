import { useEffect } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import AddToCartButton from "../components/AddToCartButton";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, clearCoursesError } from "../redux/slices/coursesSlice";
import styles from "../CSS/pages/CourseDetailsPage.module.css";

export default function CourseDetailsPage() {
  const {courseId}=useParams();
  const dispatch=useDispatch();
  const coursesList=useSelector((state)=>state.courses.coursesList);
  const isLoading=useSelector((state)=>state.courses.isLoading);
  const error=useSelector((state)=>state.courses.error);
  const course=coursesList.find((c)=>c._id===courseId);

  useEffect(() => {
    // שגיאה ממוטציה שנכשלה נשארת בסטור הגלובלי ולא מתנקה לבד
    dispatch(clearCoursesError());
    if (coursesList.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  if (isLoading) return <p className={styles.status}>טוען נתונים...</p>;
  if (error) return <p className={styles.error}>שגיאה: {error}</p>;
  //מבדיל בין "עדיין בטעינה" ל"קורס לא קיים", כדי לא להיתקע על הודעת טעינה לצמיתות
  if (!course) return <p className={styles.status}>קורס לא נמצא.</p>;

  return (
    <>
      <Header></Header>

      <main className={styles.main}>
        <img className={styles.image} src={course.courseImage} alt={course.courseName} />
        <h2 className={styles.title}>{course.courseName} </h2>
        <p className={styles.price}>מחיר: {course.price}</p>
        <div className={styles.description}>
          {course.courseDescription}
        </div>
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>תוכן הקורס:</h3>
          <ul className={styles.contentList}>
            {Array.isArray(course.courseContent) ? (
              course.courseContent.map((item, index) => (
                <li key={index} className={styles.contentItem}>
                  {item}
                </li>
              ))
            ) : (
              <li className={styles.contentItem}>{course.courseContent}</li>
            )}
          </ul>
        </div>
        <AddToCartButton courseId={course._id} />
      </main>
      <Footer></Footer>
    </>
  );
}
