/**
 * MOCK SERVICE — for frontend development when backend is not ready.
 * Covers both Employee and Admin/HR views.
 */

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ── Mock Employees ────────────────────────────────────────────────────────────
export const MOCK_EMPLOYEES = [
  {
    _id: 'emp001', userId: 'user001', employeeId: 'EMP-001',
    firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@dayflow.io',
    phone: '+91 98765 43210', address: '42, MG Road, Bengaluru, Karnataka 560001',
    department: 'Engineering', designation: 'Software Engineer',
    joiningDate: '2023-06-15', employmentType: 'full-time',
    reportingManager: 'Amit Verma', isActive: true, gender: 'Female',
    dateOfBirth: '1998-04-12',
  },
  {
    _id: 'emp002', userId: 'user002', employeeId: 'EMP-002',
    firstName: 'Rahul', lastName: 'Nair', email: 'rahul.nair@dayflow.io',
    phone: '+91 91234 56789', address: '15, Koramangala, Bengaluru 560034',
    department: 'Product', designation: 'Product Manager',
    joiningDate: '2022-03-01', employmentType: 'full-time',
    reportingManager: 'Neha Gupta', isActive: true, gender: 'Male',
    dateOfBirth: '1995-09-23',
  },
  {
    _id: 'emp003', userId: 'user003', employeeId: 'EMP-003',
    firstName: 'Sneha', lastName: 'Iyer', email: 'sneha.iyer@dayflow.io',
    phone: '+91 87654 32109', address: '8, Whitefield, Bengaluru 560066',
    department: 'Design', designation: 'UI/UX Designer',
    joiningDate: '2023-11-20', employmentType: 'full-time',
    reportingManager: 'Rahul Nair', isActive: true, gender: 'Female',
    dateOfBirth: '1999-01-30',
  },
  {
    _id: 'emp004', userId: 'user004', employeeId: 'EMP-004',
    firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@dayflow.io',
    phone: '+91 99887 76655', address: '3, HSR Layout, Bengaluru 560102',
    department: 'Engineering', designation: 'Backend Developer',
    joiningDate: '2021-08-10', employmentType: 'contract',
    reportingManager: 'Priya Sharma', isActive: true, gender: 'Male',
    dateOfBirth: '1996-07-05',
  },
  {
    _id: 'emp005', userId: 'user005', employeeId: 'EMP-005',
    firstName: 'Kavya', lastName: 'Reddy', email: 'kavya.reddy@dayflow.io',
    phone: '+91 88776 65544', address: '21, Indiranagar, Bengaluru 560038',
    department: 'HR', designation: 'HR Executive',
    joiningDate: '2022-07-01', employmentType: 'full-time',
    reportingManager: 'Amit Verma', isActive: false, gender: 'Female',
    dateOfBirth: '1997-12-15',
  },
];

// ── Salary data ───────────────────────────────────────────────────────────────
export const MOCK_SALARIES = {
  emp001: { _id: 'sal001', employeeId: 'emp001', basicSalary: 60000, allowances: 15000, deductions: 8000, netSalary: 67000, effectiveFrom: '2024-04-01', updatedAt: '2024-04-01T00:00:00.000Z' },
  emp002: { _id: 'sal002', employeeId: 'emp002', basicSalary: 90000, allowances: 20000, deductions: 12000, netSalary: 98000, effectiveFrom: '2024-04-01', updatedAt: '2024-04-01T00:00:00.000Z' },
  emp003: { _id: 'sal003', employeeId: 'emp003', basicSalary: 55000, allowances: 12000, deductions: 7000,  netSalary: 60000, effectiveFrom: '2024-04-01', updatedAt: '2024-04-01T00:00:00.000Z' },
  emp004: { _id: 'sal004', employeeId: 'emp004', basicSalary: 75000, allowances: 18000, deductions: 10000, netSalary: 83000, effectiveFrom: '2024-04-01', updatedAt: '2024-04-01T00:00:00.000Z' },
  emp005: { _id: 'sal005', employeeId: 'emp005', basicSalary: 50000, allowances: 10000, deductions: 6000,  netSalary: 54000, effectiveFrom: '2024-04-01', updatedAt: '2024-04-01T00:00:00.000Z' },
};

