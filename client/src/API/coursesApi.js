import api from "./axiosConfig";

export const getCourses = async () => {
  const response = await api.get(`/courses`);
  return response.data;
};
export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};
export const addCourse = async (course) => {
  const response = await api.post(`/courses`, course);
  return response.data;
};
export const updateCourse = async (courseId, courseToUpdate) => {
  const response = await api.put(`/courses/${courseId}`, courseToUpdate);
  return response.data;
};
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};
