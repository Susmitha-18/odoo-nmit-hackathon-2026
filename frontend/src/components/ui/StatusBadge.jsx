import React from 'react';
import { Circle } from 'lucide-react';

/**
 * StatusBadge — renders a coloured pill badge for any status.
 *
 * Supported statuses:
 *   Attendance: present | absent | half-day | leave
 *   Leave:      pending | approved | rejected
 */

const BADGE_CONFIG = {
  // Attendance statuses
  present:   { label: 'Present',   className: 'badge bg-success-100 text-success-700 font-semibold'  },
  absent:    { label: 'Absent',    className: 'badge bg-danger-100 text-danger-700 font-semibold'   },
  'half-day':{ label: 'Half Day',  className: 'badge bg-warning-100 text-warning-700 font-semibold' },
  'half_day':{ label: 'Half Day',  className: 'badge bg-warning-100 text-warning-700 font-semibold' },
  leave:     { label: 'On Leave',  className: 'badge bg-primary-100 text-primary-700 font-semibold'    },
  // Leave statuses
  pending:   { label: 'Pending',   className: 'badge bg-warning-100 text-warning-700 font-semibold'  },
  approved:  { label: 'Approved',  className: 'badge bg-success-100 text-success-700 font-semibold' },
  rejected:  { label: 'Rejected',  className: 'badge bg-danger-100 text-danger-700 font-semibold' },
};

export default function StatusBadge({ status }) {
  const config = BADGE_CONFIG[status?.toLowerCase()] ?? {
    label: status ?? 'Unknown',
    className: 'badge bg-gray-100 text-gray-600',
  };

  return (
    <span className={config.className}>
      <Circle size={6} className="fill-current" />
      {config.label}
    </span>
  );
}
