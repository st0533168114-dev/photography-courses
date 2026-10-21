import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../redux/slices/shoppingCartSlice";
import styles from "../CSS/components/DeleteFromCartButton.module.css";

export default function DeleteFromCartButton(props) {
  const { courseId } = props;
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), 2500);
    return () => clearTimeout(timer);
  }, [note]);

  const handleRemoveFromCart = async () => {
    if (!courseId) return;
    try {
      setIsDeleting(true);
      await dispatch(removeFromCart(courseId)).unwrap(); // unwrap כדי שכישלון של ה-thunk יגיע ל-catch
    } catch (err) {
      console.error("המחיקה נכשלה:", err);
      setNote(err || "המחיקה מהסל נכשלה");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {note && <span className={styles.bubble} role="status">{note}</span>}
      <button type="button" className={styles.button} onClick={handleRemoveFromCart} disabled={isDeleting}>
        {isDeleting ? "מוחק..." : "מחיקה"}
      </button>
    </div>
  );
}
