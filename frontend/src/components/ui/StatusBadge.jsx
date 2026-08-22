import React from 'react';

const formatStatus = (status) => {
  if (!status) return '';
  const str = status.replace(/_/g, ' ').toLowerCase();
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.trim().toLowerCase();
  const displayStatus = formatStatus(status);

  let styles = {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  if (normalized === 'present' || normalized === 'approved' || normalized === 'completed') {
    styles = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
    };
  } else if (normalized === 'absent' || normalized === 'rejected' || normalized === 'cancelled') {
    styles = {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
    };
  } else if (normalized === 'half-day' || normalized === 'half_day' || normalized === 'pending') {
    styles = {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
    };
  } else if (normalized === 'leave') {
    styles = {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
    };
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {displayStatus}
    </span>
  );
};

export default StatusBadge;
