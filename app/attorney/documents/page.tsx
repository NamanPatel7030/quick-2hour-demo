'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Image as ImageIcon,
  FileSpreadsheet,
  File as FileIcon,
  Eye,
  Download,
  Search,
  Grid3x3,
  List,
  LayoutGrid,
  ChevronDown,
  Filter,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/portal/page-header';
import { DataTable, SelectColumn } from '@/components/portal/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { documents } from '@/data/documents';
import { formatDate, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';
import type { Document } from '@/types';

const CATEGORIES = [
  'Intake Form',
  'Medical Record',
  'Imaging',
  'Police Report',
  'Insurance Correspondence',
  'Lien',
  'Settlement',
  'Bill',
  'Correspondence',
  'Court Filing',
] as const;

const fileMeta: Record<
  Document['fileType'],
  { icon: React.ElementType; bg: string; label: string }
> = {
  pdf: { icon: FileText, bg: 'bg-error-lighter text-error-dark', label: 'PDF' },
  jpg: { icon: ImageIcon, bg: 'bg-information-lighter text-information-dark', label: 'JPG' },
  docx: { icon: FileText, bg: 'bg-primary-lighter text-primary-base', label: 'DOCX' },
  xlsx: { icon: FileSpreadsheet, bg: 'bg-success-lighter text-success-dark', label: 'XLSX' },
};

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function categoryTone(cat: Document['category']) {
  switch (cat) {
    case 'Imaging':
      return 'info';
    case 'Lien':
    case 'Settlement':
      return 'success';
    case 'Insurance Correspondence':
    case 'Correspondence':
      return 'primary';
    case 'Bill':
      return 'warning';
    case 'Court Filing':
      return 'error';
    default:
      return 'neutral';
  }
}

export default function DocumentsPage() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return documents.filter((d) => {
      if (activeCategory && d.category !== activeCategory) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.caseId.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.uploadedBy.name.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const columns = React.useMemo<ColumnDef<Document, unknown>[]>(
    () => [
      SelectColumn<Document>(),
      {
        id: 'name',
        accessorKey: 'name',
        header: () => <span>Filename</span>,
        cell: ({ row }) => {
          const meta = fileMeta[row.original.fileType];
          const Icon = meta.icon;
          return (
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-lg shrink-0',
                  meta.bg,
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="flex flex-col min-w-0">
                <Link
                  href={`/attorney/cases/${row.original.caseId}`}
                  className="text-sm font-medium text-text-strong-950 truncate hover:text-primary-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.original.name}
                </Link>
                <span className="text-xs text-text-soft-400">{meta.label}</span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'caseId',
        accessorKey: 'caseId',
        header: () => <span>Case</span>,
        cell: ({ row }) => (
          <Link
            href={`/attorney/cases/${row.original.caseId}`}
            className="font-medium text-text-sub-600 tabular-nums hover:text-primary-base"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.caseId}
          </Link>
        ),
      },
      {
        id: 'category',
        accessorKey: 'category',
        header: () => <span>Category</span>,
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.category}
            tone={categoryTone(row.original.category)}
            dot={false}
          />
        ),
      },
      {
        id: 'size',
        accessorKey: 'sizeKB',
        header: () => <span>Size</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600 tabular-nums">
            {formatSize(row.original.sizeKB)}
          </span>
        ),
      },
      {
        id: 'uploadedBy',
        accessorKey: 'uploadedBy',
        header: () => <span>Uploaded by</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar initials={row.original.uploadedBy.initials} size="xs" />
            <span className="text-sm text-text-strong-950 truncate">
              {row.original.uploadedBy.name}
            </span>
          </div>
        ),
      },
      {
        id: 'uploadedAt',
        accessorKey: 'uploadedAt',
        header: () => <span>Uploaded</span>,
        cell: ({ row }) => (
          <span className="text-xs text-text-sub-600">
            {formatRelative(row.original.uploadedAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon-sm">
              <Eye className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Download className="size-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md p-1.5 hover:bg-bg-weak-50 text-text-soft-400 hover:text-text-strong-950 transition-colors">
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="size-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="size-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2Icon />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-error-base focus:bg-error-lighter focus:text-error-dark">
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        title="Documents"
        description="All documents across your cases, organized for quick access."
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Input
                placeholder="Search by filename, case, uploader..."
                leftIcon={<Search className="size-3.5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-0.5">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'inline-flex items-center justify-center size-7 rounded-md transition-colors',
                  view === 'grid'
                    ? 'bg-bg-weak-50 text-text-strong-950'
                    : 'text-text-soft-400 hover:text-text-strong-950',
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'inline-flex items-center justify-center size-7 rounded-md transition-colors',
                  view === 'list'
                    ? 'bg-bg-weak-50 text-text-strong-950'
                    : 'text-text-soft-400 hover:text-text-strong-950',
                )}
                aria-label="List view"
              >
                <List className="size-3.5" />
              </button>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-xs text-text-sub-600">
              <span className="size-1.5 rounded-full bg-primary-base" />
              <span className="tabular-nums">{filtered.length} documents</span>
            </span>
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="md">
              <Filter className="size-4" />
              Case
            </Button>
            <Button variant="primary" size="md">
              <Upload className="size-4" />
              Upload
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 h-7 text-xs font-medium transition-colors',
            activeCategory === null
              ? 'bg-primary-base text-text-white-0 border-primary-base'
              : 'bg-bg-white-0 text-text-sub-600 border-stroke-soft-200 hover:border-stroke-sub-300 hover:text-text-strong-950',
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 h-7 text-xs font-medium transition-colors',
              activeCategory === cat
                ? 'bg-primary-base text-text-white-0 border-primary-base'
                : 'bg-bg-white-0 text-text-sub-600 border-stroke-soft-200 hover:border-stroke-sub-300 hover:text-text-strong-950',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-5" />}
          title="No documents found"
          description="Try adjusting your filters or upload a new document to get started."
          action={{ label: 'Upload document', href: '/attorney/documents' }}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((doc) => {
            const meta = fileMeta[doc.fileType];
            const Icon = meta.icon;
            return (
              <div
                key={doc.id}
                className="group flex flex-col gap-3 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4 transition-all hover:border-stroke-sub-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'flex size-10 items-center justify-center rounded-lg',
                      meta.bg,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md p-1 text-text-soft-400 hover:bg-bg-weak-50 hover:text-text-strong-950 transition-colors">
                      <ChevronDown className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="size-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="size-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <Link
                    href={`/attorney/cases/${doc.caseId}`}
                    className="text-sm font-semibold text-text-strong-950 line-clamp-2 hover:text-primary-base"
                  >
                    {doc.name}
                  </Link>
                  <Link
                    href={`/attorney/cases/${doc.caseId}`}
                    className="text-xs text-text-sub-600 tabular-nums hover:text-primary-base"
                  >
                    {doc.caseId}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={doc.category}
                    tone={categoryTone(doc.category)}
                    dot={false}
                    className="text-[10px]"
                  />
                  <span className="text-xs text-text-soft-400 tabular-nums">
                    {formatSize(doc.sizeKB)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-stroke-soft-200 pt-3 mt-auto">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar initials={doc.uploadedBy.initials} size="xs" />
                    <span className="text-xs text-text-sub-600 truncate">
                      {doc.uploadedBy.name}
                    </span>
                  </div>
                  <span className="text-xs text-text-soft-400 shrink-0">
                    {formatRelative(doc.uploadedAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={20}
          searchPlaceholder="Search documents..."
          initialSort={[{ id: 'uploadedAt', desc: true }]}
        />
      )}
    </div>
  );
}

function Share2Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}