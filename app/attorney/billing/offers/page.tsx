'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, ChevronDown, Send, Check, X, ArrowRight, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { offers } from '@/data/offers';
import { formatCurrency, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';
import type { Offer } from '@/types';

type FilterKey = 'All' | 'Open' | 'Accepted' | 'Stalled' | 'Closed';

const FILTERS: { key: FilterKey; tone: string }[] = [
  { key: 'All', tone: 'bg-bg-weak-50 text-text-strong-950' },
  { key: 'Open', tone: 'bg-primary-lighter text-primary-base' },
  { key: 'Accepted', tone: 'bg-success-lighter text-success-dark' },
  { key: 'Stalled', tone: 'bg-warning-lighter text-warning-dark' },
  { key: 'Closed', tone: 'bg-bg-weak-50 text-text-sub-600' },
];

const STATUS_TONE: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
  Open: 'primary',
  Accepted: 'success',
  Stalled: 'warning',
  Closed: 'neutral',
};

const ROUND_STATUS_TONE: Record<string, 'info' | 'success' | 'warning' | 'error' | 'neutral'> = {
  Sent: 'info',
  Accepted: 'success',
  Rejected: 'error',
  Countered: 'warning',
};

export default function OffersPage() {
  const [filter, setFilter] = React.useState<FilterKey>('All');
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const counts = React.useMemo(() => {
    const map: Record<FilterKey, number> = { All: offers.length, Open: 0, Accepted: 0, Stalled: 0, Closed: 0 };
    for (const o of offers) {
      map[o.status] = (map[o.status] ?? 0) + 1;
    }
    return map;
  }, []);

  const filtered = React.useMemo(
    () => (filter === 'All' ? offers : offers.filter((o) => o.status === filter)),
    [filter],
  );

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div>
      <PageHeader
        title="Offers"
        description="Live negotiation threads with carriers. Track every counter and final position."
        meta={
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 h-7 text-xs font-medium transition-colors border',
                    active
                      ? 'border-primary-base bg-primary-base text-text-white-0 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
                  )}
                >
                  {f.key}
                  <span
                    className={cn(
                      'tabular-nums text-[10px] rounded-full px-1.5 h-4 inline-flex items-center justify-center',
                      active ? 'bg-primary-dark text-text-white-0' : 'bg-bg-weak-50 text-text-sub-600',
                    )}
                  >
                    {counts[f.key]}
                  </span>
                </button>
              );
            })}
          </div>
        }
        actions={
          <Button variant="primary" size="md">
            <Plus className="size-4" />
            Submit offer
          </Button>
        }
      />

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiStat
          label="Open threads"
          value={String(counts.Open)}
          accent="text-primary-base bg-primary-lighter"
        />
        <KpiStat
          label="Accepted YTD"
          value={String(counts.Accepted)}
          accent="text-success-dark bg-success-lighter"
        />
        <KpiStat
          label="Stalled"
          value={String(counts.Stalled)}
          accent="text-warning-dark bg-warning-lighter"
        />
        <KpiStat
          label="Avg rounds"
          value={(offers.reduce((s, o) => s + o.offers.length, 0) / Math.max(offers.length, 1)).toFixed(1)}
          accent="text-information-dark bg-information-lighter"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
              <p className="text-sm font-medium text-text-strong-950">No offers in this stage</p>
              <p className="text-xs text-text-sub-600">Try a different filter above.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((offer) => {
            const open = !!expanded[offer.id];
            const lastRound = offer.offers[offer.offers.length - 1];
            const pendingBy = lastRound?.by === 'Mediflow' ? 'Insurance' : 'Mediflow';
            return (
              <Card key={offer.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggle(offer.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-bg-weak-25 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/attorney/cases/${offer.caseId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-semibold text-text-strong-950 hover:text-primary-base"
                        >
                          {offer.clientName}
                        </Link>
                        <span className="text-xs text-text-soft-400">·</span>
                        <span className="text-xs text-text-sub-600">{offer.modality}</span>
                        <span className="text-xs text-text-soft-400">·</span>
                        <span className="text-xs text-text-soft-400 tabular-nums">{offer.id}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-text-sub-600">
                        <span>
                          Billed{' '}
                          <span className="font-medium tabular-nums text-text-strong-950">
                            {formatCurrency(offer.originalBilledCents, { compact: true })}
                          </span>
                        </span>
                        <span className="text-text-soft-400">·</span>
                        <span>
                          Last offer{' '}
                          <span className="font-medium tabular-nums text-text-strong-950">
                            {formatCurrency(lastRound?.amountCents ?? offer.originalBilledCents, { compact: true })}
                          </span>
                        </span>
                        <span className="text-text-soft-400">·</span>
                        <span className="tabular-nums">{offer.offers.length} rounds</span>
                        <span className="text-text-soft-400">·</span>
                        <span>awaiting {pendingBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={offer.status} tone={STATUS_TONE[offer.status]} />
                    <ChevronDown
                      className={cn(
                        'size-4 text-text-soft-400 transition-transform duration-200',
                        open && 'rotate-180 text-text-strong-950',
                      )}
                    />
                  </div>
                </button>

                {open && (
                  <div className="border-t border-stroke-soft-200 bg-bg-weak-25 px-5 py-4">
                    {/* Round timeline */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-text-sub-600 mb-1">
                        <span>Round timeline</span>
                        <div className="h-px flex-1 bg-stroke-soft-200" />
                      </div>
                      {offer.offers.map((r, i) => (
                        <div
                          key={`${offer.id}-${i}`}
                          className="flex items-start gap-3 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 py-2.5"
                        >
                          <div className="flex flex-col items-center pt-0.5">
                            <span className="inline-flex items-center justify-center rounded-full bg-primary-lighter text-primary-base size-6 text-[11px] font-semibold tabular-nums">
                              {i + 1}
                            </span>
                            {i < offer.offers.length - 1 && (
                              <span className="mt-1 w-px flex-1 bg-stroke-soft-200 min-h-[12px]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-text-strong-950">
                                {r.by}
                              </span>
                              <span className="text-xs text-text-soft-400">·</span>
                              <span className="text-sm font-medium tabular-nums text-text-strong-950">
                                {formatCurrency(r.amountCents, { compact: true })}
                              </span>
                              <StatusBadge
                                status={r.status}
                                tone={ROUND_STATUS_TONE[r.status] ?? 'neutral'}
                                dot
                              />
                              <span className="ml-auto text-[10px] text-text-soft-400 tabular-nums inline-flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatRelative(r.at)}
                              </span>
                            </div>
                            {r.note && (
                              <p className="mt-1 text-xs text-text-sub-600">{r.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stroke-soft-200 pt-3">
                      <div className="text-xs text-text-sub-600">
                        <span className="font-medium text-text-strong-950 tabular-nums">
                          {formatCurrency(lastRound?.amountCents ?? offer.originalBilledCents, { compact: true })}
                        </span>{' '}
                        is the current pending position
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <X className="size-3.5" />
                          Reject
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="size-3.5" />
                          Counter
                        </Button>
                        <Button variant="soft" size="sm">
                          <Check className="size-3.5" />
                          Accept
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function KpiStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-sub-600">{label}</span>
            <span className="text-title-h5 font-semibold tabular-nums text-text-strong-950 tracking-tight">
              {value}
            </span>
          </div>
          <span className={cn('inline-flex items-center justify-center rounded-lg size-9', accent)}>
            <span className="size-2 rounded-full bg-current opacity-70" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}