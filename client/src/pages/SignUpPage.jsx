import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import styles from "../CSS/pages/SignUpPage.module.css";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.rejected.match(resultAction)) {
      alert("ההרשמה נכשלה. ייתכן ששם המשתמש או האימייל כבר קיימים במערכת");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>הרשמה</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="firstName"
                placeholder="שם פרטי"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="lastName"
                placeholder="שם משפחה"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="phoneNumber"
                placeholder="טלפון"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="אימייל"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="userName"
                placeholder="שם משתמש"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <div className={styles.passwordRow}>
                <input
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="סיסמה"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button className={styles.toggleButton} type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "הסתר" : "הצג"}
                </button>
              </div>
            </div>

            <button className={styles.submitButton} type="submit" disabled={isLoading}>
              {isLoading ? "נרשם..." : "הרשמה"}
            </button>
          </form>

          <p className={styles.footerText}>
            כבר יש לך חשבון? <button className={styles.linkButton} onClick={() => navigate("/login")}>להתחברות</button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
