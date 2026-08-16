import  { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/slices/shoppingCartSlice";
import styles from "../CSS/components/AddToCartButton.module.css";
export default function AddToCartButton(props) {
  const { courseId } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false); //כדי למנוע לחיצה כפולה וגם כדי להשבית רק את הכפתור הזה ולא את כל כפתורי ההוספה באותו דף

  const handleAddToCart = async (e) => {
    e.stopPropagation(); //  מגביל את הלחיצה להוספה בסל בלבד
    if (!courseId) return;

    try {
      setIsAdding(true);
      await dispatch(addToCart(courseId)).unwrap(); //כדי שנקבל מהרידקס שגיאה אם היתה כזו
    } catch (err) {
      console.error("ההוספה נכשלה:", err);

      // בדיקה האם השגיאה היא 401 (Unauthorized - לא מחובר)
      if (err && err.status === 401) {
        alert("כדי להוסיף קורס לסל עליך להתחבר לחשבונך");
        navigate("/login"); // העברה לעמוד התחברות
      }
      // בדיקה אופציונלית למקרה שהקורס כבר קיים בסל (שגיאה 400)
      else if (err && err.status === 400) {
        alert("קורס זה כבר קיים בסל הקניות שלך");
      }
      // לכל שאר השגיאות הכלליות (כמו שרת כבוי או בעיית רשת)
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
      disabled={isAdding} //אם הוא באמצע להוסיף הכפתור מושבת
    >
      {isAdding ? "מבצע הוספה..." : "הוסף לסל"}
    </button>
  );
}
