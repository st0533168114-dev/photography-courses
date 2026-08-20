import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//הגנה על נתיבי הניהול
export default function AdminRoute(props) {
  const { children } = props; 
  const { isLoading, isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
  }, [isLoading, isLoggedIn, user, navigate]);

  if (isLoading) {
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
