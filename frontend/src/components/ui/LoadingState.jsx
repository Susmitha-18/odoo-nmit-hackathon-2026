import React from 'react';

const LoadingState = ({ message = "Loading content..." }) => {
  return (
    <div className="flex min-h-[350px] w-full flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-150 border-t-indigo-600 shadow-sm"></div>
      <p className="text-sm font-semibold text-slate-500 tracking-wide">{message}</p>
    </div>
  );
};

export default LoadingState;
