import React, { useEffect, useState } from 'react';
import { getAllAttendanceAPI } from '../../api/attendance.api';
import { Clock, Filter, Search, X } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchBar from '../../components/ui/SearchBar';
import FilterBar from '../../components/ui/FilterBar';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const AttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  // Search/Filters
  const [empIdVal, setEmpIdVal] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAttendanceLogs = async () => {
    setLoading(true);
    try {
      setError('');
      const params = {};
      if (empIdVal.trim()) params.employeeId = empIdVal.trim();
      if (dateFilter) params.date = dateFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await getAllAttendanceAPI(params);
      if (res.success) {
        setLogs(res.attendance || []);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch company attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceLogs();
  }, [empIdVal, dateFilter, statusFilter]);

  // Compute stats counts from logs list
  const totalCount = logs.length;
  const presentCount = logs.filter((l) => l.status === 'Present').length;
  const halfDayCount = logs.filter((l) => l.status === 'Half-day').length;
  const leaveCount = logs.filter((l) => l.status === 'Leave').length;

  const filters = [
    {
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'Present', value: 'Present' },
        { label: 'Half-day', value: 'Half-day' },
        { label: 'On Approved Leave', value: 'Leave' },
        { label: 'Absent', value: 'Absent' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-extrabold text-indigo-650">{row.employeeId}</span>,
    },
    {
      header: 'Shift Date',
      accessor: 'date',
      render: (row) => (
        <span className="font-semibold text-slate-700">
          {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Check In',
      accessor: 'checkIn',
      render: (row) => row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    },
    {
      header: 'Check Out',
      accessor: 'checkOut',
      render: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    },
    {
      header: 'Hours Worked',
      accessor: 'workHours',
      render: (row) => row.workHours ? `${row.workHours} hrs` : '—',
    },
    {
      header: 'Shift Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{row.remarks || 'On time'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Workforce Attendance Logs
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Track check-ins, check-outs, shift hours, and record anomalies.
        </p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Filtered Shifts</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">{totalCount} logs</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Present</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{presentCount} shifts</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Half-day</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{halfDayCount} shifts</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">On Leave</p>
          <p className="text-2xl font-extrabold text-blue-605 mt-1">{leaveCount} shifts</p>
        </div>
      </div>

      {/* Filters card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <SearchBar
            value={empIdVal}
            onChange={setEmpIdVal}
            placeholder="Search Employee ID (e.g. EMP002)..."
            onClear={() => setEmpIdVal('')}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 text-xs font-semibold">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:outline-none cursor-pointer"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            )}
          </div>
          <FilterBar filters={filters} />
        </div>
      </div>

      {/* Table grid */}
      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        emptyMessage="No attendance logs matching the filter parameters."
      />
    </div>
  );
};

export default AttendancePage;
