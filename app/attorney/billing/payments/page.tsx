'use client';

import * as React from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Calendar, CreditCard, Wallet, Building2, ArrowDownRight } from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { DataTable } from '@/components/portal/data-table/data-table';
import { bills } from '@/data/bills';
import { clients } from '@/data/clients';
import { toneForBill } from '@/lib/constants/status';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/utils/cn';

type PaymentRow = {
  id: string;
  date: string;
  caseId: string;
  clientName: string;
  clientInitials: string;
  clientColor: string;
  modality: string;
  bodyPart: string;
  method: 'Card' | 'Check' | 'EFT';
  amountCents: number;
  status: string;
  reference: string;
};

type Range = '30d' | '90d' | '365d' | 'All';

const RANGES: { key: Range; label: string }[] = [
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: '365d', label: '365 days' },
  { key: 'All', label: 'All time' },
];

function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

function pickMethod(billId: string): 'Card' | 'Check' | 'EFT' {
  // Stable distribution by hashing the bill id
  let h = 0;
  for (let i = 0; i < billId.length; i++) h = (h * 31 + billId.charCodeAt(i)) >>> 0;
  const mod = h % 3;
  return mod === 0 ? 'Card' : mod === 1 ? 'Check' : 'EFT';
}

function makeReference(billId: string): string {
  let h = 0;
  for (let i = 0; i < billId.length; i++) h = (h * 17 + billId.charCodeAt(i)) >>> 0;
  const tail = (h % 9_000_000 + 1_000_000).toString();
  return `TXN-${tail}`;
}

export default function PaymentsPage() {
  const [range, setRange] = React.useState<Range>('90d');

  const allPayments = React.useMemo<PaymentRow[]>(() => {
    const paid = bills.filter((b) => b.status === 'Paid' || b.status === 'Accepted');
    return paid.map((b) => {
      const client = clients.find((c) => `${c.firstName} ${c.lastName}` === b.clientName);
      return {
        id: b.id,
        date: b.serviceDate,
        caseId: b.caseId,
        clientName: b.clientName,
        clientInitials: client?.initials ?? b.clientName.slice(0, 2).toUpperCase(),
        clientColor: client?.avatarColor ?? '#3D5AFE',
        modality: b.modality,
        bodyPart: b.bodyPart,
        method: pickMethod(b.id),
        amountCents: b.billedCents,
        status: b.status,
        reference: makeReference(b.id),
      };
    });
  }, []);

  const filtered = React.useMemo(() => {
    if (range === 'All') return allPayments;
    const days = range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const cutoff = Date.now() - daysToMs(days);
    return allPayments.filter((p) => new Date(p.date).getTime() >= cutoff);
  }, [allPayments, range]);

  const totalCollected = filtered.reduce((s, p) => s + p.amountCents, 0);
  const avgPayment = filtered.length > 0 ? Math.round(totalCollected / filtered.length) : 0;
  const largest = filtered.reduce((max, p) => (p.amountCents > max ? p.amountCents : max), 0);

  const columns = React.useMemo<ColumnDef<PaymentRow, unknown>[]>(
    () => [
      {
        id: 'date',
        accessorKey: 'date',
        header: () => <span>Date</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600 tabular-nums">
            {formatDate(row.original.date, 'medium')}
          </span>
        ),
      },
      {
        id: 'case',
        accessorKey: 'caseId',
        header: () => <span>Case</span>,
        cell: ({ row }) => (
          <Link
            href={`/attorney/cases/${row.original.caseId}`}
            className="font-medium text-text-strong-950 tabular-nums hover:text-primary-base"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.caseId}
          </Link>
        ),
      },
      {
        id: 'client',
        accessorKey: 'clientName',
        header: () => <span>Client</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              initials={row.original.clientInitials}
              color={row.original.clientColor}
              size="sm"
            />
            <span className="text-sm font-medium text-text-strong-950 truncate">
              {row.original.clientName}
            </span>
          </div>
        ),
      },
      {
        id: 'modality',
        accessorKey: 'modality',
        header: () => <span>Modality</span>,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-text-strong-950">{row.original.modality}</span>
            <span className="text-[10px] text-text-soft-400">{row.original.bodyPart}</span>
          </div>
        ),
      },
      {
        id: 'method',
        accessorKey: 'method',
        header: () => <span>Method</span>,
        cell: ({ row }) => {
          const m = row.original.method;
          const Icon = m === 'Card' ? CreditCard : m === 'Check' ? Wallet : Building2;
          return (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-bg-weak-50 px-2 py-1 text-xs text-text-sub-600">
              <Icon className="size-3" />
              {m}
            </div>
          );
        },
      },
      {
        id: 'amount',
        accessorKey: 'amountCents',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums font-medium text-success-dark">
            {formatCurrency(row.original.amountCents)}
          </div>
        ),
        sortingFn: 'basic',
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => <span>Status</span>,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} tone={toneForBill(row.original.status)} />
        ),
      },
      {
        id: 'reference',
        accessorKey: 'reference',
        header: () => <span>Reference</span>,
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-sub-600 tabular-nums">
            {row.original.reference}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Settled bills and posted payments — reconciled against Mediflow ledger."
        meta={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs text-text-sub-600 mr-1">
              <Calendar className="size-3.5" />
              Range
            </span>
            {RANGES.map((r) => {
              const active = range === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 h-7 text-xs font-medium transition-colors border',
                    active
                      ? 'border-primary-base bg-primary-base text-text-white-0 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        }
        actions={
          <Button variant="outline" size="md">
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <PaymentStat
          label="Collected in range"
          value={formatCurrency(totalCollected, { compact: true })}
          helper={`${filtered.length} payments`}
          accent="text-success-dark bg-success-lighter"
        />
        <PaymentStat
          label="Average payment"
          value={formatCurrency(avgPayment, { compact: true })}
          helper="per settled bill"
          accent="text-primary-base bg-primary-lighter"
        />
        <PaymentStat
          label="Largest payment"
          value={formatCurrency(largest, { compact: true })}
          helper="single transaction"
          accent="text-information-dark bg-information-lighter"
        />
        <PaymentStat
          label="Net recovery"
          value={`${Math.round((totalCollected / Math.max(bills.reduce((s, b) => s + b.billedCents, 0), 1)) * 100)}%`}
          helper="of total billed"
          accent="text-warning-dark bg-warning-lighter"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pageSize={20}
        initialSort={[{ id: 'date', desc: true }]}
        searchPlaceholder="Search by case, client, reference..."
      />
    </div>
  );
}

function PaymentStat({
  label,
  value,
  helper,
  accent,
}: {
  label: string;
  value: string;
  helper: string;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs font-medium text-text-sub-600">{label}</span>
            <span className="text-title-h5 font-semibold text-text-strong-950 tracking-tight tabular-nums">
              {value}
            </span>
            <span className="text-[11px] text-text-soft-400 inline-flex items-center gap-1">
              <ArrowDownRight className="size-3" />
              {helper}
            </span>
          </div>
          <span className={cn('inline-flex items-center justify-center rounded-lg size-9 shrink-0', accent)}>
            <span className="size-2 rounded-full bg-current opacity-70" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}