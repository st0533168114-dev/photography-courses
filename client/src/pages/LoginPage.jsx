import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import styles from "../CSS/pages/LoginPage.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // שליפת הנתונים מתוך ה-Redux Store הגלובלי
  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  // אפקט שמקשיב למצב החיבור: אם המשתמש מחובר (גם לאחר ריענון), הוא מועבר אוטומטית לעמוד הבית
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); //מניעת ריענון בלחיצה

    if (!username || !password) {
      alert("נא למלא את כל השדות");
      return;
    }

    // שליחת פעולת ההתחברות ל-Redux
    const resultAction = await dispatch(loginUser({ userName: username, password: password }));

    // אם הפעולה נכשלה בשרת - מקפיצים התראת alert
    if (loginUser.rejected.match(resultAction)) {
      alert("פרטי התחברות שגויים או שאינך רשום במערכת");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>התחברות</h1>
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                placeholder="שם משתמש"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles.submitButton} type="submit" disabled={isLoading}>
              {isLoading ? "מתחבר..." : "כניסה"}
            </button>
          </form>

          <p className={styles.footerText}>
            אין לך חשבון? <button className={styles.linkButton} onClick={() => navigate("/signup")}>להרשמה</button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
