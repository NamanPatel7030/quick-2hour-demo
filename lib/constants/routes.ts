// Centralized route constants

export const ROUTES = {
  marketing: '/',
  signIn: '/auth/sign-in',
  forgotPassword: '/auth/forgot-password',
  resetPassword: (token: string) => `/auth/reset-password/${token}`,

  overview: '/attorney/overview',
  cases: '/attorney/cases',
  case: (id: string) => `/attorney/cases/${id}`,
  caseDocuments: (id: string) => `/attorney/cases/${id}/documents`,
  clients: '/attorney/clients',
  client: (id: string) => `/attorney/clients/${id}`,
  billing: '/attorney/billing',
  offers: '/attorney/billing/offers',
  payments: '/attorney/billing/payments',
  documents: '/attorney/documents',
  notifications: '/attorney/notifications',
  insights: '/attorney/insights',
  firm: '/attorney/firm',
  firmLocations: '/attorney/firm/locations',
  firmTeam: '/attorney/firm/team',
  firmStaff: '/attorney/firm/staff',
  firmNotifications: '/attorney/firm/notifications',
  firmSecurity: '/attorney/firm/security',
  profile: '/attorney/profile',
} as const;
