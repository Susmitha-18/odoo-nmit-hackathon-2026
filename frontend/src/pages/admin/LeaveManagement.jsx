import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, CalendarCheck } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import ErrorState from '../../components/ui/ErrorState';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import RejectLeaveModal from '../../components/modals/RejectLeaveModal';
import { leaveApi } from '../../api/leave.api';
import { formatDate, timeAgo } from '../../utils/dateUtils';
import { formatLeaveType, getErrorMessage, truncate } from '../../utils/formatUtils';

const TABS = [
  { key: 'Pending',  label: 'Pending',  icon: Clock },
  { key: 'Approved', label: 'Approved', icon: CheckCircle },
  { key: 'Rejected', label: 'Rejected', icon: XCircle },
];

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [approveModal, setApproveModal] = useState({ open: false, leave: null });
  const [rejectModal, setRejectModal] = useState({ open: false, leave: null });
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getAll({ status: activeTab });
      setLeaves(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  // ── Approve ──────────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await leaveApi.approve(approveModal.leave._id, '');
      toast.success(`Leave approved for ${approveModal.leave.employeeName}.`);
      setApproveModal({ open: false, leave: null });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject ───────────────────────────────────────────────────────────────────
  const handleReject = async (comment) => {
    setActionLoading(true);
    try {
      await leaveApi.reject(rejectModal.leave._id, comment);
      toast.success(`Leave rejected for ${rejectModal.leave.employeeName}.`);
      setRejectModal({ open: false, leave: null });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Duration helper
  const calcDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const days = Math.floor(diff / 86400000) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  // Get display name from leave record
  const getEmployeeName = (row) => {
    if (row.applicant?.email) return row.applicant.email.split('@')[0];
    return row.employeeId || 'Employee';
  };

  // Table columns per tab
  const baseColumns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar firstName={row.employeeId} lastName="" size="sm" />
          <div>
            <p className="text-sm font-medium text-neutral-800">{getEmployeeName(row)}</p>
            <p className="text-xs text-neutral-400">{row.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'leaveType',
      label: 'Type',
      render: (row) => <StatusBadge status={row.leaveType} />,
    },
    {
      key: 'dates',
      label: 'Duration',
      render: (row) => (
        <div>
          <p className="text-sm text-neutral-700">{formatDate(row.startDate)} → {formatDate(row.endDate)}</p>
          <p className="text-xs text-neutral-400">{calcDays(row.startDate, row.endDate)}</p>
        </div>
      ),
    },
    {
      key: 'remarks',
      label: 'Reason',
      render: (row) => (
        <span className="text-xs text-neutral-500 italic">
          {row.reason ? `"${truncate(row.reason, 50)}"` : '—'}
        </span>
      ),
    },
    {
      key: 'submitted',
      label: 'Submitted',
      render: (row) => (
        <span className="text-xs text-neutral-400">{timeAgo(row.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const pendingActions = {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setApproveModal({ open: true, leave: {
            ...row,
            employeeName: getEmployeeName(row),
          }})}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" /> Approve
        </button>
        <button
          onClick={() => setRejectModal({ open: true, leave: {
            ...row,
            employeeName: getEmployeeName(row),
          }})}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    ),
  };

  const reviewedColumn = {
    key: 'adminComment',
    label: 'Admin Comment',
    render: (row) => (
      <span className="text-xs text-neutral-500 italic">
        {row.adminComment ? `"${truncate(row.adminComment, 60)}"` : '—'}
      </span>
    ),
  };

  const columns =
    activeTab === 'Pending'
      ? [...baseColumns, pendingActions]
      : [...baseColumns, reviewedColumn];

  const tabCounts = { pending: 0, approved: 0, rejected: 0 };
  if (activeTab === 'pending') tabCounts.pending = leaves.length;
  else if (activeTab === 'approved') tabCounts.approved = leaves.length;
  else tabCounts.rejected = leaves.length;

  return (
    <AdminLayout>
      <PageHeader
        title="Leave Management"
        subtitle="Review, approve, or reject employee leave requests."
        breadcrumb={[{ label: 'Admin' }, { label: 'Leave Requests' }]}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm mb-4">
        <div className="flex border-b border-neutral-100">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {!loading && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === key ? 'bg-indigo-100 text-indigo-700' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {leaves.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        {error ? (
          <div className="p-5"><ErrorState message={error} onRetry={load} /></div>
        ) : (
          <DataTable
            columns={columns}
            data={leaves}
            loading={loading}
            emptyMessage={
              activeTab === 'Pending'
                ? 'No pending leave requests. All caught up!'
                : activeTab === 'Approved'
                ? 'No approved leave requests.'
                : 'No rejected leave requests.'
            }
            emptyIcon={CalendarCheck}
          />
        )}
      </div>

      {/* Approve confirmation modal */}
      <ConfirmationModal
        isOpen={approveModal.open}
        title="Approve Leave Request"
        message={
          approveModal.leave
            ? `Approve ${formatLeaveType(approveModal.leave.leaveType)} for ${approveModal.leave.employeeName} from ${formatDate(approveModal.leave.startDate)} to ${formatDate(approveModal.leave.endDate)}?`
            : ''
        }
        confirmLabel="Approve"
        onConfirm={handleApprove}
        onCancel={() => !actionLoading && setApproveModal({ open: false, leave: null })}
        loading={actionLoading}
        variant="default"
      />

      {/* Reject modal */}
      <RejectLeaveModal
        isOpen={rejectModal.open}
        leaveRequest={rejectModal.leave}
        onReject={handleReject}
        onCancel={() => !actionLoading && setRejectModal({ open: false, leave: null })}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}
