import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import styles from "../CSS/layout/Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
// פונקציה שמחזירה את שם המחלקה של הקישור בהתאם למצבו (פעיל או לא פעיל)
//המטרה: לספק עיצוב שונה לקישור פעיל לעומת הקישור לא פעיל
  const navLinkClassName = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>{/* תמונת לוגו כשלוחצים עליה קישור לדף הבית */}</div>

      <nav className={styles.nav}>
        <NavLink to="/" className={navLinkClassName}>דף הבית</NavLink>
        <NavLink to="/about" className={navLinkClassName}>אודות</NavLink>
        <NavLink to="/categories" className={navLinkClassName}>קורסים</NavLink>
        <NavLink to="/contactUs" className={navLinkClassName}>צור קשר</NavLink>
      </nav>
      {/* 3 אפשרויות תצוגה:אם לא מחובר ,אם מחובר ומשתמש רגיל ואם מחובר ומנהל */}
      <div className={styles.actions}>
        {isLoggedIn ? (
          <>
            {user?.role === "admin" ? (
              <NavLink to="/admin" className={navLinkClassName}>ניהול</NavLink>
            ) : (
              <>
                <NavLink to="/ShoppingCartPage" className={navLinkClassName}>סל קניות</NavLink>
                <NavLink to="/myCourses" className={navLinkClassName}>הקורסים שלי</NavLink>
              </>
            )}

            {/* תצוגת טקסט באותה שורה */}
            <span className={styles.greeting}>שלום, {user?.firstName}</span>
            <button className={styles.logoutButton} onClick={handleLogout}>התנתקות</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClassName}>התחברות</NavLink>
            <NavLink to="/signUp" className={navLinkClassName}>הרשמה</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
