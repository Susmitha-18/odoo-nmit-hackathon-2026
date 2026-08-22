import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * ConfirmationModal — generic confirm/cancel dialog
 * Props: isOpen, title, message, confirmLabel, cancelLabel,
 *        onConfirm, onCancel, variant (default|danger)
 */
export default function ConfirmationModal({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'default',
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmClasses = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          {!loading && (
            <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-neutral-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-60 transition-colors ${confirmClasses}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
