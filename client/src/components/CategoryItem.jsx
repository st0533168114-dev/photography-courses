import { useNavigate } from "react-router-dom";
import styles from "../CSS/components/CategoryItem.module.css";

export default function CategoryItem(props) {
  const { category } = props;
  const navigate = useNavigate();
//אם לא נשלחה קטגוריה כל הקורסים יוצגו
  const categoryName = category?.categoryName || "לכל הקורסים";
  const destination = category?._id ? `/courses/${category._id}` : "/courses";

  const isAllCourses = !category?._id;

  return (
    <div
    //עיצוב מסוים לקטגוריה רגילה ועיצוב אחר לכל הקורסים
      className={`${styles.category} ${isAllCourses ? styles.allCoursesCard : ""}`}
      onClick={() => navigate(destination)}
    >
      <h3 className={styles.title}>{categoryName}</h3>
    </div>
  );
}
