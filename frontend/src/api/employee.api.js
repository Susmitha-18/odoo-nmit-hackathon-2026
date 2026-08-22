import axiosInstance from './axiosInstance';

export const getMyProfileAPI = async () => {
  const response = await axiosInstance.get('/employees');
  return {
    success: response.data.success,
    profile: response.data.employees?.[0] || null
  };
};

export const updateMyProfileAPI = async (id, data) => {
  const response = await axiosInstance.put(`/employees/${id}`, data);
  return response.data;
};

export const getAllEmployeesAPI = async () => {
  const response = await axiosInstance.get('/employees');
  return response.data;
};

export const getEmployeeByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/employees/${id}`);
  return response.data;
};

export const updateEmployeeByAdminAPI = async (id, data) => {
  const response = await axiosInstance.put(`/employees/${id}`, data);
  return response.data;
};
