import React, { useState, useEffect } from 'react';
import { Plus, CalendarOff, Loader2, MessageSquare } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormInput';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { formatDate, daysBetween } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

const LEAVE_TYPES = [
  { value: 'paid',   label: 'Paid Leave' },
  { value: 'sick',   label: 'Sick Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

const INITIAL_FORM = { leaveType: 'paid', startDate: '', endDate: '', remarks: '' };

export default function Leave() {
  const [leaves, setLeaves]           = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [formData, setFormData]       = useState(INITIAL_FORM);
  const [formErrors, setFormErrors]   = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    mockService.getMyLeaves().then((res) => {
      const sorted = [...(res.data ?? [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLeaves(sorted);
    }).finally(() => setIsLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.startDate)  e.startDate = 'Start date is required';
    if (!formData.endDate)    e.endDate   = 'End date is required';
    else if (formData.startDate && formData.endDate < formData.startDate)
                              e.endDate   = 'End date must be after start date';
    if (!formData.remarks.trim()) e.remarks = 'Please add a remark';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const res = await mockService.applyLeave(formData);
    setLeaves((p) => [res.data, ...p]);
    toast.success('Leave request submitted!');
    setShowModal(false);
    setFormData(INITIAL_FORM);
    setIsSubmitting(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((p) => ({ ...p, [field]: '' }));
  };

  const openModal = () => { setFormData(INITIAL_FORM); setFormErrors({}); setShowModal(true); };

  const pending  = leaves.filter((l) => l.status === 'pending').length;
  const approved = leaves.filter((l) => l.status === 'approved').length;
  const rejected = leaves.filter((l) => l.status === 'rejected').length;

  if (isLoading) return <LoadingState message="Loading leave requests…" />;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title text-xl">Leave Requests</h2>
          <p className="section-subtitle">View and manage your time-off requests</p>
        </div>
        <button id="apply-leave-btn" onClick={openModal} className="btn-primary btn">
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending',  count: pending,  cls: 'bg-warning-50 text-warning-700 border-warning-100' },
          { label: 'Approved', count: approved, cls: 'bg-success-50 text-success-700 border-success-100' },
          { label: 'Rejected', count: rejected, cls: 'bg-danger-50  text-danger-700  border-danger-100'  },
        ].map(({ label, count, cls }) => (
          <div key={label} className={`rounded-xl border p-4 flex flex-col items-center ${cls}`}>
            <span className="text-2xl font-bold">{count}</span>
            <span className="text-xs font-medium mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {leaves.length === 0 ? (
          <EmptyState
            icon={<CalendarOff size={36} />}
            title="No leave requests yet"
            message="Apply for leave using the button above."
            action={<button onClick={openModal} className="btn-primary btn btn-sm"><Plus size={14} /> Apply</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th><th>Start Date</th><th>End Date</th>
                  <th>Days</th><th>Remarks</th><th>Status</th><th>Admin Note</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="font-medium capitalize">{leave.leaveType} Leave</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{daysBetween(leave.startDate, leave.endDate)}</td>
                    <td className="max-w-xs">
                      <span className="block truncate text-gray-600" title={leave.remarks}>
                        {leave.remarks || '—'}
                      </span>
                    </td>
                    <td><StatusBadge status={leave.status} /></td>
                    <td>
                      {leave.adminComment ? (
                        <div className="flex items-start gap-1.5 text-xs text-gray-500 max-w-xs">
                          <MessageSquare size={12} className="shrink-0 mt-0.5 text-gray-400" />
                          <span>{leave.adminComment}</span>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for Leave" size="md">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormSelect id="leave-type" label="Leave Type" value={formData.leaveType} onChange={handleChange('leaveType')}>
            {LEAVE_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FormSelect>

          <div className="grid grid-cols-2 gap-4">
            <FormInput id="leave-start" label="Start Date" type="date"
              value={formData.startDate} onChange={handleChange('startDate')}
              error={formErrors.startDate}
              min={new Date().toISOString().slice(0, 10)} />
            <FormInput id="leave-end" label="End Date" type="date"
              value={formData.endDate} onChange={handleChange('endDate')}
              error={formErrors.endDate}
              min={formData.startDate || new Date().toISOString().slice(0, 10)} />
          </div>

          {formData.startDate && formData.endDate && formData.endDate >= formData.startDate && (
            <div className="text-xs text-primary-600 bg-primary-50 rounded-lg px-3 py-2">
              Duration: <strong>{daysBetween(formData.startDate, formData.endDate)} day(s)</strong>
            </div>
          )}

          <FormTextarea id="leave-remarks" label="Remarks"
            placeholder="Briefly explain the reason for your leave…"
            value={formData.remarks} onChange={handleChange('remarks')}
            error={formErrors.remarks} rows={3} />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary btn flex-1">
              Cancel
            </button>
            <button id="leave-submit-btn" type="submit" disabled={isSubmitting} className="btn-primary btn flex-1">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
