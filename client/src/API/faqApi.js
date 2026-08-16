import api from "./axiosConfig";

export const getFaqs = async () => {
  const response = await api.get(`/faq`);
  return response.data;
};

export const getFaqById = async (faqId) => {
  const response = await api.get(`/faq/${faqId}`);
  return response.data;
};

export const addFaq = async (faq) => {
  const response = await api.post(`/faq`, faq);
  return response.data;
};

export const updateFaq = async (faqId, faqToUpdate) => {
  const response = await api.put(`/faq/${faqId}`, faqToUpdate);
  return response.data;
};

export const deleteFaq = async (faqId) => {
  const response = await api.delete(`/faq/${faqId}`);
  return response.data;
};
