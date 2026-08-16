import { useEffect } from "react";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import AddToCartButton from "../components/AddToCartButton";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "../redux/slices/coursesSlice";
import styles from "../CSS/pages/CourseDetailsPage.module.css";

export default function CourseDetailsPage() {
  const {courseId}=useParams();
  const dispatch=useDispatch();
  const coursesList=useSelector((state)=>state.courses.coursesList);
  const course=coursesList.find((c)=>c._id===courseId);

  useEffect(() => {
    if (coursesList.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  if (!course) return <p className={styles.status}>טוען נתונים...</p>;

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
          {/* כותרת תוכן הקורס */}
          <h3 className={styles.contentTitle}>תוכן הקורס:</h3>
          {/* מציג את תוכן הקורס כרשימה */}
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
