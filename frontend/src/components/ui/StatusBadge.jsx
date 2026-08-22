/**
 * StatusBadge — renders a colored pill badge for any status value.
 * Covers: attendance, leave, employment status, leave type, job type
 */
const STATUS_MAP = {
  // Attendance
  present:   { label: 'Present',   classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  absent:    { label: 'Absent',    classes: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
  'half-day':{ label: 'Half Day',  classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  leave:     { label: 'On Leave',  classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },

  // Leave requests
  pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  approved:  { label: 'Approved',  classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  rejected:  { label: 'Rejected',  classes: 'bg-red-50 text-red-700 ring-1 ring-red-200' },

  // Employment
  active:    { label: 'Active',    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  inactive:  { label: 'Inactive',  classes: 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200' },
  terminated:{ label: 'Terminated',classes: 'bg-red-50 text-red-700 ring-1 ring-red-200' },

  // Leave types
  paid:      { label: 'Paid Leave',   classes: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  sick:      { label: 'Sick Leave',   classes: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' },
  unpaid:    { label: 'Unpaid Leave', classes: 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200' },

  // Job type
  'full-time': { label: 'Full-Time', classes: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  'part-time': { label: 'Part-Time', classes: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200' },
  contract:    { label: 'Contract',  classes: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200' },
};

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_MAP[status] || {
    label: status,
    classes: 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
