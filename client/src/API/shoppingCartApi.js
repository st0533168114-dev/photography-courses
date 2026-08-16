//import axios from "axios";
import api from "./axiosConfig";

export const getAllShoppingCarts = async () => {
  const response = await api.get(`/shoppingCarts/admin/all`);
  return response.data;
};
export const getShoppingCart = async () => {
  const response = await api.get(`/shoppingCarts`);
  return response.data;
};
// export const addShoppingCart=async(shoppingCart)=>{
// const response=await axios.post(`/shoppingCarts`,shoppingCart);
// return response.data;
// }
// export const updateShoppingCart=async (shoppingCartId,shoppingCartToUpdate)=>{
//     const response=await axios.put(`/shoppingCarts/${shoppingCartId}`,shoppingCartToUpdate);
//     return response.data;
// }

export const clearShoppingCart = async () => {
  const response = await api.delete(`/shoppingCarts/items`);
  return response.data;
};

export const addToShoppingCart = async (courseId) => {
  const response = await api.post(`/shoppingCarts/items`, { courseId });
  return response.data;
};
export const removeFromShoppingCart = async (courseId) => {
  const response = await api.delete(`/shoppingCarts/items/${courseId}`);
  return response.data;
};
