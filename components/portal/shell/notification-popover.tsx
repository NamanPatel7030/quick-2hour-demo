'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { notifications as allNotifications } from '@/data/notifications';
import { formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';
import { useNotificationStore } from '@/store/notifications.store';

const typeIcons: Record<string, string> = {
  case_update: 'ri-file-list-line',
  billing: 'ri-money-dollar-circle-line',
  signature: 'ri-quill-pen-line',
  schedule: 'ri-calendar-line',
  payment: 'ri-bank-card-line',
  lien: 'ri-file-shield-2-line',
  system: 'ri-information-line',
};

const typeColors: Record<string, string> = {
  case_update: 'bg-information-lighter text-information-dark',
  billing: 'bg-primary-lighter text-primary-base',
  signature: 'bg-away-lighter text-away-dark',
  schedule: 'bg-feature-lighter text-feature-base',
  payment: 'bg-success-lighter text-success-dark',
  lien: 'bg-warning-lighter text-warning-dark',
  system: 'bg-bg-weak-50 text-text-sub-600',
};

export function NotificationPopover() {
  const [open, setOpen] = React.useState(false);
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Notifications (${unreadCount} unread)`} className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-error-base text-[9px] font-bold text-white ring-2 ring-bg-white-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-stroke-soft-200 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-label-sm font-semibold">Notifications</span>
            <span className="text-xs text-text-sub-600">
              {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
            </span>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              leftIcon={<Check className="size-3.5" />}
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-text-sub-600">No notifications yet.</p>
            </div>
          ) : (
            items.slice(0, 8).map((n) => (
              <Link
                key={n.id}
                href={n.actionUrl ?? '/attorney/notifications'}
                onClick={() => {
                  if (!n.read) markRead(n.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 hover:bg-bg-weak-25 border-b border-stroke-soft-200 last:border-b-0 transition-colors',
                  !n.read && 'bg-primary-lighter/40',
                )}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg',
                    typeColors[n.type],
                  )}
                >
                  <i className={cn(typeIcons[n.type], 'text-base')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-text-strong-950 line-clamp-1">
                      {n.title}
                    </span>
                    {!n.read && <span className="size-2 shrink-0 mt-1.5 rounded-full bg-primary-base" />}
                  </div>
                  <p className="text-xs text-text-sub-600 line-clamp-2 mt-0.5">{n.body}</p>
                  <span className="text-[10px] text-text-soft-400 mt-1.5 inline-block">
                    {formatRelative(n.createdAt)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
        <Link
          href="/attorney/notifications"
          className="block border-t border-stroke-soft-200 px-4 py-3 text-center text-xs font-medium text-primary-base hover:bg-bg-weak-25"
          onClick={() => setOpen(false)}
        >
          View all notifications →
        </Link>
      </PopoverContent>
    </Popover>
  );
}