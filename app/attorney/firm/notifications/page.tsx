'use client';

import * as React from 'react';
import { Mail, Bell, Plus, X, Save } from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

type EventDef = {
  id: string;
  name: string;
  description: string;
  defaults: {
    attorneyEmail: boolean;
    caseManagerEmail: boolean;
    ccEmails: string[];
    faxMe: boolean;
    ccFaxes: string[];
  };
};

const EVENTS: EventDef[] = [
  {
    id: 'imaging-scheduled',
    name: 'Imaging scheduled',
    description: 'Sent when a new appointment is booked for a client.',
    defaults: { attorneyEmail: true, caseManagerEmail: true, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
  {
    id: 'imaging-completed',
    name: 'Imaging completed',
    description: 'Sent when the imaging facility reports a completed scan.',
    defaults: { attorneyEmail: true, caseManagerEmail: true, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
  {
    id: 'bill-submitted',
    name: 'Bill submitted',
    description: 'Sent when a bill is submitted to insurance or the client.',
    defaults: { attorneyEmail: true, caseManagerEmail: true, ccEmails: [], faxMe: true, ccFaxes: [] },
  },
  {
    id: 'offer-received',
    name: 'Negotiation offer received',
    description: 'Sent when an insurance carrier or counterparty responds with an offer.',
    defaults: { attorneyEmail: true, caseManagerEmail: false, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
  {
    id: 'offer-accepted',
    name: 'Negotiation offer accepted',
    description: 'Sent when an offer is accepted and the bill is closed.',
    defaults: { attorneyEmail: true, caseManagerEmail: true, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
  {
    id: 'payment-received',
    name: 'Payment received',
    description: 'Sent when a payment posts to your account.',
    defaults: { attorneyEmail: true, caseManagerEmail: true, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
  {
    id: 'lien-signature',
    name: 'Lien signature requested',
    description: 'Sent when a lien is sent to a client for signature.',
    defaults: { attorneyEmail: true, caseManagerEmail: true, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
  {
    id: 'case-status',
    name: 'Case status changed',
    description: 'Sent whenever a case moves to a new status (e.g. Records Received, In Negotiation).',
    defaults: { attorneyEmail: false, caseManagerEmail: true, ccEmails: [], faxMe: false, ccFaxes: [] },
  },
];

function TagInput({
  values,
  onChange,
  placeholder,
  max = 3,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  max?: number;
}) {
  const [draft, setDraft] = React.useState('');
  const canAdd = values.length < max && draft.trim().length > 0;

  const add = () => {
    const v = draft.trim();
    if (!v || values.length >= max) return;
    onChange([...values, v]);
    setDraft('');
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 focus-within:border-primary-base focus-within:ring-2 focus-within:ring-primary-base/30">
      {values.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 rounded-md bg-primary-lighter px-2 py-0.5 text-xs text-primary-base"
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((x) => x !== v))}
            className="rounded-sm hover:bg-primary-light"
            aria-label={`Remove ${v}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
            onChange(values.slice(0, -1));
          }
        }}
        placeholder={values.length >= max ? `Max ${max}` : placeholder}
        disabled={values.length >= max}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none disabled:cursor-not-allowed"
      />
      {canAdd && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-md text-xs text-primary-base hover:bg-primary-lighter px-1.5 py-0.5"
        >
          <Plus className="size-3" />
          Add
        </button>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-text-strong-950">{label}</span>
        {description && (
          <span className="text-xs text-text-sub-600">{description}</span>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function NotificationPreferencesPage() {
  const [state, setState] = React.useState<
    Record<string, EventDef['defaults']>
  >(() => Object.fromEntries(EVENTS.map((e) => [e.id, e.defaults])));

  const update = (id: string, patch: Partial<EventDef['defaults']>) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  return (
    <div className="pb-24">
      <PageHeader
        title="Preferences"
        description="Choose how and when you're notified about case updates."
        meta={
          <div className="flex items-center gap-2 text-xs text-text-sub-600">
            <Bell className="size-3.5 text-text-soft-400" />
            <span>
              <span className="tabular-nums font-medium text-text-strong-950">
                {Object.values(state).filter((s) => s.attorneyEmail).length}
              </span>{' '}
              of{' '}
              <span className="tabular-nums">{EVENTS.length}</span> event types will email you
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-4">
        {EVENTS.map((ev) => {
          const s = state[ev.id];
          return (
            <Card key={ev.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle>{ev.name}</CardTitle>
                    <CardDescription className="mt-0.5">{ev.description}</CardDescription>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 h-5 text-[10px] font-medium shrink-0',
                      s.attorneyEmail
                        ? 'bg-primary-lighter text-primary-base'
                        : 'bg-bg-weak-50 text-text-soft-400',
                    )}
                  >
                    <Mail className="size-3" />
                    {s.attorneyEmail ? 'Active' : 'Off'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 divide-y divide-stroke-soft-200">
                <ToggleRow
                  label="Email me when I'm the attorney on the case"
                  checked={s.attorneyEmail}
                  onCheckedChange={(v) => update(ev.id, { attorneyEmail: v })}
                />
                <ToggleRow
                  label="Email my case manager"
                  description="The case manager assigned to this case receives a copy."
                  checked={s.caseManagerEmail}
                  onCheckedChange={(v) => update(ev.id, { caseManagerEmail: v })}
                />
                <div className="py-2 flex flex-col gap-2">
                  <Label htmlFor={`cc-email-${ev.id}`} className="text-xs text-text-sub-600">
                    CC additional emails (up to 3)
                  </Label>
                  <TagInput
                    values={s.ccEmails}
                    onChange={(v) => update(ev.id, { ccEmails: v })}
                    placeholder="name@example.com and press Enter"
                  />
                </div>
                <ToggleRow
                  label="Fax me"
                  description="We will send a fax to your primary fax number."
                  checked={s.faxMe}
                  onCheckedChange={(v) => update(ev.id, { faxMe: v })}
                />
                <div className="py-2 flex flex-col gap-2">
                  <Label htmlFor={`cc-fax-${ev.id}`} className="text-xs text-text-sub-600">
                    CC additional fax numbers (up to 3)
                  </Label>
                  <TagInput
                    values={s.ccFaxes}
                    onChange={(v) => update(ev.id, { ccFaxes: v })}
                    placeholder="+1 (555) 123-4567 and press Enter"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-6 py-3 lg:pl-[280px]">
          <span className="text-xs text-text-sub-600">
            Changes apply to all new events going forward.
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md">
              Reset to defaults
            </Button>
            <Button variant="primary" size="md">
              <Save className="size-4" />
              Save preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}