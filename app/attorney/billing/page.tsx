import Link from 'next/link';
import { Filter, Download, Clock, CircleDollarSign, FileText, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bills } from '@/data/bills';
import { billingKpis } from '@/data/kpis';
import { formatCurrency, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';
import type { Bill } from '@/types';

type Column = {
  key: string;
  title: string;
  predicate: (b: Bill) => boolean;
  accent: string;
};

const COLUMNS: Column[] = [
  { key: 'draft', title: 'Draft', accent: 'bg-text-soft-400', predicate: (b) => b.status === 'Draft' },
  { key: 'submitted', title: 'Submitted', accent: 'bg-information-base', predicate: (b) => b.status === 'Submitted' },
  { key: 'review', title: 'Under Review', accent: 'bg-primary-base', predicate: (b) => b.status === 'Under Review' },
  {
    key: 'counter',
    title: 'Counter Offered',
    accent: 'bg-away-base',
    predicate: (b) =>
      b.status === 'Counter Offered' || b.status === 'Counter Sent' || b.status === 'Offer Received',
  },
  { key: 'paid', title: 'Paid', accent: 'bg-success-base', predicate: (b) => b.status === 'Paid' },
];

function daysSince(serviceDate: string): string {
  const ms = Date.now() - new Date(serviceDate).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function BillingPage() {
  const { totalBilledCents, totalPaidCents, outstandingCents, avgDaysToPay } = billingKpis;
  const collectionRate = totalBilledCents > 0 ? totalPaidCents / totalBilledCents : 0;

  const kpis: { label: string; value: string; helper: string; tone: string; icon: React.ReactNode }[] = [
    {
      label: 'Total billed',
      value: formatCurrency(totalBilledCents, { compact: true }),
      helper: `${bills.length} bills across portfolio`,
      tone: 'text-primary-base bg-primary-lighter',
      icon: <FileText className="size-4" />,
    },
    {
      label: 'Collected',
      value: formatCurrency(totalPaidCents, { compact: true }),
      helper: `${Math.round(collectionRate * 100)}% collection rate`,
      tone: 'text-success-dark bg-success-lighter',
      icon: <CircleDollarSign className="size-4" />,
    },
    {
      label: 'Outstanding',
      value: formatCurrency(outstandingCents, { compact: true }),
      helper: `${bills.filter((b) => b.status !== 'Paid' && b.status !== 'Written Off').length} open bills`,
      tone: 'text-warning-dark bg-warning-lighter',
      icon: <TrendingUp className="size-4" />,
    },
    {
      label: 'Avg days to pay',
      value: `${avgDaysToPay}d`,
      helper: 'Industry benchmark 45d',
      tone: 'text-information-dark bg-information-lighter',
      icon: <Clock className="size-4" />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Track every bill from draft to collection. Drag-and-drop pipeline of active negotiations."
        meta={
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-sub-600">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-weak-50 px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-success-base" />
              <span className="tabular-nums">{bills.length}</span>
              <span>total bills</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-weak-50 px-2.5 py-1">
              <span className="size-1.5 rounded-full bg-away-base" />
              <span className="tabular-nums">{bills.filter((b) => b.status === 'Overdue').length}</span>
              <span>overdue</span>
            </span>
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="md">
              <Filter className="size-4" />
              Filter
            </Button>
            <Button variant="outline" size="md">
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-xs font-medium text-text-sub-600">{k.label}</span>
                  <span className="text-title-h5 font-semibold text-text-strong-950 tracking-tight tabular-nums">
                    {k.value}
                  </span>
                  <span className="text-[11px] text-text-soft-400">{k.helper}</span>
                </div>
                <span className={cn('inline-flex items-center justify-center rounded-lg size-9 shrink-0', k.tone)}>
                  {k.icon}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const items = bills.filter(col.predicate);
          const totalCents = items.reduce((sum, b) => sum + b.billedCents, 0);
          return (
            <div key={col.key} className="flex flex-col gap-2 min-w-0">
              <div className="sticky top-16 z-10 bg-bg-weak-25 px-1 py-2 border-b border-stroke-soft-200">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn('size-2 rounded-full shrink-0', col.accent)} />
                    <h2 className="text-label-sm font-semibold text-text-strong-950 truncate">
                      {col.title}
                    </h2>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full bg-bg-soft-200 px-2 h-5 text-[10px] font-semibold tabular-nums text-text-strong-950">
                    {items.length}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-text-soft-400 px-1">
                  <span className="tabular-nums">{formatCurrency(totalCents, { compact: true })}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 px-0.5">
                {items.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-stroke-soft-200 px-3 py-6 text-center text-[11px] text-text-soft-400">
                    No bills in this stage.
                  </div>
                ) : (
                  items.map((b) => (
                    <Link
                      key={b.id}
                      href={`/attorney/cases/${b.caseId}`}
                      className="block rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 hover:border-stroke-sub-300 hover:shadow-[0_2px_6px_rgba(15,23,42,0.04)] cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-text-strong-950 truncate">
                            {b.clientName}
                          </span>
                          <span className="text-xs text-text-sub-600 truncate">
                            {b.modality} · {b.bodyPart}
                          </span>
                        </div>
                        <div className="flex flex-col items-end shrink-0 text-right">
                          <span className="text-sm font-medium tabular-nums text-text-strong-950">
                            {formatCurrency(b.billedCents, { compact: true })}
                          </span>
                          {b.status !== 'Draft' && b.negotiatedCents !== null && (
                            <span className="text-[10px] tabular-nums text-success-dark">
                              offer {formatCurrency(b.negotiatedCents, { compact: true })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-text-soft-400">
                        <span className="truncate">{b.facility}</span>
                        <span className="tabular-nums shrink-0">{daysSince(b.serviceDate)}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}