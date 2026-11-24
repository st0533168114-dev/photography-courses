import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import styles from "../css/components/UserMenu.module.css";

export default function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // המאזינים על document רק כשהתפריט פתוח, כדי לסגור בלחיצה מחוץ לתפריט או ב-Escape
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    dispatch(logoutUser());
    navigate("/");
  };

  const firstName = user?.firstName || "";
  const isAdmin = user?.role === "admin";

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        className={styles.avatar}
        type="button"
        onClick={handleToggle}
        title="התפריט שלי"
        aria-label="התפריט שלי"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {firstName.charAt(0)}
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <p className={styles.greeting}>שלום, {firstName}</p>
          {/* למנהל אין אזור אישי, כמו לפני המעבר לתפריט */}
          {!isAdmin && (
            <Link className={styles.menuItem} to="/profile" role="menuitem" onClick={handleClose}>
              האזור האישי
            </Link>
          )}
          <button className={styles.menuItem} type="button" role="menuitem" onClick={handleLogout}>
            התנתקות
          </button>
        </div>
      )}
    </div>
  );
}
