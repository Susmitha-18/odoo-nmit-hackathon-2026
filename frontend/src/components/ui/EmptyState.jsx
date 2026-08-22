import { InboxIcon } from 'lucide-react';

export default function EmptyState({
  message = 'No records found.',
  description,
  icon: Icon = InboxIcon,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-neutral-100 rounded-full p-4 mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <p className="text-sm font-semibold text-neutral-600">{message}</p>
      {description && (
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
