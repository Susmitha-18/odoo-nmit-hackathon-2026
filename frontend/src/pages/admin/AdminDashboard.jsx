import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, CalendarOff, Wallet, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/States';
import { mockService, MOCK_EMPLOYEES } from '../../mock/mockService';
import { formatDate } from '../../utils/dateUtils';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mockService.getAllEmployees(),
      mockService.getAllLeaves(),
      mockService.getAllAttendance(),
      mockService.getAllPayroll(),
    ]).then(([empRes, lvRes, attRes, payRes]) => {
      setEmployees(empRes.data || []);
      setLeaves(lvRes.data || []);
      setAttendance(attRes.data || []);
      setSalaries(payRes.data || []);
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState message="Loading HR Dashboard..." />;

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const activeEmployees = employees.filter(e => e.isActive);
  const todayPresent = attendance.filter(a => a.status === 'present').length;
  const totalPayroll = salaries.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">HR Administration</span>
          <h2 className="text-2xl font-bold mt-1">Workforce & Operations Overview</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Monitor real-time employee attendance, review pending leave requests, and manage payroll.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/leave" className="btn bg-white text-indigo-900 hover:bg-indigo-50 font-medium btn-sm">
            Review Leaves ({pendingLeaves.length})
          </Link>
          <Link to="/admin/employees" className="btn bg-indigo-800 text-white hover:bg-indigo-900 border border-indigo-600 btn-sm">
            Add Employee
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Workforce"
          value={`${employees.length} Members`}
          subtitle={`${activeEmployees.length} active employees`}
          icon={<Users size={18} />}
          color="blue"
        />
        <KpiCard
          title="Today's Attendance"
          value={`${todayPresent} Present`}
          subtitle="Across all departments"
          icon={<CalendarCheck size={18} />}
          color="green"
        />
        <KpiCard
          title="Pending Approvals"
          value={`${pendingLeaves.length} Requests`}
          subtitle={pendingLeaves.length > 0 ? "Requires review" : "All cleared"}
          icon={<CalendarOff size={18} />}
          color={pendingLeaves.length > 0 ? "yellow" : "green"}
        />
        <KpiCard
          title="Monthly Payroll"
          value={`₹${totalPayroll.toLocaleString('en-IN')}`}
          subtitle="Estimated net payout"
          icon={<Wallet size={18} />}
          color="blue"
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leaves Requiring Action */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Pending Leave Requests</h3>
              <p className="section-subtitle">Employees waiting for your decision</p>
            </div>
            <Link to="/admin/leave" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
              <CheckCircle size={32} className="text-success-600" />
              <p>No pending leave requests to review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.slice(0, 4).map((leave) => (
                <div key={leave._id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{leave.employeeName}</p>
                    <p className="text-xs text-gray-500 capitalize">{leave.leaveType} Leave · {formatDate(leave.startDate)} to {formatDate(leave.endDate)}</p>
                    <p className="text-xs text-gray-400 italic mt-0.5">"{leave.remarks}"</p>
                  </div>
                  <Link to="/admin/leave" className="btn-primary btn btn-sm shrink-0">
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Employees Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Employee Directory Snapshot</h3>
              <p className="section-subtitle">Active workforce directory</p>
            </div>
            <Link to="/admin/employees" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              All employees <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {employees.slice(0, 4).map((emp) => (
              <div key={emp._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {emp.firstName?.[0]}
                  </div>
                  <div>
                    <Link to={`/admin/employees/${emp._id}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                      {emp.firstName} {emp.lastName}
                    </Link>
                    <p className="text-xs text-gray-500">{emp.designation} · <span className="text-gray-400">{emp.department}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${emp.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">{emp.employeeId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
