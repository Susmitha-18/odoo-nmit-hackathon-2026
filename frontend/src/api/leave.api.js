import axiosInstance from './axiosInstance';

export const applyLeaveAPI = async (data) => {
  const response = await axiosInstance.post('/leaves', data);
  return response.data;
};

export const getMyLeavesAPI = async () => {
  const response = await axiosInstance.get('/leaves/me');
  return response.data;
};

export const getAllLeavesAPI = async (status) => {
  const params = status ? { status } : {};
  const response = await axiosInstance.get('/leaves', { params });
  return response.data;
};

export const handleLeaveDecisionAPI = async (id, status, adminComment) => {
  const path = status === 'Approved' ? `/leaves/${id}/approve` : `/leaves/${id}/reject`;
  const response = await axiosInstance.put(path, { adminComment });
  return response.data;
};
