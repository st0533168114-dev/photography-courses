import { NavLink } from "react-router-dom";
import styles from "../CSS/layout/Footer.module.css";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* //כמובן פתוח לשינויים!!*/}
      <div className={styles.column}>
        <NavLink to="/" className={styles.link}>דף הבית</NavLink>
        <NavLink to="/about" className={styles.link}>אודות</NavLink>
        <NavLink to="/contactUs" className={styles.link}>צור קשר </NavLink>
      </div>
      <div className={styles.column}>
        {/* <div>????איך קישורים? */}
        {/* <NavLink to="/courses">קורסים מקצועיים</NavLink>
               <NavLink to="/courses">קורסים חובבני</NavLink>
               <NavLink to="/courses">קורסים חינמיים</NavLink> */}
        {/* ארצה בהמשך להוסיף סלייס לקטגוריות ואז אוסיף כאן את הקישורים לקטגוריות ה */}
        <NavLink to="/courses" className={styles.link}>כל הקורסים</NavLink>
      </div>
      <div className={styles.column}>
        <NavLink to="/login" className={styles.link}>התחברות</NavLink>
        <NavLink to="/signUp" className={styles.link}>הרשמה</NavLink>
      </div>
    </footer>
  );
}
