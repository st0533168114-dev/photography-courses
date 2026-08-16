import Header from "../layout/Header";
import Footer from "../layout/Footer";
import WellcomeSection from "../components/WellcomeSection";
import CategoryGrid from "../components/CategoryGrid";
import FAQSection from "../components/FAQSection";
import ContactUsSection from "../components/ContactUsSection";
import styles from "../CSS/pages/HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <WellcomeSection />

        <section className={styles.categoriesSection}>
          {/* בדף הבית לא מציגים את כרטיס "לכל הקורסים", רק את ריבועי הקטגוריות */}
          <CategoryGrid showAllCourses={false} />
        </section>

        <FAQSection />
        <ContactUsSection />
      </main>
      <Footer />
    </>
  );
}
