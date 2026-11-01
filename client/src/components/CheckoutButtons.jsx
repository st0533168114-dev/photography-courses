import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from "../css/components/CheckoutButtons.module.css";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CLIENT_ID,
  currency: "ILS",
  intent: "capture",
};

export default function CheckoutButtons(props) {
  const { createOrder, onApprove, onCancel, onError, disabled = false } = props;

  return (
    <div className={styles.wrapper}>
      <PayPalScriptProvider options={PAYPAL_OPTIONS}>
        {/* הפונקציות של העמוד נמסרות ל-PayPal, והוא מפעיל אותן ברגע המתאים: לחיצה, אישור בחלון, ביטול או שגיאה */}
        <PayPalButtons
          disabled={disabled}
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
}
