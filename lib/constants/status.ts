// Status maps — case/bill/notification → visual variant
// Used by StatusBadge component

export type StatusTone =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'pending'
  | 'neutral'
  | 'primary';

export const caseStatusMap: Record<string, StatusTone> = {
  'Awaiting Records': 'pending',
  'Records Received': 'info',
  Scheduled: 'info',
  'Imaging Complete': 'info',
  'Lien Pending': 'warning',
  'Awaiting Signature': 'warning',
  'In Negotiation': 'primary',
  'Offer Received': 'primary',
  'Pending Payment': 'primary',
  Paid: 'success',
  Closed: 'neutral',
  'In Collections': 'error',
};

export const billStatusMap: Record<string, StatusTone> = {
  Draft: 'neutral',
  Submitted: 'info',
  'Under Review': 'info',
  'Counter Offered': 'primary',
  'Counter Sent': 'primary',
  Accepted: 'success',
  Paid: 'success',
  Overdue: 'error',
  'Written Off': 'neutral',
};

export const injuryTypeMap: Record<string, StatusTone> = {
  MVA: 'info',
  'Slip & Fall': 'warning',
  Workplace: 'pending',
  'Medical Malpractice': 'error',
  'Product Liability': 'primary',
};

export const priorityMap: Record<string, StatusTone> = {
  low: 'neutral',
  medium: 'info',
  high: 'error',
};

export const lienStatusMap: Record<string, StatusTone> = {
  Draft: 'neutral',
  Sent: 'warning',
  Signed: 'success',
  Void: 'neutral',
  Expired: 'error',
};

export const modalityMap: Record<string, StatusTone> = {
  MRI: 'info',
  CT: 'primary',
  'X-Ray': 'neutral',
  EMG: 'warning',
  'Neurological Eval': 'error',
};

export function toneForCase(status: string): StatusTone {
  return caseStatusMap[status] ?? 'neutral';
}

export function toneForBill(status: string): StatusTone {
  return billStatusMap[status] ?? 'neutral';
}

export function toneForLien(status: string): StatusTone {
  return lienStatusMap[status] ?? 'neutral';
}
