import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as coursesApi from "../../API/coursesApi";


export const getCourses = createAsyncThunk("courses/getCourses", async (_, thunkAPI) => {
  try {
    const response = await coursesApi.getCourses();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue("שליפת הקורסים נכשלה");
  }
});
//כרגע לא בשמוש!אבל כנראה שאצטרך בהמשך.כרגע שולפת את כל הקורסים בעמוד פרטי קורס
export const getCourseById = createAsyncThunk(
  "courses/getCourseById",
  async (courseId, thunkAPI) => {
    try {
      const response = await coursesApi.getCourseById(courseId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("שליפת הקורס נכשלה");
    }
  }
);

export const addCourse = createAsyncThunk("courses/addCourse", async (course, thunkAPI) => {
  try {
    const response = await coursesApi.addCourse(course);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue("הוספת הקורס נכשלה");
  }
});

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ courseId, course }, thunkAPI) => {
    try {
      const response = await coursesApi.updateCourse(courseId, course);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("עדכון הקורס נכשל");
    }
  }
);

export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (courseId, thunkAPI) => {
  try {
    await coursesApi.deleteCourse(courseId);
    return courseId;
  } catch (error) {
    return thunkAPI.rejectWithValue("מחיקת הקורס נכשלה");
  }
});


export const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    coursesList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coursesList = action.payload;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coursesList.push(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.coursesList.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.coursesList[index] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coursesList = state.coursesList.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default coursesSlice.reducer;
