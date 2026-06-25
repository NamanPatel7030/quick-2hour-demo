'use client';

import * as React from 'react';
import {
  Lock,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  LogOut,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  Globe,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

type Session = {
  id: string;
  device: string;
  icon: React.ElementType;
  location: string;
  ip: string;
  lastActive: string;
  current?: boolean;
};

const SESSIONS: Session[] = [
  {
    id: 's1',
    device: 'MacBook Pro · Chrome 138',
    icon: Laptop,
    location: 'San Francisco, CA',
    ip: '73.14.x.x',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 's2',
    device: 'iPhone 16 Pro · Safari',
    icon: Smartphone,
    location: 'San Francisco, CA',
    ip: '73.14.x.x',
    lastActive: '2h ago',
  },
  {
    id: 's3',
    device: 'iPad Air · Mediflow App',
    icon: Tablet,
    location: 'Los Angeles, CA',
    ip: '104.32.x.x',
    lastActive: 'Yesterday',
  },
  {
    id: 's4',
    device: 'Windows · Edge 138',
    icon: Monitor,
    location: 'Austin, TX',
    ip: '76.211.x.x',
    lastActive: '3d ago',
  },
];

function strengthScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'] as const;
const STRENGTH_TONES = ['bg-error-base', 'bg-error-base', 'bg-warning-base', 'bg-information-base', 'bg-success-base'] as const;

export default function SecurityPage() {
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showNext, setShowNext] = React.useState(false);
  const [twoFA, setTwoFA] = React.useState(true);

  const score = strengthScore(next);
  const matches = next.length > 0 && next === confirm;
  const canSave =
    current.length > 0 && next.length >= 8 && matches && score >= 2;

  return (
    <div className="pb-24">
      <PageHeader
        title="Security"
        description="Update your password and review your security settings."
        meta={
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-lighter px-2.5 h-6 text-success-dark">
              <ShieldCheck className="size-3" />
              Account secure
            </span>
            <span className="text-text-sub-600">Last login 2h ago from San Francisco</span>
          </div>
        }
      />

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-lighter text-primary-base">
                <KeyRound className="size-4" />
              </span>
              <div>
                <CardTitle>Change password</CardTitle>
                <CardDescription>
                  Use at least 8 characters with a mix of letters, numbers, and symbols.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="cur-pw">Current password</Label>
                <Input
                  id="cur-pw"
                  type="password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-pw">New password</Label>
                <div className="relative">
                  <Input
                    id="new-pw"
                    type={showNext ? 'text' : 'password'}
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    placeholder="Choose a new password"
                    leftIcon={<Lock className="size-3.5" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNext((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft-400 hover:text-text-strong-950"
                    aria-label={showNext ? 'Hide password' : 'Show password'}
                  >
                    {showNext ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-pw">Confirm new password</Label>
                <Input
                  id="confirm-pw"
                  type={showNext ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter the new password"
                  invalid={confirm.length > 0 && !matches}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-stroke-soft-200 bg-bg-weak-25 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-sub-600">Password strength</span>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    score <= 1 && 'text-error-dark',
                    score === 2 && 'text-warning-dark',
                    score === 3 && 'text-information-dark',
                    score === 4 && 'text-success-dark',
                  )}
                >
                  {next.length === 0 ? '—' : STRENGTH_LABELS[score]}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      i < score ? STRENGTH_TONES[score] : 'bg-bg-soft-200',
                    )}
                  />
                ))}
              </div>
              <ul className="mt-1 flex flex-col gap-1 text-xs text-text-sub-600">
                <li className={cn(next.length >= 8 ? 'text-success-dark' : '')}>
                  {next.length >= 8 ? '✓' : '·'} At least 8 characters
                </li>
                <li className={cn(/[A-Z]/.test(next) && /[a-z]/.test(next) ? 'text-success-dark' : '')}>
                  {/[A-Z]/.test(next) && /[a-z]/.test(next) ? '✓' : '·'} Mixed case letters
                </li>
                <li className={cn(/\d/.test(next) ? 'text-success-dark' : '')}>
                  {/\d/.test(next) ? '✓' : '·'} At least one number
                </li>
                <li className={cn(/[^A-Za-z0-9]/.test(next) ? 'text-success-dark' : '')}>
                  {/[^A-Za-z0-9]/.test(next) ? '✓' : '·'} At least one symbol
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="md">
                Cancel
              </Button>
              <Button variant="primary" size="md" disabled={!canSave}>
                <Save className="size-4" />
                Update password
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-success-lighter text-success-dark">
                <ShieldCheck className="size-4" />
              </span>
              <div>
                <CardTitle>Two-factor authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security with an authenticator app.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-strong-950">
                  Authenticator app (TOTP)
                </span>
                <StatusBadge
                  status={twoFA ? 'Enabled' : 'Disabled'}
                  tone={twoFA ? 'success' : 'neutral'}
                />
              </div>
              <span className="text-xs text-text-sub-600">
                {twoFA
                  ? 'Codes generated by Authy, 1Password, or Google Authenticator.'
                  : 'Enable to require a code at sign-in.'}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {twoFA && (
                <Button variant="outline" size="sm">
                  View backup codes
                </Button>
              )}
              <Switch checked={twoFA} onCheckedChange={setTwoFA} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-information-lighter text-information-dark">
                <Globe className="size-4" />
              </span>
              <div>
                <CardTitle>Recent sessions</CardTitle>
                <CardDescription>
                  Devices that have recently signed in to your account.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-stroke-soft-200">
              {SESSIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          'flex size-9 items-center justify-center rounded-lg shrink-0',
                          s.current
                            ? 'bg-success-lighter text-success-dark'
                            : 'bg-bg-weak-50 text-text-sub-600',
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-strong-950 truncate">
                            {s.device}
                          </span>
                          {s.current && (
                            <Badge tone="primary" size="sm" dot>
                              This device
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-text-sub-600">
                          {s.location} · IP {s.ip} · {s.lastActive}
                        </span>
                      </div>
                    </div>
                    {!s.current && (
                      <Button variant="ghost" size="sm">
                        <LogOut className="size-3.5" />
                        Sign out
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}