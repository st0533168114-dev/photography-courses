import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CheckoutButtons from "../components/CheckoutButtons";
import { getCart, resetCart } from "../redux/slices/shoppingCartSlice";
import { updateUserCourses } from "../redux/slices/authSlice";
import { addOrder, captureOrder } from "../api/orderApi";
import styles from "../css/pages/CreateOrderPage.module.css";

export default function CreateOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.shoppingCart.cart);
  const isCartLoading = useSelector((state) => state.shoppingCart.isLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // שגיאת שליפה מקומית ולא מהסטור - שגיאה ישנה ממוטציה בעגלה לא תחליף את העמוד
  const [loadError, setLoadError] = useState(null);
  // ref ולא state: המזהה נדרש רק בין createOrder ל-onApprove ולא משפיע על התצוגה
  const orderIdRef = useRef(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        await dispatch(getCart()).unwrap();
      } catch (err) {
        setLoadError(err || "טעינת העגלה נכשלה");
      }
    };
    loadCart();
  }, [dispatch]);

  const courseList = cart?.courseList || [];
  const subtotal = cart?.subtotal || 0;
  const hasUnavailable = courseList.some((course) => course.isAvailable === false);

  if (isSubmitting) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <h2>מעבד את ההזמנה...</h2>
          <p>אנא המתן.</p>
        </main>
        <Footer />
      </>
    );
  }

  const handleCreateOrder = async () => {
    setError(null);
    try {
      // השרת בונה את ההזמנה מעגלת הקניות של המשתמש, ולכן גוף הבקשה ריק בכוונה
      const response = await addOrder({});
      orderIdRef.current = response.order._id;
      return response.payments.providerOrderId;
    } catch (err) {
      setError(err.response?.data?.message || "יצירת ההזמנה נכשלה, נסה שוב");
      throw err;
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const response = await captureOrder(orderIdRef.current);

      // עדכון הקורסים בסטייט הוא מה שפותח גישה מיידית ל"הקורסים שלי" בלי בקשה נוספת לשרת
      dispatch(updateUserCourses(response.user.courseIds));
      dispatch(resetCart());

      // replace: "חזור" מעמוד האישור לא יחזיר לעמוד התשלום עם עגלה ריקה
      navigate("/paymentConfirmation", { state: { order: response.order }, replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "התשלום נכשל, נסה שוב");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setError("התשלום בוטל. ניתן לנסות שוב.");
  };

  const handleError = () => {
    // שגיאה מ-handleCreateOrder כבר נשמרה עם ההודעה מהשרת, ולא דורסים אותה
    setError((prevError) => prevError || "אירעה תקלה בתשלום, נסה שוב");
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2>ביצוע רכישה</h2>

        <p>{user?.firstName} {user?.lastName}</p>
        <p>{user?.phoneNumber}</p>
        <p>{user?.email}</p>

        {isCartLoading ? (
          <p>טוען את פרטי ההזמנה...</p>
        ) : loadError ? (
          <p>שגיאה: {loadError}</p>
        ) : courseList.length === 0 ? (
          <p>עגלת הקניות שלך ריקה.</p>
        ) : (
          <div>
            {courseList.map((course) => (
              <p key={course.courseId}>
                {course.courseName} - {course.price} ₪
              </p>
            ))}
            <h3>סה"כ לתשלום: {subtotal} ₪</h3>
            {error && <p>{error}</p>}
            <CheckoutButtons
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onCancel={handleCancel}
              onError={handleError}
              disabled={hasUnavailable}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
