import axiosInstance from './axiosInstance';
import * as mockService from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authApi = {
  /**
   * POST /api/v1/auth/login
   * Body: { email, password }
   * Response: { success, token, user: { id, employeeId, email, role, firstName, lastName, department, designation } }
   */
  login: async (email, password) => {
    if (USE_MOCK) return mockService.login(email, password);
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    return data; // { success, token, user }
  },

  /**
   * POST /api/v1/auth/register
   * Body: { employeeId, email, password, role, firstName, lastName, department, designation, phone }
   * Response: { success, token, user }
   */
  register: async (payload) => {
    if (USE_MOCK) return mockService.register(payload);
    const { data } = await axiosInstance.post('/auth/register', payload);
    return data;
  },

  /**
   * GET /api/v1/auth/me
   * Response: { success, user: { id, employeeId, email, role, profile } }
   */
  getMe: async () => {
    if (USE_MOCK) return mockService.getMe();
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },
};
