import axiosInstance from './axiosInstance';
import { mockGetAdminDashboard } from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const dashboardApi = {
  getAdminSummary: async () => {
    if (USE_MOCK) return mockGetAdminDashboard();
    const { data } = await axiosInstance.get('/dashboard/admin');
    return data;
  },

  getEmployeeSummary: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      return { recentAttendance: [], pendingLeaves: 0, lastCheckIn: null };
    }
    const { data } = await axiosInstance.get('/dashboard/employee');
    return data;
  },
};
