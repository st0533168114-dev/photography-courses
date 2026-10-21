import { useNavigate } from "react-router-dom";
import styles from "../CSS/components/PurchaseButton.module.css";

export default function PurchaseButton(props) {
  const { disabled } = props;
  const navigate = useNavigate();

  return (
    <button type="button" className={styles.button} disabled={disabled} onClick={() => navigate("/createOrder")}>
      בצע רכישה
    </button>
  );
}
