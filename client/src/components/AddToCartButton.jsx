import  { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/slices/shoppingCartSlice";
import styles from "../CSS/components/AddToCartButton.module.css";
export default function AddToCartButton(props) {
  const { courseId } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // סטייט מקומי ולא מהסטור, כדי שרק הכפתור שנלחץ יושבת ולא כל כפתורי ההוספה בדף
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // הכפתור יושב בתוך כרטיס קורס שלחיצה עליו מנווטת - מונע ניווט לא רצוי
    if (!courseId) return;

    try {
      setIsAdding(true);
      await dispatch(addToCart(courseId)).unwrap(); // unwrap כדי שכישלון של ה-thunk יגיע ל-catch
    } catch (err) {
      console.error("ההוספה נכשלה:", err);

      if (err && err.status === 401) {
        alert("כדי להוסיף קורס לסל עליך להתחבר לחשבונך");
        navigate("/login");
      }
      else if (err && err.status === 400) {
        alert("קורס זה כבר קיים בסל הקניות שלך");
      }
      else {
        alert("אופס, תקלה זמנית בהוספת הקורס לסל. נסה שנית מאוחר יותר.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      {isAdding ? "מבצע הוספה..." : "הוסף לסל"}
    </button>
  );
}
