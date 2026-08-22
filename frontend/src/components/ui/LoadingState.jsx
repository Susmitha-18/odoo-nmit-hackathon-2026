import { Loader2 } from 'lucide-react';

export default function LoadingState({ fullScreen = false, message = 'Loading...' }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 bg-white flex items-center justify-center z-50'
    : 'flex items-center justify-center py-16';

  return (
    <div className={wrapper}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">{message}</p>
      </div>
    </div>
  );
}
