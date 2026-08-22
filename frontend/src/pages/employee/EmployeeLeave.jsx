import React, { useEffect, useState } from 'react';
import { getMyLeavesAPI, applyLeaveAPI } from '../../api/leave.api';
import { useToast } from '../../context/ToastContext';
import { Calendar, Plus, X, MessageSquare, AlertCircle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/ui/PageHeader';

const EmployeeLeave = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaves, setLeaves] = useState([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchLeaves = async () => {
    try {
      setError('');
      const res = await getMyLeavesAPI();
      if (res.success) {
        setLeaves(res.leaves);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch personal leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!startDate || !endDate || !reason.trim()) {
      setFormError('Please fill out all fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setFormError('End Date cannot be earlier than Start Date.');
      return;
    }

    setFormLoading(true);
    try {
      const res = await applyLeaveAPI({
        leaveType,
        startDate,
        endDate,
        remarks: reason,
      });

      if (res.success) {
        showToast('Leave request submitted successfully!', 'success');
        setModalOpen(false);
        // Clear form
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaves();
      } else {
        setFormError(res.message || 'Failed to submit leave.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error during submission.');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leaveType',
      render: (row) => {
        let display = row.leaveType;
        if (display === 'Paid') display = 'Paid Time Off (PTO)';
        if (display === 'Sick') display = 'Sick Leave';
        if (display === 'Unpaid') display = 'Unpaid Leave';
        return <span className="font-semibold text-slate-700">{display}</span>;
      },
    },
    {
      header: 'Duration',
      accessor: 'totalDays',
      render: (row) => (
        <span>
          {new Date(row.startDate).toLocaleDateString()} to {new Date(row.endDate).toLocaleDateString()}{' '}
          <span className="text-slate-400 font-bold text-[10px]">({row.totalDays} {row.totalDays === 1 ? 'day' : 'days'})</span>
        </span>
      ),
    },
    {
      header: 'My Reason',
      accessor: 'remarks',
      render: (row) => <span className="text-xs text-slate-500 font-medium max-w-[200px] truncate block">{row.remarks || row.reason}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Remarks / Comments',
      accessor: 'adminComment',
      render: (row) => {
        if (row.status === 'Rejected') {
          return (
            <div className="flex items-center space-x-1.5 text-xs text-red-700 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1.5 max-w-xs leading-relaxed font-semibold">
              <MessageSquare size={13} className="shrink-0 mt-0.5" />
              <span>Reject reason: {row.adminComment || 'No comment provided.'}</span>
            </div>
          );
        }
        if (row.status === 'Approved') {
          return (
            <span className="text-xs text-slate-450 italic">
              Approved: {row.adminComment || 'Enjoy your leave!'}
            </span>
          );
        }
        return <span className="text-xs text-slate-400 font-medium">Pending HR decision</span>;
      },
    },
  ];

  if (loading) return <LoadingState message="Fetching leave balances and request logs..." />;
  if (error) return <ErrorState message={error} onRetry={fetchLeaves} />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <PageHeader 
        title="Leaves & Absence" 
        subtitle="Apply for leave, verify balances, and inspect approvals."
        action={
          <Button onClick={() => setModalOpen(true)} icon={Plus}>
            Apply Leave
          </Button>
        }
      />

      {/* Grid List */}
      <DataTable
        columns={columns}
        data={leaves}
        emptyMessage="You have not submitted any leave applications yet."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Apply For Leave"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyLeave} disabled={formLoading}>
              {formLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-rose-50 border border-rose-100 p-3 text-sm font-semibold text-rose-700 flex items-center space-x-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="Sick">Sick Leave</option>
                <option value="Paid">Paid Time Off (PTO)</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Reason for Absence
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you need this leave..."
                rows={4}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeLeave;
