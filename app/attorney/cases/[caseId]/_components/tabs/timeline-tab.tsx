'use client';

import * as React from 'react';
import { FileText, Phone, Mail, AlertCircle, Send, CreditCard, Handshake, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { timelineForCase } from '@/data/timeline';
import { formatDate, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';

const typeMeta: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  note: { icon: FileText, color: 'bg-bg-weak-50 text-text-sub-600', label: 'Note' },
  call: { icon: Phone, color: 'bg-information-lighter text-information-dark', label: 'Call' },
  email: { icon: Mail, color: 'bg-primary-lighter text-primary-base', label: 'Email' },
  status_change: { icon: AlertCircle, color: 'bg-away-lighter text-away-dark', label: 'Status' },
  document: { icon: FileText, color: 'bg-feature-lighter text-feature-dark', label: 'Document' },
  payment: { icon: CreditCard, color: 'bg-success-lighter text-success-dark', label: 'Payment' },
  signature: { icon: Handshake, color: 'bg-verified-lighter text-verified-dark', label: 'Signature' },
  system: { icon: Bell, color: 'bg-faded-light text-text-sub-600', label: 'System' },
};

export function TimelineTab({ caseId }: { caseId: string }) {
  const events = timelineForCase(caseId);
  const [filter, setFilter] = React.useState<string>('all');

  const types = ['all', 'note', 'call', 'email', 'status_change', 'document', 'payment', 'signature'];
  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Case timeline</CardTitle>
          <div className="flex flex-wrap items-center gap-1.5">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors capitalize',
                  filter === t
                    ? 'bg-primary-base text-text-white-0'
                    : 'bg-bg-weak-50 text-text-sub-600 hover:bg-bg-weak-25',
                )}
              >
                {t === 'all' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-stroke-soft-200" />
          <ul className="flex flex-col gap-5">
            {filtered.map((e) => {
              const meta = typeMeta[e.type] ?? typeMeta.note;
              const Icon = meta.icon;
              return (
                <li key={e.id} className="relative pl-14">
                  <span className={cn('absolute left-0 top-0 flex size-10 items-center justify-center rounded-full ring-4 ring-bg-white-0', meta.color)}>
                    <Icon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-1 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{e.title}</span>
                        <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider', meta.color)}>
                          {meta.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-sub-600" title={formatDate(e.at, 'long')}>
                        {formatRelative(e.at)}
                      </span>
                    </div>
                    {e.description && (
                      <p className="text-sm text-text-sub-600 leading-relaxed">{e.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-text-soft-400 mt-0.5">
                      <Avatar initials={e.actor.initials} color="#94a3b8" size="xs" />
                      <span>{e.actor.name}</span>
                      <span>·</span>
                      <span>{formatDate(e.at, 'medium')}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}