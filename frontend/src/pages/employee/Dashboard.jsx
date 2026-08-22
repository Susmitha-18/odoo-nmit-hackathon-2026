import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, CalendarOff, Wallet,
  Clock, LogIn, LogOut, Loader2, Activity,
} from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/States';
import { useAuth } from '../../context/AuthContext';
import { mockService } from '../../mock/mockService';
import { getGreeting, formatTime, formatDate, formatCurrency } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();

  const [employee, setEmployee]       = useState(null);
  const [todayAtt, setTodayAtt]       = useState(null);
  const [leaves, setLeaves]           = useState([]);
  const [payroll, setPayroll]         = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [checkingIn, setCheckingIn]   = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    Promise.all([
      mockService.getMyProfile(),
      mockService.getTodayAttendance(),
      mockService.getMyLeaves(),
      mockService.getMyPayroll(),
    ]).then(([emp, att, lv, pay]) => {
      setEmployee(emp.data);
      setTodayAtt(att.data);
      setLeaves(lv.data ?? []);
      setPayroll(pay.data);
    }).finally(() => setIsLoading(false));
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await mockService.checkIn();
      setTodayAtt(res.data);
      toast.success('Checked in successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Check-in failed.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      const res = await mockService.checkOut();
      setTodayAtt(res.data);
      toast.success('Checked out. Have a great evening!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Check-out failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  const pendingLeaves  = leaves.filter((l) => l.status?.toUpperCase() === 'PENDING').length;
  const approvedLeaves = leaves.filter((l) => l.status?.toUpperCase() === 'APPROVED').length;
  const recentLeaves   = [...leaves]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const fullName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : 'Employee';

  const isCheckedIn  = !!todayAtt?.checkIn;
  const isCheckedOut = !!todayAtt?.checkOut;

  if (isLoading) return <LoadingState message="Loading your dashboard…" />;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {getGreeting()}, {fullName} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Today's Status"
          value={<StatusBadge status={todayAtt?.status ?? 'present'} />}
          subtitle={isCheckedIn ? `Checked in at ${formatTime(todayAtt.checkIn)}` : 'Not checked in yet'}
          icon={<CalendarCheck size={18} />}
          color={isCheckedIn ? 'green' : 'yellow'}
        />
        <KpiCard
          title="Leave Requests"
          value={`${approvedLeaves} approved`}
          subtitle={pendingLeaves > 0 ? `${pendingLeaves} pending` : 'No pending requests'}
          icon={<CalendarOff size={18} />}
          color={pendingLeaves > 0 ? 'yellow' : 'blue'}
        />
        <KpiCard
          title="Net Salary"
          value={payroll ? formatCurrency(payroll.netSalary) : '—'}
          subtitle={payroll ? `Effective ${formatDate(payroll.effectiveFrom)}` : 'Not available'}
          icon={<Wallet size={18} />}
          color="blue"
        />
      </div>

      {/* Attendance + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title">Today's Attendance</h3>
              <p className="section-subtitle">
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            </div>
            {todayAtt && <StatusBadge status={todayAtt.status ?? 'present'} />}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <LogIn size={13} /> Check In
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {isCheckedIn ? formatTime(todayAtt.checkIn) : '—'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <LogOut size={13} /> Check Out
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {isCheckedOut ? formatTime(todayAtt.checkOut) : '—'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              id="dashboard-checkin-btn"
              onClick={handleCheckIn}
              disabled={isCheckedIn || checkingIn}
              className="btn-success btn flex-1"
            >
              {checkingIn
                ? <><Loader2 size={16} className="animate-spin" /> Checking in…</>
                : <><LogIn size={16} /> Check In</>}
            </button>
            <button
              id="dashboard-checkout-btn"
              onClick={handleCheckOut}
              disabled={!isCheckedIn || isCheckedOut || checkingOut}
              className="btn-secondary btn flex-1"
            >
              {checkingOut
                ? <><Loader2 size={16} className="animate-spin" /> Checking out…</>
                : <><LogOut size={16} /> Check Out</>}
            </button>
          </div>

          {isCheckedIn && !isCheckedOut && (
            <p className="text-xs text-success-600 mt-3 flex items-center gap-1.5">
              <Clock size={12} /> You're currently checked in. Don't forget to check out!
            </p>
          )}
        </div>

        {/* Recent Leaves */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-gray-400" />
            <h3 className="section-title">Recent Leave Requests</h3>
          </div>
          {recentLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm gap-2">
              <CalendarOff size={28} className="text-gray-300" />
              <p>No leave requests yet</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentLeaves.map((leave) => (
                <li key={leave._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {leave.leaveType} Leave
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                    </p>
                  </div>
                  <StatusBadge status={leave.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


    </div>
  );
}
