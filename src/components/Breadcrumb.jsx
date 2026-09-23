export default function Breadcrumb({ crumbs, onNavigate }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm text-gray-600 mb-4">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.id ?? 'home'} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-400">/</span>}
            {isLast ? (
              <span className="font-medium text-gray-900">{crumb.name}</span>
            ) : (
              <button
                onClick={() => onNavigate(crumb.id)}
                className="hover:underline hover:text-gray-900"
              >
                {crumb.name}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