// ── Attendance data ───────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);

const MOCK_TODAY_ATTENDANCE = {
  _id: 'att_today', employeeId: 'emp001', date: today,
  checkIn: new Date(new Date().setHours(9, 15, 0)).toISOString(),
  checkOut: null, status: 'present', workingHours: null,
};

const MOCK_ATTENDANCE_HISTORY = [
  { _id: 'att1', employeeId: 'emp001', date: '2024-07-19', checkIn: '2024-07-19T09:10:00.000Z', checkOut: '2024-07-19T18:05:00.000Z', status: 'present',  workingHours: 8.9 },
  { _id: 'att2', employeeId: 'emp001', date: '2024-07-18', checkIn: '2024-07-18T09:30:00.000Z', checkOut: '2024-07-18T17:45:00.000Z', status: 'present',  workingHours: 8.3 },
  { _id: 'att3', employeeId: 'emp001', date: '2024-07-17', checkIn: null,                        checkOut: null,                        status: 'absent',   workingHours: 0   },
  { _id: 'att4', employeeId: 'emp001', date: '2024-07-16', checkIn: '2024-07-16T09:00:00.000Z', checkOut: '2024-07-16T13:00:00.000Z', status: 'half-day', workingHours: 4   },
  { _id: 'att5', employeeId: 'emp001', date: '2024-07-15', checkIn: null,                        checkOut: null,                        status: 'leave',    workingHours: 0   },
  { _id: 'att6', employeeId: 'emp002', date: '2024-07-19', checkIn: '2024-07-19T09:00:00.000Z', checkOut: '2024-07-19T18:00:00.000Z', status: 'present',  workingHours: 9.0 },
  { _id: 'att7', employeeId: 'emp002', date: '2024-07-18', checkIn: null,                        checkOut: null,                        status: 'absent',   workingHours: 0   },
  { _id: 'att8', employeeId: 'emp003', date: '2024-07-19', checkIn: '2024-07-19T09:45:00.000Z', checkOut: '2024-07-19T17:30:00.000Z', status: 'present',  workingHours: 7.8 },
  { _id: 'att9', employeeId: 'emp004', date: '2024-07-19', checkIn: null,                        checkOut: null,                        status: 'leave',    workingHours: 0   },
];

// ── Leave data ────────────────────────────────────────────────────────────────
let MOCK_LEAVES = [
  { _id: 'leave1', employeeId: 'emp001', employeeName: 'Priya Sharma', leaveType: 'sick',   startDate: '2024-07-15', endDate: '2024-07-15', remarks: 'Fever and cold',    status: 'approved', adminComment: 'Get well soon!', createdAt: '2024-07-14T10:00:00.000Z' },
  { _id: 'leave2', employeeId: 'emp001', employeeName: 'Priya Sharma', leaveType: 'paid',   startDate: '2024-07-22', endDate: '2024-07-24', remarks: 'Family vacation',    status: 'pending',  adminComment: null, createdAt: '2024-07-18T08:30:00.000Z' },
  { _id: 'leave3', employeeId: 'emp001', employeeName: 'Priya Sharma', leaveType: 'unpaid', startDate: '2024-06-10', endDate: '2024-06-11', remarks: 'Personal work',      status: 'rejected', adminComment: 'Team is short-staffed this week.', createdAt: '2024-06-08T09:00:00.000Z' },
  { _id: 'leave4', employeeId: 'emp002', employeeName: 'Rahul Nair',   leaveType: 'paid',   startDate: '2024-07-25', endDate: '2024-07-26', remarks: 'Wedding ceremony',   status: 'pending',  adminComment: null, createdAt: '2024-07-20T11:00:00.000Z' },
  { _id: 'leave5', employeeId: 'emp003', employeeName: 'Sneha Iyer',   leaveType: 'sick',   startDate: '2024-07-18', endDate: '2024-07-18', remarks: 'Doctor appointment', status: 'approved', adminComment: 'Approved.', createdAt: '2024-07-17T07:00:00.000Z' },
  { _id: 'leave6', employeeId: 'emp004', employeeName: 'Arjun Mehta',  leaveType: 'paid',   startDate: '2024-08-01', endDate: '2024-08-05', remarks: 'Annual trip',        status: 'pending',  adminComment: null, createdAt: '2024-07-21T09:00:00.000Z' },
];

