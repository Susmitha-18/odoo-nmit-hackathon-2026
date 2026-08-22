import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = "No data found", message = "There is nothing to display here at the moment.", icon: Icon = Inbox, actionText, onAction }) => {
  return (
    <div className="flex min-h-[350px] w-full flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="rounded-2xl bg-slate-50 p-4 text-slate-400 border border-slate-100 shadow-inner">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {message}
        </p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-indigo-600 px-4.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
