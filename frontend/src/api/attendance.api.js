import axiosInstance from './axiosInstance';

export const checkInAPI = async () => {
  const response = await axiosInstance.post('/attendance/check-in');
  return response.data;
};

export const checkOutAPI = async () => {
  const response = await axiosInstance.post('/attendance/check-out');
  return response.data;
};

export const getTodayStatusAPI = async () => {
  const response = await axiosInstance.get('/attendance/status/today');
  return response.data;
};

export const getMyAttendanceAPI = async () => {
  const response = await axiosInstance.get('/attendance/me');
  return response.data;
};

export const getAllAttendanceAPI = async (params = {}) => {
  const response = await axiosInstance.get('/attendance/all', { params });
  return response.data;
};
