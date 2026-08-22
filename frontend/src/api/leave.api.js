import api from './axios';

export const leaveApi = {
  /**
   * Submit a new leave request.
   * @param {{ leaveType, startDate, endDate, remarks }} data
   */
  apply: (data) => api.post('/leave', data),

  /**
   * Get own leave requests.
   */
  getMyLeaves: () => api.get('/leave/me'),

  /**
   * Get a single leave request by ID.
   */
  getById: (id) => api.get(`/leave/${id}`),
};
