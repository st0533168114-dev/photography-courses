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
  const navLinkClassName = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>

      <nav className={styles.nav}>
        <NavLink to="/" className={navLinkClassName}>דף הבית</NavLink>
        <NavLink to="/about" className={navLinkClassName}>אודות</NavLink>
        <NavLink to="/categories" className={navLinkClassName}>קורסים</NavLink>
        <NavLink to="/contactUs" className={navLinkClassName}>צור קשר</NavLink>
      </nav>
      {/* למנהל לא מוצגים סל קניות ו"הקורסים שלי" - הוא אינו רוכש קורסים במערכת */}
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
