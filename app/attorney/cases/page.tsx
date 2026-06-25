'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/portal/page-header';
import { DataTable, SelectColumn } from '@/components/portal/data-table/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/portal/empty-state';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cases } from '@/data/cases';
import { clients } from '@/data/clients';
import { toneForCase, injuryTypeMap, priorityMap } from '@/lib/constants/status';
import { formatCurrency, formatDate, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';
import type { Case } from '@/types';

export default function CasesPage() {
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<Case, unknown>[]>(
    () => [
      SelectColumn<Case>(),
      {
        id: 'id',
        accessorKey: 'id',
        header: () => <span>Case ID</span>,
        cell: ({ row }) => (
          <Link
            href={`/attorney/cases/${row.original.id}`}
            className="font-medium text-text-strong-950 tabular-nums hover:text-primary-base"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.id}
          </Link>
        ),
      },
      {
        id: 'client',
        header: () => <span>Client</span>,
        cell: ({ row }) => {
          const client = clients.find((c) => c.id === row.original.clientId);
          if (!client) return <span className="text-text-sub-600">Unknown</span>;
          return (
            <Link
              href={`/attorney/clients/${client.id}`}
              className="flex items-center gap-2.5 min-w-0 group"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar initials={client.initials} color={client.avatarColor} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-text-strong-950 truncate group-hover:text-primary-base">
                  {client.firstName} {client.lastName}
                </span>
                <span className="text-xs text-text-sub-600 truncate">{client.city}</span>
              </div>
            </Link>
          );
        },
      },
      {
        id: 'injuryType',
        accessorKey: 'injuryType',
        header: () => <span>Injury</span>,
        cell: ({ row }) => (
          <StatusBadge status={row.original.injuryType} tone={injuryTypeMap[row.original.injuryType]} dot={false} />
        ),
      },
      {
        id: 'dateOfInjury',
        accessorKey: 'dateOfInjury',
        header: () => <span>DOI</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600 tabular-nums">
            {formatDate(row.original.dateOfInjury, 'medium')}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => <span>Status</span>,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} tone={toneForCase(row.original.status)} />
        ),
      },
      {
        id: 'insuranceCarrier',
        accessorKey: 'insuranceCarrier',
        header: () => <span>Insurance</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600">{row.original.insuranceCarrier}</span>
        ),
      },
      {
        id: 'billed',
        accessorKey: 'billedCents',
        header: () => <div className="text-right">Billed</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums font-medium">
            {formatCurrency(row.original.billedCents, { compact: true })}
          </div>
        ),
        sortingFn: 'basic',
      },
      {
        id: 'paid',
        accessorKey: 'paidCents',
        header: () => <div className="text-right">Paid</div>,
        cell: ({ row }) => (
          <div className={cn('text-right tabular-nums', row.original.paidCents > 0 ? 'text-success-dark font-medium' : 'text-text-soft-400')}>
            {row.original.paidCents > 0 ? formatCurrency(row.original.paidCents, { compact: true }) : '—'}
          </div>
        ),
      },
      {
        id: 'outstanding',
        accessorKey: 'billedCents',
        header: () => <div className="text-right">Outstanding</div>,
        cell: ({ row }) => {
          const outstanding = row.original.billedCents - row.original.paidCents;
          return (
            <div className="text-right tabular-nums text-text-strong-950">
              {formatCurrency(outstanding, { compact: true })}
            </div>
          );
        },
      },
      {
        id: 'lastActivity',
        accessorKey: 'lastActivityAt',
        header: () => <span>Last activity</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600">{formatRelative(row.original.lastActivityAt)}</span>
        ),
      },
      {
        id: 'priority',
        accessorKey: 'priority',
        header: () => <span>Priority</span>,
        cell: ({ row }) => {
          const p = row.original.priority;
          const dot = p === 'high' ? 'bg-error-base' : p === 'medium' ? 'bg-warning-base' : 'bg-text-soft-400';
          return (
            <div className="flex items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', dot)} />
              <span className="text-xs capitalize text-text-sub-600">{p}</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-1.5 hover:bg-bg-weak-50 text-text-soft-400 hover:text-text-strong-950 transition-colors">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.push(`/attorney/cases/${row.original.id}`)}>
                <Briefcase className="size-4" />
                Open case
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="size-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error-base focus:bg-error-lighter focus:text-error-dark">
                Archive case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [router],
  );

  return (
    <div>
      <PageHeader
        title="Cases"
        description="Manage and track every active client case across your practice."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" />
              Status
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="size-3.5" />
              Injury type
            </Button>
            <Button variant="outline" size="sm">
              <AlertCircle className="size-3.5" />
              Priority
            </Button>
            <span className="hidden sm:inline-flex items-center gap-2 text-xs text-text-sub-600 ml-2">
              <span className="size-1.5 rounded-full bg-primary-base" />
              <span className="tabular-nums">{cases.length} cases</span>
            </span>
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="md">
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button variant="primary" size="md">
              <Plus className="size-4" />
              New case
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={cases}
        pageSize={20}
        searchPlaceholder="Search by case ID, client name, claim..."
        initialSort={[{ id: 'lastActivity', desc: true }]}
        onRowClick={(row) => router.push(`/attorney/cases/${row.id}`)}
        bulkActions={(selected) => (
          <>
            <Button variant="outline" size="sm">Update status</Button>
            <Button variant="outline" size="sm">Assign case manager</Button>
            <Button variant="outline" size="sm">
              <Download className="size-3.5" />
              Export ({selected.length})
            </Button>
          </>
        )}
        emptyState={
          <EmptyState
            icon={<Briefcase className="size-5" />}
            title="No cases yet"
            description="Add your first case to start tracking imaging, billing, and liens in one workspace."
            action={{ label: 'Add your first case', href: '/attorney/cases' }}
          />
        }
      />
    </div>
  );
}