import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-6"
    >
      <Link
        href="/overview"
        className="hover:text-accent transition-colors"
        aria-label="Home"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-base">home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-base text-outline">chevron_right</span>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-accent transition-colors uppercase tracking-wider"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-accent font-bold uppercase tracking-wider">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
