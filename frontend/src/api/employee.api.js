import api from './axios';

export const employeeApi = {
  /**
   * Get the currently authenticated employee's own profile.
   */
  getMyProfile: () => api.get('/employees/me'),

  /**
   * Update own profile — only address, phone allowed for employees.
   * @param {{ phone?, address? }} data
   */
  updateMyProfile: (data) => api.put('/employees/me', data),

  /**
   * Get a specific employee by ID (Admin only in practice).
   */
  getById: (id) => api.get(`/employees/${id}`),
};
