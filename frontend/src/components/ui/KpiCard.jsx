import React from 'react';

const KpiCard = ({ title, value, icon: Icon, color = 'indigo', subtitle }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
  };

  const selectedColors = colorMap[color] || colorMap.indigo;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`rounded-xl p-3.5 ${selectedColors.bg} ${selectedColors.text}`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    </div>
  );
};

export default KpiCard;
