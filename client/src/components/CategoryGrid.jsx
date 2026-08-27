import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryItem from "./CategoryItem";
import { getCategories, clearCategoriesError } from "../redux/slices/categoriesSlice";
import styles from "../CSS/components/CategoryGrid.module.css";

export default function CategoryGrid(props) {
  // ברירת המחדל true כי רוב העמודים מציגים את הכרטיס - דף הבית הוא היוצא מן הכלל
  const { showAllCourses = true } = props;
  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categories.categoriesList);
  const isLoading = useSelector((state) => state.categories.isLoading);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    // שגיאה ממוטציה שנכשלה נשארת בסטור הגלובלי ולא מתנקה לבד
    dispatch(clearCategoriesError());
    if (categoriesList.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categoriesList.length]);

  if (isLoading) {
    return <p className={styles.status}>טוען קטגוריות ממסד הנתונים...</p>;
  }

  if (error) {
    return <p className={styles.error}>שגיאה: {error}</p>;
  }

  return (
    <>
      {/* category={null} הוא הסימן ל-CategoryItem להציג את כרטיס "לכל הקורסים" */}
      {showAllCourses && (
        <div className={styles.featuredRow}>
          <CategoryItem category={null} />
        </div>
      )}
      <div className={styles.grid}>
        {categoriesList.map((singleCategory) => (
          <CategoryItem key={singleCategory._id} category={singleCategory} />
        ))}
      </div>
    </>
  );
}
