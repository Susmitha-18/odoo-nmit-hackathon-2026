/**
 * PageHeader — consistent page title area with optional breadcrumb and actions
 */
export default function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <nav className="text-xs text-neutral-400 mb-2 flex items-center gap-1.5">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-indigo-600 transition-colors">{crumb.label}</a>
              ) : (
                <span className="text-neutral-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
