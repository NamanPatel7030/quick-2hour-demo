import type { TimelineEvent } from '@/types';

export const timelineEvents: TimelineEvent[] = [
  // CASE-2024-0142 (Marcus Reyes)
  { id: 'tl_001', caseId: 'CASE-2024-0142', type: 'note', title: 'Initial intake completed', description: 'Marcus contacted us after a rear-end collision on Highway 101.', actor: { name: 'Jessica Marquez', initials: 'JM' }, at: '2025-09-16T10:22:00Z' },
  { id: 'tl_002', caseId: 'CASE-2024-0142', type: 'document', title: 'Police report uploaded', actor: { name: 'California Highway Patrol', initials: 'CHP' }, at: '2025-09-18T14:11:00Z' },
  { id: 'tl_003', caseId: 'CASE-2024-0142', type: 'status_change', title: 'Liability accepted', description: 'State Farm accepted 100% liability for the MVA.', actor: { name: 'State Farm', initials: 'SF' }, at: '2025-11-04T16:22:00Z' },
  { id: 'tl_004', caseId: 'CASE-2024-0142', type: 'signature', title: 'Lien signed by client', actor: { name: 'Marcus Reyes', initials: 'MR' }, at: '2025-11-15T11:11:00Z' },
  { id: 'tl_005', caseId: 'CASE-2024-0142', type: 'document', title: 'MRI Lumbar report uploaded', actor: { name: 'Pacific Imaging', initials: 'PI' }, at: '2025-10-04T09:32:00Z' },
  { id: 'tl_006', caseId: 'CASE-2024-0142', type: 'document', title: 'MRI Cervical report uploaded', actor: { name: 'Pacific Imaging', initials: 'PI' }, at: '2025-10-04T09:35:00Z' },
  { id: 'tl_007', caseId: 'CASE-2024-0142', type: 'document', title: 'EMG results uploaded', actor: { name: 'Bay Neuro Diagnostics', initials: 'BN' }, at: '2025-10-12T15:42:00Z' },
  { id: 'tl_008', caseId: 'CASE-2024-0142', type: 'email', title: 'Demand letter sent', description: 'Sent comprehensive demand letter to State Farm.', actor: { name: 'Danny Rackow', initials: 'DR' }, at: '2026-01-22T09:14:00Z' },
  { id: 'tl_009', caseId: 'CASE-2024-0142', type: 'status_change', title: 'Negotiation started', description: 'Round 1 of negotiations initiated.', actor: { name: 'Mediflow', initials: 'MF' }, at: '2026-03-04T10:11:00Z' },
  { id: 'tl_010', caseId: 'CASE-2024-0142', type: 'call', title: 'Call with adjuster Patricia Hernandez', description: 'Discussed lumbar and cervical MRI pricing.', actor: { name: 'Danny Rackow', initials: 'DR' }, at: '2026-06-23T14:32:00Z' },

  // CASE-2025-0018 (Liam Chen)
  { id: 'tl_011', caseId: 'CASE-2025-0018', type: 'note', title: 'Initial intake completed', actor: { name: 'Zoe Brennan', initials: 'ZB' }, at: '2026-01-11T08:00:00Z' },
  { id: 'tl_012', caseId: 'CASE-2025-0018', type: 'document', title: 'Workers comp first report uploaded', actor: { name: 'Texas Mutual', initials: 'TM' }, at: '2026-01-11T08:30:00Z' },
  { id: 'tl_013', caseId: 'CASE-2025-0018', type: 'document', title: 'Lumbar MRI report uploaded', actor: { name: 'Austin Diagnostic Center', initials: 'AD' }, at: '2026-05-22T11:11:00Z' },
  { id: 'tl_014', caseId: 'CASE-2025-0018', type: 'document', title: 'Neuropsych eval report uploaded', actor: { name: 'Texas Neurology Group', initials: 'TN' }, at: '2026-05-29T14:33:00Z' },
  { id: 'tl_015', caseId: 'CASE-2025-0018', type: 'status_change', title: 'Imaging complete', actor: { name: 'Mediflow', initials: 'MF' }, at: '2026-06-19T16:42:00Z' },
  { id: 'tl_016', caseId: 'CASE-2025-0018', type: 'note', title: 'Drafting demand letter', actor: { name: 'Danny Rackow', initials: 'DR' }, at: '2026-06-23T09:14:00Z' },

  // CASE-2025-0098 (Sofia Marchetti)
  { id: 'tl_017', caseId: 'CASE-2025-0098', type: 'note', title: 'Initial intake completed', actor: { name: 'Priya Iyer', initials: 'PI' }, at: '2026-04-04T11:00:00Z' },
  { id: 'tl_018', caseId: 'CASE-2025-0098', type: 'signature', title: 'Lien signed by client', actor: { name: 'Sofia Marchetti', initials: 'SM' }, at: '2026-04-08T10:11:00Z' },
  { id: 'tl_019', caseId: 'CASE-2025-0098', type: 'document', title: 'MRI Cervical report uploaded', actor: { name: 'Miami Imaging Group', initials: 'MI' }, at: '2026-06-11T15:42:00Z' },
  { id: 'tl_020', caseId: 'CASE-2025-0098', type: 'email', title: 'Settlement draft sent', description: 'Round 3 settlement terms shared with USAA.', actor: { name: 'Danny Rackow', initials: 'DR' }, at: '2026-06-23T18:42:00Z' },
  { id: 'tl_021', caseId: 'CASE-2025-0098', type: 'note', title: 'Waiting on USAA response', actor: { name: 'Danny Rackow', initials: 'DR' }, at: '2026-06-24T08:42:00Z' },

  // CASE-2025-0204 (Mateo Gutierrez - Paid)
  { id: 'tl_022', caseId: 'CASE-2025-0204', type: 'payment', title: 'EFT received', description: '$4,800 EFT received from GEICO. Posted to account.', actor: { name: 'GEICO', initials: 'GE' }, at: '2026-06-15T17:30:00Z' },
  { id: 'tl_023', caseId: 'CASE-2025-0204', type: 'signature', title: 'Settlement signed by all parties', actor: { name: 'All parties', initials: 'AP' }, at: '2026-06-11T15:33:00Z' },
  { id: 'tl_024', caseId: 'CASE-2025-0204', type: 'status_change', title: 'Case closed', actor: { name: 'Mediflow', initials: 'MF' }, at: '2026-06-15T17:32:00Z' },

  // CASE-2025-0262 (Aaliyah Carter - Paid)
  { id: 'tl_025', caseId: 'CASE-2025-0262', type: 'payment', title: 'Check mailed', description: '$3,880 check mailed to client.', actor: { name: 'CNA', initials: 'CN' }, at: '2026-06-10T14:25:00Z' },
  { id: 'tl_026', caseId: 'CASE-2025-0262', type: 'status_change', title: 'Case closed', actor: { name: 'Mediflow', initials: 'MF' }, at: '2026-06-14T11:22:00Z' },
];

export function timelineForCase(caseId: string): TimelineEvent[] {
  return timelineEvents
    .filter((e) => e.caseId === caseId)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}