
import { useNavigate } from "react-router-dom";
import styles from "../CSS/components/PurchaseButton.module.css";
export default function PurchaseButton() {
  const navigate = useNavigate();
  //TODO
//לעבור לעמוד קליטת פרטי הזמנה ליצירת הזמנה אמיתית

  return (
    <>
      <button className={styles.button} onClick={() => navigate("/createOrder")}>בצע רכישה</button>
    </>
  );
}
