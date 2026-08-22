import axiosInstance from './axiosInstance';
import { mockGetEmployees, mockGetEmployee, mockUpdateEmployee } from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const employeeApi = {
  getAll: async (params = {}) => {
    if (USE_MOCK) return mockGetEmployees(params);
    const { data } = await axiosInstance.get('/employees', { params });
    return data;
  },

  getById: async (id) => {
    if (USE_MOCK) return mockGetEmployee(id);
    const { data } = await axiosInstance.get(`/employees/${id}`);
    return data;
  },

  // Admin: update any field
  update: async (id, payload) => {
    if (USE_MOCK) return mockUpdateEmployee(id, payload);
    const { data } = await axiosInstance.put(`/employees/${id}`, payload);
    return data;
  },

  // Employee: update only allowed fields (address, phone, profilePicture)
  updateSelf: async (id, payload) => {
    if (USE_MOCK) return mockUpdateEmployee(id, payload);
    const { data } = await axiosInstance.patch(`/employees/${id}/self`, payload);
    return data;
  },
};
