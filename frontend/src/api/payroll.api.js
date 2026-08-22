import axiosInstance from './axiosInstance';
import { mockGetAllPayroll, mockGetEmployeePayroll, mockUpdatePayroll } from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const payrollApi = {
  // Admin: all payroll
  getAll: async () => {
    if (USE_MOCK) return mockGetAllPayroll();
    const { data } = await axiosInstance.get('/payroll');
    return data;
  },

  // Admin/Employee: employee payroll by userId
  getByEmployee: async (userId) => {
    if (USE_MOCK) return mockGetEmployeePayroll(userId);
    const { data } = await axiosInstance.get(`/payroll/${userId}`);
    return data;
  },

  // Employee: own payroll
  getMy: async () => {
    if (USE_MOCK) return mockGetEmployeePayroll('emp-001');
    const { data } = await axiosInstance.get('/payroll/my');
    return data;
  },

  // Admin: update salary structure
  update: async (userId, payload) => {
    if (USE_MOCK) return mockUpdatePayroll(userId, payload);
    const { data } = await axiosInstance.put(`/payroll/${userId}`, payload);
    return data;
  },
};
