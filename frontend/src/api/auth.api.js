import api from './axios';

export const authApi = {
  /**
   * Register a new user.
   * @param {{ employeeId, email, password, role }} data
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Login with email + password.
   * @param {{ email, password }} data
   * @returns {{ token, user: { _id, email, role, employeeId } }}
   */
  login: (data) => api.post('/auth/login', data),

  /**
   * Get the currently authenticated user's info.
   */
  me: () => api.get('/auth/me'),

  /**
   * Logout (clears server session if applicable).
   */
  logout: () => api.post('/auth/logout'),
};
