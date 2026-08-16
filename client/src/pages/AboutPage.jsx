import Header from "../layout/Header";
import Footer from "../layout/Footer";
import styles from "../CSS/pages/AboutPage.module.css";

//עד כאן

export default function AboutPage() {
  return (
    <>
      <Header></Header>
      <main className={styles.main}>
        <p className={styles.text}>
  כאן מירלה כהן. איך אגדיר את עצמי בכמה מילים? קצת קשה... אני אמא לשמונה מתוקים (בלי עין הרע), נשואה באושר, וגרה בחיפה (כן, ממש ליד הים). 
  חוץ מזה, אני גם צלמת – וכנראה שזו הסיבה שאתם כאן, אז טוב שבאתם! 
  אני ממש אוהבת אורחים, ובעיקר אוהבת לצלם. אין כמו לצלם ילדים – שובבים, מתוקים או עקשנים – ולתפוס את הזיק בעיניים שלהם דרך העדשה, ואת האושר של ההורים שסוף סוף יש להם תמונות להתגאות בהן. 
  ואם אתם עצמאיים שאוהבים לעשות הכל לבד – מעולה! תמצאו כאן המון דרכים להפוך את הצילום שלכם ל'וואו'. יאללה, מתחילים?
</p>
      </main>
      <Footer></Footer>
    </>
  );
}
