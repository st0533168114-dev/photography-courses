import api from "./axiosConfig";

export const getPayments = async () => {
  const response = await api.get(`/payments`);
  return response.data;
};
export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};
export const addPayment = async (payment) => {
  const response = await api.post(`/payments`, payment);
  return response.data;
};
export const updatePayment = async (paymentId, paymentToUpdate) => {
  const response = await api.put(`/payments/${paymentId}`, paymentToUpdate);
  return response.data;
};
export const deletePayment = async (paymentId) => {
  const response = await api.delete(`/payments/${paymentId}`);
  return response.data;
};
