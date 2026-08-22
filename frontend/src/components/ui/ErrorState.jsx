import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ title = "Something went wrong", message = "We encountered an error while loading this component.", onRetry }) => {
  return (
    <div className="flex min-h-[350px] w-full flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-red-200 bg-red-50/20 p-8 text-center shadow-sm">
      <div className="rounded-2xl bg-red-50 p-4 text-red-600 border border-red-100 shadow-inner">
        <AlertTriangle size={36} strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base font-bold text-red-800 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-red-550 leading-relaxed font-medium">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 rounded-xl bg-red-600 px-4.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
