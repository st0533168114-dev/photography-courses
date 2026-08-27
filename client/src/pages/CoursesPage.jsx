import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CourseCard from "../components/CourseCard";
import { getCourses, clearCoursesError } from "../redux/slices/coursesSlice";
import styles from "../CSS/pages/CoursesPage.module.css";

export default function CoursesPage() {
  // categoryId קיים רק בנתיב /courses/:categoryId - בלעדיו מוצגים כל הקורסים
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const error = useSelector((state) => state.courses.error);

  useEffect(() => {
    // שגיאה ממוטציה שנכשלה נשארת בסטור הגלובלי ולא מתנקה לבד
    dispatch(clearCoursesError());
    if (coursesList.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  const displayedCourses = categoryId
    ? coursesList.filter((course) => course.categoryId === categoryId)
    : coursesList;
  return (
    <>
      <Header></Header>
      <main className={styles.main}>
        {isLoading && <p className={styles.status}>טוען קורסים ממסד הנתונים...</p>}
        {error && <p className={styles.error}>שגיאה: {error}</p>}
        {!isLoading && !error && (
          <div className={styles.grid}>
            
            {displayedCourses.map((singleCourse) => (
              <CourseCard key={singleCourse._id} course={singleCourse} />
            ))}
          </div>
        )}
      </main>
      <Footer></Footer>
    </>
  );
}
