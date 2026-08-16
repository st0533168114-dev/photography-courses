
import { useNavigate } from "react-router-dom";
import styles from "../CSS/components/PurchaseButton.module.css";
export default function PurchaseButton() {
  const navigate = useNavigate();
 //אמור להיות כאן מעבר לעמוד של קליטת פרטי הזמנה
  return (
    <>
      <button className={styles.button} onClick={() => navigate("/createOrder")}>בצע רכישה</button>
    </>
  );
}
