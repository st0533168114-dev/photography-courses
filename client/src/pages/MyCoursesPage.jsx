import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import MyCourseItem from "../components/MyCourseItem";
import { getCourses } from "../redux/slices/coursesSlice";
import styles from "../CSS/pages/CoursesPage.module.css";

export default function MyCoursesPage() {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const error = useSelector((state) => state.courses.error);

  useEffect(() => {
    if (coursesList.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch]);

  //שליפת מערך מזהי הקורסים והמרתו למחרוזת-לבטיחות
  const purchasedCourseIds = (user?.courseIds || []).map((id) => String(id));
//סינון הקורסים שהמשתמש רכש-לפי הקודים
  const userCourses = coursesList.filter((course) => purchasedCourseIds.includes(String(course._id)));

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1>הקורסים שלי</h1>

        {!isLoggedIn && <p className={styles.status}>עליך להתחבר כדי לראות את הקורסים שלך.</p>}
        {isLoading && <p className={styles.status}>טוען את הקורסים שלך...</p>}
        {error && <p className={styles.error}>שגיאה: {error}</p>}

        {!isLoading && !error && isLoggedIn && userCourses.length === 0 && (
          <p className={styles.status}>עדיין לא רכשת קורסים.</p>
        )}

        {!isLoading && !error && isLoggedIn && userCourses.length > 0 && (
          <div className={styles.grid}>
            {userCourses.map((course) => (
              <MyCourseItem key={course._id} course={course} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
