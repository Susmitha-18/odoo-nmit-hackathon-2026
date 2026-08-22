import { getInitials } from '../../utils/formatUtils';

/**
 * Avatar — shows profile picture or initials fallback
 * Props: src, firstName, lastName, size (sm|md|lg|xl), className
 */
const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colors = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
];

function getColorForName(name = '') {
  const code = name.charCodeAt(0) || 0;
  return colors[code % colors.length];
}

export default function Avatar({ src, firstName = '', lastName = '', size = 'md', className = '' }) {
  const sizeClass = sizes[size] || sizes.md;
  const initials = getInitials(firstName, lastName);
  const colorClass = getColorForName(firstName);

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
      aria-label={`${firstName} ${lastName}`}
    >
      {initials || '?'}
    </div>
  );
}
