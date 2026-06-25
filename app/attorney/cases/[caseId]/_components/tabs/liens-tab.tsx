'use client';

import * as React from 'react';
import { Send, RefreshCw, Trash2, ShieldCheck, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { liensForCase } from '@/data/liens';
import { toneForLien } from '@/lib/constants/status';
import { formatCurrency, formatDate, formatRelative } from '@/lib/format';
import { toast } from 'sonner';

export function LiensTab({ caseId }: { caseId: string }) {
  const liens = liensForCase(caseId);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <CardTitle>Liens ({liens.length})</CardTitle>
              <span className="text-xs text-text-sub-600">
                Track and manage every lien signature in this case.
              </span>
            </div>
            <Button variant="primary" size="md">
              <Send className="size-4" />
              Send lien
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {liens.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stroke-soft-200 bg-bg-weak-25 p-10 text-center">
              <ShieldCheck className="mx-auto size-8 text-text-soft-400 mb-2" />
              <p className="text-sm text-text-sub-600">No liens for this case yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {liens.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-3 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums">{formatCurrency(l.amountCents)}</span>
                        <StatusBadge status={l.status} tone={toneForLien(l.status)} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-sub-600">
                        <Mail className="size-3" />
                        <span>{l.signerEmail}</span>
                      </div>
                      {l.signedAt && (
                        <div className="flex items-center gap-1.5 text-xs text-success-dark">
                          <ShieldCheck className="size-3" />
                          Signed {formatRelative(l.signedAt)}
                        </div>
                      )}
                      {l.status === 'Sent' && (
                        <div className="flex items-center gap-1.5 text-xs text-warning-dark">
                          <Clock className="size-3" />
                          Expires {formatRelative(l.expiresAt)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Signing link resent', { description: `Sent to ${l.signerEmail}` })}
                      >
                        <RefreshCw className="size-3.5" />
                        Resend
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast('Lien voided', { description: `${formatCurrency(l.amountCents)} lien voided` })}
                        className="text-error-base hover:bg-error-lighter"
                      >
                        <Trash2 className="size-3.5" />
                        Void
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}