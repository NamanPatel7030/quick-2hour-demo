import type { Offer } from '@/types';

export const offers: Offer[] = [
  {
    id: 'ofr_001',
    caseId: 'CASE-2024-0142',
    clientName: 'Marcus Reyes',
    modality: 'Lumbar MRI',
    originalBilledCents: 285000,
    offers: [
      { by: 'Mediflow', amountCents: 285000, at: '2026-04-12T10:00:00Z', note: 'Initial bill submitted to State Farm.', status: 'Sent' },
      { by: 'Insurance', amountCents: 175000, at: '2026-04-29T15:11:00Z', note: 'State Farm initial offer — 61% of billed.', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 245000, at: '2026-05-08T09:00:00Z', note: 'Counter — fair market rate.', status: 'Rejected' },
      { by: 'Insurance', amountCents: 205000, at: '2026-05-22T14:11:00Z', note: 'Slight increase, still below acceptable.', status: 'Countered' },
      { by: 'Mediflow', amountCents: 215000, at: '2026-06-04T10:00:00Z', note: 'Holding firm — premium MRI w/ contrast.', status: 'Sent' },
    ],
    status: 'Open',
  },
  {
    id: 'ofr_002',
    caseId: 'CASE-2024-0142',
    clientName: 'Marcus Reyes',
    modality: 'Cervical MRI',
    originalBilledCents: 295000,
    offers: [
      { by: 'Mediflow', amountCents: 295000, at: '2026-04-14T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 180000, at: '2026-05-01T15:11:00Z', note: 'Standard carrier reduction.', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 250000, at: '2026-05-10T09:00:00Z', status: 'Rejected' },
      { by: 'Insurance', amountCents: 215000, at: '2026-06-08T14:11:00Z', note: 'Closest to demand.', status: 'Countered' },
      { by: 'Mediflow', amountCents: 220000, at: '2026-06-15T10:00:00Z', note: 'Final counter — pending acceptance.', status: 'Sent' },
    ],
    status: 'Open',
  },
  {
    id: 'ofr_003',
    caseId: 'CASE-2024-0142',
    clientName: 'Marcus Reyes',
    modality: 'EMG',
    originalBilledCents: 385000,
    offers: [
      { by: 'Mediflow', amountCents: 385000, at: '2026-04-22T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 250000, at: '2026-05-12T15:11:00Z', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 320000, at: '2026-05-20T09:00:00Z', status: 'Countered' },
      { by: 'Insurance', amountCents: 290000, at: '2026-06-10T14:11:00Z', note: 'Acceptable range.', status: 'Accepted' },
    ],
    status: 'Accepted',
  },
  {
    id: 'ofr_004',
    caseId: 'CASE-2025-0098',
    clientName: 'Sofia Marchetti',
    modality: 'Cervical MRI',
    originalBilledCents: 495000,
    offers: [
      { by: 'Mediflow', amountCents: 495000, at: '2026-06-09T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 325000, at: '2026-06-15T15:11:00Z', note: 'Standard U&C reduction.', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 425000, at: '2026-06-19T09:00:00Z', status: 'Countered' },
      { by: 'Insurance', amountCents: 380000, at: '2026-06-23T14:11:00Z', note: 'Final — pending Danny.', status: 'Countered' },
    ],
    status: 'Open',
  },
  {
    id: 'ofr_005',
    caseId: 'CASE-2025-0104',
    clientName: 'Devon Williams',
    modality: 'Knee MRI',
    originalBilledCents: 405000,
    offers: [
      { by: 'Mediflow', amountCents: 405000, at: '2026-06-15T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 250000, at: '2026-06-19T15:11:00Z', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 360000, at: '2026-06-22T09:00:00Z', status: 'Countered' },
      { by: 'Insurance', amountCents: 320000, at: '2026-06-24T11:17:00Z', note: 'Best and final.', status: 'Sent' },
    ],
    status: 'Open',
  },
  {
    id: 'ofr_006',
    caseId: 'CASE-2025-0156',
    clientName: 'Priya Shah',
    modality: 'Cervical MRI',
    originalBilledCents: 540000,
    offers: [
      { by: 'Mediflow', amountCents: 540000, at: '2026-06-19T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 380000, at: '2026-06-21T15:11:00Z', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 450000, at: '2026-06-22T09:00:00Z', status: 'Countered' },
      { by: 'Insurance', amountCents: 425000, at: '2026-06-22T15:11:00Z', status: 'Accepted' },
    ],
    status: 'Accepted',
  },
  {
    id: 'ofr_007',
    caseId: 'CASE-2025-0218',
    clientName: 'Mateo Gutierrez',
    modality: 'Lumbar MRI',
    originalBilledCents: 532000,
    offers: [
      { by: 'Mediflow', amountCents: 532000, at: '2026-06-12T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 300000, at: '2026-06-18T15:11:00Z', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 420000, at: '2026-06-22T09:00:00Z', status: 'Countered' },
      { by: 'Insurance', amountCents: 370000, at: '2026-06-24T07:02:00Z', status: 'Sent' },
    ],
    status: 'Open',
  },
  {
    id: 'ofr_008',
    caseId: 'CASE-2025-0129',
    clientName: 'Devon Williams',
    modality: 'CT Brain',
    originalBilledCents: 595000,
    offers: [
      { by: 'Mediflow', amountCents: 595000, at: '2026-06-17T10:00:00Z', status: 'Sent' },
      { by: 'Insurance', amountCents: 380000, at: '2026-06-19T15:11:00Z', status: 'Rejected' },
      { by: 'Mediflow', amountCents: 480000, at: '2026-06-21T09:00:00Z', status: 'Countered' },
      { by: 'Insurance', amountCents: 440000, at: '2026-06-22T15:09:00Z', status: 'Sent' },
    ],
    status: 'Stalled',
  },
];

export function offersForCase(caseId: string): Offer[] {
  return offers.filter((o) => o.caseId === caseId);
}