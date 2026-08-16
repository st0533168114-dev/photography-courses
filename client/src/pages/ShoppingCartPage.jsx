import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CourseCartItem from "../components/CourseCartItem";
import PurchaseButton from "../components/PurchaseButton";
import { getCart } from "../redux/slices/shoppingCartSlice";
import styles from "../CSS/pages/ShoppingCartPage.module.css";

export default function ShoppingCartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.shoppingCart.cart);
  const isLoading = useSelector((state) => state.shoppingCart.isLoading);
//??/בכל מקרה כדי לקבל את המידע הכי עדכני?
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const courseList = cart?.courseList || cart?.coursList || [];
  const subtotal = cart?.subtotal || 0;

  if (isLoading && courseList.length === 0) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <p className={styles.emptyState}>טוען את עגלת הקניות...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>עגלת הקניות שלי</h1>
          </div>

          {courseList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>עגלת הקניות שלך ריקה. זה הזמן להוסיף קורסים!</p>
            </div>
          ) : (
            <div className={styles.content}>
              <div className={styles.itemsList}>
                {courseList.map((course) => (
                  <CourseCartItem key={course.courseId} course={course} />
                ))}
              </div>

              <aside className={styles.summary}>
                <h3 className={styles.total}>לתשלום: {subtotal} ₪</h3>
                <PurchaseButton />
              </aside>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
