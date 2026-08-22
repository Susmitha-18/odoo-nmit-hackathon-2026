import React, { useEffect, useState } from 'react';
import { getAllLeavesAPI, handleLeaveDecisionAPI } from '../../api/leave.api';
import { useToast } from '../../context/ToastContext';
import { Check, X, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import RejectLeaveModal from '../../components/modals/RejectLeaveModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import PageHeader from '../../components/ui/PageHeader';

const LeaveManagement = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'

  // Modals state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      setError('');
      const res = await getAllLeavesAPI();
      if (res.success) {
        setLeaves(res.leaves || []);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load employee leave queues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApproveConfirm = async () => {
    setApproveModalOpen(false);
    try {
      const res = await handleLeaveDecisionAPI(selectedLeaveId, 'Approved', 'Approved by HR Admin');
      if (res.success) {
        showToast('Leave request approved successfully!', 'success');
        fetchLeaves();
      } else {
        showToast(res.message || 'Failed to approve request.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error approving request.', 'error');
    }
  };

  const handleRejectConfirm = async (comment) => {
    setRejectModalOpen(false);
    try {
      const res = await handleLeaveDecisionAPI(selectedLeaveId, 'Rejected', comment);
      if (res.success) {
        showToast('Leave request rejected.', 'success');
        fetchLeaves();
      } else {
        showToast(res.message || 'Failed to reject request.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error rejecting request.', 'error');
    }
  };

  // Filter requests by active tab
  const filteredLeaves = leaves.filter((l) => (l.status || '').toUpperCase() === activeTab.toUpperCase());

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-extrabold text-indigo-650">{row.employeeId}</span>,
    },
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
      header: 'Dates / Duration',
      accessor: 'totalDays',
      render: (row) => (
        <span className="text-slate-650 font-medium">
          {new Date(row.startDate).toLocaleDateString()} to {new Date(row.endDate).toLocaleDateString()}{' '}
          <span className="text-[10px] text-slate-400 font-bold">({row.totalDays} {row.totalDays === 1 ? 'day' : 'days'})</span>
        </span>
      ),
    },
    {
      header: 'Applicant Remarks',
      accessor: 'remarks',
      render: (row) => <span className="text-xs text-slate-550 italic max-w-sm truncate block">"{row.remarks || row.reason || 'No remarks'}"</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    ...(activeTab !== 'Pending'
      ? [
          {
            header: 'HR Action Comments',
            accessor: 'adminComment',
            render: (row) => (
              <span className="text-xs text-slate-500 font-medium leading-relaxed block max-w-xs truncate">
                {row.adminComment || '—'}
              </span>
            ),
          },
        ]
      : [
          {
            header: 'Actions',
            accessor: '_id',
            render: (row) => (
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => {
                    setSelectedLeaveId(row._id);
                    setApproveModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold transition-all"
                >
                  <Check size={12} />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedLeaveId(row._id);
                    setRejectModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 text-xs font-bold transition-all"
                >
                  <X size={12} />
                  <span>Reject</span>
                </button>
              </div>
            ),
          },
        ]),
  ];

  const counts = {
    Pending: leaves.filter((l) => l.status === 'Pending').length,
    Approved: leaves.filter((l) => l.status === 'Approved').length,
    Rejected: leaves.filter((l) => l.status === 'Rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <PageHeader 
        title="Leave Approvals Queue" 
        subtitle="Review employee absence requests, approve applications, or provide rejection remarks."
      />

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3.5 relative flex items-center space-x-1.5 transition-colors ${
              activeTab === tab
                ? 'text-indigo-600 font-extrabold border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{tab} Requests</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-550'
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Queue Data Grid */}
      <DataTable
        columns={columns}
        data={filteredLeaves}
        loading={loading}
        emptyMessage={`No ${activeTab.toLowerCase()} leave requests found in queue.`}
      />

      {/* Modals */}
      <ConfirmationModal
        isOpen={approveModalOpen}
        title="Approve Leave Request"
        message="Are you sure you want to approve this leave request? Approving will automatically flag attendance logs as 'Leave' for these shift dates."
        type="success"
        confirmText="Approve Leave"
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalOpen(false)}
      />

      <RejectLeaveModal
        isOpen={rejectModalOpen}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalOpen(false)}
      />
    </div>
  );
};

export default LeaveManagement;
