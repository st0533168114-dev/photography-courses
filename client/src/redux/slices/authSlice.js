import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userApi from "../../API/userApi";

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return thunkAPI.rejectWithValue("no token");

    const response = await userApi.getProfile();
    return response;
  } catch (error) {
    // טוקן שנדחה על ידי השרת נמחק מיד, כדי שלא יישלח שוב בכל בקשה
    localStorage.removeItem("token");
    return thunkAPI.rejectWithValue("פג תוקף החיבור");
  }
});

export const registerUser = createAsyncThunk("users/registerUser", async (user, thunkAPI) => {
  try {
    const response = await userApi.addUser(user);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "ההרשמה נכשלה");
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const response = await userApi.loginUser(credentials);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "ההתחברות נכשלה");
  }
});

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    isLoggedIn: false,
    isLoading: true, // מתחיל ב-true כדי שמסך ההתחברות לא יוצג לרגע למשתמש שכבר מחובר
    error: null,
  },
  reducers: {
    logoutUser(state) {
      localStorage.removeItem("token");

      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    updateUserCourses(state, action) {
      if (state.user) {
        state.user.courseIds = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      // error לא מתעדכן כאן: אורח שאינו מחובר אינו מקרה שגיאה שצריך להציג במסך
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, updateUserCourses } = authSlice.actions;
export default authSlice.reducer;
