import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

/**
 * DataTable — responsive table with loading/empty states.
 * Props:
 *   columns: [{ key, label, render?, className? }]
 *   data: array of row objects
 *   loading, error, emptyMessage, emptyIcon
 *   keyExtractor: (row) => string (default: row._id)
 */
export default function DataTable({
  columns,
  data = [],
  loading = false,
  error = null,
  emptyMessage = 'No records found.',
  emptyIcon,
  keyExtractor,
  className = '',
}) {
  if (loading) {
    return <LoadingState message="Loading data..." />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />;
  }

  const getKey = keyExtractor || ((row) => row._id || Math.random());

  return (
    <div className={`overflow-x-auto rounded-lg border border-neutral-200 ${className}`}>
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap ${col.headerClassName || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-100">
          {data.map((row, rowIdx) => (
            <tr
              key={getKey(row)}
              className="hover:bg-neutral-50 transition-colors duration-100"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm text-neutral-700 whitespace-nowrap ${col.className || ''}`}
                >
                  {col.render ? col.render(row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
