'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { User as UserIcon, Settings, Keyboard, LogOut, Building2 } from 'lucide-react';
import { signOutAction } from '@/app/actions/auth';
import type { SessionData } from '@/types';

export function UserMenu({ session }: { session: SessionData }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2">
        <Avatar
          initials={session.initials || 'DR'}
          color={session.avatarColor || '#3D5AFE'}
          size="sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2.5 py-2 flex items-center gap-2.5">
          <Avatar
            initials={session.initials || 'DR'}
            color={session.avatarColor || '#3D5AFE'}
            size="md"
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold truncate">{session.fullName}</span>
            <span className="text-xs text-text-sub-600 truncate">{session.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/attorney/profile">
            <UserIcon />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/attorney/firm">
            <Building2 />
            Firm Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Keyboard />
          Keyboard Shortcuts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <button
            type="submit"
            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-error-base transition-colors hover:bg-error-lighter outline-none"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}