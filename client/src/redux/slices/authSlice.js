import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userApi from "../../API/userApi";
// בדיקת מצב ההתחברות בעת טעינת האפליקציה.
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    // בדיקת טוקן שמור בזיכרון המקומי.
    const token = localStorage.getItem("token");
    if (!token) return thunkAPI.rejectWithValue("no token");

    // שליפת פרטי המשתמש מהשרת.
    const response = await userApi.getProfile();
    return response;
  } catch (error) {
    // סילוק טוקן ישן במקרה של חיבור לא תקין.
    localStorage.removeItem("token");
    return thunkAPI.rejectWithValue("פג תוקף החיבור");
  }
});

// הרשמה של משתמש חדש למערכת.
export const registerUser = createAsyncThunk("users/registerUser", async (user, thunkAPI) => {
  try {
    // שליחה של פרטי המשתמש לשרת.
    const response = await userApi.addUser(user);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "ההרשמה נכשלה");
  }
});

// התחברות של משתמש קיים למערכת.
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    // שליחה של פרטי ההתחברות לשרת.
    const response = await userApi.loginUser(credentials);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "ההתחברות נכשלה");
  }
});

// הגדרת הסלייס לניהול פרטי ההתחברות.
const authSlice = createSlice({
  name: "auth",
 
  // מצב התחלתי של פרטי המשתמש.
  initialState: {
    //רק מה מידע על המשתמש עצמו פרטים אישיים בל סימה ובלי קודים
    user: null, // fullName,email,userName,phoneNumber,courseIds
    isLoggedIn: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    // סיום ההתחברות והסרת פרטי המשתמש מהמצב.
    logoutUser(state) {
      // .מחיקת הטוקן מהדפדפן ר
      localStorage.removeItem("token");

      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    // עדכון רשימת הקורסים של המשתמש.
    updateUserCourses(state, action) {
      if (state.user) {
        state.user.courseIds = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // עדכון מצב בעת התחלת בדיקת ההתחברות.
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // עדכון מצב לאחר בדיקת ההתחברות בהצלחה.
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      // עדכון מצב במקרה של כישלון בבדיקה.
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        // לא תמיד נרצה להציג שגיאה במסך כשהמשתמש פשוט לא מחובר בטעינה ראשונית
        state.isLoggedIn = false;
        state.user = null;
      })
      // עדכון מצב בעת התחלת תהליך ההרשמה.
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // עדכון מצב לאחר הרשמה מוצלחת.
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      // עדכון מצב במקרה של כישלון בהרשמה.
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // עדכון מצב בעת התחלת תהליך ההתחברות.
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // עדכון מצב לאחר התחברות מוצלחת.
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      // עדכון מצב במקרה של כישלון בהתחברות.
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// יצוא של פעולות הסלייס.
export const { logoutUser, updateUserCourses } = authSlice.actions;
export default authSlice.reducer;
