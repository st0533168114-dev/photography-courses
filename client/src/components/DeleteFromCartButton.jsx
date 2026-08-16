import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../redux/slices/shoppingCartSlice";
import styles from "../CSS/components/DeleteFromCartButton.module.css";

export default function DeleteFromCartButton(props) {
  const { courseId } = props;
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleRemoveFromCart = async () => {
    if (!courseId) return;
    try {
      setIsDeleting(true);
      await dispatch(removeFromCart(courseId));
    } catch (err) {
      console.error("המחיקה נכשלה:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      {/* אני רוצה ציור פח */}
      {/* כפתור מחיקה */}
      <button className={styles.button} onClick={handleRemoveFromCart} disabled={isDeleting}>
        {" "}
        מחיקה
      </button>
    </>
  );
}
