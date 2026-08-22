import axiosInstance from './axiosInstance';
import { mockLogin, mockGetMe } from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authApi = {
  login: async (email, password) => {
    if (USE_MOCK) return mockLogin(email, password);
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    return data;
  },

  register: async (payload) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));
      return { message: 'Registration successful. Please verify your email.' };
    }
    const { data } = await axiosInstance.post('/auth/register', payload);
    return data;
  },

  verifyEmail: async (token) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      return { message: 'Email verified successfully.' };
    }
    const { data } = await axiosInstance.post('/auth/verify-email', { token });
    return data;
  },

  getMe: async () => {
    if (USE_MOCK) return mockGetMe();
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },

  logout: () => {
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  },
};
