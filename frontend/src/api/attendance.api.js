import axiosInstance from './axiosInstance';
import { mockGetAllAttendance } from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const attendanceApi = {
  // Admin: all attendance with optional filters
  getAll: async (params = {}) => {
    if (USE_MOCK) return mockGetAllAttendance(params);
    const { data } = await axiosInstance.get('/attendance', { params });
    return data;
  },

  // Admin: specific employee's attendance
  getByEmployee: async (userId, params = {}) => {
    if (USE_MOCK) return mockGetAllAttendance({ userId, ...params });
    const { data } = await axiosInstance.get(`/attendance/${userId}`, { params });
    return data;
  },

  // Employee: check in
  checkIn: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { message: 'Checked in successfully.', time: new Date().toISOString() };
    }
    const { data } = await axiosInstance.post('/attendance/checkin');
    return data;
  },

  // Employee: check out
  checkOut: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return { message: 'Checked out successfully.', time: new Date().toISOString() };
    }
    const { data } = await axiosInstance.post('/attendance/checkout');
    return data;
  },

  // Employee: own attendance
  getMy: async (params = {}) => {
    if (USE_MOCK) return mockGetAllAttendance({ userId: 'emp-001', ...params });
    const { data } = await axiosInstance.get('/attendance/my', { params });
    return data;
  },
};
