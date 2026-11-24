import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "../components/UserMenu";
import { CartIcon } from "../components/SiteIcons";
import styles from "../css/layout/Header.module.css";

export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const navLinkClassName = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img className={styles.logoImage} src="/logo.jpg" alt="מירלה כהן – קורסי צילום" />
      </Link>

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
                <NavLink to="/myCourses" className={navLinkClassName}>הקורסים שלי</NavLink>
                <NavLink
                  to="/ShoppingCartPage"
                  className={navLinkClassName}
                  title="סל קניות"
                  aria-label="סל קניות"
                >
                  <CartIcon />
                </NavLink>
              </>
            )}

            <UserMenu />
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
