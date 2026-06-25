'use client';

import * as React from 'react';
import {
  Plus,
  MapPin,
  Phone,
  MoreHorizontal,
  Pencil,
  Users,
  Building2,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/portal/page-header';
import { DataTable, SelectColumn } from '@/components/portal/data-table/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { AvatarStack } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { firmLocations, firmAttorneys } from '@/data/firm';
import { formatPhone } from '@/lib/format';
import type { Location, Attorney } from '@/types';

function locationTone(t: Location['type']): 'primary' | 'info' | 'neutral' {
  if (t === 'HQ') return 'primary';
  if (t === 'Branch') return 'info';
  return 'neutral';
}

export default function LocationsPage() {
  const columns = React.useMemo<ColumnDef<Location, unknown>[]>(
    () => [
      SelectColumn<Location>(),
      {
        id: 'name',
        accessorKey: 'name',
        header: () => <span>Name</span>,
        cell: ({ row }) => {
          const l = row.original;
          return (
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-lighter text-primary-base shrink-0">
                <Building2 className="size-4" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-text-strong-950 truncate">
                  {l.name}
                </span>
                <StatusBadge
                  status={l.type}
                  tone={locationTone(l.type)}
                  dot={false}
                  className="self-start mt-0.5"
                />
              </div>
            </div>
          );
        },
      },
      {
        id: 'address',
        accessorKey: 'address',
        header: () => <span>Address</span>,
        cell: ({ row }) => (
          <div className="flex items-start gap-2 min-w-0">
            <MapPin className="size-3.5 text-text-soft-400 mt-0.5 shrink-0" />
            <span className="text-sm text-text-strong-950">
              {row.original.address.line1}, {row.original.address.city},{' '}
              {row.original.address.state} {row.original.address.zip}
            </span>
          </div>
        ),
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: () => <span>Phone</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="size-3.5 text-text-soft-400" />
            <span className="text-sm tabular-nums text-text-strong-950">
              {formatPhone(row.original.phone)}
            </span>
          </div>
        ),
      },
      {
        id: 'attorneys',
        accessorKey: 'activeAttorneys',
        header: () => <span>Active attorneys</span>,
        cell: ({ row }) => {
          const n = row.original.activeAttorneys;
          // Pick a few attorneys as illustration
          const sample: Attorney[] = firmAttorneys.slice(0, Math.min(n, 4));
          const stack = sample.map((a) => ({
            initials: a.initials,
            color: a.avatarColor,
            name: a.fullName,
          }));
          return (
            <div className="flex items-center gap-2">
              <AvatarStack people={stack} size="xs" max={3} />
              <span className="text-xs text-text-sub-600 tabular-nums">{n}</span>
            </div>
          );
        },
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
              <DropdownMenuItem>
                <Users className="size-4" />
                View team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error-base focus:bg-error-lighter focus:text-error-dark">
                Archive location
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
        title="Locations"
        description="Office locations for Rackow & Pathora Injury Law."
        meta={
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-sub-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary-base" />
              <span className="tabular-nums">{firmLocations.length} locations</span>
            </span>
            <span className="text-text-soft-400">·</span>
            <span>
              {firmLocations.reduce((s, l) => s + l.activeAttorneys, 0)} attorneys across offices
            </span>
          </div>
        }
        actions={
          <Button variant="primary" size="md">
            <Plus className="size-4" />
            Add location
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={firmLocations}
        pageSize={20}
        searchPlaceholder="Search locations..."
      />
    </div>
  );
}