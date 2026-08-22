import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * KpiCard — a clean metric card used on the dashboard.
 *
 * Props:
 *   title     string  — metric label
 *   value     string  — primary display value
 *   subtitle  string  — secondary label (optional)
 *   icon      node    — lucide icon element
 *   trend     "up" | "down" | "neutral" (optional)
 *   color     "blue" | "green" | "yellow" | "red" (optional, default "blue")
 */
export default function KpiCard({ title, value, subtitle, icon, trend, color = 'blue' }) {
  const colorMap = {
    blue:   { bg: 'bg-primary-50',  icon: 'text-primary-600',  text: 'text-primary-700' },
    green:  { bg: 'bg-success-50',  icon: 'text-success-600',  text: 'text-success-700' },
    yellow: { bg: 'bg-warning-50',  icon: 'text-warning-600',  text: 'text-warning-700' },
    red:    { bg: 'bg-danger-50',   icon: 'text-danger-600',   text: 'text-danger-700'  },
  };
  const c = colorMap[color] ?? colorMap.blue;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-gray-400';

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon && (
          <span className={`p-2 rounded-lg ${c.bg} ${c.icon}`}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={13} />
          <span>{trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'}</span>
        </div>
      )}
    </div>
  );
}
