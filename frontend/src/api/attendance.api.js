import axiosInstance from './axiosInstance';
import * as mockService from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const attendanceApi = {
  /**
   * GET /api/v1/attendance/all  (Admin only)
   * Query params: { date, employeeId, status }
   * Response: { success, count, attendance: [...] }
   * Each record: { _id, user, employeeId, date, checkIn, checkOut, workHours, status, remarks }
   * Status values from backend: 'Present' | 'Half-day' | 'Absent' | 'Leave'
   */
  getAll: async (params = {}) => {
    if (USE_MOCK) return mockService.getAllAttendance(params);
    const { data } = await axiosInstance.get('/attendance/all', { params });
    return data.attendance || [];
  },

  /**
   * GET /api/v1/attendance/me  (Own records)
   */
  getMine: async (params = {}) => {
    if (USE_MOCK) return mockService.getMyAttendance(params);
    const { data } = await axiosInstance.get('/attendance/me', { params });
    return data.attendance || [];
  },

  /**
   * GET /api/v1/attendance/status/today
   */
  getTodayStatus: async () => {
    if (USE_MOCK) return mockService.getTodayAttendance();
    const { data } = await axiosInstance.get('/attendance/status/today');
    return data;
  },

  /**
   * POST /api/v1/attendance/check-in
   */
  checkIn: async () => {
    if (USE_MOCK) return mockService.checkIn();
    const { data } = await axiosInstance.post('/attendance/check-in');
    return data.attendance;
  },

  /**
   * POST /api/v1/attendance/check-out
   */
  checkOut: async () => {
    if (USE_MOCK) return mockService.checkOut();
    const { data } = await axiosInstance.post('/attendance/check-out');
    return data.attendance;
  },
};
