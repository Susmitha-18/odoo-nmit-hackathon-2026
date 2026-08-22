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
  present:   { label: 'Present',   className: 'badge-present'  },
  absent:    { label: 'Absent',    className: 'badge-absent'   },
  'half-day':{ label: 'Half Day',  className: 'badge-half-day' },
  leave:     { label: 'On Leave',  className: 'badge-leave'    },
  // Leave statuses
  pending:   { label: 'Pending',   className: 'badge-pending'  },
  approved:  { label: 'Approved',  className: 'badge-approved' },
  rejected:  { label: 'Rejected',  className: 'badge-rejected' },
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
