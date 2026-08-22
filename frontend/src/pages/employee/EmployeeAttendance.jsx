import React, { useEffect, useState } from 'react';
import { getMyAttendanceAPI, checkInAPI, checkOutAPI } from '../../api/attendance.api';
import { useToast } from '../../context/ToastContext';
import { Play, Square, Calendar, Filter, X } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const EmployeeAttendance = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  // Check in/out state
  const [todayRecord, setTodayRecord] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAttendance = async () => {
    try {
      setError('');
      const logsRes = await getMyAttendanceAPI();

      if (logsRes.success) {
        const logsList = logsRes.attendance || [];
        setLogs(logsList);

        // Find today's log
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = logsList.find((log) => log.date === todayStr);
        setIsCheckedIn(!!todayLog);
        setIsCheckedOut(todayLog ? !!todayLog.checkOut : false);
        setTodayRecord(todayLog || null);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load attendance records from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await checkInAPI();
      if (res.success) {
        showToast('Successfully clocked in!', 'success');
        fetchAttendance();
      } else {
        showToast(res.message || 'Check-in failed.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error during check-in.', 'error');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await checkOutAPI();
      if (res.success) {
        showToast('Successfully clocked out! Work hours recorded.', 'success');
        fetchAttendance();
      } else {
        showToast(res.message || 'Check-out failed.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error during check-out.', 'error');
    }
  };

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    if (!log.date) return true;
    if (startDate && log.date < startDate) return false;
    if (endDate && log.date > endDate) return false;
    return true;
  });

  // Calculate statistics
  const totalDays = logs.length;
  const presentDays = logs.filter((l) => l.status === 'Present').length;
  const halfDays = logs.filter((l) => l.status === 'Half-day').length;
  const leaveDays = logs.filter((l) => l.status === 'Leave').length;

  const columns = [
    {
      header: 'Date',
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
      header: 'Work Hours',
      accessor: 'workHours',
      render: (row) => row.workHours ? `${row.workHours} hrs` : '—',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{row.remarks || 'On time'}</span>,
    },
  ];

  if (loading) return <LoadingState message="Fetching attendance history..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAttendance} />;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            My Attendance Portal
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Clock in, check out, and track historical attendance logs.
          </p>
        </div>

        {/* Quick check in controls */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
          >
            <Play size={12} />
            <span>Clock In</span>
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isCheckedOut}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-750 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
          >
            <Square size={12} />
            <span>Clock Out</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active Logs</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">{totalDays} days</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{presentDays} days</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Half-day</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{halfDays} days</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leaves Taken</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{leaveDays} days</p>
        </div>
      </div>

      {/* Filters row */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-semibold">
          <Filter size={14} />
          <span>Filter Date Range:</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        emptyMessage="No attendance logs found in this date range."
      />
    </div>
  );
};

export default EmployeeAttendance;
