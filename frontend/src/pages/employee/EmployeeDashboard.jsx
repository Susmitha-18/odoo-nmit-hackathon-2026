import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMyAttendanceAPI, checkInAPI, checkOutAPI } from '../../api/attendance.api';
import { getMyPayrollAPI } from '../../api/payroll.api';
import { getMyLeavesAPI } from '../../api/leave.api';
import { Clock, Calendar, AlertCircle, Play, Square, Landmark, CalendarCheck2, RefreshCw } from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Loaders & Errors
  const [attLoading, setAttLoading] = useState(true);
  const [attError, setAttError] = useState('');
  const [payLoading, setPayLoading] = useState(true);
  const [payError, setPayError] = useState('');
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [leaveError, setLeaveError] = useState('');

  // Attendance state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);

  // Stats state
  const [netSalary, setNetSalary] = useState('0');
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttendanceData = async () => {
    setAttLoading(true);
    setAttError('');
    try {
      const attRes = await getMyAttendanceAPI();
      if (attRes.success && attRes.attendance) {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = attRes.attendance.find((log) => log.date === todayStr);
        setIsCheckedIn(!!todayLog);
        setIsCheckedOut(todayLog ? !!todayLog.checkOut : false);
        setTodayRecord(todayLog || null);

        // Update activities feed
        setRecentActivities((prev) => {
          // Filter out old attendance activities
          const filtered = prev.filter((a) => a.type !== 'attendance');
          const newAtt = [];
          if (todayLog) {
            newAtt.push({
              id: todayLog._id,
              type: 'attendance',
              title: 'Clocked In',
              desc: `Time: ${new Date(todayLog.checkIn).toLocaleTimeString()}`,
              date: new Date(todayLog.checkIn),
            });
            if (todayLog.checkOut) {
              newAtt.push({
                id: todayLog._id + '-out',
                type: 'attendance',
                title: 'Clocked Out',
                desc: `Time: ${new Date(todayLog.checkOut).toLocaleTimeString()} (${todayLog.workHours} hrs worked)`,
                date: new Date(todayLog.checkOut),
              });
            }
          }
          const merged = [...filtered, ...newAtt];
          merged.sort((a, b) => b.date - a.date);
          return merged.slice(0, 4);
        });
      } else {
        setAttError('Unable to load attendance details.');
      }
    } catch (err) {
      console.error(err);
      setAttError('Unable to load attendance details.');
    } finally {
      setAttLoading(false);
    }
  };

  const loadPayrollData = async () => {
    setPayLoading(true);
    setPayError('');
    try {
      const payrollRes = await getMyPayrollAPI();
      if (payrollRes.success && payrollRes.payroll) {
        setNetSalary(payrollRes.payroll.netSalary?.toLocaleString() || '0');
      } else {
        setPayError('Unable to load payroll details.');
      }
    } catch (err) {
      console.error(err);
      setPayError('Unable to load payroll details.');
    } finally {
      setPayLoading(false);
    }
  };

  const loadLeavesData = async () => {
    setLeaveLoading(true);
    setLeaveError('');
    try {
      const leaveRes = await getMyLeavesAPI();
      if (leaveRes.success && leaveRes.leaves) {
        const pending = leaveRes.leaves.filter((l) => (l.status || '').toUpperCase() === 'PENDING').length;
        setPendingLeavesCount(pending);

        // Update activities feed
        setRecentActivities((prev) => {
          // Filter out old leave activities
          const filtered = prev.filter((a) => a.type !== 'leave');
          const newLeaves = leaveRes.leaves.slice(0, 3).map((l) => ({
            id: l._id,
            type: 'leave',
            title: `Leave request (${l.leaveType})`,
            desc: `Status: ${l.status}. Remarks: ${l.remarks}`,
            date: new Date(l.createdAt),
          }));
          const merged = [...filtered, ...newLeaves];
          merged.sort((a, b) => b.date - a.date);
          return merged.slice(0, 4);
        });
      } else {
        setLeaveError('Unable to load leave stats.');
      }
    } catch (err) {
      console.error(err);
      setLeaveError('Unable to load leave stats.');
    } finally {
      setLeaveLoading(false);
    }
  };

  const fetchData = () => {
    loadAttendanceData();
    loadPayrollData();
    loadLeavesData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await checkInAPI();
      if (res.success) {
        showToast('Successfully clocked in!', 'success');
        loadAttendanceData();
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
        showToast('Successfully clocked out! Good job today.', 'success');
        loadAttendanceData();
      } else {
        showToast(res.message || 'Check-out failed.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error during check-out.', 'error');
    }
  };

  // Get current hour of the day for greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  if (hour >= 17) greeting = 'Good evening';

  return (
    <div className="space-y-6">
      {/* Greetings Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {greeting}, {user?.fullName || 'User'}!
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Here's your overview for today, {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Real-time Clock */}
          <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-205 shadow-sm text-slate-700">
            <Clock size={16} className="text-indigo-600 animate-pulse" />
            <span className="text-sm font-bold font-mono tracking-wide">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>

          <button 
            onClick={fetchData}
            className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh Dashboard"
          >
            <RefreshCw size={16} className={`${(attLoading || payLoading || leaveLoading) ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {attError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">Attendance Tracker Error</span>
            <button onClick={loadAttendanceData} className="text-[10px] font-bold text-indigo-600 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
            <KpiCard
              title="Today's Shift"
              value={attLoading ? '...' : isCheckedOut ? 'Completed' : isCheckedIn ? 'Checked In' : 'Not Shifted'}
              icon={CalendarCheck2}
              color={isCheckedOut ? 'emerald' : isCheckedIn ? 'amber' : 'rose'}
              subtitle={todayRecord ? <StatusBadge status={todayRecord.status} /> : 'Awaiting clock-in'}
            />
        )}

        {leaveError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">Pending Leaves Error</span>
            <button onClick={loadLeavesData} className="text-[10px] font-bold text-indigo-600 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
          <KpiCard
            title="Pending Leaves"
            value={leaveLoading ? '...' : pendingLeavesCount}
            icon={Calendar}
            color="indigo"
            subtitle="Awaiting HR review"
          />
        )}

        {payError ? (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
            <span className="text-xs font-bold text-red-700">Salary scale Error</span>
            <button onClick={loadPayrollData} className="text-[10px] font-bold text-indigo-600 hover:underline text-left mt-2">Retry Loading</button>
          </div>
        ) : (
          <KpiCard
            title="Net Salary"
            value={payLoading ? '...' : `₹${netSalary}`}
            icon={Landmark}
            color="emerald"
            subtitle="Monthly Take-home scale"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Clock In / Out Action Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
              Shift Attendance Controls
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Record your daily start and end times. Status recalculates automatically based on hours logged.
            </p>
          </div>

          {attLoading ? (
            <div className="py-10 text-center text-xs text-slate-400">Loading controls...</div>
          ) : attError ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-red-650 font-semibold">{attError}</p>
              <button onClick={loadAttendanceData} className="text-xs font-bold text-indigo-650 hover:underline">Try Again</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Check In Panel */}
              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Clock In Time</p>
                  <p className="text-lg font-extrabold text-slate-700 mt-0.5">
                    {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString() : '--:-- --'}
                  </p>
                </div>
                <Button
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                  className="w-full py-3"
                  icon={Play}
                >
                  Clock In
                </Button>
              </div>

              {/* Check Out Panel */}
              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Clock Out Time</p>
                  <p className="text-lg font-extrabold text-slate-700 mt-0.5">
                    {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString() : '--:-- --'}
                  </p>
                </div>
                <Button
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn || isCheckedOut}
                  variant="danger"
                  className="w-full py-3"
                  icon={Square}
                >
                  Clock Out
                </Button>
              </div>
            </div>
          )}

          {/* Guidelines info */}
          <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4 flex items-start space-x-2.5 text-xs text-indigo-800">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Attendance Rule:</span> Working for 7+ hours logs a full day, while working less than 4 hours logs a half-day.
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
              Recent Activity Feed
            </h3>
            <p className="text-[9px] text-slate-400 font-medium">Updates to your logs, leaves, or shifts.</p>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((act, idx) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  {/* Bullet Node */}
                  <div className="relative mt-1">
                    <span className={`h-2.5 w-2.5 rounded-full flex ring-4 ring-white ${act.type === 'leave' ? 'bg-indigo-600' : 'bg-emerald-500'}`}></span>
                    {idx < recentActivities.length - 1 && (
                      <span className="absolute left-[4px] top-3 h-10 w-0.5 bg-slate-100 -z-10"></span>
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-slate-750">{act.title}</p>
                    <p className="text-[10px] text-slate-400">{act.desc}</p>
                    <span className="text-[9px] font-bold text-slate-400">
                      {act.date.toLocaleDateString()} at {act.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs font-semibold">No recent records. Start by clocking in!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
