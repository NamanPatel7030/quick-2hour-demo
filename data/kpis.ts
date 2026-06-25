import type { Kpi } from '@/types';

export const sparklineData: Record<string, number[]> = {
  activeCases: [12, 13, 13, 14, 15, 15, 15, 16, 16, 16, 15, 16],
  pendingBills: [9, 11, 10, 8, 9, 7, 8, 6, 7, 8, 7, 7],
  unsignedLiens: [4, 4, 5, 5, 4, 3, 3, 4, 3, 3, 2, 3],
  offersToReview: [1, 2, 0, 1, 3, 2, 4, 3, 2, 1, 2, 2],
  payments: [142, 165, 158, 172, 168, 180, 175, 188, 192, 178, 186, 184],
  recovery: [62, 64, 65, 66, 67, 68, 69, 70, 70, 70, 71, 71],
};

export const dannyKpis: Kpi[] = [
  {
    id: 'active-cases',
    label: 'Active cases',
    value: 16,
    formattedValue: '16',
    delta: 0.12,
    sparkline: sparklineData.activeCases,
    href: '/attorney/cases',
    format: 'number',
  },
  {
    id: 'pending-bills',
    label: 'Pending bills',
    value: 7,
    formattedValue: '7',
    delta: -0.03,
    sparkline: sparklineData.pendingBills,
    href: '/attorney/billing',
    format: 'number',
  },
  {
    id: 'unsigned-liens',
    label: 'Unsigned liens',
    value: 3,
    formattedValue: '3',
    delta: -0.25,
    sparkline: sparklineData.unsignedLiens,
    href: '/attorney/cases',
    format: 'number',
  },
  {
    id: 'payments-month',
    label: 'Recovered this month',
    value: 1842500,
    formattedValue: '$18,425',
    delta: 0.24,
    sparkline: sparklineData.payments,
    href: '/attorney/billing/payments',
    format: 'currency',
  },
];

export const billingKpis = {
  totalBilledCents: 18750000,
  totalPaidCents: 8420000,
  outstandingCents: 10330000,
  avgDaysToPay: 38,
};

export const recoveryByAttorney = [
  { attorney: 'Danny Rackow', recovery: 0.71, cases: 16 },
  { attorney: 'Alex Patel', recovery: 0.68, cases: 12 },
  { attorney: 'Maya Singh', recovery: 0.74, cases: 9 },
  { attorney: 'Roberto Diaz', recovery: 0.62, cases: 7 },
  { attorney: 'Sarah Klein', recovery: 0.69, cases: 6 },
  { attorney: "James O'Brien", recovery: 0.65, cases: 8 },
];

export const statusMix = [
  { name: 'Awaiting Records', value: 2, fill: '#94a3b8' },
  { name: 'Records Received', value: 2, fill: '#3b82f6' },
  { name: 'Scheduled', value: 1, fill: '#0ea5e9' },
  { name: 'Imaging Complete', value: 1, fill: '#06b6d4' },
  { name: 'Lien Pending', value: 1, fill: '#f59e0b' },
  { name: 'Awaiting Signature', value: 1, fill: '#f97316' },
  { name: 'In Negotiation', value: 3, fill: '#8b5cf6' },
  { name: 'Offer Received', value: 1, fill: '#a855f7' },
  { name: 'Pending Payment', value: 1, fill: '#ec4899' },
  { name: 'Paid', value: 2, fill: '#10b981' },
  { name: 'In Collections', value: 1, fill: '#ef4444' },
];

export const topModalities = [
  { modality: 'MRI', billed: 8450000 },
  { modality: 'Neurological Eval', billed: 3380000 },
  { modality: 'EMG', billed: 2380000 },
  { modality: 'CT', billed: 2150000 },
  { modality: 'X-Ray', billed: 720000 },
];

export const recoveryTrend = [
  { month: 'Jul', recovered: 12400, target: 15000 },
  { month: 'Aug', recovered: 14200, target: 15000 },
  { month: 'Sep', recovered: 15800, target: 15500 },
  { month: 'Oct', recovered: 13900, target: 15500 },
  { month: 'Nov', recovered: 17200, target: 16000 },
  { month: 'Dec', recovered: 18100, target: 16000 },
  { month: 'Jan', recovered: 16400, target: 16500 },
  { month: 'Feb', recovered: 17900, target: 16500 },
  { month: 'Mar', recovered: 19200, target: 17000 },
  { month: 'Apr', recovered: 17600, target: 17000 },
  { month: 'May', recovered: 18800, target: 17500 },
  { month: 'Jun', recovered: 18425, target: 17500 },
];