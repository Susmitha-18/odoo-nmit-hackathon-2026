import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

/**
 * RejectLeaveModal — captures admin rejection comment (required).
 * Props: isOpen, leaveRequest, onReject(comment), onCancel, loading
 */
export default function RejectLeaveModal({ isOpen, leaveRequest, onReject, onCancel, loading = false }) {
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setComment('');
      setTouched(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isInvalid = touched && !comment.trim();

  const handleSubmit = () => {
    setTouched(true);
    if (!comment.trim()) return;
    onReject(comment.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 rounded-lg p-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-base font-semibold text-neutral-900">Reject Leave Request</h2>
          </div>
          {!loading && (
            <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Leave summary */}
        {leaveRequest && (
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-neutral-400 text-xs">Employee</span>
                <p className="font-medium text-neutral-800">{leaveRequest.employeeName}</p>
              </div>
              <div>
                <span className="text-neutral-400 text-xs">Leave Type</span>
                <p className="font-medium text-neutral-800 capitalize">{leaveRequest.leaveType} Leave</p>
              </div>
              <div>
                <span className="text-neutral-400 text-xs">Start Date</span>
                <p className="font-medium text-neutral-800">{leaveRequest.startDate}</p>
              </div>
              <div>
                <span className="text-neutral-400 text-xs">End Date</span>
                <p className="font-medium text-neutral-800">{leaveRequest.endDate}</p>
              </div>
            </div>
            {leaveRequest.remarks && (
              <div className="mt-3">
                <span className="text-neutral-400 text-xs">Employee Remarks</span>
                <p className="text-sm text-neutral-700 mt-0.5 italic">"{leaveRequest.remarks}"</p>
              </div>
            )}
          </div>
        )}

        {/* Comment input */}
        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Explain why this leave is being rejected. This will be visible to the employee."
            rows={4}
            className={`w-full text-sm border rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 transition-colors ${
              isInvalid
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                : 'border-neutral-200 focus:ring-indigo-500/20 focus:border-indigo-400'
            }`}
          />
          {isInvalid && (
            <p className="text-xs text-red-500 mt-1">A rejection reason is required.</p>
          )}
          <p className="text-xs text-neutral-400 mt-1.5">{comment.length} characters</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60 transition-colors"
          >
            {loading ? 'Rejecting...' : 'Reject Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
