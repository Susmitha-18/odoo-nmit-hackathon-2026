import api from './axios';

export const attendanceApi = {
  /**
   * Record check-in for the currently authenticated employee.
   */
  checkIn: () => api.post('/attendance/checkin'),

  /**
   * Record check-out for the currently authenticated employee.
   */
  checkOut: () => api.post('/attendance/checkout'),

  /**
   * Get own attendance records.
   * @param {{ startDate?, endDate?, week? }} params
   */
  getMyAttendance: (params = {}) => api.get('/attendance/me', { params }),

  /**
   * Get today's attendance record for the current employee.
   */
  getToday: () => api.get('/attendance/me/today'),
};
