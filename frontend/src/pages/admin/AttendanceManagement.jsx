import React, { useState, useEffect } from 'react';
import { CalendarCheck, Search, Filter, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { mockService, MOCK_EMPLOYEES } from '../../mock/mockService';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/States';
import { formatDate, formatTime, formatHours } from '../../utils/dateUtils';

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mockService.getAllAttendance(),
      mockService.getAllEmployees(),
    ]).then(([attRes, empRes]) => {
      setAttendance(attRes.data || []);
      setEmployees(empRes.data || []);
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState message="Loading company-wide attendance..." />;

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e._id === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee';
  };

  const getEmployeeDept = (empId) => {
    const emp = employees.find(e => e._id === empId);
    return emp ? emp.department : 'General';
  };

  const filtered = attendance.filter(item => {
    const name = getEmployeeName(item.employeeId).toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || (item.date && item.date.includes(searchTerm));
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const leaveCount = attendance.filter(a => a.status === 'leave').length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Workforce Attendance Log</h2>
        <p className="text-sm text-gray-500">Monitor check-in timestamps, working durations, and attendance status for all employees.</p>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card !p-4 border-l-4 border-success-600 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Logged Present</span>
            <p className="text-2xl font-bold text-gray-900">{presentCount} Records</p>
          </div>
          <CheckCircle2 size={24} className="text-success-600" />
        </div>
        <div className="card !p-4 border-l-4 border-danger-600 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Absent</span>
            <p className="text-2xl font-bold text-gray-900">{absentCount} Records</p>
          </div>
          <XCircle size={24} className="text-danger-600" />
        </div>
        <div className="card !p-4 border-l-4 border-primary-600 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">On Approved Leave</span>
            <p className="text-2xl font-bold text-gray-900">{leaveCount} Records</p>
          </div>
          <AlertCircle size={24} className="text-primary-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="card !p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select text-sm !w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="half-day">Half-Day</option>
            <option value="leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="font-semibold text-gray-900">
                    {getEmployeeName(record.employeeId)}
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {getEmployeeDept(record.employeeId)}
                    </span>
                  </td>
                  <td>{formatDate(record.date)}</td>
                  <td>{record.checkIn ? formatTime(record.checkIn) : '—'}</td>
                  <td>{record.checkOut ? formatTime(record.checkOut) : '—'}</td>
                  <td className="font-medium text-gray-800">{formatHours(record.workingHours)}</td>
                  <td>
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
