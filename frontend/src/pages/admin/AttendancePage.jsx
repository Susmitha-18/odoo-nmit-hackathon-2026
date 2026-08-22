import { useState, useEffect, useCallback } from 'react';
import { UserCheck, UserX, Clock4, Umbrella } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import KpiCard from '../../components/ui/KpiCard';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import ErrorState from '../../components/ui/ErrorState';
import { attendanceApi } from '../../api/attendance.api';
import { employeeApi } from '../../api/employee.api';
import { formatDate, formatTime, formatHours } from '../../utils/dateUtils';
import { getFullName, getErrorMessage } from '../../utils/formatUtils';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'half-day', label: 'Half Day' },
  { value: 'leave', label: 'On Leave' },
];

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ userId: '', date: '', status: '' });

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [attData, empData] = await Promise.all([
        attendanceApi.getAll(filters),
        employeeApi.getAll(),
      ]);
      setRecords(attData);
      setEmployees(empData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Summary counts from current records
  const summary = records.reduce(
    (acc, r) => {
      if (r.status === 'present') acc.present++;
      else if (r.status === 'absent') acc.absent++;
      else if (r.status === 'half-day') acc.halfDay++;
      else if (r.status === 'leave') acc.leave++;
      return acc;
    },
    { present: 0, absent: 0, halfDay: 0, leave: 0 }
  );

  const filterConfig = [
    {
      key: 'userId',
      label: 'Employee',
      value: filters.userId,
      options: employees.map((e) => ({ value: e.userId || e._id, label: getFullName(e) })),
    },
    {
      key: 'date',
      label: 'Date',
      value: filters.date,
      options: [], // date is handled separately below as an input
    },
    {
      key: 'status',
      label: 'Status',
      value: filters.status,
      options: STATUS_OPTIONS,
    },
  ];

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (row) => {
        const emp = employees.find((e) => (e.userId || e._id) === row.userId);
        return (
          <div className="flex items-center gap-2.5">
            <Avatar
              firstName={row.employeeName?.split(' ')[0] || emp?.firstName}
              lastName={row.employeeName?.split(' ')[1] || emp?.lastName}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-neutral-800">{row.employeeName || getFullName(emp) || '—'}</p>
              <p className="text-xs text-neutral-400">{row.department || emp?.department || ''}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <div>
          <p className="text-sm text-neutral-700">{formatDate(row.date)}</p>
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Check In',
      render: (row) => (
        <span className={`text-sm ${row.checkIn ? 'text-neutral-700' : 'text-neutral-300'}`}>
          {formatTime(row.checkIn)}
        </span>
      ),
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      render: (row) => (
        <span className={`text-sm ${row.checkOut ? 'text-neutral-700' : 'text-neutral-300'}`}>
          {formatTime(row.checkOut)}
        </span>
      ),
    },
    {
      key: 'hoursWorked',
      label: 'Hours',
      render: (row) => (
        <span className="text-sm text-neutral-600 font-mono">{formatHours(row.hoursWorked)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Attendance Management"
        subtitle="View and filter attendance records across all employees."
        breadcrumb={[{ label: 'Admin' }, { label: 'Attendance' }]}
      />

      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <KpiCard title="Present" value={summary.present} icon={UserCheck} colorScheme="emerald" />
        <KpiCard title="Absent" value={summary.absent} icon={UserX} colorScheme="rose" />
        <KpiCard title="Half Day" value={summary.halfDay} icon={Clock4} colorScheme="amber" />
        <KpiCard title="On Leave" value={summary.leave} icon={Umbrella} colorScheme="blue" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm mb-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Employee select */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Employee</label>
            <select
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-w-[160px]"
            >
              <option value="">All Employees</option>
              {employees.map((e) => (
                <option key={e._id} value={e.userId || e._id}>{getFullName(e)}</option>
              ))}
            </select>
          </div>

          {/* Date input */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              max={today}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>

          {/* Status select */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(filters.userId || filters.date || filters.status) && (
            <button
              onClick={() => setFilters({ userId: '', date: '', status: '' })}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium pb-2 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              {records.length} record{records.length !== 1 ? 's' : ''}
              {filters.date ? ` for ${formatDate(filters.date)}` : ''}
            </span>
          </div>
          <DataTable
            columns={columns}
            data={records}
            loading={loading}
            emptyMessage="No attendance records found for the selected filters."
          />
        </div>
      )}
    </AdminLayout>
  );
}
