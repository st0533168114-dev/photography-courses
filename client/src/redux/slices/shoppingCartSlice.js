import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as shoppingCartApi from "../../API/shoppingCartApi";

export const getCart = createAsyncThunk("shoppingCart/getCart", async (_, thunkAPI) => {
  try {
    const response = await shoppingCartApi.getShoppingCart();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue("Get cart failed");
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
      message: "Add to cart failed",
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
      return thunkAPI.rejectWithValue("Remove from cart failed");
    }
  }
);
export const clearCart = createAsyncThunk("shoppingCart/clearCart",
   async (_, thunkAPI) => {
  try {
    const response = await shoppingCartApi.clearShoppingCart();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue("Clear cart failed");
  }
});

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: {
    cart: null,
    isLoading: false,
    error: null,
  },
  reducers: {
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
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

  },
});
export default shoppingCartSlice.reducer;
