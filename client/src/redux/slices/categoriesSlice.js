import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as categoryApi from "../../API/categoryApi";

export const getCategories = createAsyncThunk("categories/getCategories", async (_, thunkAPI) => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue("שליפת הקטגוריות נכשלה");
  }
});

export const getCategoryById = createAsyncThunk(
  "categories/getCategoryById",
  async (categoryId, thunkAPI) => {
    try {
      const response = await categoryApi.getCategoryById(categoryId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("שליפת הקטגוריה נכשלה");
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category, thunkAPI) => {
    try {
      const response = await categoryApi.addCategory(category);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("הוספת הקטגוריה נכשלה");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, categoryToUpdate }, thunkAPI) => {
    try {
      const response = await categoryApi.updateCategory(categoryId, categoryToUpdate);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("עדכון הקטגוריה נכשל");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, thunkAPI) => {
    try {
      await categoryApi.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return thunkAPI.rejectWithValue("מחיקת הקטגוריה נכשלה");
    }
  }
);


export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categoriesList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoriesList = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoriesList.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categoriesList.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categoriesList[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoriesList = state.categoriesList.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
