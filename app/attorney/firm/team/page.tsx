'use client';

import * as React from 'react';
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Archive,
  UserCircle2,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/portal/page-header';
import { DataTable, SelectColumn } from '@/components/portal/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { firmAttorneys } from '@/data/firm';
import { formatDate, formatPhone } from '@/lib/format';
import { cn } from '@/utils/cn';
import type { Attorney } from '@/types';

type Tab = 'active' | 'archived';

export default function TeamPage() {
  const [tab, setTab] = React.useState<Tab>('active');

  const filtered = React.useMemo(() => {
    if (tab === 'active') return firmAttorneys.filter((a) => !a.archived);
    return firmAttorneys.filter((a) => a.archived);
  }, [tab]);

  const columns = React.useMemo<ColumnDef<Attorney, unknown>[]>(
    () => [
      SelectColumn<Attorney>(),
      {
        id: 'attorney',
        header: () => <span>Attorney</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar initials={row.original.initials} color={row.original.avatarColor} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-text-strong-950 truncate">
                {row.original.fullName}
              </span>
              <span className="text-xs text-text-sub-600 truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'barNumber',
        accessorKey: 'barNumber',
        header: () => <span>Bar number</span>,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-text-strong-950 tabular-nums">
            {row.original.barNumber}
          </span>
        ),
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: () => <span>Title</span>,
        cell: ({ row }) => (
          <span className="text-sm text-text-strong-950">{row.original.title}</span>
        ),
      },
      {
        id: 'states',
        accessorKey: 'licensureStates',
        header: () => <span>Licensure</span>,
        cell: ({ row }) => {
          const states = row.original.licensureStates;
          const visible = states.slice(0, 3);
          const overflow = states.length - visible.length;
          return (
            <div className="flex items-center gap-1">
              {visible.map((s) => (
                <Badge key={s} tone="neutral" variant="soft" size="sm" dot={false}>
                  {s}
                </Badge>
              ))}
              {overflow > 0 && (
                <span className="text-xs text-text-soft-400 tabular-nums">
                  +{overflow}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'activeCases',
        accessorKey: 'activeCases',
        header: () => <div className="text-right">Active cases</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums font-medium text-text-strong-950">
            {row.original.activeCases}
          </div>
        ),
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: () => <span>Phone</span>,
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-text-strong-950">
            {formatPhone(row.original.phone)}
          </span>
        ),
      },
      {
        id: 'joined',
        accessorKey: 'joinedAt',
        header: () => <span>Joined</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600">
            {formatDate(row.original.joinedAt, 'medium')}
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
              <DropdownMenuItem>
                <UserCircle2 className="size-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="size-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Team"
        description="Attorneys across your firm."
        meta={
          <div className="inline-flex items-center rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-0.5">
            {(['active', 'archived'] as Tab[]).map((t) => {
              const active = tab === t;
              const count =
                t === 'active'
                  ? firmAttorneys.filter((a) => !a.archived).length
                  : firmAttorneys.filter((a) => a.archived).length;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-3 h-7 text-xs font-medium capitalize transition-colors',
                    active
                      ? 'bg-bg-weak-50 text-text-strong-950'
                      : 'text-text-sub-600 hover:text-text-strong-950',
                  )}
                >
                  {t}
                  <span
                    className={cn(
                      'tabular-nums text-[10px] rounded-full px-1.5 h-4 inline-flex items-center',
                      active ? 'bg-bg-white-0 text-text-sub-600' : 'bg-bg-weak-50 text-text-soft-400',
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        }
        actions={
          <Button variant="primary" size="md">
            <Plus className="size-4" />
            Add attorney
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        pageSize={20}
        searchPlaceholder="Search by name, email, bar number..."
      />
    </div>
  );
}