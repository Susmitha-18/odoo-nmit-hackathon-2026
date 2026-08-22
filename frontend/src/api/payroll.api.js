import axiosInstance from './axiosInstance';

export const getMyPayrollAPI = async () => {
  const response = await axiosInstance.get('/payroll/me');
  return response.data;
};

export const getAllPayrollsAPI = async () => {
  const response = await axiosInstance.get('/payroll');
  return response.data;
};

export const updateEmployeePayrollAPI = async (employeeId, data) => {
  const response = await axiosInstance.put(`/payroll/${employeeId}`, data);
  return response.data;
};
