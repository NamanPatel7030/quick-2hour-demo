import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Sparkline } from './sparkline';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/lib/format';
import type { Kpi } from '@/types';

interface KpiCardProps {
  kpi: Kpi;
  href?: string;
}

export function KpiCard({ kpi, href }: KpiCardProps) {
  const isUp = kpi.delta >= 0;
  const tone = isUp ? 'text-success-base' : 'text-error-base';
  const bgTone = isUp ? 'bg-success-lighter' : 'bg-error-lighter';
  const sparkColor = isUp ? 'var(--color-success-base)' : 'var(--color-error-base)';
  const sparkFill = isUp ? 'var(--color-success-lighter)' : 'var(--color-error-lighter)';

  const inner = (
    <div
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-5 transition-all',
        'hover:border-stroke-sub-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)]',
        href && 'cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-text-sub-600">{kpi.label}</span>
          <span className="text-title-h5 font-semibold text-text-strong-950 tracking-tight">
            {kpi.formattedValue}
          </span>
        </div>
        <div
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium',
            bgTone,
            tone,
          )}
        >
          {isUp ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {formatPercent(Math.abs(kpi.delta), 0)}
        </div>
      </div>
      <div className="-mb-1">
        <Sparkline
          data={kpi.sparkline}
          stroke={sparkColor}
          fill={sparkFill}
          height={32}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base rounded-xl">
        {inner}
      </Link>
    );
  }
  return inner;
}