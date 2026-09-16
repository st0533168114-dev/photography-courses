import  { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../redux/slices/shoppingCartSlice";
import styles from "../CSS/components/AddToCartButton.module.css";
export default function AddToCartButton(props) {
  const { courseId, isAvailable } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ownedCourseIds = useSelector((state) => state.auth.user?.courseIds);
  const isOwned = (ownedCourseIds || []).some((id) => String(id) === String(courseId));
  // סטייט מקומי ולא מהסטור, כדי שרק הכפתור שנלחץ יושבת ולא כל כפתורי ההוספה בדף
  const [isAdding, setIsAdding] = useState(false);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), 2500);
    return () => clearTimeout(timer);
  }, [note]);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // הכפתור יושב בתוך כרטיס קורס שלחיצה עליו מנווטת - מונע ניווט לא רצוי
    if (!courseId) return;

    try {
      setIsAdding(true);
      await dispatch(addToCart(courseId)).unwrap(); // unwrap כדי שכישלון של ה-thunk יגיע ל-catch
    } catch (err) {
      console.error("ההוספה נכשלה:", err);

      if (err && err.status === 401) {
        navigate("/login", {
          state: { from: location.pathname, message: "כדי להוסיף קורס לסל עליך להתחבר לחשבונך" },
        });
      }
      else if (err && err.status === 400) {
        setNote(err.message);
      }
      else {
        setNote("אופס, תקלה זמנית בהוספת הקורס לסל. נסה שנית מאוחר יותר.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {note && <span className={styles.bubble} role="status">{note}</span>}
      <button
        className={styles.button}
        onClick={handleAddToCart}
        disabled={isAdding || !isAvailable || isOwned}
      >
        {isOwned ? "נרכש" : isAdding ? "מבצע הוספה..." : "הוסף לסל"}
      </button>
    </div>
  );
}
