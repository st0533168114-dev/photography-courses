import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// הגנה בצד הלקוח בלבד - היא מסתירה את הממשק, והאכיפה האמיתית נעשית ב-isAdminMiddleware בשרת
export default function AdminRoute(props) {
  const { children } = props; 
  const { isCheckingAuth, isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
  }, [isCheckingAuth, isLoggedIn, user, navigate]);

  if (isCheckingAuth) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>טוען...</h3>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== "admin") {
    return null;
  }

  return children;
}
