// Shared TypeScript types for Mediflow-2
// Matches §7 of the spec

export type Role = 'ATTORNEY' | 'CASE_MANAGER' | 'ADMIN';

export type Attorney = {
  id: string;
  email: string;
  fullName: string;
  initials: string;
  role: Role;
  firmId: string;
  avatarColor: string;
  joinedAt: string;
  phone: string;
  title: string;
  barNumber: string;
  licensureStates: string[];
  activeCases: number;
  archived: boolean;
};

export type Firm = {
  id: string;
  name: string;
  shortName: string;
  taxId: string;
  website: string;
  firmType: string;
  address: { line1: string; city: string; state: string; zip: string };
  mainPhone: string;
  mainEmail: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    fax: string;
  };
  locations: number;
  attorneys: number;
  caseManagers: number;
  activeClients: number;
};

export type Location = {
  id: string;
  name: string;
  type: 'HQ' | 'Branch' | 'Virtual';
  address: { line1: string; city: string; state: string; zip: string };
  phone: string;
  activeAttorneys: number;
};

export type CaseManager = {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  assignedAttorneys: string[];
  activeClients: number;
  avatarColor: string;
};

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  city: string;
  caseCount: number;
  openBalanceCents: number;
  status: 'Active' | 'Closed';
  initials: string;
  avatarColor: string;
};

export type CaseStatus =
  | 'Awaiting Records'
  | 'Records Received'
  | 'Scheduled'
  | 'Imaging Complete'
  | 'Lien Pending'
  | 'Awaiting Signature'
  | 'In Negotiation'
  | 'Offer Received'
  | 'Pending Payment'
  | 'Paid'
  | 'Closed'
  | 'In Collections';

export type Case = {
  id: string;
  clientId: string;
  patientMediflowId: string;
  attorneyId: string;
  caseManagerId: string;
  injuryType:
    | 'MVA'
    | 'Slip & Fall'
    | 'Workplace'
    | 'Medical Malpractice'
    | 'Product Liability';
  dateOfInjury: string;
  state:
    | 'CA'
    | 'TX'
    | 'NY'
    | 'FL'
    | 'GA'
    | 'WA'
    | 'MA'
    | 'CO'
    | 'NV'
    | 'AZ';
  status: CaseStatus;
  financialType: 'Lien' | 'Insurance' | 'Med-Pay' | 'Letter of Protection';
  insuranceCarrier: string;
  adjuster: { name: string; email: string; phone: string };
  claimNumber: string;
  billedCents: number;
  paidCents: number;
  negotiatedCents: number | null;
  offersCount: number;
  documentsCount: number;
  lastActivityAt: string;
  liabilityCleared: boolean;
  litigation: boolean;
  priority: 'low' | 'medium' | 'high';
};

export type Bill = {
  id: string;
  caseId: string;
  clientName: string;
  serviceDate: string;
  modality: 'MRI' | 'CT' | 'X-Ray' | 'EMG' | 'Neurological Eval';
  bodyPart:
    | 'Lumbar Spine'
    | 'Cervical Spine'
    | 'Brain'
    | 'Right Knee'
    | 'Left Shoulder'
    | 'Wrist';
  facility: string;
  billedCents: number;
  insurancePaidCents: number;
  negotiatedCents: number | null;
  patientResponsibilityCents: number;
  dueDate: string;
  status:
    | 'Draft'
    | 'Submitted'
    | 'Under Review'
    | 'Counter Offered'
    | 'Counter Sent'
    | 'Accepted'
    | 'Paid'
    | 'Overdue'
    | 'Written Off';
};

export type Document = {
  id: string;
  caseId: string;
  name: string;
  category:
    | 'Intake Form'
    | 'Medical Record'
    | 'Imaging'
    | 'Police Report'
    | 'Insurance Correspondence'
    | 'Lien'
    | 'Settlement'
    | 'Bill'
    | 'Correspondence'
    | 'Court Filing';
  fileType: 'pdf' | 'jpg' | 'docx' | 'xlsx';
  sizeKB: number;
  uploadedAt: string;
  uploadedBy: { name: string; initials: string };
  shared: boolean;
};

export type TimelineEvent = {
  id: string;
  caseId: string;
  type:
    | 'note'
    | 'call'
    | 'email'
    | 'status_change'
    | 'document'
    | 'payment'
    | 'signature'
    | 'system';
  title: string;
  description?: string;
  actor: { name: string; initials: string };
  at: string;
};

export type NotificationType =
  | 'case_update'
  | 'billing'
  | 'signature'
  | 'schedule'
  | 'payment'
  | 'lien'
  | 'system';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  caseId?: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
};

export type Kpi = {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  delta: number; // percent
  sparkline: number[];
  href: string;
  format: 'number' | 'currency';
};

export type Offer = {
  id: string;
  caseId: string;
  clientName: string;
  modality: string;
  originalBilledCents: number;
  offers: {
    by: 'Mediflow' | 'Insurance' | 'Attorney';
    amountCents: number;
    at: string;
    note?: string;
    status: 'Sent' | 'Accepted' | 'Rejected' | 'Countered';
  }[];
  status: 'Open' | 'Accepted' | 'Stalled' | 'Closed';
};

export type Lien = {
  id: string;
  caseId: string;
  clientName: string;
  amountCents: number;
  status: 'Draft' | 'Sent' | 'Signed' | 'Void' | 'Expired';
  signerName: string;
  signerEmail: string;
  sentAt: string;
  expiresAt: string;
  signedAt?: string;
};

export type SessionData = {
  userId: string;
  email: string;
  fullName: string;
  initials: string;
  role: Role;
  firmId: string;
  avatarColor: string;
  loggedInAt: number;
};