// ── Mock API ──────────────────────────────────────────────────────────────────
export const mockService = {
  // ── Employee self-service ──
  getMyProfile:       async () => { await delay(); return { data: MOCK_EMPLOYEES[0] }; },
  updateMyProfile:    async (data) => { await delay(); return { data: { ...MOCK_EMPLOYEES[0], ...data } }; },
  getTodayAttendance: async () => { await delay(); return { data: MOCK_TODAY_ATTENDANCE }; },
  getMyAttendance:    async () => { await delay(); return { data: MOCK_ATTENDANCE_HISTORY.filter((a) => a.employeeId === 'emp001') }; },
  checkIn:  async () => { await delay(600); return { data: { ...MOCK_TODAY_ATTENDANCE, checkIn: new Date().toISOString(), status: 'present' } }; },
  checkOut: async () => { await delay(600); return { data: { ...MOCK_TODAY_ATTENDANCE, checkOut: new Date().toISOString(), workingHours: 8.5 } }; },
  getMyLeaves:  async () => { await delay(); return { data: MOCK_LEAVES.filter((l) => l.employeeId === 'emp001') }; },
  applyLeave:   async (data) => {
    await delay(600);
    const newLeave = { _id: `leave_${Date.now()}`, employeeId: 'emp001', employeeName: 'Priya Sharma', ...data, status: 'pending', adminComment: null, createdAt: new Date().toISOString() };
    MOCK_LEAVES = [newLeave, ...MOCK_LEAVES];
    return { data: newLeave };
  },
  getMyPayroll: async () => { await delay(); return { data: MOCK_SALARIES.emp001 }; },

  // ── Admin / HR ──
  getAllEmployees: async () => { await delay(); return { data: MOCK_EMPLOYEES }; },
  getEmployeeById: async (id) => {
    await delay();
    const emp = MOCK_EMPLOYEES.find((e) => e._id === id);
    if (!emp) throw { response: { data: { message: 'Employee not found' }, status: 404 } };
    return { data: emp };
  },
  updateEmployee: async (id, data) => {
    await delay(600);
    const idx = MOCK_EMPLOYEES.findIndex((e) => e._id === id);
    if (idx !== -1) Object.assign(MOCK_EMPLOYEES[idx], data);
    return { data: { ...MOCK_EMPLOYEES[idx] } };
  },

  getAllAttendance: async () => { await delay(); return { data: MOCK_ATTENDANCE_HISTORY }; },
  getEmployeeAttendance: async (empId) => { await delay(); return { data: MOCK_ATTENDANCE_HISTORY.filter((a) => a.employeeId === empId) }; },

  getAllLeaves: async () => { await delay(); return { data: MOCK_LEAVES }; },
  approveLeave: async (id, comment) => {
    await delay(600);
    MOCK_LEAVES = MOCK_LEAVES.map((l) => l._id === id ? { ...l, status: 'approved', adminComment: comment || 'Approved.' } : l);
    return { data: MOCK_LEAVES.find((l) => l._id === id) };
  },
  rejectLeave: async (id, comment) => {
    await delay(600);
    MOCK_LEAVES = MOCK_LEAVES.map((l) => l._id === id ? { ...l, status: 'rejected', adminComment: comment } : l);
    return { data: MOCK_LEAVES.find((l) => l._id === id) };
  },

  getAllPayroll: async () => { await delay(); return { data: Object.values(MOCK_SALARIES) }; },
  getEmployeePayroll: async (empId) => { await delay(); return { data: MOCK_SALARIES[empId] ?? null }; },
  updateSalary: async (empId, data) => {
    await delay(600);
    const net = (data.basicSalary ?? 0) + (data.allowances ?? 0) - (data.deductions ?? 0);
    MOCK_SALARIES[empId] = { ...MOCK_SALARIES[empId], ...data, netSalary: net, updatedAt: new Date().toISOString() };
    return { data: MOCK_SALARIES[empId] };
  },
};
