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

  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  // הניווט תלוי ב-isLoggedIn ולא בתוצאת ההתחברות, כדי שגם משתמש שכבר מחובר לא יישאר בעמוד
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("נא למלא את כל השדות");
      return;
    }

    const resultAction = await dispatch(loginUser({ userName: username, password: password }));

    // ה-thunk לא זורק שגיאה, ולכן בודקים את סוג ה-action שהוחזר
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
