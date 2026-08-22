import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Loader2, CalendarCheck } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatDate, formatTime, formatHours, todayString } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [todayAtt, setTodayAtt]       = useState(null);
  const [records, setRecords]         = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [checkingIn, setCheckingIn]   = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [filters, setFilters]         = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    Promise.all([
      mockService.getTodayAttendance(),
      mockService.getMyAttendance(),
    ]).then(([today, hist]) => {
      setTodayAtt(today.data);
      setRecords(hist.data ?? []);
    }).finally(() => setIsLoading(false));
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    const res = await mockService.checkIn();
    setTodayAtt(res.data);
    toast.success('Checked in!');
    setCheckingIn(false);
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    const res = await mockService.checkOut();
    setTodayAtt(res.data);
    toast.success('Checked out. Great work today!');
    setCheckingOut(false);
  };

  const isCheckedIn  = !!todayAtt?.checkIn;
  const isCheckedOut = !!todayAtt?.checkOut;

  const filtered = records.filter((r) => {
    if (filters.startDate && r.date < filters.startDate) return false;
    if (filters.endDate   && r.date > filters.endDate)   return false;
    return true;
  });

  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading) return <LoadingState message="Loading attendance…" />;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Today's card */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">Today's Attendance</h2>
            <p className="section-subtitle">{formatDate(todayString())}</p>
          </div>
          {todayAtt && <StatusBadge status={todayAtt.status ?? 'present'} />}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Check In</p>
            <p className="text-lg font-semibold text-gray-900">{isCheckedIn ? formatTime(todayAtt.checkIn) : '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Check Out</p>
            <p className="text-lg font-semibold text-gray-900">{isCheckedOut ? formatTime(todayAtt.checkOut) : '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Hours Worked</p>
            <p className="text-lg font-semibold text-gray-900">{formatHours(todayAtt?.workingHours)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            id="att-checkin-btn"
            onClick={handleCheckIn}
            disabled={isCheckedIn || checkingIn}
            className="btn-success btn flex-1 sm:w-40 sm:flex-none"
          >
            {checkingIn ? <><Loader2 size={16} className="animate-spin" /> Checking in…</> : <><LogIn size={16} /> Check In</>}
          </button>
          <button
            id="att-checkout-btn"
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isCheckedOut || checkingOut}
            className="btn-secondary btn flex-1 sm:w-40 sm:flex-none"
          >
            {checkingOut ? <><Loader2 size={16} className="animate-spin" /> Checking out…</> : <><LogOut size={16} /> Check Out</>}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: 'present',   label: 'Present',   color: 'bg-success-50 text-success-700 border-success-100' },
          { key: 'absent',    label: 'Absent',    color: 'bg-danger-50  text-danger-700  border-danger-100'  },
          { key: 'half-day',  label: 'Half Day',  color: 'bg-warning-50 text-warning-700 border-warning-100' },
          { key: 'leave',     label: 'On Leave',  color: 'bg-primary-50 text-primary-700 border-primary-100' },
        ].map(({ key, label, color }) => (
          <div key={key} className={`card border ${color} flex items-center justify-between p-4`}>
            <span className="text-sm font-medium">{label}</span>
            <span className="text-2xl font-bold">{statusCounts[key] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <h3 className="section-title flex-1">Attendance History</h3>
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="form-label">From</label>
              <input type="date" id="att-filter-start" value={filters.startDate}
                onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                className="form-input text-xs" />
            </div>
            <div>
              <label className="form-label">To</label>
              <input type="date" id="att-filter-end" value={filters.endDate}
                onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                className="form-input text-xs" />
            </div>
            {(filters.startDate || filters.endDate) && (
              <button className="btn-ghost btn btn-sm" onClick={() => setFilters({ startDate: '', endDate: '' })}>
                Clear
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<CalendarCheck size={36} />} title="No records found" message="Your attendance history will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => (
                  <tr key={rec._id}>
                    <td className="font-medium">{formatDate(rec.date)}</td>
                    <td>{rec.checkIn ? formatTime(rec.checkIn) : '—'}</td>
                    <td>{rec.checkOut ? formatTime(rec.checkOut) : '—'}</td>
                    <td>{formatHours(rec.workingHours)}</td>
                    <td><StatusBadge status={rec.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
