import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Download,
  Send,
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  CircleDot,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/page-header';
import { CaseWorkspaceTabs } from './_components/case-workspace-tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Sparkline } from '@/components/portal/sparkline';
import { findCase } from '@/data/cases';
import { findClient } from '@/data/clients';
import { getAttorneyById } from '@/lib/auth/lookup';
import { firmCaseManagers } from '@/data/firm';
import { toneForCase } from '@/lib/constants/status';
import { formatCurrency, formatDate, formatPhone, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';

export default async function CaseWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ caseId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { caseId } = await params;
  const { tab } = await searchParams;
  const caseData = findCase(caseId);
  if (!caseData) notFound();

  const client = findClient(caseData.clientId);
  if (!client) notFound();
  const attorney = getAttorneyById(caseData.attorneyId);
  const caseManager = firmCaseManagers.find((cm) => cm.id === caseData.caseManagerId);
  const outstanding = caseData.billedCents - caseData.paidCents;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/attorney/cases"
          className="inline-flex items-center gap-1 text-xs font-medium text-text-sub-600 hover:text-text-strong-950 mb-2"
        >
          <ArrowLeft className="size-3" />
          Back to all cases
        </Link>
      </div>

      {/* Summary card */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar initials={client.initials} color={client.avatarColor} size="xl" />
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-title-h4 font-semibold tracking-tight">
                    {client.firstName} {client.lastName}
                  </h1>
                  <StatusBadge status={caseData.status} tone={toneForCase(caseData.status)} />
                </div>
                <div className="flex items-center gap-2 text-sm text-text-sub-600 tabular-nums">
                  <span>{caseData.id}</span>
                  <span>·</span>
                  <span>{caseData.claimNumber}</span>
                  <span>·</span>
                  <span>{caseData.injuryType}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-soft-400">
                  <span>DOI {formatDate(caseData.dateOfInjury, 'medium')}</span>
                  <span>·</span>
                  <span>{caseData.insuranceCarrier}</span>
                  <span>·</span>
                  <span>{caseData.state}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="md">
                <Phone className="size-4" />
                Call
              </Button>
              <Button variant="outline" size="md">
                <Mail className="size-4" />
                Email
              </Button>
              <Button variant="outline" size="md">
                <MessageSquare className="size-4" />
                Message
              </Button>
              <Button variant="primary" size="md">
                <Plus className="size-4" />
                Add note
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-stroke-soft-200">
            <Stat label="Billed" value={formatCurrency(caseData.billedCents)} sublabel="3 active bills" />
            <Stat label="Paid" value={formatCurrency(caseData.paidCents)} sublabel={caseData.paidCents > 0 ? 'Completed' : 'Pending'} tone={caseData.paidCents > 0 ? 'positive' : 'muted'} />
            <Stat label="Outstanding" value={formatCurrency(outstanding)} sublabel={`${caseData.offersCount} offers`} tone={outstanding > 0 ? 'default' : 'muted'} />
            <Stat label="Documents" value={caseData.documentsCount.toString()} sublabel={`${caseData.offersCount} offer rounds`} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <CaseWorkspaceTabs caseId={caseData.id} initialTab={tab ?? 'overview'} />
    </div>
  );
}

function Stat({
  label,
  value,
  sublabel,
  tone = 'default',
}: {
  label: string;
  value: string;
  sublabel: string;
  tone?: 'default' | 'positive' | 'negative' | 'muted';
}) {
  return (
    <div className="px-6 py-4 border-r border-stroke-soft-200 last:border-r-0">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">{label}</div>
      <div
        className={cn(
          'mt-1 text-title-h5 font-semibold tabular-nums',
          tone === 'positive' && 'text-success-dark',
          tone === 'negative' && 'text-error-base',
          tone === 'muted' && 'text-text-soft-400',
          tone === 'default' && 'text-text-strong-950',
        )}
      >
        {value}
      </div>
      <div className="text-[11px] text-text-sub-600 mt-0.5">{sublabel}</div>
    </div>
  );
}