'use client';

import * as React from 'react';
import {
  Plus,
  MoreHorizontal,
  Pencil,
  UserMinus,
  Mail,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/portal/page-header';
import { DataTable, SelectColumn } from '@/components/portal/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarStack } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { firmCaseManagers, firmAttorneys } from '@/data/firm';
import { formatPhone } from '@/lib/format';
import type { CaseManager } from '@/types';

export default function StaffPage() {
  const columns = React.useMemo<ColumnDef<CaseManager, unknown>[]>(
    () => [
      SelectColumn<CaseManager>(),
      {
        id: 'manager',
        header: () => <span>Manager</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar initials={row.original.initials} color={row.original.avatarColor} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-text-strong-950 truncate">
                {row.original.fullName}
              </span>
              <span className="text-xs text-text-sub-600 truncate">
                Case manager
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: () => <span>Email</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="size-3.5 text-text-soft-400 shrink-0" />
            <span className="text-sm text-text-strong-950 truncate">
              {row.original.email}
            </span>
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
        id: 'attorneys',
        accessorKey: 'assignedAttorneys',
        header: () => <span>Assigned attorneys</span>,
        cell: ({ row }) => {
          const ids = row.original.assignedAttorneys;
          const matched = ids
            .map((id) => firmAttorneys.find((a) => a.id === id))
            .filter((a): a is NonNullable<typeof a> => Boolean(a));
          if (matched.length === 0)
            return <span className="text-text-soft-400 text-xs">—</span>;
          return (
            <div className="flex items-center gap-2">
              <AvatarStack
                people={matched.map((a) => ({
                  initials: a.initials,
                  color: a.avatarColor,
                  name: a.fullName,
                }))}
                size="xs"
                max={3}
              />
              <span className="text-xs text-text-sub-600 tabular-nums">
                {matched.length}
              </span>
            </div>
          );
        },
      },
      {
        id: 'clients',
        accessorKey: 'activeClients',
        header: () => <div className="text-right">Active clients</div>,
        cell: ({ row }) => (
          <div className="text-right tabular-nums font-medium text-text-strong-950">
            {row.original.activeClients}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-1.5 hover:bg-bg-weak-50 text-text-soft-400 hover:text-text-strong-950 transition-colors">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error-base focus:bg-error-lighter focus:text-error-dark">
                <UserMinus className="size-4" />
                Remove
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

  const totalClients = firmCaseManagers.reduce((s, c) => s + c.activeClients, 0);

  return (
    <div>
      <PageHeader
        title="Case Managers"
        description="Staff managing your active clients."
        meta={
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-sub-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary-base" />
              <span className="tabular-nums">{firmCaseManagers.length} managers</span>
            </span>
            <span className="text-text-soft-400">·</span>
            <span>
              <span className="tabular-nums">{totalClients}</span> active clients
            </span>
          </div>
        }
        actions={
          <Button variant="primary" size="md">
            <Plus className="size-4" />
            Add case manager
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={firmCaseManagers}
        pageSize={20}
        searchPlaceholder="Search managers..."
      />
    </div>
  );
}