import api from "./axiosConfig";

export const getUploadSignature = async (paramsToSign) => {
  const response = await api.post(`/media/signature`, { paramsToSign });
  return response.data.signature;
};
