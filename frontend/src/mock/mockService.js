import api from '../api/axios';

/**
 * LIVE API INTEGRATION SERVICE
 * Connects frontend views directly to the Dayflow Node/Express & MongoDB Backend Engine.
 */

// Fallback Mock Data in case backend is offline
import { MOCK_EMPLOYEES, MOCK_SALARIES } from './mockDataFallback';
export { MOCK_EMPLOYEES, MOCK_SALARIES };

export const mockService = {
  // ── Employee self-service ──
  getMyProfile: async () => {
    try {
      const res = await api.get('/employees/me');
      const p = res.data.profile || res.data.employees?.[0];
      return {
        data: {
          _id: p?._id || 'emp001',
          employeeId: p?.employeeId || 'EMP002',
          firstName: p?.firstName || p?.fullName?.split(' ')[0] || 'John',
          lastName: p?.lastName || p?.fullName?.split(' ')[1] || 'Doe',
          email: p?.user?.email || p?.email || 'emp01@dayflow.com',
          phone: p?.phone || '+1 (555) 123-4567',
          address: p?.address || '42 Silicon Avenue, Apt 3B',
          department: p?.department || 'Engineering',
          designation: p?.designation || 'Senior Fullstack Engineer',
          joiningDate: p?.joiningDate ? new Date(p.joiningDate).toISOString().split('T')[0] : '2023-03-10',
          avatarUrl: p?.avatarUrl || p?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        }
      };
    } catch (err) {
      console.warn('API getMyProfile error, returning local state:', err);
      return { data: MOCK_EMPLOYEES[0] };
    }
  },

  updateMyProfile: async (data) => {
    try {
      const res = await api.patch('/employees/me', data);
      return { data: res.data.profile || res.data.employee };
    } catch (err) {
      return { data };
    }
  },

  getTodayAttendance: async () => {
    try {
      const res = await api.get('/attendance/status/today');
      return { data: res.data.attendance || null };
    } catch (err) {
      return { data: null };
    }
  },

  getMyAttendance: async () => {
    try {
      const res = await api.get('/attendance/me');
      return { data: res.data.attendance || [] };
    } catch (err) {
      return { data: [] };
    }
  },

  checkIn: async () => {
    const res = await api.post('/attendance/check-in');
    return { data: res.data.attendance };
  },

  checkOut: async () => {
    const res = await api.post('/attendance/check-out');
    return { data: res.data.attendance };
  },

  getMyLeaves: async () => {
    try {
      const res = await api.get('/leaves/me');
      return { data: res.data.leaves || [] };
    } catch (err) {
      return { data: [] };
    }
  },

  applyLeave: async (data) => {
    const res = await api.post('/leaves', {
      leaveType: data.leaveType?.toUpperCase() || 'PAID',
      startDate: data.startDate,
      endDate: data.endDate,
      remarks: data.remarks || data.reason || 'Leave requested'
    });
    return { data: res.data.leave };
  },

  getMyPayroll: async () => {
    try {
      const res = await api.get('/payroll/me');
      return { data: res.data.payroll };
    } catch (err) {
      return { data: MOCK_SALARIES.emp001 };
    }
  },

  // ── Admin / HR Functions ──
  getAllEmployees: async () => {
    try {
      const res = await api.get('/employees');
      const list = res.data.employees || [];
      return {
        data: list.map(e => ({
          _id: e._id,
          employeeId: e.employeeId,
          firstName: e.firstName || e.fullName?.split(' ')[0] || 'Employee',
          lastName: e.lastName || e.fullName?.split(' ')[1] || '',
          email: e.user?.email || e.email,
          phone: e.phone,
          address: e.address,
          department: e.department,
          designation: e.designation,
          joiningDate: e.joiningDate ? new Date(e.joiningDate).toISOString().split('T')[0] : '2023-01-01',
          isActive: true
        }))
      };
    } catch (err) {
      return { data: MOCK_EMPLOYEES };
    }
  },

  getEmployeeById: async (id) => {
    try {
      const res = await api.get(`/employees/${id}`);
      const e = res.data.employee || res.data.profile;
      return {
        data: {
          _id: e._id,
          employeeId: e.employeeId,
          firstName: e.firstName || e.fullName?.split(' ')[0] || 'Employee',
          lastName: e.lastName || e.fullName?.split(' ')[1] || '',
          email: e.user?.email || e.email,
          phone: e.phone,
          address: e.address,
          department: e.department,
          designation: e.designation,
          joiningDate: e.joiningDate ? new Date(e.joiningDate).toISOString().split('T')[0] : '2023-01-01',
          isActive: true
        }
      };
    } catch (err) {
      const emp = MOCK_EMPLOYEES.find(e => e._id === id);
      return { data: emp || MOCK_EMPLOYEES[0] };
    }
  },

  updateEmployee: async (id, data) => {
    const res = await api.put(`/employees/${id}`, data);
    return { data: res.data.employee || res.data.profile };
  },

  getAllAttendance: async () => {
    try {
      const res = await api.get('/attendance/all');
      return { data: res.data.attendance || [] };
    } catch (err) {
      return { data: [] };
    }
  },

  getEmployeeAttendance: async (empId) => {
    try {
      const res = await api.get(`/attendance/employee/${empId}`);
      return { data: res.data.attendance || [] };
    } catch (err) {
      return { data: [] };
    }
  },

  getAllLeaves: async () => {
    try {
      const res = await api.get('/leaves');
      return { data: res.data.leaves || [] };
    } catch (err) {
      return { data: [] };
    }
  },

  approveLeave: async (id, comment) => {
    const res = await api.put(`/leaves/${id}/approve`, { adminComment: comment });
    return { data: res.data.leave };
  },

  rejectLeave: async (id, comment) => {
    const res = await api.put(`/leaves/${id}/reject`, { adminComment: comment });
    return { data: res.data.leave };
  },

  getAllPayroll: async () => {
    try {
      const res = await api.get('/payroll');
      return { data: res.data.payrolls || [res.data.payroll] };
    } catch (err) {
      return { data: Object.values(MOCK_SALARIES) };
    }
  },

  getEmployeePayroll: async (empId) => {
    try {
      const res = await api.get('/payroll');
      const item = res.data.payrolls?.find(p => p.employeeId === empId);
      return { data: item || res.data.payroll };
    } catch (err) {
      return { data: MOCK_SALARIES.emp001 };
    }
  },

  updateSalary: async (empId, data) => {
    const res = await api.put(`/payroll/${empId}`, data);
    return { data: res.data.payroll };
  }
};
