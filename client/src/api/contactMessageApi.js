import api from "./axiosConfig";

export const getContactMessages = async () => {
  const response = await api.get(`/contactMessages`);
  return response.data;
};

export const getContactMessagesCount = async () => {
  const response = await api.get(`/contactMessages/count`);
  return response.data.count;
};

export const addContactMessage = async (contactMessage) => {
  const response = await api.post(`/contactMessages`, contactMessage);
  return response.data;
};

export const changeContactMessageStatus = async (contactMessageId, isHandled) => {
  const response = await api.put(`/contactMessages/${contactMessageId}/status`, { isHandled });
  return response.data;
};

export const deleteContactMessage = async (contactMessageId) => {
  const response = await api.delete(`/contactMessages/${contactMessageId}`);
  return response.data;
};
