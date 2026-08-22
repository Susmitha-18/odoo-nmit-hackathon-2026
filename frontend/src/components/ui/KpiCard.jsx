/**
 * KpiCard — Summary metric card used on dashboards.
 * Props: title, value, subtitle, icon, trend, colorScheme
 */
export default function KpiCard({ title, value, subtitle, icon: Icon, trend, colorScheme = 'indigo' }) {
  const schemes = {
    indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  iconBg: 'bg-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', iconBg: 'bg-emerald-100' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   iconBg: 'bg-amber-100' },
    rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    iconBg: 'bg-rose-100' },
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    iconBg: 'bg-blue-100' },
  };
  const s = schemes[colorScheme] || schemes.indigo;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      {Icon && (
        <div className={`flex-shrink-0 ${s.iconBg} rounded-lg p-3`}>
          <Icon className={`w-5 h-5 ${s.icon}`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-neutral-900 mt-0.5">
          {value ?? '—'}
        </p>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${
            trend.positive ? 'text-emerald-600' : 'text-red-500'
          }`}>
            <span>{trend.positive ? '↑' : '↓'}</span>
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
