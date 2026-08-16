import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CategoryGrid from "../components/CategoryGrid";
import styles from "../CSS/pages/CategoriesPage.module.css";

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>הקורסים שלנו</h1>
        {/* בדף קטגוריות מציגים גם את כרטיס "לכל הקורסים" וגם את ריבועי הקטגוריות */}
        <CategoryGrid showAllCourses={true} />
      </main>
      <Footer />
    </>
  );
}
