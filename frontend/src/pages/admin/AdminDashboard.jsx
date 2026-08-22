import React, { useEffect, useState } from 'react';
import { getAllEmployeesAPI } from '../../api/employee.api';
import { getAllAttendanceAPI } from '../../api/attendance.api';
import { getAllLeavesAPI } from '../../api/leave.api';
import { Users, UserCheck, CalendarDays, Inbox, Clock, CalendarRange, RefreshCw } from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

const AdminDashboard = () => {
  // Loaders & Errors
  const [empLoading, setEmpLoading] = useState(true);
  const [empError, setEmpError] = useState('');
  const [attLoading, setAttLoading] = useState(true);
  const [attError, setAttError] = useState('');
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [leaveError, setLeaveError] = useState('');

  // Stats
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);

  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [deptDistribution, setDeptDistribution] = useState({});

  const loadEmployees = async () => {
    setEmpLoading(true);
    setEmpError('');
    try {
      const empRes = await getAllEmployeesAPI();
      if (empRes.success) {
        setTotalEmployees(empRes.count || empRes.employees?.length || 0);
        const depts = {};
        empRes.employees?.forEach((e) => {
          const dept = e.department || 'Other';
          depts[dept] = (depts[dept] || 0) + 1;
        });
        setDeptDistribution(depts);
      } else {
        setEmpError('Unable to load employee statistics.');
      }
    } catch (err) {
      console.error(err);
      setEmpError('Unable to load employee statistics.');
    } finally {
      setEmpLoading(false);
    }
  };

  const loadAttendance = async () => {
    setAttLoading(true);
    setAttError('');
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const attTodayRes = await getAllAttendanceAPI({ date: todayStr });
      if (attTodayRes.success) {
        const todayLogs = attTodayRes.attendance || [];
        const presentCount = todayLogs.filter(a => {
          const s = (a.status || '').toUpperCase();
          return s === 'PRESENT' || s === 'HALF_DAY';
        }).length;
        const leaveCount = todayLogs.filter(a => (a.status || '').toUpperCase() === 'LEAVE').length;

        setPresentToday(presentCount);
        setOnLeaveToday(leaveCount);
        setRecentAttendance(todayLogs.slice(0, 5));
      } else {
        setAttError('Unable to load today\'s attendance.');
      }
    } catch (err) {
      console.error(err);
      setAttError('Unable to load today\'s attendance.');
    } finally {
      setAttLoading(false);
    }
  };

  const loadLeaves = async () => {
    setLeaveLoading(true);
    setLeaveError('');
    try {
      const leaveRes = await getAllLeavesAPI();
      if (leaveRes.success) {
        const leavesList = leaveRes.leaves || [];
        const pendingList = leavesList.filter(l => (l.status || '').toUpperCase() === 'PENDING');
        setPendingLeavesCount(pendingList.length);
        setRecentLeaves(pendingList.slice(0, 5));
      } else {
        setLeaveError('Unable to load leave requests.');
      }
    } catch (err) {
      console.error(err);
      setLeaveError('Unable to load leave requests.');
    } finally {
      setLeaveLoading(false);
    }
  };

  const fetchDashboardData = () => {
    loadEmployees();
    loadAttendance();
    loadLeaves();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="HR Management Dashboard" 
        subtitle="Real-time analytics and workforce administration overview."
        action={
          <Button 
            onClick={fetchDashboardData}
            variant="secondary"
            className="p-2 h-10 w-10 !px-0 rounded-xl"
            title="Refresh Dashboard Data"
          >
            <RefreshCw size={16} className={`${(empLoading || attLoading || leaveLoading) ? 'animate-spin' : ''}`} />
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {empError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">Employees Data Error</span>
            <button onClick={loadEmployees} className="text-[10px] font-bold text-indigo-605 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
          <KpiCard
            title="Total Employees"
            value={empLoading ? '...' : totalEmployees}
            icon={Users}
            color="indigo"
          />
        )}

        {attError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">Present Today Error</span>
            <button onClick={loadAttendance} className="text-[10px] font-bold text-indigo-650 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
          <KpiCard
            title="Present Today"
            value={attLoading ? '...' : presentToday}
            icon={UserCheck}
            color="emerald"
          />
        )}

        {attError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">On Leave Today Error</span>
            <button onClick={loadAttendance} className="text-[10px] font-bold text-indigo-650 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
          <KpiCard
            title="On Leave Today"
            value={attLoading ? '...' : onLeaveToday}
            icon={CalendarRange}
            color="blue"
          />
        )}

        {leaveError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">Pending Approvals Error</span>
            <button onClick={loadLeaves} className="text-[10px] font-bold text-indigo-650 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
          <KpiCard
            title="Pending Approvals"
            value={leaveLoading ? '...' : pendingLeavesCount}
            icon={Inbox}
            color="amber"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Leaves Pending and Department Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leaves Pending */}
          <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-855 tracking-wider uppercase flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>Pending Leave Queue</span>
              </h3>
              <Link to="/admin/leaves" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                View Queue
              </Link>
            </div>

            {leaveLoading ? (
              <div className="py-10 text-center text-xs text-slate-400">Loading leave requests...</div>
            ) : leaveError ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-xs text-red-650 font-semibold">{leaveError}</p>
                <button onClick={loadLeaves} className="text-xs font-bold text-indigo-600 hover:underline">Try Again</button>
              </div>
            ) : recentLeaves.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentLeaves.map((l) => (
                  <div key={l._id} className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">
                        {l.userId?.email ? l.userId.email.split('@')[0].toUpperCase() : l.employeeId}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {l.leaveType} Leave • {l.totalDays} {l.totalDays === 1 ? 'day' : 'days'} ({new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()})
                      </p>
                      <p className="text-[10px] italic text-slate-400 font-medium truncate max-w-sm">
                        "{l.remarks || 'No remarks provided'}"
                      </p>
                    </div>
                    <Link
                      to="/admin/leaves"
                      className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-705 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-xs text-slate-405 italic">
                All leave requests have been processed! No pending items.
              </p>
            )}
          </div>

          {/* Department Distribution (CSS Bar Chart) */}
          <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-850 tracking-wider uppercase border-b border-slate-100 pb-2.5">
                Department Distribution
              </h3>
            </div>

            {empLoading ? (
              <div className="py-10 text-center text-xs text-slate-400">Loading statistics...</div>
            ) : empError ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-xs text-red-650 font-semibold">{empError}</p>
                <button onClick={loadEmployees} className="text-xs font-bold text-indigo-650 hover:underline">Try Again</button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(deptDistribution).map((dept) => {
                  const count = deptDistribution[dept];
                  const percentage = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;

                  return (
                    <div key={dept} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>{dept}</span>
                        <span>
                          {count} {count === 1 ? 'employee' : 'employees'} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Today's Shift Logs */}
        <div className="rounded-2xl border border-slate-205 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-850 tracking-wider uppercase">
              Today's Shift Activity
            </h3>
            <Link to="/admin/attendance" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
              View Log
            </Link>
          </div>

          {attLoading ? (
            <div className="py-10 text-center text-xs text-slate-400">Loading today's shift log...</div>
          ) : attError ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-red-655 font-semibold">{attError}</p>
              <button onClick={loadAttendance} className="text-xs font-bold text-indigo-650 hover:underline">Try Again</button>
            </div>
          ) : recentAttendance.length > 0 ? (
            <div className="space-y-4">
              {recentAttendance.map((att) => {
                const statusUpper = (att.status || '').toUpperCase();
                return (
                  <div key={att._id} className="flex items-start space-x-3 text-xs leading-tight">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 shrink-0">
                      <Clock size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-slate-800 truncate">
                          {att.employeeId}
                        </p>
                        <StatusBadge status={statusUpper} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Check-in: {new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        {att.checkOut ? `• Out: ${new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '• In Office'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <CalendarDays className="mx-auto text-slate-300 mb-2" size={28} />
              <p className="text-xs font-semibold">No attendance shifts recorded today yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
