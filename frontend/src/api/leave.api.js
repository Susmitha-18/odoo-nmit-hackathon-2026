import axiosInstance from './axiosInstance';
import { mockGetAllLeaves, mockApproveLeave, mockRejectLeave } from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const leaveApi = {
  // Admin: all leave requests
  getAll: async (params = {}) => {
    if (USE_MOCK) return mockGetAllLeaves(params);
    const { data } = await axiosInstance.get('/leaves', { params });
    return data;
  },

  // Employee: own leave requests
  getMy: async () => {
    if (USE_MOCK) return mockGetAllLeaves({ userId: 'emp-001' });
    const { data } = await axiosInstance.get('/leaves/my');
    return data;
  },

  // Employee: apply for leave
  apply: async (payload) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      return { message: 'Leave request submitted.', status: 'pending' };
    }
    const { data } = await axiosInstance.post('/leaves', payload);
    return data;
  },

  // Admin: approve
  approve: async (id, comment = '') => {
    if (USE_MOCK) return mockApproveLeave(id, comment);
    const { data } = await axiosInstance.patch(`/leaves/${id}/approve`, { comment });
    return data;
  },

  // Admin: reject (comment required)
  reject: async (id, comment) => {
    if (USE_MOCK) return mockRejectLeave(id, comment);
    const { data } = await axiosInstance.patch(`/leaves/${id}/reject`, { comment });
    return data;
  },
};
