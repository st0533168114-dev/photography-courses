import { NavLink, Outlet } from "react-router-dom";

import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

export default function AdminPage() {


  return (
    <>
      <Header></Header>
      <h2>עמוד ניהול</h2>
      <nav>
        <NavLink to="/admin/categories/list">ניהול קטגוריות</NavLink>
        <NavLink to="/admin/courses/list">ניהול קורסים</NavLink>
        <NavLink to="/admin/users/list">ניהול משתמשים</NavLink>
      </nav>
      <div>
        <Outlet />
      </div>
      <Footer></Footer>
    </>
  );
}
