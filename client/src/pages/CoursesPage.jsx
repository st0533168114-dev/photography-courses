import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../redux/slices/coursesSlice";
import styles from "../CSS/pages/CoursesPage.module.css";

export default function CoursesPage() {
  //אם ארצה להוסיף כאן שם קטגוריה גם אז צריך סלייס קטגוריותתת
  const { categoryId } = useParams(); //אם יש
  const dispatch = useDispatch();
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const error = useSelector((state) => state.courses.error);

  useEffect(() => {
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
  //  //לשנות כי הוספתי סלייס קטגוריות
  // ????????????
  //  import React, { useEffect } from "react";
  // import { useDispatch, useSelector } from "react-redux";
  // import Header from "../layout/Header";
  // import Footer from "../layout/Footer";
  // import CategoryItem from "../components/CategoryItem";
  // import { getCategories } from "../redux/slices/categoriesSlice";

  // export default function CategoriesPage() {
  //   const dispatch = useDispatch();

  //   // שליפת הנתונים מתוך ה-Redux Store
  //   const categoriesList = useSelector((state) => state.categories.categoriesList);
  //   const isLoading = useSelector((state) => state.categories.isLoading);
  //   const error = useSelector((state) => state.categories.error);

  //   // טעינת הקטגוריות רק אם הרשימה בסטייט הגלובלי עדיין ריקה
  //   useEffect(() => {
  //     if (categoriesList.length === 0) {
  //       dispatch(getCategories());
  //     }
  //   }, [categoriesList.length, dispatch]);

  //   return (
  //     <>
  //       <Header />

  //       <p>קטגוריות</p>

  //       {/* תצוגת מצבי טעינה ושגיאה */}
  //       {isLoading && <p>טוען קטגוריות ממסד הנתונים...</p>}
  //       {error && <p>שגיאה: {error}</p>}

  //       {/* רינדור רשימת הקטגוריות במידה והכל נטען בהצלחה */}
  //       {!isLoading && !error && (
  //         <div className="categories-grid">
  //           {categoriesList.map((singleCategory) => (
  //             <CategoryItem
  //               key={singleCategory._id}
  //               category={singleCategory}
  //             />
  //           ))}
  //         </div>
  //       )}

  //       <Footer />
  //     </>
  //   );
  // }