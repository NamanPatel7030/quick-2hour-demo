import Link from 'next/link';
import {
  CalendarCheck,
  FileText,
  Handshake,
  Receipt,
  Plus,
  Upload,
  CreditCard,
  Send,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Bell,
  Calendar,
} from 'lucide-react';
import { KpiCard } from '@/components/portal/kpi-card';
import { PageHeader } from '@/components/portal/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Sparkline } from '@/components/portal/sparkline';
import { dannyKpis, recoveryTrend, statusMix, topModalities } from '@/data/kpis';
import { cases } from '@/data/cases';
import { clients } from '@/data/clients';
import { timelineForCase } from '@/data/timeline';
import { bills } from '@/data/bills';
import { toneForCase, toneForBill } from '@/lib/constants/status';
import { formatCurrency, formatRelative, greeting, formatDate } from '@/lib/format';
import { cn } from '@/utils/cn';

const actionButtons = [
  { label: 'New case', icon: Plus, href: '/attorney/cases', primary: true },
  { label: 'Upload RX', icon: Upload, href: '/attorney/documents' },
  { label: 'Submit bill offer', icon: Send, href: '/attorney/billing/offers' },
  { label: 'Make payment', icon: CreditCard, href: '/attorney/billing/payments' },
];

const timelineIcons: Record<string, React.ElementType> = {
  note: FileText,
  call: CalendarCheck,
  email: Send,
  status_change: AlertCircle,
  document: FileText,
  payment: CreditCard,
  signature: Handshake,
  system: Bell,
};

