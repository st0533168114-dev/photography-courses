import api from "./axiosConfig";

export const getPayments = async () => {
  const response = await api.get(`/payments`);
  return response.data;
};
export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};
