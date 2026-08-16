import axios from "axios";

// יצירת מופע מותאם אישית של אקסיוס לעבודה נוחה מול השרת
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// הגדרת אינטרספטור - פונקציה שתופסת כל בקשה רגע לפני שהיא נשלחת לשרת
api.interceptors.request.use(
  (config) => {
    // שליפת הטוקן של המשתמש השמור בדפדפן
    const token = localStorage.getItem("token");

    // אם המשתמש מחובר וקיים טוקן, נדביק אותו לראש הבקשה
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // המשך שליחת הבקשה לשרת עם הנתונים המעודכנים
    return config;
  },
  // טיפול בשגיאה במידה והבקשה נכשלה עוד לפני שיצאה מהדפדפן
  (error) => Promise.reject(error)
);

export default api;
