import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryItem from "./CategoryItem";
import { getCategories } from "../redux/slices/categoriesSlice";
import styles from "../CSS/components/CategoryGrid.module.css";

export default function CategoryGrid(props) {
  // showAllCourses: האם להציג כרטיס "לכל הקורסים" מעל ריבועי הקטגוריות (ברירת מחדל: כן)
  const { showAllCourses = true } = props;
  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categories.categoriesList);
  const isLoading = useSelector((state) => state.categories.isLoading);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
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
      {/* מוצג רק כש-showAllCourses=true – כרטיס רחב שמנווט לכל הקורסים (/courses) */}
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
