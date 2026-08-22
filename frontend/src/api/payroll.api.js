import api from './axios';

export const payrollApi = {
  /**
   * Get the currently authenticated employee's own payroll (read-only).
   */
  getMyPayroll: () => api.get('/payroll/me'),
};
