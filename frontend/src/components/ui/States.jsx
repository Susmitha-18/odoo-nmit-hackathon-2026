import React from 'react';

/**
 * LoadingState — full-section loading spinner.
 * Props:
 *   message string — optional label (default "Loading…")
 *   mini    bool   — small inline spinner variant
 */
export function LoadingState({ message = 'Loading…', mini = false }) {
  if (mini) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
        <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span>{message}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * EmptyState — shown when a list or section has no data.
 * Props:
 *   icon    node   — optional icon
 *   title   string
 *   message string
 *   action  node   — optional CTA button
 */
export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      {icon && <div className="text-gray-300 mb-1">{icon}</div>}
      <p className="text-base font-medium text-gray-600">{title}</p>
      {message && <p className="text-sm text-center max-w-xs">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/**
 * ErrorState — shown when an API call fails.
 * Props:
 *   message string — error description
 *   onRetry func   — optional retry handler
 */
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center text-danger-600 text-xl font-bold">!</div>
      <p className="text-base font-medium text-gray-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary btn btn-sm mt-1">
          Try again
        </button>
      )}
    </div>
  );
}
