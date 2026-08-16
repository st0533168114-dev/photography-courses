import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ContactUsSection from "../components/ContactUsSection";
import styles from "../CSS/pages/ContactUsPage.module.css";
export default function ContactUsPage() {
  return (
    <>
      <Header></Header>
      <main className={styles.main}>
        <ContactUsSection />
      </main>
      <Footer></Footer>
    </>
  );
}
