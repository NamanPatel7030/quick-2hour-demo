'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Search,
  Briefcase,
  Users,
  FileText,
  Receipt,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cases } from '@/data/cases';
import { clients } from '@/data/clients';
import { bills } from '@/data/bills';
import { documents } from '@/data/documents';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/utils/cn';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  // Keyboard shortcut: ⌘K / Ctrl+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const q = search.trim().toLowerCase();
  const matchedCases = q
    ? cases
        .filter(
          (c) =>
            c.id.toLowerCase().includes(q) ||
            c.claimNumber.toLowerCase().includes(q) ||
            c.insuranceCarrier.toLowerCase().includes(q),
        )
        .slice(0, 5)
    : cases.slice(0, 5);

  const matchedClients = q
    ? clients
        .filter(
          (c) =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q),
        )
        .slice(0, 5)
    : clients.slice(0, 4);

  const matchedBills = q
    ? bills
        .filter(
          (b) =>
            b.id.toLowerCase().includes(q) ||
            b.clientName.toLowerCase().includes(q) ||
            b.modality.toLowerCase().includes(q),
        )
        .slice(0, 5)
    : bills.slice(0, 3);

  const matchedDocs = q
    ? documents
        .filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q),
        )
        .slice(0, 5)
    : documents.slice(0, 3);

  const quickActions = [
    { label: 'New case', icon: Plus, action: () => navigate(ROUTES.cases) },
    { label: 'Upload RX', icon: FileText, action: () => navigate(ROUTES.documents) },
    { label: 'Submit bill offer', icon: Receipt, action: () => navigate(ROUTES.offers) },
    { label: 'Submit payment', icon: Receipt, action: () => navigate(ROUTES.payments) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command
          className="flex flex-col"
          shouldFilter={false}
          label="Global command palette"
        >
          <div className="flex items-center gap-2 px-4 border-b border-stroke-soft-200">
            <Search className="size-4 text-text-soft-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search cases, clients, bills, documents..."
              className="flex-1 h-12 bg-transparent text-sm text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-stroke-soft-200 bg-bg-weak-50 px-1.5 h-5 text-[10px] font-medium text-text-sub-600">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[420px] overflow-y-auto p-2">
            <Command.Empty className="py-12 text-center text-sm text-text-sub-600">
              No results found.
            </Command.Empty>

            <Command.Group heading="Quick actions" className="mb-2">
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-sub-600">
                Quick actions
              </div>
              <div className="grid grid-cols-2 gap-1">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Command.Item
                      key={a.label}
                      onSelect={a.action}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-text-strong-950 aria-selected:bg-bg-weak-50"
                    >
                      <Icon className="size-3.5 text-text-soft-400" />
                      {a.label}
                    </Command.Item>
                  );
                })}
              </div>
            </Command.Group>

            {matchedCases.length > 0 && (
              <Command.Group heading="Cases" className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-sub-600">
                  Cases
                </div>
                {matchedCases.map((c) => (
                  <Command.Item
                    key={c.id}
                    onSelect={() => navigate(ROUTES.case(c.id))}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm text-text-strong-950 aria-selected:bg-bg-weak-50"
                  >
                    <Briefcase className="size-3.5 text-text-soft-400 shrink-0" />
                    <span className="font-medium tabular-nums">{c.id}</span>
                    <span className="text-text-sub-600 truncate">· {c.injuryType} · {c.insuranceCarrier}</span>
                    <ArrowRight className="ml-auto size-3 text-text-soft-400" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {matchedClients.length > 0 && (
              <Command.Group heading="Clients" className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-sub-600">
                  Clients
                </div>
                {matchedClients.map((c) => (
                  <Command.Item
                    key={c.id}
                    onSelect={() => navigate(ROUTES.client(c.id))}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm text-text-strong-950 aria-selected:bg-bg-weak-50"
                  >
                    <Users className="size-3.5 text-text-soft-400 shrink-0" />
                    <span className="font-medium">{c.firstName} {c.lastName}</span>
                    <span className="text-text-sub-600 truncate">· {c.city}</span>
                    <ArrowRight className="ml-auto size-3 text-text-soft-400" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {matchedBills.length > 0 && (
              <Command.Group heading="Bills" className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-sub-600">
                  Bills
                </div>
                {matchedBills.map((b) => (
                  <Command.Item
                    key={b.id}
                    onSelect={() => navigate(ROUTES.case(b.caseId))}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm text-text-strong-950 aria-selected:bg-bg-weak-50"
                  >
                    <Receipt className="size-3.5 text-text-soft-400 shrink-0" />
                    <span className="font-medium tabular-nums">{b.id}</span>
                    <span className="text-text-sub-600 truncate">· {b.modality} · {b.clientName}</span>
                    <ArrowRight className="ml-auto size-3 text-text-soft-400" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {matchedDocs.length > 0 && (
              <Command.Group heading="Documents" className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-sub-600">
                  Documents
                </div>
                {matchedDocs.map((d) => (
                  <Command.Item
                    key={d.id}
                    onSelect={() => navigate(ROUTES.caseDocuments(d.caseId))}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm text-text-strong-950 aria-selected:bg-bg-weak-50"
                  >
                    <FileText className="size-3.5 text-text-soft-400 shrink-0" />
                    <span className="truncate">{d.name}</span>
                    <span className="text-text-sub-600 text-xs shrink-0">· {d.category}</span>
                    <ArrowRight className="ml-auto size-3 text-text-soft-400" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
          <div className="border-t border-stroke-soft-200 bg-bg-weak-25 px-3 py-2 flex items-center justify-between text-[10px] text-text-sub-600">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-stroke-soft-200 bg-bg-white-0 px-1 h-4 inline-flex items-center">↑↓</kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-stroke-soft-200 bg-bg-white-0 px-1 h-4 inline-flex items-center">↵</kbd>
                select
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-stroke-soft-200 bg-bg-white-0 px-1 h-4 inline-flex items-center">esc</kbd>
                close
              </span>
            </div>
            <span className="font-medium">Mediflow · ⌘K</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}