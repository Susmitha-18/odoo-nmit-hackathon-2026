import axiosInstance from './axiosInstance';
import * as mockService from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const employeeApi = {
  /**
   * GET /api/v1/employees
   * Admin: all employees | Employee: own profile in array
   * Response: { success, count, employees: [...EmployeeProfile] }
   * Each profile has: _id, employeeId, firstName, lastName, department, designation, phone, address, joiningDate, avatarUrl, user { email, role }
   */
  getAll: async (params = {}) => {
    if (USE_MOCK) return mockService.getEmployees(params);
    const { data } = await axiosInstance.get('/employees', { params });
    return data.employees || [];
  },

  /**
   * GET /api/v1/employees/me  — current user's own profile
   */
  getMyProfile: async () => {
    if (USE_MOCK) return mockService.getMyProfile();
    const { data } = await axiosInstance.get('/employees/me');
    return data.profile;
  },

  /**
   * GET /api/v1/employees/:id  — by EmployeeProfile _id (Admin)
   */
  getById: async (id) => {
    if (USE_MOCK) return mockService.getEmployeeById(id);
    const { data } = await axiosInstance.get(`/employees/${id}`);
    return data.profile;
  },

  /**
   * PATCH /api/v1/employees/:id  — Admin updates any employee
   * Body: { firstName, lastName, department, designation, phone, address, avatarUrl, joiningDate }
   */
  update: async (id, payload) => {
    if (USE_MOCK) return mockService.updateEmployee(id, payload);
    const { data } = await axiosInstance.patch(`/employees/${id}`, payload);
    return data.profile;
  },

  /**
   * PATCH /api/v1/employees/me  — Employee updates own restricted fields
   * Body: { phone, address, avatarUrl }
   */
  updateMyProfile: async (payload) => {
    if (USE_MOCK) return mockService.updateMyProfile(payload);
    const { data } = await axiosInstance.patch('/employees/me', payload);
    return data.profile;
  },
};
