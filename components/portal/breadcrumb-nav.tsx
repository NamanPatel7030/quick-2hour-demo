import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Crumb {
  label: string;
  href?: string;
}

export function BreadcrumbNav({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav className={cn('flex items-center gap-1.5 text-sm', className)} aria-label="Breadcrumb">
      <Link
        href="/attorney/overview"
        className="flex items-center gap-1 text-text-soft-400 hover:text-text-strong-950 transition-colors"
      >
        <Home className="size-3.5" />
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-text-soft-400" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-text-sub-600 hover:text-text-strong-950 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn('font-medium', isLast ? 'text-text-strong-950' : 'text-text-sub-600')}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}