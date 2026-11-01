import { Link, Navigate, useLocation } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import styles from "../css/pages/PaymentConfirmationPage.module.css";

export default function PaymentConfirmationPage() {
  const location = useLocation();

  const order = location.state?.order;

  // ההזמנה מגיעה רק מעמוד התשלום. בכניסה ישירה או בריענון אין state, ולא מציגים "התשלום בוצע" בלי רכישה
  if (!order) {
    return <Navigate to="/myCourses" replace />;
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.title}>התשלום בוצע בהצלחה</h2>
          <p className={styles.subtitle}>תודה שבחרתם ללמוד איתנו</p>

          <div className={styles.details}>
            <p>
              מספר הזמנה: <span className={styles.orderId}>{order._id}</span>
            </p>
            <p>תאריך: {new Date(order.orderDate).toLocaleDateString("he-IL")}</p>
          </div>

          <ul className={styles.coursesList}>
            {order.coursesList.map((course) => (
              <li key={course.courseId} className={styles.courseRow}>
                <span>{course.courseName}</span>
                <span>₪{course.price}</span>
              </li>
            ))}
          </ul>

          <p className={styles.total}>סה"כ שולם: ₪{order.totalAmount}</p>

          <Link to="/myCourses" className={styles.myCoursesLink}>
            לקורסים שלי
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
