'use client';

import * as React from 'react';
import {
  UserCircle2,
  Mail,
  Phone,
  ShieldCheck,
  PenTool,
  Upload,
  Save,
  Camera,
  Plus,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { firmAttorneys } from '@/data/firm';
import { cn } from '@/utils/cn';

const danny = firmAttorneys.find((a) => a.id === 'aty_danny')!;

const ALL_STATES = [
  'CA', 'NY', 'TX', 'FL', 'GA', 'WA', 'MA', 'CO', 'NV', 'AZ', 'IL', 'PA',
];

export default function ProfilePage() {
  const [name, setName] = React.useState(danny.fullName);
  const [title, setTitle] = React.useState(danny.title);
  const [email, setEmail] = React.useState(danny.email);
  const [phone, setPhone] = React.useState(danny.phone);
  const [states, setStates] = React.useState<string[]>(danny.licensureStates);

  const toggleState = (s: string) => {
    setStates((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="pb-24">
      <PageHeader
        title="My Profile"
        description="Your personal information and preferences."
        meta={
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-sub-600">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success-base" />
              Profile complete
            </span>
            <span className="text-text-soft-400">·</span>
            <span>Signed in as <span className="text-text-strong-950 font-medium">{danny.email}</span></span>
          </div>
        }
      />

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-lighter text-primary-base">
                <UserCircle2 className="size-4" />
              </span>
              <div>
                <CardTitle>Photo & identity</CardTitle>
                <CardDescription>How you appear to clients and colleagues.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <Avatar initials={danny.initials} color={danny.avatarColor} size="2xl" />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-primary-base hover:bg-primary-lighter px-2 py-1"
              >
                <Camera className="size-3" />
                Change photo
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="profile-title">Title</Label>
                <Input
                  id="profile-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="profile-bar">Bar number</Label>
                <Input
                  id="profile-bar"
                  value={danny.barNumber}
                  readOnly
                  disabled
                  className="font-mono tabular-nums"
                />
                <span className="text-xs text-text-sub-600">
                  Bar number is managed by your firm administrator.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-information-lighter text-information-dark">
                <Mail className="size-4" />
              </span>
              <div>
                <CardTitle>Contact</CardTitle>
                <CardDescription>How clients and your team reach you.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="size-3.5" />}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="size-3.5" />}
              />
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
                <CardTitle>Licensure</CardTitle>
                <CardDescription>States where you're admitted to practice.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATES.map((s) => {
                const active = states.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleState(s)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-3 h-8 text-xs font-medium transition-colors',
                      active
                        ? 'bg-primary-base text-text-white-0 border-primary-base'
                        : 'bg-bg-white-0 text-text-sub-600 border-stroke-soft-200 hover:border-stroke-sub-300 hover:text-text-strong-950',
                    )}
                  >
                    {s}
                    {active && <X className="size-3" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-sub-600">
              <Plus className="size-3" />
              <span>
                Click a state to toggle licensure. CA, NY, TX are highlighted because they're
                your active admissions.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-warning-lighter text-warning-dark">
                <PenTool className="size-4" />
              </span>
              <div>
                <CardTitle>Signature</CardTitle>
                <CardDescription>Used on settlements and correspondence.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-stroke-soft-200 bg-bg-weak-25 px-6 py-12 text-center transition-colors hover:border-primary-base/50 hover:bg-primary-lighter/30">
              <span className="flex size-12 items-center justify-center rounded-full bg-bg-white-0 border border-stroke-soft-200 text-text-sub-600">
                <Upload className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-strong-950">
                  Drop your signature image here
                </p>
                <p className="text-xs text-text-sub-600">
                  PNG with transparent background, ideally 600×200
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="sm">
                  <Upload className="size-3.5" />
                  Upload signature
                </Button>
              </div>
              <div className="mt-4 w-full max-w-sm rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-text-soft-400">
                  Preview
                </div>
                <div className="mt-1 text-2xl italic text-text-strong-950" style={{ fontFamily: 'cursive' }}>
                  Danny Rackow
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-6 py-3 lg:pl-[280px]">
          <span className="text-xs text-text-sub-600">
            Changes to your profile are visible to your firm immediately.
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md">
              Cancel
            </Button>
            <Button variant="primary" size="md">
              <Save className="size-4" />
              Save profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}