'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCheck,
  Receipt,
  PenTool,
  CalendarCheck,
  CreditCard,
  FileSignature,
  FileText,
  Bell,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/portal/empty-state';
import { useNotificationStore } from '@/store/notifications.store';
import { formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';
import type { Notification, NotificationType } from '@/types';

type TabKey = 'all' | 'unread' | NotificationType;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'billing', label: 'Billing' },
  { key: 'signature', label: 'Signature' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'payment', label: 'Payment' },
  { key: 'lien', label: 'Lien' },
  { key: 'case_update', label: 'Case update' },
  { key: 'system', label: 'System' },
];

const typeMeta: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; label: string }
> = {
  billing: { icon: Receipt, bg: 'bg-warning-lighter text-warning-dark', label: 'Billing' },
  signature: { icon: PenTool, bg: 'bg-primary-lighter text-primary-base', label: 'Signature' },
  schedule: { icon: CalendarCheck, bg: 'bg-information-lighter text-information-dark', label: 'Schedule' },
  payment: { icon: CreditCard, bg: 'bg-success-lighter text-success-dark', label: 'Payment' },
  lien: { icon: FileSignature, bg: 'bg-away-lighter text-away-dark', label: 'Lien' },
  case_update: { icon: FileText, bg: 'bg-bg-weak-100 text-text-strong-950', label: 'Case update' },
  system: { icon: Bell, bg: 'bg-bg-weak-50 text-text-sub-600', label: 'System' },
};

type Bucket = 'Today' | 'Yesterday' | 'This week' | 'Earlier';

function bucketFor(iso: string, now: Date): Bucket {
  const d = new Date(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDiff = Math.floor((today.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86_400_000);
  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return 'This week';
  return 'Earlier';
}

export default function NotificationsPage() {
  const router = useRouter();
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const [tab, setTab] = React.useState<TabKey>('all');

  // Pin "now" to a fixed date so grouping is stable across renders
  const now = React.useMemo(() => new Date('2026-06-25T12:00:00'), []);

  const filtered = React.useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (tab === 'all') return sorted;
    if (tab === 'unread') return sorted.filter((n) => !n.read);
    return sorted.filter((n) => n.type === tab);
  }, [items, tab]);

  const grouped = React.useMemo(() => {
    const buckets: Record<Bucket, Notification[]> = {
      Today: [],
      Yesterday: [],
      'This week': [],
      Earlier: [],
    };
    for (const n of filtered) {
      buckets[bucketFor(n.createdAt, now)].push(n);
    }
    return buckets;
  }, [filtered, now]);

  const unreadCount = items.filter((n) => !n.read).length;

  const tabCount = (key: TabKey): number => {
    if (key === 'all') return items.length;
    if (key === 'unread') return items.filter((n) => !n.read).length;
    return items.filter((n) => n.type === key).length;
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="All updates across your cases, billing, and schedule."
        meta={
          <div className="flex flex-wrap items-center gap-1.5">
            {TABS.map((t) => {
              const active = tab === t.key;
              const count = tabCount(t.key);
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 h-7 text-xs font-medium transition-colors',
                    active
                      ? 'bg-primary-base text-text-white-0 border-primary-base'
                      : 'bg-bg-white-0 text-text-sub-600 border-stroke-soft-200 hover:border-stroke-sub-300 hover:text-text-strong-950',
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      'tabular-nums text-[10px] rounded-full px-1.5 h-4 inline-flex items-center',
                      active ? 'bg-white/20 text-text-white-0' : 'bg-bg-weak-50 text-text-sub-600',
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
          <Button
            variant="outline"
            size="md"
            onClick={() => markAllRead()}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4" />
            Mark all read
            {unreadCount > 0 && (
              <Badge tone="primary" variant="solid" size="sm" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </Button>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="No notifications"
          description="You're all caught up. New updates will appear here as they happen."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {(['Today', 'Yesterday', 'This week', 'Earlier'] as Bucket[]).map((bucket) => {
            const list = grouped[bucket];
            if (list.length === 0) return null;
            return (
              <div key={bucket} className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-label-sm font-semibold text-text-strong-950">
                    {bucket}
                  </h3>
                  <span className="text-xs text-text-sub-600 tabular-nums">
                    {list.length} {list.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0 divide-y divide-stroke-soft-200">
                  {list.map((n) => {
                    const meta = typeMeta[n.type];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markRead(n.id);
                          if (n.actionUrl) router.push(n.actionUrl);
                        }}
                        className={cn(
                          'group relative flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-bg-weak-25',
                          !n.read && 'bg-primary-lighter/30',
                        )}
                      >
                        <span
                          className={cn(
                            'absolute left-1.5 top-1/2 -translate-y-1/2 size-2 rounded-full transition-opacity',
                            n.read ? 'opacity-0' : 'bg-primary-base',
                          )}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-lg',
                            meta.bg,
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <div className="flex flex-1 flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={cn(
                                'text-sm text-text-strong-950 truncate',
                                !n.read ? 'font-semibold' : 'font-medium',
                              )}
                            >
                              {n.title}
                            </h4>
                            {n.caseId && (
                              <span className="text-[10px] font-medium tabular-nums text-text-sub-600 shrink-0">
                                {n.caseId}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-text-sub-600 line-clamp-2">
                            {n.body}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <Badge tone="neutral" variant="soft" size="sm" dot={false}>
                              {meta.label}
                            </Badge>
                            <span className="text-xs text-text-soft-400">
                              {formatRelative(n.createdAt)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}