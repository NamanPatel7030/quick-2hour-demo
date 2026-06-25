'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Download,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  MapPin,
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
import { cn } from '@/utils/cn';
import { clients } from '@/data/clients';
import { cases, casesForClient } from '@/data/cases';
import { formatCurrency, formatPhone, formatRelative } from '@/lib/format';
import type { Client } from '@/types';

type StatusFilter = 'all' | 'Active' | 'Closed';

interface ClientRow extends Client {
  totalBilledCents: number;
  lastActivityAt: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');

  const rows = React.useMemo<ClientRow[]>(() => {
    return clients.map((c) => {
      const clientCases = casesForClient(c.id);
      const totalBilledCents = clientCases.reduce(
        (sum, cs) => sum + cs.billedCents,
        0,
      );
      const lastActivityAt = clientCases.reduce<string>(
        (latest, cs) =>
          new Date(cs.lastActivityAt).getTime() > new Date(latest).getTime()
            ? cs.lastActivityAt
            : latest,
        clientCases[0]?.lastActivityAt ?? new Date(0).toISOString(),
      );
      return {
        ...c,
        totalBilledCents,
        lastActivityAt,
      };
    });
  }, []);

  const filteredRows = React.useMemo(() => {
    if (statusFilter === 'all') return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const totalActive = rows.filter((r) => r.status === 'Active').length;
  const totalClosed = rows.filter((r) => r.status === 'Closed').length;

  const columns = React.useMemo<ColumnDef<ClientRow, unknown>[]>(
    () => [
      SelectColumn<ClientRow>(),
      {
        id: 'client',
        header: () => <span>Client</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              initials={row.original.initials}
              color={row.original.avatarColor}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-text-strong-950 truncate">
                {row.original.firstName} {row.original.lastName}
              </span>
              <span className="text-xs text-text-sub-600 truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'phone',
        header: () => <span>Phone</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600 tabular-nums">
            {row.original.phone ? formatPhone(row.original.phone) : '—'}
          </span>
        ),
      },
      {
        id: 'city',
        header: () => <span>City</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-text-sub-600">
            <MapPin className="size-3 text-text-soft-400" />
            <span className="truncate max-w-[140px]">{row.original.city}</span>
          </div>
        ),
      },
      {
        id: 'caseCount',
        accessorKey: 'caseCount',
        header: () => <div className="text-right">Cases</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums font-medium">
            {row.original.caseCount}
          </div>
        ),
        sortingFn: 'basic',
      },
      {
        id: 'totalBilled',
        accessorKey: 'totalBilledCents',
        header: () => <div className="text-right">Total billed</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums">
            {formatCurrency(row.original.totalBilledCents, { compact: true })}
          </div>
        ),
        sortingFn: 'basic',
      },
      {
        id: 'outstanding',
        accessorKey: 'openBalanceCents',
        header: () => <div className="text-right">Outstanding</div>,
        cell: ({ row }) => {
          const o = row.original.openBalanceCents;
          return (
            <div
              className={cn(
                'text-right tabular-nums',
                o === 0 ? 'text-success-base font-medium' : 'text-text-strong-950',
              )}
            >
              {o === 0 ? '—' : formatCurrency(o, { compact: true })}
            </div>
          );
        },
        sortingFn: 'basic',
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => <span>Status</span>,
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.status}
            tone={row.original.status === 'Active' ? 'success' : 'neutral'}
          />
        ),
      },
      {
        id: 'lastActivity',
        accessorKey: 'lastActivityAt',
        header: () => <span>Last activity</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600">
            {formatRelative(row.original.lastActivityAt)}
          </span>
        ),
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
              <DropdownMenuItem
                onSelect={() => router.push(`/attorney/clients/${row.original.id}`)}
              >
                <User className="size-4" />
                View client
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="size-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="size-4" />
                Call client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="size-4" />
                Export record
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
        title="Clients"
        description="All active and closed clients across your practice."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
              <span className="ml-1 rounded bg-bg-white-0/30 px-1.5 py-0.5 text-[10px] tabular-nums">
                {rows.length}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'Active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('Active')}
            >
              Active
              <span className="ml-1 rounded bg-bg-white-0/30 px-1.5 py-0.5 text-[10px] tabular-nums">
                {totalActive}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'Closed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('Closed')}
            >
              Closed
              <span className="ml-1 rounded bg-bg-white-0/30 px-1.5 py-0.5 text-[10px] tabular-nums">
                {totalClosed}
              </span>
            </Button>
            <span className="hidden sm:inline-flex items-center gap-2 text-xs text-text-sub-600 ml-2">
              <span className="size-1.5 rounded-full bg-primary-base" />
              <span className="tabular-nums">{cases.length} cases total</span>
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
              Add client
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={filteredRows}
        pageSize={20}
        searchPlaceholder="Search by client name, email, or city..."
        initialSort={[{ id: 'caseCount', desc: true }]}
        onRowClick={(row) => router.push(`/attorney/clients/${row.id}`)}
        emptyState={
          <EmptyState
            icon={<User className="size-5" />}
            title="No clients found"
            description={
              statusFilter === 'all'
                ? 'Add your first client to start tracking their cases.'
                : `No ${statusFilter.toLowerCase()} clients to show.`
            }
            action={{ label: 'Add your first client', href: '/attorney/clients' }}
          />
        }
      />
    </div>
  );
}