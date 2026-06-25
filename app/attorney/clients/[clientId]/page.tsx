import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Plus,
  Briefcase,
  ShieldCheck,
  StickyNote,
  Calendar,
  MapPin,
  FileText,
  Send,
  CreditCard,
  Handshake,
  AlertCircle,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/portal/empty-state';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { findClient } from '@/data/clients';
import { casesForClient } from '@/data/cases';
import { timelineForCase } from '@/data/timeline';
import { getAttorneyById } from '@/lib/auth/lookup';
import { toneForCase } from '@/lib/constants/status';
import { formatCurrency, formatDate, formatPhone, formatRelative } from '@/lib/format';
import { cn } from '@/utils/cn';

const timelineIcons: Record<string, React.ElementType> = {
  note: FileText,
  call: Phone,
  email: Send,
  status_change: AlertCircle,
  document: FileText,
  payment: CreditCard,
  signature: Handshake,
  system: Bell,
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = findClient(clientId);
  if (!client) notFound();

  const clientCases = casesForClient(clientId);
  const totalBilledCents = clientCases.reduce(
    (sum, c) => sum + c.billedCents,
    0,
  );
  const totalPaidCents = clientCases.reduce(
    (sum, c) => sum + c.paidCents,
    0,
  );

  // Timeline: first 5 events across this client's cases, sorted desc
  const timeline = clientCases
    .flatMap((c) => timelineForCase(c.id).map((e) => ({ ...e, caseId: c.id })))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5);

  const attorney = clientCases[0] ? getAttorneyById(clientCases[0].attorneyId) : undefined;
  const now = new Date('2026-06-25T10:30:00');

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link
          href="/attorney/clients"
          className="inline-flex items-center gap-1 text-xs font-medium text-text-sub-600 hover:text-text-strong-950"
        >
          <ArrowLeft className="size-3" />
          Back to all clients
        </Link>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                initials={client.initials}
                color={client.avatarColor}
                size="xl"
              />
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-title-h4 font-semibold tracking-tight">
                    {client.firstName} {client.lastName}
                  </h1>
                  <StatusBadge
                    status={client.status}
                    tone={client.status === 'Active' ? 'success' : 'neutral'}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-sub-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {client.email}
                  </span>
                  <span className="text-text-soft-400">·</span>
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <Phone className="size-3.5" />
                    {formatPhone(client.phone)}
                  </span>
                  <span className="text-text-soft-400">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {client.city}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="md">
                <Mail className="size-4" />
                Email
              </Button>
              <Button variant="outline" size="md">
                <Phone className="size-4" />
                Call
              </Button>
              <Button variant="primary" size="md">
                <Plus className="size-4" />
                New case
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile
          label="Total cases"
          value={client.caseCount.toString()}
          sublabel={`${clientCases.filter((c) => c.status !== 'Closed' && c.status !== 'Paid').length} active`}
          tone="info"
        />
        <StatTile
          label="Open balance"
          value={formatCurrency(client.openBalanceCents, { compact: true })}
          sublabel={client.openBalanceCents === 0 ? 'Paid in full' : 'Awaiting payment'}
          tone={client.openBalanceCents === 0 ? 'success' : 'warning'}
        />
        <StatTile
          label="Total billed"
          value={formatCurrency(totalBilledCents, { compact: true })}
          sublabel={formatCurrency(totalPaidCents, { compact: true }) + ' collected'}
          tone="primary"
        />
        <StatTile
          label="Status"
          value={client.status}
          sublabel={client.status === 'Active' ? 'Engagement open' : 'File closed'}
          tone={client.status === 'Active' ? 'success' : 'neutral'}
        />
      </section>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Cases ({clientCases.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal info</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <Field label="Date of birth" value={formatDate(client.dob, 'long')} />
                    <Field label="Phone" value={formatPhone(client.phone)} />
                    <Field label="Email" value={client.email} />
                    <Field label="City" value={client.city} />
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insurance information</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientCases[0] ? (
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <Field label="Primary carrier" value={clientCases[0].insuranceCarrier} />
                      <Field label="Claim number" value={clientCases[0].claimNumber} mono />
                      <Field label="Adjuster" value={clientCases[0].adjuster.name} />
                      <Field
                        label="Adjuster email"
                        value={clientCases[0].adjuster.email}
                      />
                    </dl>
                  ) : (
                    <p className="text-sm text-text-sub-600">
                      No insurance information on file yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Notes</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Plus className="size-3.5" />
                      Add note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <NoteItem
                      author="Danny Rackow"
                      initials="DR"
                      at="2026-06-20T15:42:00Z"
                      body={`Client confirmed availability for upcoming cervical MRI. ${client.firstName} asked about timeline for lien packet.`}
                    />
                    <NoteItem
                      author="Jessica Marquez"
                      initials="JM"
                      at="2026-06-12T11:08:00Z"
                      body={`Sent intake forms and records request to ${client.firstName}. Followed up by phone on 6/14.`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent activity</CardTitle>
                    <span className="text-xs text-text-sub-600 tabular-nums">
                      {timeline.length} events
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-stroke-soft-200" />
                    <ul className="flex flex-col gap-4">
                      {timeline.length === 0 ? (
                        <li className="pl-9 text-sm text-text-sub-600">
                          No activity yet.
                        </li>
                      ) : (
                        timeline.map((e) => {
                          const Icon = timelineIcons[e.type] ?? Bell;
                          return (
                            <li key={e.id} className="relative pl-9">
                              <span className="absolute left-0 top-0.5 flex size-7 items-center justify-center rounded-full bg-bg-white-0 border border-stroke-soft-200 text-text-sub-600">
                                <Icon className="size-3.5" />
                              </span>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-text-strong-950 leading-tight line-clamp-1">
                                  {e.title}
                                </span>
                                {e.description && (
                                  <span className="text-xs text-text-sub-600 leading-snug line-clamp-2">
                                    {e.description}
                                  </span>
                                )}
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-soft-400">
                                  <Avatar
                                    initials={e.actor.initials}
                                    color="#94a3b8"
                                    size="xs"
                                  />
                                  <span>{e.actor.name}</span>
                                  <span>·</span>
                                  <span>{formatRelative(e.at, now)}</span>
                                </div>
                              </div>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assigned attorney</CardTitle>
                </CardHeader>
                <CardContent>
                  {attorney ? (
                    <div className="flex items-start gap-3">
                      <Avatar
                        initials={attorney.initials}
                        color={attorney.avatarColor}
                        size="md"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-text-strong-950">
                          {attorney.fullName}
                        </span>
                        <span className="text-xs text-text-sub-600">
                          {attorney.title}
                        </span>
                        <span className="mt-1 text-xs text-text-sub-600 tabular-nums">
                          Bar #{attorney.barNumber}
                        </span>
                        <a
                          href={`mailto:${attorney.email}`}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-primary-base hover:underline"
                        >
                          <Mail className="size-3" />
                          {attorney.email}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-text-sub-600">No attorney assigned.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Cases */}
        <TabsContent value="cases">
          <Card>
            <CardContent className="p-0">
              {clientCases.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={<Briefcase className="size-5" />}
                    title="No cases yet"
                    description="Create a new case to start tracking imaging, billing, and liens."
                    action={{ label: 'New case', href: '/attorney/cases' }}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stroke-soft-200 bg-bg-weak-25">
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
                          Case ID
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
                          Injury
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
                          Status
                        </th>
                        <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
                          Billed
                        </th>
                        <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
                          Last activity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientCases.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-stroke-soft-200 last:border-b-0 hover:bg-bg-weak-25 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/attorney/cases/${c.id}`}
                              className="font-medium text-text-strong-950 tabular-nums hover:text-primary-base"
                            >
                              {c.id}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-text-sub-600">{c.injuryType}</td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              status={c.status}
                              tone={toneForCase(c.status)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium">
                            {formatCurrency(c.billedCents, { compact: true })}
                          </td>
                          <td className="px-4 py-3 text-xs text-text-sub-600">
                            {formatRelative(c.lastActivityAt, now)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholders */}
        {(['documents', 'billing', 'notes', 'profile'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <EmptyState
              icon={
                tab === 'documents' ? (
                  <FileText className="size-5" />
                ) : tab === 'billing' ? (
                  <CreditCard className="size-5" />
                ) : tab === 'notes' ? (
                  <StickyNote className="size-5" />
                ) : (
                  <ShieldCheck className="size-5" />
                )
              }
              title={`${tab.charAt(0).toUpperCase() + tab.slice(1)} coming soon`}
              description={`The ${tab} workspace for this client is on the roadmap. Stay tuned for updates.`}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
        {label}
      </dt>
      <dd
        className={cn(
          'mt-1 text-sm text-text-strong-950',
          mono && 'tabular-nums',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function NoteItem({
  author,
  initials,
  at,
  body,
}: {
  author: string;
  initials: string;
  at: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-stroke-soft-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar initials={initials} color="#94a3b8" size="xs" />
          <span className="text-sm font-semibold text-text-strong-950">{author}</span>
        </div>
        <span className="text-[11px] text-text-soft-400 inline-flex items-center gap-1">
          <Calendar className="size-3" />
          {formatRelative(at)}
        </span>
      </div>
      <p className="mt-2 text-sm text-text-sub-600 leading-relaxed">{body}</p>
    </div>
  );
}

function StatTile({
  label,
  value,
  sublabel,
  tone,
}: {
  label: string;
  value: string;
  sublabel: string;
  tone: 'info' | 'success' | 'warning' | 'primary' | 'neutral';
}) {
  const toneMap: Record<string, string> = {
    info: 'bg-information-lighter text-information-dark',
    success: 'bg-success-lighter text-success-dark',
    warning: 'bg-warning-lighter text-warning-dark',
    primary: 'bg-primary-lighter text-primary-base',
    neutral: 'bg-bg-weak-50 text-text-sub-600',
  };
  return (
    <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
          {label}
        </span>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium',
            toneMap[tone],
          )}
        >
          <CheckCircle2 className="size-3 mr-0.5" />
          {tone === 'success' ? 'OK' : tone === 'warning' ? 'Open' : 'Active'}
        </span>
      </div>
      <div className="mt-2 text-title-h5 font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-text-sub-600">{sublabel}</div>
    </div>
  );
}