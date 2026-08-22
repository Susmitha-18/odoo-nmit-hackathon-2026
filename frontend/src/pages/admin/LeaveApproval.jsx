import React, { useState, useEffect } from 'react';
import { Check, X, MessageSquare, AlertCircle, Calendar, User, Search, Filter } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/States';
import { formatDate, daysBetween } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
  const [adminComment, setAdminComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchLeaves = () => {
    mockService.getAllLeaves().then(res => {
      setLeaves(res.data || []);
    }).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (isLoading) return <LoadingState message="Loading leave requests..." />;

  const handleOpenAction = (leave, type) => {
    setSelectedLeave(leave);
    setActionType(type);
    setAdminComment(type === 'approve' ? 'Approved. Work has been coordinated.' : '');
  };

  const handleConfirmDecision = async (e) => {
    e.preventDefault();
    if (!selectedLeave || !actionType) return;
    setIsProcessing(true);

    try {
      if (actionType === 'approve') {
        await mockService.approveLeave(selectedLeave._id, adminComment);
        toast.success(`Leave approved for ${selectedLeave.employeeName}`);
      } else {
        await mockService.rejectLeave(selectedLeave._id, adminComment || 'Request declined by HR.');
        toast.error(`Leave request rejected`);
      }
      setSelectedLeave(null);
      setActionType(null);
      fetchLeaves();
    } catch {
      toast.error('Failed to process decision');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredLeaves = leaves.filter(l => {
    if (statusFilter === 'ALL') return true;
    return l.status?.toUpperCase() === statusFilter.toUpperCase();
  });

  const pendingCount = leaves.filter(l => l.status?.toUpperCase() === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leave Approvals & Workflow</h2>
          <p className="text-sm text-gray-500">Review time-off requests submitted by employees and record decisions with notes.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-warning-100 text-warning-800">
            {pendingCount} Pending Action
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        {['ALL', 'pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              statusFilter === tab
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="capitalize">{tab === 'ALL' ? 'All Requests' : `${tab} Requests`}</span>
            {statusFilter === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Employee Reason</th>
                <th>Status</th>
                <th>HR Decision Notes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="font-semibold text-gray-900">
                    {leave.employeeName}
                  </td>
                  <td className="capitalize font-medium text-gray-700">
                    {leave.leaveType} Leave
                  </td>
                  <td className="text-xs text-gray-600">
                    {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                  </td>
                  <td className="font-medium text-gray-900">
                    {daysBetween(leave.startDate, leave.endDate)}d
                  </td>
                  <td className="text-xs text-gray-600 max-w-xs truncate" title={leave.remarks}>
                    {leave.remarks || '—'}
                  </td>
                  <td>
                    <StatusBadge status={leave.status} />
                  </td>
                  <td className="text-xs text-gray-500 max-w-xs">
                    {leave.adminComment ? (
                      <span className="italic">"{leave.adminComment}"</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="text-right">
                    {leave.status === 'pending' ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAction(leave, 'approve')}
                          className="btn-success btn btn-sm py-1 px-2.5 inline-flex items-center gap-1"
                          title="Approve Leave"
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={() => handleOpenAction(leave, 'reject')}
                          className="btn-danger btn btn-sm py-1 px-2.5 inline-flex items-center gap-1"
                          title="Reject Leave"
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        size="md"
      >
        {selectedLeave && (
          <form onSubmit={handleConfirmDecision} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl text-sm space-y-1">
              <p><span className="text-gray-500 font-medium">Employee:</span> <strong className="text-gray-900">{selectedLeave.employeeName}</strong></p>
              <p><span className="text-gray-500 font-medium">Type:</span> <strong className="capitalize">{selectedLeave.leaveType} Leave</strong></p>
              <p><span className="text-gray-500 font-medium">Duration:</span> {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)} ({daysBetween(selectedLeave.startDate, selectedLeave.endDate)} days)</p>
              <p className="text-xs text-gray-500 italic mt-1">Employee Remarks: "{selectedLeave.remarks}"</p>
            </div>

            <div>
              <label htmlFor="adminComment" className="form-label">
                Decision Note / Feedback for Employee
              </label>
              <textarea
                id="adminComment"
                rows={3}
                required={actionType === 'reject'}
                placeholder={actionType === 'approve' ? 'Optional comment (e.g. Approved, tasks re-assigned)...' : 'Reason for rejection (e.g. Project deadline this week)...'}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="form-textarea w-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedLeave(null)}
                className="btn-secondary btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={actionType === 'approve' ? 'btn-success btn' : 'btn-danger btn'}
              >
                {isProcessing ? 'Recording...' : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
