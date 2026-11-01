import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as shoppingCartApi from "../../api/shoppingCartApi";

export const getCart = createAsyncThunk("shoppingCart/getCart", async (_, thunkAPI) => {
  try {
    const response = await shoppingCartApi.getShoppingCart();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "טעינת הסל נכשלה");
  }
});

export const addToCart = createAsyncThunk("shoppingCart/addToCart", async (courseId, thunkAPI) => {
  try {
    const response = await shoppingCartApi.addToShoppingCart(courseId);
    return response;
  } catch (error) {
    const statusCode = error.response?.status || 500;
    return thunkAPI.rejectWithValue({
      status: statusCode,
      message: error.response?.data?.message || "ההוספה נכשלה",
    });
  }
});

export const removeFromCart = createAsyncThunk(
  "shoppingCart/removeFromCart",
  async (courseId, thunkAPI) => {
    try {
      const response = await shoppingCartApi.removeFromShoppingCart(courseId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "המחיקה מהסל נכשלה");
    }
  }
);
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: {
    cart: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetCart(state) {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

  },
});
export const { resetCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
