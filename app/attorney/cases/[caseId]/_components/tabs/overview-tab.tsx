import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  UserCheck,
  FileText,
  Bell,
  Edit3,
  CheckCircle2,
  Gavel,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { findCase } from '@/data/cases';
import { findClient } from '@/data/clients';
import { getAttorneyById } from '@/lib/auth/lookup';
import { firmCaseManagers } from '@/data/firm';
import { documentsForCase } from '@/data/documents';
import { toneForCase } from '@/lib/constants/status';
import { formatDate, formatPhone } from '@/lib/format';
import { cn } from '@/utils/cn';

export function OverviewTab({ caseId }: { caseId: string }) {
  const caseData = findCase(caseId)!;
  const client = findClient(caseData.clientId)!;
  const attorney = getAttorneyById(caseData.attorneyId);
  const caseManager = firmCaseManagers.find((cm) => cm.id === caseData.caseManagerId);
  const docs = documentsForCase(caseId).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left column: claim details + attorney notes */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Claim details</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit3 className="size-3.5" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Detail label="Case ID" value={caseData.id} mono />
              <Detail label="Claim number" value={caseData.claimNumber} mono />
              <Detail label="Patient ID" value={caseData.patientMediflowId} mono />
              <Detail label="Date of injury" value={formatDate(caseData.dateOfInjury, 'medium')} />
              <Detail label="Injury type" value={caseData.injuryType} />
              <Detail label="Jurisdiction" value={caseData.state} />
              <Detail label="Financial type" value={caseData.financialType} />
              <Detail label="Liability cleared" value={caseData.liabilityCleared ? 'Yes' : 'Pending'} />
              <Detail label="Litigation" value={caseData.litigation ? 'Active' : 'Pre-litigation'} />
              <Detail label="Status" value={<StatusBadge status={caseData.status} tone={toneForCase(caseData.status)} />} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Insurance &amp; adjuster</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-stroke-soft-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="size-4 text-text-sub-600" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Carrier</span>
                </div>
                <div className="text-base font-semibold">{caseData.insuranceCarrier}</div>
                <div className="mt-3 text-xs text-text-sub-600">Claim #{caseData.claimNumber}</div>
              </div>
              <div className="rounded-lg border border-stroke-soft-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="size-4 text-text-sub-600" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Adjuster</span>
                </div>
                <div className="text-base font-semibold">{caseData.adjuster.name}</div>
                <div className="mt-2 flex flex-col gap-1 text-xs text-text-sub-600">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3" />
                    <a href={`mailto:${caseData.adjuster.email}`} className="hover:text-primary-base">{caseData.adjuster.email}</a>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3" />
                    {formatPhone(caseData.adjuster.phone)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attorney notes</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit3 className="size-3.5" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-bg-weak-25 p-4 text-sm leading-relaxed text-text-strong-950">
              Client retained {formatDate(caseData.dateOfInjury, 'long')}. Liability accepted {caseData.liabilityCleared ? 'in full' : 'is pending'}.
              {caseData.litigation && ' Litigation filed; trial date pending.'} Current focus:{' '}
              {caseData.status === 'In Negotiation' && 'Round ' + caseData.offersCount + ' of negotiations with carrier.'}
              {caseData.status === 'Awaiting Records' && 'Awaiting outstanding medical records from Pacific Imaging.'}
              {caseData.status === 'Records Received' && 'Records complete. Drafting demand letter.'}
              {caseData.status === 'Offer Received' && 'Reviewing carrier offer with client.'}
              {caseData.status === 'Pending Payment' && 'Settlement reached. Awaiting disbursement.'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column: case manager, contact preferences, recent uploads */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Case manager</CardTitle>
          </CardHeader>
          <CardContent>
            {caseManager && (
              <div className="flex items-center gap-3">
                <Avatar initials={caseManager.initials} color={caseManager.avatarColor} size="md" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{caseManager.fullName}</span>
                  <span className="text-xs text-text-sub-600">{caseManager.email}</span>
                  <span className="text-xs text-text-sub-600">{formatPhone(caseManager.phone)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned attorney</CardTitle>
          </CardHeader>
          <CardContent>
            {attorney && (
              <div className="flex items-center gap-3">
                <Avatar initials={attorney.initials} color={attorney.avatarColor} size="md" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{attorney.fullName}</span>
                  <span className="text-xs text-text-sub-600">{attorney.title}</span>
                  <span className="text-xs text-text-sub-600">Bar #{attorney.barNumber}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2 text-text-strong-950">
                <CheckCircle2 className="size-4 text-success-base" />
                Email · {client.email}
              </li>
              <li className="flex items-center gap-2 text-text-strong-950">
                <CheckCircle2 className="size-4 text-success-base" />
                Phone · {formatPhone(client.phone)}
              </li>
              <li className="flex items-center gap-2 text-text-strong-950">
                <CheckCircle2 className="size-4 text-success-base" />
                SMS opt-in
              </li>
              <li className="flex items-center gap-2 text-text-soft-400">
                <Bell className="size-4" />
                Mail — not preferred
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent uploads</CardTitle>
              <Link href={`/attorney/cases/${caseId}/documents`} className="text-xs font-medium text-primary-base hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2.5">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50 text-text-sub-600">
                    <FileText className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-xs font-medium truncate">{d.name}</span>
                    <span className="text-[11px] text-text-sub-600">{d.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">{label}</dt>
      <dd className={cn('text-sm text-text-strong-950', mono && 'font-mono tabular-nums')}>{value}</dd>
    </div>
  );
}