import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info", // "info", "danger", "success"
}) => {
  if (!isOpen) return null;

  const typeMap = {
    danger: {
      btn: 'bg-red-650 hover:bg-red-700 text-white',
      accent: 'text-red-600 bg-red-50',
    },
    success: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accent: 'text-emerald-600 bg-emerald-50',
    },
    info: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      accent: 'text-indigo-600 bg-indigo-50',
    },
  };

  const style = typeMap[type] || typeMap.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl border border-slate-100 transition-all duration-300 z-10">
        <div className="flex items-start space-x-4">
          <div className={`rounded-xl p-3 ${style.accent}`}>
            <AlertCircle size={24} />
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3.5">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-colors ${style.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
