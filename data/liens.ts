import type { Lien } from '@/types';

export const liens: Lien[] = [
  {
    id: 'ln_001',
    caseId: 'CASE-2024-0142',
    clientName: 'Marcus Reyes',
    amountCents: 1245000,
    status: 'Signed',
    signerName: 'Marcus Reyes',
    signerEmail: 'marcus.reyes@example.com',
    sentAt: '2025-11-12T10:00:00Z',
    expiresAt: '2025-11-19T10:00:00Z',
    signedAt: '2025-11-15T11:11:00Z',
  },
  {
    id: 'ln_002',
    caseId: 'CASE-2025-0098',
    clientName: 'Sofia Marchetti',
    amountCents: 1098000,
    status: 'Sent',
    signerName: 'Sofia Marchetti',
    signerEmail: 'sofia.m@example.com',
    sentAt: '2026-06-23T14:00:00Z',
    expiresAt: '2026-06-30T14:00:00Z',
  },
  {
    id: 'ln_003',
    caseId: 'CASE-2025-0071',
    clientName: 'Liam Chen',
    amountCents: 612000,
    status: 'Sent',
    signerName: 'Liam Chen',
    signerEmail: 'liam.chen@example.com',
    sentAt: '2026-06-23T14:08:00Z',
    expiresAt: '2026-06-30T14:08:00Z',
  },
  {
    id: 'ln_004',
    caseId: 'CASE-2025-0218',
    clientName: 'Mateo Gutierrez',
    amountCents: 1612000,
    status: 'Draft',
    signerName: 'Mateo Gutierrez',
    signerEmail: 'mateo.g@example.com',
    sentAt: '2026-06-24T08:00:00Z',
    expiresAt: '2026-07-01T08:00:00Z',
  },
  {
    id: 'ln_005',
    caseId: 'CASE-2025-0044',
    clientName: 'Liam Chen',
    amountCents: 820000,
    status: 'Void',
    signerName: '—',
    signerEmail: '—',
    sentAt: '2026-03-15T08:00:00Z',
    expiresAt: '2026-03-22T08:00:00Z',
  },
];

export function liensForCase(caseId: string): Lien[] {
  return liens.filter((l) => l.caseId === caseId);
}