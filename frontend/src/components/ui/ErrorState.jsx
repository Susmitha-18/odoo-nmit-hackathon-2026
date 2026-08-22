import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-sm font-semibold text-neutral-700">Something went wrong</p>
      <p className="text-xs text-neutral-400 mt-1 max-w-sm">
        {message || 'Unable to load data. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
