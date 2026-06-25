'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Row,
  type RowSelectionState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
  pageSize?: number;
  emptyState?: React.ReactNode;
  toolbar?: React.ReactNode;
  bulkActions?: (selected: TData[]) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  className?: string;
  initialSort?: SortingState;
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchColumn,
  pageSize = 20,
  emptyState,
  toolbar,
  bulkActions,
  onRowClick,
  className,
  initialSort,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSort ?? []);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection, globalFilter },
    initialState: { pagination: { pageSize } },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue) return true;
      const q = String(filterValue).toLowerCase();
      return Object.values(row.original as Record<string, unknown>).some((v) =>
        String(v ?? '').toLowerCase().includes(q),
      );
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((r: Row<TData>) => r.original);
  const hasSelection = Object.keys(rowSelection).length > 0;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {(toolbar || searchColumn !== undefined || true) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2 min-w-[200px] max-w-md">
            <Input
              placeholder={searchPlaceholder}
              leftIcon={<Search className="size-3.5" />}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9"
            />
          </div>
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {hasSelection && bulkActions && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary-base/30 bg-primary-lighter px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-primary-darker tabular-nums">
              {selectedRows.length} selected
            </span>
            <button
              onClick={() => setRowSelection({})}
              className="text-xs text-text-sub-600 hover:text-text-strong-950 underline"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center gap-1.5">{bulkActions(selectedRows)}</div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-stroke-soft-200 bg-bg-weak-25">
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-sub-600 whitespace-nowrap',
                          header.column.id === 'select' && 'w-10',
                          header.column.id === 'actions' && 'w-12 text-right',
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                            className={cn(
                              'inline-flex items-center gap-1',
                              canSort && 'cursor-pointer hover:text-text-strong-950',
                            )}
                            disabled={!canSort}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span className="text-text-soft-400">
                                {sortDir === 'asc' ? (
                                  <ChevronUp className="size-3" />
                                ) : sortDir === 'desc' ? (
                                  <ChevronDown className="size-3" />
                                ) : (
                                  <ChevronsUpDown className="size-3" />
                                )}
                              </span>
                            )}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    {emptyState ?? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm text-text-sub-600">No results.</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={cn(
                      'border-b border-stroke-soft-200 last:border-b-0 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-bg-weak-25',
                      row.getIsSelected() && 'bg-primary-lighter/40',
                      i % 2 === 1 && !onRowClick && 'bg-bg-white-0',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-3 py-3 align-middle',
                          cell.column.id === 'select' && 'w-10',
                          cell.column.id === 'actions' && 'w-12 text-right',
                        )}
                        onClick={
                          cell.column.id === 'select' || cell.column.id === 'actions'
                            ? (e) => e.stopPropagation()
                            : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stroke-soft-200 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs text-text-sub-600">
            <span className="tabular-nums">
              {table.getRowModel().rows.length === 0
                ? '0'
                : `${table.getState().pagination.pageIndex * pageSize + 1}–${Math.min(
                    (table.getState().pagination.pageIndex + 1) * pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}`}{' '}
              of {table.getFilteredRowModel().rows.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <span className="text-xs text-text-sub-600 px-2 tabular-nums">
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Indeterminate checkbox helper
export function SelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all"
        className="size-3.5 cursor-pointer rounded border-stroke-sub-300 accent-primary-base"
        checked={table.getIsAllPageRowsSelected()}
        ref={(el) => {
          if (el) el.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
        }}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={`Select row ${row.id}`}
        className="size-3.5 cursor-pointer rounded border-stroke-sub-300 accent-primary-base"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
