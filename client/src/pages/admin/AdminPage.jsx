import { NavLink, Outlet } from "react-router-dom";

import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

export default function AdminPage() {


  return (
    <>
      <Header></Header>
      <h2>עמוד ניהול</h2>
      <nav>
        {/* //כך נכון הקישורים?לבדוק */}
 
        <NavLink to="/admin/courses">ניהול קורסים</NavLink>
        {/* <NavLink to="/admin/users">ניהול משתמשים</NavLink>
        <NavLink to="/admin/categories">ניהול קטגוריות</NavLink>
        <NavLink to="/admin/orders">ניהול הזמנות</NavLink>
        <NavLink to="/admin/payments">ניהול תשלומים</NavLink> */}
      </nav>
      <div>
        <Outlet />
      </div>
      <Footer></Footer>
    </>
  );
}
