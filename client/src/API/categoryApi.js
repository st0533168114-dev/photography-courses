import api from "./axiosConfig";

export const getCategories = async () => {
  const response = await api.get(`/categories`);
  return response.data;
};
export const getCategoryById = async (categoryId) => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
};
export const addCategory = async (category) => {
  const response = await api.post(`/categories`, category);
  return response.data;
};
export const updateCategory = async (categoryId, categoryToUpdate) => {
  const response = await api.put(`/categories/${categoryId}`, categoryToUpdate);
  return response.data;
};
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};
