import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Umbrella, Clock, ChevronRight, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import KpiCard from '../../components/ui/KpiCard';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Avatar from '../../components/ui/Avatar';
import { dashboardApi } from '../../api/dashboard.api';
import { employeeApi } from '../../api/employee.api';
import { formatDate, timeAgo } from '../../utils/dateUtils';
import { formatLeaveType, getFullName } from '../../utils/formatUtils';

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, empData] = await Promise.all([
        dashboardApi.getAdminSummary(),
        employeeApi.getAll(),
      ]);
      setStats(dashData);
      setEmployees(empData.slice(0, 5));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <AdminLayout><LoadingState message="Loading dashboard..." /></AdminLayout>;
  if (error) return <AdminLayout><ErrorState message={error} onRetry={load} /></AdminLayout>;

  const kpis = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      colorScheme: 'indigo',
      subtitle: 'All active staff',
    },
    {
      title: 'Present Today',
      value: stats?.presentToday ?? 0,
      icon: UserCheck,
      colorScheme: 'emerald',
      subtitle: `of ${stats?.totalEmployees} employees`,
    },
    {
      title: 'On Leave Today',
      value: stats?.onLeaveToday ?? 0,
      icon: Umbrella,
      colorScheme: 'amber',
      subtitle: 'Approved leave',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingLeaveRequests ?? 0,
      icon: Clock,
      colorScheme: 'rose',
      subtitle: 'Awaiting review',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Attendance trend bar chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">Weekly Attendance Overview</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Present / Absent / On Leave</p>
              </div>
              <TrendingUp className="w-4 h-4 text-neutral-300" />
            </div>
            {stats?.attendanceTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.attendanceTrend} barSize={14} barGap={2}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    cursor={{ fill: '#f3f4f6' }}
                  />
                  <Bar dataKey="present" name="Present" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="absent"  name="Absent"  fill="#f87171" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="leave"   name="On Leave" fill="#fbbf24" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-neutral-400">
                No attendance data available.
              </div>
            )}
          </div>

          {/* Dept headcount pie */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-neutral-800">Headcount by Department</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Active employees</p>
            </div>
            {stats?.departmentHeadcount?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.departmentHeadcount}
                    dataKey="count"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                  >
                    {stats.departmentHeadcount.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-neutral-400">
                No data available.
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent leave requests */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-800">Recent Leave Requests</h3>
              <button
                onClick={() => navigate('/admin/leaves')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-neutral-50">
              {stats?.recentLeaves?.length > 0 ? (
                stats.recentLeaves.map((lv) => (
                  <div key={lv._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50/60 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar firstName={lv.employeeName?.split(' ')[0]} lastName={lv.employeeName?.split(' ')[1]} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{lv.employeeName}</p>
                        <p className="text-xs text-neutral-400">{formatLeaveType(lv.leaveType)} · {timeAgo(lv.createdAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={lv.status} className="ml-2 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-neutral-400">No recent leave requests.</div>
              )}
            </div>
          </div>

          {/* Recent employees */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-800">Employee Directory</h3>
              <button
                onClick={() => navigate('/admin/employees')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-neutral-50">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <div
                    key={emp._id}
                    onClick={() => navigate(`/admin/employees/${emp._id}`)}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar firstName={emp.firstName} lastName={emp.lastName} src={emp.profilePicture} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{getFullName(emp)}</p>
                        <p className="text-xs text-neutral-400 truncate">{emp.jobTitle} · {emp.department}</p>
                      </div>
                    </div>
                    <StatusBadge status={emp.employmentStatus} className="ml-2 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center text-sm text-neutral-400">No employees found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
