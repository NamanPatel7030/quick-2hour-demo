'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BreadcrumbNav } from '@/components/portal/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import { NotificationPopover } from './notification-popover';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';
import { CommandPalette } from './command-palette';
import { pathoraFirm } from '@/data/firm';
import type { SessionData } from '@/types';

const crumbMap: Record<string, { label: string; href?: string }[]> = {
  '/attorney/overview': [{ label: 'Overview' }],
  '/attorney/cases': [{ label: 'Cases', href: '/attorney/cases' }],
  '/attorney/clients': [{ label: 'Clients', href: '/attorney/clients' }],
  '/attorney/documents': [{ label: 'Documents' }],
  '/attorney/billing': [{ label: 'Billing' }],
  '/attorney/billing/offers': [
    { label: 'Billing', href: '/attorney/billing' },
    { label: 'Offers' },
  ],
  '/attorney/billing/payments': [
    { label: 'Billing', href: '/attorney/billing' },
    { label: 'Payments' },
  ],
  '/attorney/notifications': [{ label: 'Notifications' }],
  '/attorney/insights': [{ label: 'Analytics' }],
  '/attorney/firm': [{ label: 'Firm', href: '/attorney/firm' }],
  '/attorney/firm/locations': [
    { label: 'Firm', href: '/attorney/firm' },
    { label: 'Locations' },
  ],
  '/attorney/firm/team': [
    { label: 'Firm', href: '/attorney/firm' },
    { label: 'Team' },
  ],
  '/attorney/firm/staff': [
    { label: 'Firm', href: '/attorney/firm' },
    { label: 'Staff' },
  ],
  '/attorney/firm/notifications': [
    { label: 'Firm', href: '/attorney/firm' },
    { label: 'Preferences' },
  ],
  '/attorney/firm/security': [
    { label: 'Firm', href: '/attorney/firm' },
    { label: 'Security' },
  ],
  '/attorney/profile': [{ label: 'My Profile' }],
};

function buildCrumbs(pathname: string) {
  if (pathname.startsWith('/attorney/cases/')) {
    const id = pathname.split('/')[3];
    return [
      { label: 'Cases', href: '/attorney/cases' },
      { label: id ?? 'Case' },
    ];
  }
  if (pathname.startsWith('/attorney/clients/')) {
    const id = pathname.split('/')[3];
    return [
      { label: 'Clients', href: '/attorney/clients' },
      { label: id ?? 'Client' },
    ];
  }
  return crumbMap[pathname] ?? [{ label: 'Mediflow' }];
}

export function Topbar({ session }: { session: SessionData }) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-md px-6">
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <BreadcrumbNav items={crumbs} />
          <span className="hidden lg:inline-flex text-xs text-text-sub-600 px-2 py-0.5 rounded-full bg-bg-weak-50 border border-stroke-soft-200">
            {pathoraFirm.shortName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaletteOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 text-text-sub-600 pr-2"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" />
            <span>Search...</span>
            <kbd className="ml-2 rounded border border-stroke-soft-200 bg-bg-weak-50 px-1.5 h-5 inline-flex items-center text-[10px] font-medium text-text-sub-600">
              ⌘K
            </kbd>
          </Button>

          <ThemeToggle />
          <NotificationPopover />
          <UserMenu session={session} />
        </div>
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}