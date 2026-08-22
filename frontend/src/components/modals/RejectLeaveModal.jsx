import React, { useState } from 'react';
import { XSquare } from 'lucide-react';

const RejectLeaveModal = ({ isOpen, onConfirm, onCancel }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a reason/comment for rejection.');
      return;
    }
    setError('');
    onConfirm(comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal Content */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl border border-slate-100 transition-all duration-300 z-10 space-y-4"
      >
        <div className="flex items-start space-x-4">
          <div className="rounded-xl p-3 bg-rose-50 text-rose-600">
            <XSquare size={24} />
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Reject Leave Request
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Please enter an admin comment explaining the reason for rejecting this leave request.
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-1">
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (e.target.value.trim()) setError('');
            }}
            placeholder="e.g. Critical project deadline week. Please coordinate with another engineer."
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
          {error && <p className="text-[10px] font-semibold text-red-600">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3.5 pt-2">
          <button
            type="button"
            onClick={() => {
              setError('');
              setComment('');
              onCancel();
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-red-600 hover:bg-red-750 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            Reject Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RejectLeaveModal;
