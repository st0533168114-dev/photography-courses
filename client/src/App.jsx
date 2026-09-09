
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";
import SignUpPage from "./pages/SignUpPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import LoginPage from "./pages/LoginPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminCourseFormPage from "./pages/admin/AdminCourseFormPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminCategoryFormPage from "./pages/admin/AdminCategoryFormPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetailsPage";
import AdminUserFormPage from "./pages/admin/AdminUserFormPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminOrderFormPage from "./pages/admin/AdminOrderFormPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminFaqPage from "./pages/admin/AdminFaqPage";
import AdminFaqFormPage from "./pages/admin/AdminFaqFormPage";
import AdminRoute from "./components/AdminRoute";
import CreateOrderPage from "./pages/CreateOrderPage";
import PaymentConfirmationPage from "./pages/PaymentConfirmationPage";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/slices/authSlice";
import CourseDetailsPage from "./pages/CourseDetailsPage";



function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);

  // הטוקן נבדק מול השרת בכל טעינה, כדי שהמשתמש יישאר מחובר גם אחרי ריענון
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // חוסם את רינדור הראוטים עד לסיום הבדיקה, אחרת משתמש מחובר היה נשלח רגע למסך התחברות
  if (isLoading) {
    return (
      <div
        className="loading-container"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <h3>טוען נתונים, אנא המתן...</h3>
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/ShoppingCartPage" element={<ShoppingCartPage />}></Route>

          <Route path="/createOrder" element={<CreateOrderPage />}></Route>
          <Route path="/paymentConfirmation" element={<PaymentConfirmationPage />}></Route>

          <Route path="/categories" element={<CategoriesPage />}></Route>

          <Route path="/courses" element={<CoursesPage />}></Route>

          <Route path="/courses/:categoryId" element={<CoursesPage />}></Route>
          <Route path="/course/:courseId" element={<CourseDetailsPage />}></Route>

          <Route path="/contactUs" element={<ContactUsPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signUp" element={<SignUpPage />}></Route>
          <Route path="/myCourses" element={<MyCoursesPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>

          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
                {/* בלי ניתוב ברירת מחדל הכניסה ל-/admin מציגה סרגל צד בלי תוכן */}
                <Route index element={<Navigate to='dashboard' replace />}></Route>
                <Route path='dashboard' element={<AdminDashboardPage />}></Route>

                <Route path='courses/list' element={<AdminCoursesPage />}></Route>
                {/* courseType נשמר בנתיב ולא ב-state, כדי שהטופס יידע אם הקורס בתשלום או חינמי גם בכניסה ישירה לכתובת */}
                <Route path='courses/new/:courseType' element={<AdminCourseFormPage />}></Route>
                <Route path='courses/:courseId/edit/:courseType' element={<AdminCourseFormPage />}></Route>

                <Route path='categories/list' element={<AdminCategoriesPage />}></Route>
                <Route path='categories/new' element={<AdminCategoryFormPage />}></Route>
                <Route path='categories/:categoryId/edit' element={<AdminCategoryFormPage />}></Route>

                <Route path='users/list' element={<AdminUsersPage />}></Route>
                <Route path='users/:userId' element={<AdminUserDetailsPage />}></Route>
                <Route path='users/:userId/edit' element={<AdminUserFormPage />}></Route>

                <Route path='orders/list' element={<AdminOrdersPage />}></Route>
                <Route path='orders/:orderId' element={<AdminOrderDetailsPage />}></Route>
                <Route path='orders/:orderId/edit' element={<AdminOrderFormPage />}></Route>

                <Route path='payments/list' element={<AdminPaymentsPage />}></Route>

                <Route path='faq/list' element={<AdminFaqPage />}></Route>
                <Route path='faq/new' element={<AdminFaqFormPage />}></Route>
                <Route path='faq/:faqId/edit' element={<AdminFaqFormPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
