// Sidebar navigation config — §5 of the spec

export type NavItem = {
  label: string;
  href: string;
  icon: string; // Remix icon name
  badge?: string;
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

export const attorneyNav: NavSection[] = [
  {
    section: 'Workspace',
    items: [
      { label: 'Overview', href: '/attorney/overview', icon: 'ri-dashboard-line' },
      { label: 'Cases', href: '/attorney/cases', icon: 'ri-briefcase-line', badge: '12 active' },
      { label: 'Clients', href: '/attorney/clients', icon: 'ri-user-line' },
      { label: 'Documents', href: '/attorney/documents', icon: 'ri-file-text-line' },
    ],
  },
  {
    section: 'Money',
    items: [
      { label: 'Billing', href: '/attorney/billing', icon: 'ri-receipt-line', badge: '3 new' },
      { label: 'Offers', href: '/attorney/billing/offers', icon: 'ri-handshake-line' },
      { label: 'Payments', href: '/attorney/billing/payments', icon: 'ri-bank-card-line' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { label: 'Notifications', href: '/attorney/notifications', icon: 'ri-notification-3-line', badge: '5 unread' },
      { label: 'Analytics', href: '/attorney/insights', icon: 'ri-line-chart-line' },
    ],
  },
  {
    section: 'Firm',
    items: [
      { label: 'Profile', href: '/attorney/firm', icon: 'ri-building-2-line' },
      { label: 'Locations', href: '/attorney/firm/locations', icon: 'ri-map-pin-line' },
      { label: 'Team', href: '/attorney/firm/team', icon: 'ri-user-settings-line' },
      { label: 'Staff', href: '/attorney/firm/staff', icon: 'ri-user-star-line' },
      { label: 'Preferences', href: '/attorney/firm/notifications', icon: 'ri-notification-snooze-line' },
      { label: 'Security', href: '/attorney/firm/security', icon: 'ri-shield-check-line' },
    ],
  },
];

export const userBottomNav: NavItem[] = [
  { label: 'My Profile', href: '/attorney/profile', icon: 'ri-user-3-line' },
  { label: 'Keyboard Shortcuts', href: '#shortcuts', icon: 'ri-keyboard-line' },
  { label: 'Help & Support', href: '#help', icon: 'ri-question-line' },
];
