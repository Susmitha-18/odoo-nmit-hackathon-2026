import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dayflow_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clean up token and we can let the context handler handle redirecting
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_user');
      // If we are not on login page, we can redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
