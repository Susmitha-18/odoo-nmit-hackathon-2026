/**
 * FilterBar — renders a row of labeled select dropdowns.
 * Props:
 *   filters: [{ key, label, options: [{value, label}], value }]
 *   onChange: (key, value) => void
 *   onReset: () => void
 */
export default function FilterBar({ filters, onChange, onReset, className = '' }) {
  const hasActive = filters.some((f) => f.value);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-0.5">
          {filter.label && (
            <label className="text-xs font-medium text-neutral-500">{filter.label}</label>
          )}
          <select
            value={filter.value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors min-w-[130px]"
          >
            <option value="">All {filter.label || ''}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {hasActive && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="self-end text-xs text-indigo-600 hover:text-indigo-800 font-medium pb-2 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
