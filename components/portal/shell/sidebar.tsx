'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Receipt,
  Handshake,
  CreditCard,
  Bell,
  LineChart,
  Building2,
  MapPin,
  UserCog,
  UserCheck,
  BellRing,
  ShieldCheck,
  ChevronLeft,
  LogOut,
  Keyboard,
  HelpCircle,
  User as UserIcon,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar.store';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { attorneyNav, userBottomNav } from '@/lib/constants/nav';
import { signOutAction } from '@/app/actions/auth';
import type { SessionData } from '@/types';

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Receipt,
  Handshake,
  CreditCard,
  Bell,
  LineChart,
  Building2,
  MapPin,
  UserCog,
  UserCheck,
  BellRing,
  ShieldCheck,
  User: UserIcon,
} as const;

interface SidebarProps {
  session: SessionData;
}

export function Sidebar({ session }: SidebarProps) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const pathname = usePathname();

  const width = collapsed ? 'w-[68px]' : 'w-[248px]';

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0F172A] text-white transition-[width] duration-200 ease-out',
          width,
          'border-r border-white/5',
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            'flex items-center h-16 border-b border-white/5 px-4',
            collapsed ? 'justify-center' : 'gap-2.5',
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-base to-[#7C3AED] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <span className="text-sm font-bold tracking-tight">M</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">Mediflow</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
                Attorney Portal
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {attorneyNav.map((section) => (
            <div key={section.section} className="mb-4">
              {!collapsed && (
                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {section.section}
                </div>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/attorney/overview' && pathname.startsWith(item.href));
                  const Icon = iconMap[item.icon as keyof typeof iconMap];

                  const link = (
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white',
                        collapsed && 'justify-center px-0',
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full bg-primary-base" />
                      )}
                      {Icon && <Icon className="size-4 shrink-0" />}
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <li key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  }
                  return <li key={item.href}>{link}</li>;
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-2">
          <ul className="flex flex-col gap-0.5">
            {userBottomNav.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? UserIcon;
              const isExternal = item.href.startsWith('#');
              const link = isExternal ? (
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
              if (collapsed) {
                return (
                  <li key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </li>
                );
              }
              return <li key={item.label}>{link}</li>;
            })}

            <li>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <LogOut className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">Sign out</span>}
                </button>
              </form>
            </li>
          </ul>

          {/* User card */}
          <div
            className={cn(
              'mt-2 flex items-center gap-2.5 rounded-lg p-2 hover:bg-white/5 transition-colors',
              collapsed && 'justify-center',
            )}
          >
            <Avatar
              initials={session.initials}
              color={session.avatarColor || '#3D5AFE'}
              size="sm"
            />
            {!collapsed && (
              <div className="flex flex-1 flex-col leading-tight min-w-0">
                <span className="text-xs font-semibold truncate">{session.fullName}</span>
                <span className="text-[10px] text-white/50 truncate">{session.email}</span>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={toggle}
                className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="size-3.5" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              onClick={toggle}
              className="mt-2 flex w-full items-center justify-center rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
              aria-label="Expand sidebar"
            >
              <ChevronLeft className="size-3.5 rotate-180" />
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}