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
  const [formError, setFormError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setFormError("נא למלא את כל השדות");
      return;
    }

    setFormError(null);
    const resultAction = await dispatch(loginUser({ userName: username, password: password }));

    if (loginUser.rejected.match(resultAction)) {
      setFormError(resultAction.payload?.message || "פרטי התחברות שגויים או שאינך רשום במערכת");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>התחברות</h1>

          {formError && <div className={styles.error}>{formError}</div>}

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
