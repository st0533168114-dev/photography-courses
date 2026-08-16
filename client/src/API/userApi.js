//   אם זה עובד-לבדוקקקקק!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//import axios from "axios";
import api from "./axiosConfig";

export const loginUser = async (credentials) => {
  const response = await api.post(`/users/login`, credentials);
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};
export const addUser = async (user) => {
  const response = await api.post(`/users`, user);
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get(`/users`);
  return response.data;
};
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(`/users/profile`);
  return response.data;
};

export const updateUser = async (userId, userToUpdate) => {
  const response = await api.put(`/users/${userId}`, userToUpdate);
  return response.data;
};
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};