export default function OverviewPage() {
  const now = new Date('2026-06-25T10:30:00');
  const attention = cases.filter(
    (c) => ['Offer Received', 'Awaiting Signature', 'In Negotiation', 'Lien Pending'].includes(c.status),
  ).slice(0, 4);
  const inProgress = cases.filter(
    (c) => ['Records Received', 'Imaging Complete', 'Scheduled'].includes(c.status),
  ).slice(0, 4);
  const recent = cases.filter((c) => c.status === 'Paid' || c.status === 'Closed').slice(0, 2);

  const allTimeline = cases
    .flatMap((c) => timelineForCase(c.id).slice(0, 2).map((e) => ({ ...e, case: c })))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  const today = new Date('2026-06-25');
  const upcomingSchedule = [
    { caseId: 'CASE-2025-0003', clientId: 'cl_002', time: '09:30', modality: 'Brain MRI', facility: 'Westside Imaging' },
    { caseId: 'CASE-2025-0018', clientId: 'cl_003', time: '14:00', modality: 'EMG', facility: 'Austin Diagnostic' },
    { caseId: 'CASE-2025-0104', clientId: 'cl_005', time: '11:00', modality: 'Knee MRI', facility: 'Atlanta Imaging' },
    { caseId: 'CASE-2025-0098', clientId: 'cl_004', time: '16:30', modality: 'Cervical MRI', facility: 'Miami Imaging' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`${greeting(now)}, Danny 👋`}
        description={`Here's what's happening across your ${dannyKpis[0].value} active cases today, ${formatDate(today.toISOString(), 'long')}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {actionButtons.map((a) => {
              const Icon = a.icon;
              return (
                <Button
                  key={a.label}
                  asChild
                  variant={a.primary ? 'primary' : 'outline'}
                  size="md"
                >
                  <Link href={a.href}>
                    <Icon className="size-4" />
                    {a.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        }
      />

      {/* KPI strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dannyKpis.map((k) => (
          <KpiCard key={k.id} kpi={k} href={k.href} />
        ))}
      </section>

      {/* Priority + Schedule */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Priority queue</CardTitle>
              <Link
                href="/attorney/cases"
                className="text-xs font-medium text-primary-base hover:underline inline-flex items-center gap-1"
              >
                View all cases <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Column title="Needs your attention" tone="warning" count={attention.length}>
                {attention.map((c) => {
                  const client = clients.find((cl) => cl.id === c.clientId);
                  return (
                    <CaseCard key={c.id} caseData={c} clientName={client ? `${client.firstName} ${client.lastName}` : 'Unknown'} clientInitials={client?.initials ?? '??'} clientColor={client?.avatarColor ?? '#3D5AFE'} />
                  );
                })}
              </Column>
              <Column title="In progress" tone="info" count={inProgress.length}>
                {inProgress.map((c) => {
                  const client = clients.find((cl) => cl.id === c.clientId);
                  return (
                    <CaseCard key={c.id} caseData={c} clientName={client ? `${client.firstName} ${client.lastName}` : 'Unknown'} clientInitials={client?.initials ?? '??'} clientColor={client?.avatarColor ?? '#3D5AFE'} />
                  );
                })}
              </Column>
              <Column title="Recently completed" tone="success" count={recent.length}>
                {recent.map((c) => {
                  const client = clients.find((cl) => cl.id === c.clientId);
                  return (
                    <CaseCard key={c.id} caseData={c} clientName={client ? `${client.firstName} ${client.lastName}` : 'Unknown'} clientInitials={client?.initials ?? '??'} clientColor={client?.avatarColor ?? '#3D5AFE'} />
                  );
                })}
              </Column>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today&apos;s schedule</CardTitle>
              <span className="text-xs text-text-sub-600 tabular-nums">{upcomingSchedule.length} appts</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {upcomingSchedule.map((a) => {
                const client = clients.find((cl) => cl.id === a.clientId);
                return (
                  <Link
                    key={a.caseId}
                    href={`/attorney/cases/${a.caseId}`}
                    className="group flex items-start gap-3 rounded-lg border border-stroke-soft-200 p-3 hover:border-stroke-sub-300 hover:bg-bg-weak-25 transition-colors"
                  >
                    <div className="flex flex-col items-center w-12 shrink-0 rounded-md bg-primary-lighter text-primary-base py-1.5">
                      <span className="text-[9px] font-semibold uppercase tracking-wider">JUN</span>
                      <span className="text-base font-semibold tabular-nums">25</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3 text-text-soft-400" />
                        <span className="text-xs font-medium tabular-nums">{a.time}</span>
                        <span className="text-xs text-text-sub-600">·</span>
                        <span className="text-xs text-text-sub-600 truncate">{a.modality}</span>
                      </div>
                      <div className="mt-0.5 text-sm font-medium truncate">
                        {client?.firstName} {client?.lastName}
                      </div>
                      <div className="text-[11px] text-text-sub-600 truncate">{a.facility}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Activity + Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent activity</CardTitle>
              <Link
                href="/attorney/notifications"
                className="text-xs font-medium text-primary-base hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-stroke-soft-200" />
              <ul className="flex flex-col gap-3.5">
                {allTimeline.map((e) => {
                  const Icon = timelineIcons[e.type] ?? Bell;
                  return (
                    <li key={e.id} className="relative pl-9">
                      <span className="absolute left-0 top-0.5 flex size-7 items-center justify-center rounded-full bg-bg-white-0 border border-stroke-soft-200 text-text-sub-600">
                        <Icon className="size-3.5" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-text-strong-950 leading-tight line-clamp-1">{e.title}</span>
                        <span className="text-xs text-text-sub-600 leading-snug line-clamp-2">{e.description}</span>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-soft-400">
                          <Avatar initials={e.actor.initials} color="#94a3b8" size="xs" />
                          <span>{e.actor.name}</span>
                          <span>·</span>
                          <span>{formatRelative(e.at, now)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recovery trend</CardTitle>
              <Link href="/attorney/insights" className="text-xs font-medium text-primary-base hover:underline">
                Open analytics →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <RecoveryChart />
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Recovered (Jun)" value={formatCurrency(1842500, { compact: true })} sublabel="vs $17.6K last month" />
              <Stat label="Active cases" value="16" sublabel="+2 this month" />
              <Stat label="Avg time to paid" value="38d" sublabel="-4d vs Q1" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Column({
  title,
  tone,
  count,
  children,
}: {
  title: string;
  tone: 'warning' | 'info' | 'success';
  count: number;
  children: React.ReactNode;
}) {
  const toneClass = {
    warning: 'bg-warning-lighter text-warning-dark',
    info: 'bg-information-lighter text-information-dark',
    success: 'bg-success-lighter text-success-dark',
  }[tone];
  return (
    <div className="rounded-lg bg-bg-weak-25 p-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">{title}</span>
        <span className={cn('flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-semibold', toneClass)}>
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

function CaseCard({
  caseData,
  clientName,
  clientInitials,
  clientColor,
}: {
  caseData: (typeof cases)[number];
  clientName: string;
  clientInitials: string;
  clientColor: string;
}) {
  return (
    <Link
      href={`/attorney/cases/${caseData.id}`}
      className="group flex flex-col gap-1.5 rounded-md border border-stroke-soft-200 bg-bg-white-0 p-2.5 hover:border-stroke-sub-300 hover:shadow-[0_2px_6px_rgba(15,23,42,0.04)] transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar initials={clientInitials} color={clientColor} size="xs" />
          <span className="text-xs font-semibold truncate">{clientName}</span>
        </div>
        <StatusBadge status={caseData.status} tone={toneForCase(caseData.status)} />
      </div>
      <div className="text-[10px] text-text-sub-600 truncate tabular-nums">
        {caseData.id} · {caseData.injuryType}
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[10px] text-text-soft-400">{formatRelative(caseData.lastActivityAt, new Date('2026-06-25'))}</span>
        <span className="text-[10px] font-medium text-text-strong-950 tabular-nums">
          {formatCurrency(caseData.billedCents, { compact: true })}
        </span>
      </div>
    </Link>
  );
}

function Stat({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="rounded-lg border border-stroke-soft-200 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">{label}</div>
      <div className="mt-1 text-title-h6 font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-text-sub-600 mt-0.5">{sublabel}</div>
    </div>
  );
}

function RecoveryChart() {
  const W = 600;
  const H = 160;
  const padX = 24;
  const padY = 16;
  const xs = recoveryTrend.map((_, i) => padX + (i * (W - padX * 2)) / (recoveryTrend.length - 1));
  const maxV = Math.max(...recoveryTrend.flatMap((d) => [d.recovered, d.target]));
  const minV = Math.min(...recoveryTrend.flatMap((d) => [d.recovered, d.target]));
  const range = maxV - minV || 1;
  const yScale = (v: number) => H - padY - ((v - minV) / range) * (H - padY * 2);

  const recoveredPath = recoveryTrend
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${yScale(d.recovered)}`)
    .join(' ');
  const targetPath = recoveryTrend
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${yScale(d.target)}`)
    .join(' ');
  const areaPath = `${recoveredPath} L ${xs[xs.length - 1]} ${H - padY} L ${xs[0]} ${H - padY} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[160px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-base)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-primary-base)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0, 0.5, 1].map((p) => {
          const y = padY + p * (H - padY * 2);
          return <line key={p} x1={padX} y1={y} x2={W - padX} y2={y} stroke="var(--color-stroke-soft-200)" strokeWidth="1" />;
        })}
        <path d={areaPath} fill="url(#recoveryGradient)" />
        <path d={recoveredPath} fill="none" stroke="var(--color-primary-base)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={targetPath} fill="none" stroke="var(--color-text-soft-400)" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
        {recoveryTrend.map((d, i) => (
          <circle key={d.month} cx={xs[i]} cy={yScale(d.recovered)} r="3" fill="var(--color-primary-base)" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-text-soft-400 px-1">
        {recoveryTrend.map((d) => (
          <span key={d.month}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}