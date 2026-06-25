'use client';

import * as React from 'react';
import Link from 'next/link';
import { Receipt, Send, CreditCard, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { billsForCase } from '@/data/bills';
import { offersForCase } from '@/data/offers';
import { findCase } from '@/data/cases';
import { toneForBill } from '@/lib/constants/status';
import { formatCurrency, formatDate, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';

export function BillingTab({ caseId }: { caseId: string }) {
  const bills = billsForCase(caseId);
  const offers = offersForCase(caseId);
  const caseData = findCase(caseId)!;
  const totalBilled = bills.reduce((s, b) => s + b.billedCents, 0);
  const totalNegotiated = bills.reduce((s, b) => s + (b.negotiatedCents ?? 0), 0);
  const totalPaid = bills.reduce((s, b) => s + b.insurancePaidCents, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <CardTitle>Bills ({bills.length})</CardTitle>
                <span className="text-xs text-text-sub-600 tabular-nums">
                  {formatCurrency(totalBilled)} billed · {formatCurrency(totalNegotiated)} negotiated · {formatCurrency(totalPaid)} paid
                </span>
              </div>
              <Button variant="primary" size="md">
                <Plus className="size-4" />
                Submit bill offer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-stroke-soft-200">
              <table className="w-full text-sm">
                <thead className="bg-bg-weak-25 border-b border-stroke-soft-200">
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
                    <th className="px-3 py-2.5 text-left">Bill ID</th>
                    <th className="px-3 py-2.5 text-left">Service</th>
                    <th className="px-3 py-2.5 text-left">Modality</th>
                    <th className="px-3 py-2.5 text-right">Billed</th>
                    <th className="px-3 py-2.5 text-right">Negotiated</th>
                    <th className="px-3 py-2.5 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id} className="border-b border-stroke-soft-200 last:border-b-0 hover:bg-bg-weak-25">
                      <td className="px-3 py-2.5 font-mono text-xs tabular-nums">{b.id}</td>
                      <td className="px-3 py-2.5 text-xs">{formatDate(b.serviceDate, 'medium')}</td>
                      <td className="px-3 py-2.5">
                        <div className="text-sm">{b.modality}</div>
                        <div className="text-[11px] text-text-sub-600">{b.bodyPart}</div>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(b.billedCents)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {b.negotiatedCents ? (
                          <span className="text-success-dark font-medium">{formatCurrency(b.negotiatedCents)}</span>
                        ) : (
                          <span className="text-text-soft-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={b.status} tone={toneForBill(b.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offer timeline */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Offer timeline</CardTitle>
              <span className="text-xs text-text-sub-600 tabular-nums">{offers.length}</span>
            </div>
          </CardHeader>
          <CardContent>
            {offers.length === 0 ? (
              <p className="text-sm text-text-sub-600 text-center py-6">No offers yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-stroke-soft-200" />
                <ul className="flex flex-col gap-4">
                  {offers.map((o) => (
                    <li key={o.id} className="relative pl-9">
                      <span className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full bg-primary-lighter text-primary-base ring-4 ring-bg-white-0">
                        <Receipt className="size-3.5" />
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{o.modality}</span>
                          <StatusBadge status={o.status} tone="primary" />
                        </div>
                        <div className="text-[11px] text-text-sub-600">
                          {formatCurrency(o.originalBilledCents)} original · {o.offers.length} round{o.offers.length !== 1 ? 's' : ''}
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {o.offers.map((off, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px]">
                              <span className="text-text-sub-600">
                                Round {i + 1} · {off.by}
                              </span>
                              <span className="tabular-nums font-medium">{formatCurrency(off.amountCents)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="md" className="w-full justify-start">
                <Send className="size-4" />
                Submit bill offer
              </Button>
              <Button variant="outline" size="md" className="w-full justify-start">
                <CreditCard className="size-4" />
                Make payment
              </Button>
              <Link href="/attorney/billing/offers" className="text-xs font-medium text-primary-base hover:underline self-center mt-2">
                View all offers →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}