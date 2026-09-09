import { Link, Outlet, useLocation } from "react-router-dom";

import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import styles from "../../CSS/pages/admin/AdminPage.module.css";

const adminSections = [
  { to: "/admin/dashboard", prefix: "/admin/dashboard", label: "לוח בקרה" },
  { to: "/admin/categories/list", prefix: "/admin/categories", label: "ניהול קטגוריות" },
  { to: "/admin/courses/list", prefix: "/admin/courses", label: "ניהול קורסים" },
  { to: "/admin/users/list", prefix: "/admin/users", label: "ניהול משתמשים" },
  { to: "/admin/orders/list", prefix: "/admin/orders", label: "ניהול הזמנות" },
  { to: "/admin/payments/list", prefix: "/admin/payments", label: "ניהול תשלומים" },
  { to: "/admin/faq/list", prefix: "/admin/faq", label: "שאלות ותשובות" },
];

export default function AdminPage() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <nav className={styles.sidebar}>
            {adminSections.map((section) => {
              const isActive = pathname.startsWith(section.prefix);

              return (
                <Link
                  key={section.to}
                  to={section.to}
                  className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                >
                  {section.label}
                </Link>
              );
            })}
          </nav>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
