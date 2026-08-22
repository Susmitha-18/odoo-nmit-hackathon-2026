import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ filters = [] }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <div className="flex items-center space-x-1.5 text-slate-500 text-sm font-medium">
        <Filter size={16} />
        <span>Filters:</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {filters.map((f, idx) => (
          <div key={idx} className="flex items-center">
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-slate-350 transition-colors"
            >
              <option value="">{f.placeholder || `All ${f.label}`}</option>
              {f.options.map((opt, optIdx) => (
                <option key={optIdx} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
