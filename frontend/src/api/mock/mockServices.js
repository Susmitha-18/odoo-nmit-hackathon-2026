// Mock service layer — simulates backend API responses
// Swap import sources in api/*.api.js files when backend is ready

import {
  MOCK_USERS,
  MOCK_EMPLOYEES,
  MOCK_ATTENDANCE,
  MOCK_LEAVES,
  MOCK_PAYROLL,
  MOCK_DASHBOARD,
} from './mockData';

// Simulate network latency
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// In-memory state for mutations during the session
let employees = [...MOCK_EMPLOYEES];
let attendanceRecords = [...MOCK_ATTENDANCE];
let leaveRequests = [...MOCK_LEAVES];
let payrollRecords = [...MOCK_PAYROLL];

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const mockLogin = async (email, password) => {
  await delay(600);
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) throw { response: { data: { message: 'Invalid credentials.' } } };
  if (password.length < 3) throw { response: { data: { message: 'Invalid credentials.' } } };
  const token = `mock-jwt-${user._id}-${Date.now()}`;
  return { token, user };
};

export const mockGetMe = async () => {
  await delay(200);
  const stored = localStorage.getItem('dayflow_user');
  if (!stored) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
  return JSON.parse(stored);
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export const mockGetAdminDashboard = async () => {
  await delay(500);
  return { ...MOCK_DASHBOARD };
};

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
export const mockGetEmployees = async (params = {}) => {
  await delay(400);
  let result = [...employees];
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q)
    );
  }
  if (params.department) result = result.filter((e) => e.department === params.department);
  if (params.status) result = result.filter((e) => e.employmentStatus === params.status);
  return result;
};

export const mockGetEmployee = async (id) => {
  await delay(300);
  const emp = employees.find((e) => e._id === id || e.userId === id);
  if (!emp) throw { response: { data: { message: 'Employee not found.' } } };
  // Attach attendance summary
  const empAttendance = attendanceRecords.filter((a) => a.userId === emp.userId);
  const empLeaves = leaveRequests.filter((l) => l.userId === emp.userId);
  const empPayroll = payrollRecords.find((p) => p.userId === emp.userId);
  return { ...emp, attendanceSummary: empAttendance.slice(0, 7), leaveHistory: empLeaves, payroll: empPayroll };
};

export const mockUpdateEmployee = async (id, data) => {
  await delay(500);
  const idx = employees.findIndex((e) => e._id === id);
  if (idx === -1) throw { response: { data: { message: 'Employee not found.' } } };
  employees[idx] = { ...employees[idx], ...data };
  return employees[idx];
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const mockGetAllAttendance = async (params = {}) => {
  await delay(400);
  let result = [...attendanceRecords];
  if (params.userId) result = result.filter((a) => a.userId === params.userId);
  if (params.date) result = result.filter((a) => a.date === params.date);
  if (params.status) result = result.filter((a) => a.status === params.status);
  return result.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// ─── LEAVES ───────────────────────────────────────────────────────────────────
export const mockGetAllLeaves = async (params = {}) => {
  await delay(400);
  let result = [...leaveRequests];
  if (params.status) result = result.filter((l) => l.status === params.status);
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const mockApproveLeave = async (id, comment = '') => {
  await delay(600);
  const idx = leaveRequests.findIndex((l) => l._id === id);
  if (idx === -1) throw { response: { data: { message: 'Leave request not found.' } } };
  if (leaveRequests[idx].status !== 'pending')
    throw { response: { data: { message: 'Only pending requests can be approved.' } } };
  leaveRequests[idx] = {
    ...leaveRequests[idx],
    status: 'approved',
    adminComment: comment,
    reviewedAt: new Date().toISOString(),
  };
  return leaveRequests[idx];
};

export const mockRejectLeave = async (id, comment) => {
  await delay(600);
  if (!comment) throw { response: { data: { message: 'A rejection comment is required.' } } };
  const idx = leaveRequests.findIndex((l) => l._id === id);
  if (idx === -1) throw { response: { data: { message: 'Leave request not found.' } } };
  if (leaveRequests[idx].status !== 'pending')
    throw { response: { data: { message: 'Only pending requests can be rejected.' } } };
  leaveRequests[idx] = {
    ...leaveRequests[idx],
    status: 'rejected',
    adminComment: comment,
    reviewedAt: new Date().toISOString(),
  };
  return leaveRequests[idx];
};

// ─── PAYROLL ──────────────────────────────────────────────────────────────────
export const mockGetAllPayroll = async () => {
  await delay(400);
  return [...payrollRecords];
};

export const mockGetEmployeePayroll = async (userId) => {
  await delay(300);
  const record = payrollRecords.find((p) => p.userId === userId);
  if (!record) throw { response: { data: { message: 'Payroll record not found.' } } };
  return record;
};

export const mockUpdatePayroll = async (userId, data) => {
  await delay(600);
  const idx = payrollRecords.findIndex((p) => p.userId === userId);
  if (idx === -1) throw { response: { data: { message: 'Payroll record not found.' } } };
  const updated = {
    ...payrollRecords[idx],
    ...data,
    netSalary:
      Number(data.baseSalary || payrollRecords[idx].baseSalary) +
      (data.allowances || payrollRecords[idx].allowances).reduce((s, a) => s + Number(a.amount), 0) -
      (data.deductions || payrollRecords[idx].deductions).reduce((s, d) => s + Number(d.amount), 0),
    updatedAt: new Date().toISOString(),
  };
  payrollRecords[idx] = updated;
  return updated;
};
