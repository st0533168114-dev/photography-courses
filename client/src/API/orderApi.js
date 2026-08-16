import api from "./axiosConfig";

export const getOrders = async () => {
  const response = await api.get(`/orders`);
  return response.data;
};
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
export const addOrder = async (order) => {
  const response = await api.post(`/orders`, order);
  return response.data;
};
export const updateOrder = async (orderId, orderToUpdate) => {
  const response = await api.put(`/orders/${orderId}`, orderToUpdate);
  return response.data;
};
export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};
