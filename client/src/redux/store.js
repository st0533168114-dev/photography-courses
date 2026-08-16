import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coursesReducer from "./slices/coursesSlice";
import categoriesReducer from "./slices/categoriesSlice";
import shoppingCartReducer from "./slices/shoppingCartSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    categories: categoriesReducer,
    shoppingCart: shoppingCartReducer,
  },
});
export default store; 