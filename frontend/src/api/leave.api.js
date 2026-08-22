import axiosInstance from './axiosInstance';
import * as mockService from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const leaveApi = {
  /**
   * GET /api/v1/leaves/all?status=Pending|Approved|Rejected  (Admin only)
   * Response: { success, count, leaves: [...] }
   * Backend status values: 'Pending' | 'Approved' | 'Rejected'
   */
  getAll: async (params = {}) => {
    if (USE_MOCK) return mockService.getAllLeaves(params);
    // Map lowercase status values to backend's capitalized values
    const queryParams = {};
    if (params.status) {
      queryParams.status = params.status.charAt(0).toUpperCase() + params.status.slice(1).toLowerCase();
    }
    const { data } = await axiosInstance.get('/leaves/all', { params: queryParams });
    return data.leaves || [];
  },

  /**
   * GET /api/v1/leaves/me  (Own leaves — Employee)
   */
  getMine: async () => {
    if (USE_MOCK) return mockService.getMyLeaves();
    const { data } = await axiosInstance.get('/leaves/me');
    return data.leaves || [];
  },

  /**
   * POST /api/v1/leaves
   * Body: { leaveType, startDate, endDate, reason }
   * Note: backend field is 'reason' (not 'remarks')
   */
  apply: async (payload) => {
    if (USE_MOCK) return mockService.applyLeave(payload);
    const { data } = await axiosInstance.post('/leaves', {
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      reason: payload.reason || payload.remarks, // normalize field name
    });
    return data.leave;
  },

  /**
   * PATCH /api/v1/leaves/:id/decision
   * Body: { status: 'Approved', adminComment }
   */
  approve: async (id, adminComment = '') => {
    if (USE_MOCK) return mockService.approveLeave(id);
    const { data } = await axiosInstance.patch(`/leaves/${id}/decision`, {
      status: 'Approved',
      adminComment: adminComment || 'Leave approved by HR',
    });
    return data.leave;
  },

  /**
   * PATCH /api/v1/leaves/:id/decision
   * Body: { status: 'Rejected', adminComment }
   */
  reject: async (id, adminComment) => {
    if (USE_MOCK) return mockService.rejectLeave(id, adminComment);
    const { data } = await axiosInstance.patch(`/leaves/${id}/decision`, {
      status: 'Rejected',
      adminComment,
    });
    return data.leave;
  },
};
