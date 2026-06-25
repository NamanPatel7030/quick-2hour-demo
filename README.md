# Mediflow — Attorney Portal

A modern medical-legal portal for personal injury attorneys. Mediflow unifies case management, lien negotiation, billing, and scheduling into one premium, low-friction experience.

> Built with Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + shadcn-style components.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo login

- **Email:** `danny@pathora.ai`
- **Password:** `abcd123`

The demo routes you through a fully populated experience for **Danny Rackow** — Senior Partner at **Rackow & Pathora Injury Law**, with 16 active cases, 12 clients, 24 bills, 30 documents, 25 notifications, 8 attorneys, and 6 case managers.

---

## Route map

### Public
| Path | Purpose |
| --- | --- |
| `/` | Marketing landing page |
| `/auth/sign-in` | Login (split-screen brand panel + form) |
| `/auth/forgot-password` | Reset request |
| `/auth/reset-password/[token]` | New password |

### Attorney portal (authenticated)
| Path | Purpose |
| --- | --- |
| `/attorney/overview` | Dashboard — KPIs, priority queue, today's schedule, activity, insights |
| `/attorney/cases` | Master case list (TanStack table) |
| `/attorney/cases/[caseId]` | Case workspace (Overview · Documents · Billing · Timeline · Liens · Notes) |
| `/attorney/clients` | Client list |
| `/attorney/clients/[clientId]` | Client detail |
| `/attorney/billing` | Billing kanban (Draft / Submitted / Under Review / Counter / Paid) |
| `/attorney/billing/offers` | Negotiation inbox |
| `/attorney/billing/payments` | Payment history |
| `/attorney/documents` | Global document library |
| `/attorney/notifications` | Notifications feed |
| `/attorney/insights` | Analytics (recharts) |
| `/attorney/firm` | Firm profile |
| `/attorney/firm/locations` | Office locations |
| `/attorney/firm/team` | Attorneys |
| `/attorney/firm/staff` | Case managers |
| `/attorney/firm/notifications` | Notification preferences |
| `/attorney/firm/security` | Change password / 2FA |
| `/attorney/profile` | Danny's profile |

---

## Project structure

```
app/
├── (marketing)/ page.tsx                  # /
├── (auth)/auth/                           # sign-in, forgot, reset
├── (portal)/attorney/                     # all attorney routes
├── actions/auth.ts                        # login / logout server actions
├── layout.tsx                             # root layout + Toaster
└── globals.css                            # AlignUI design tokens (Tailwind 4 @theme)

components/
├── ui/                                    # primitives (Button, Card, Badge, Tabs, etc.)
├── portal/
│   ├── shell/                             # Sidebar, Topbar, CommandPalette, ThemeToggle, NotificationPopover, UserMenu
│   ├── kpi-card.tsx                       # KPI tile with sparkline + delta
│   ├── page-header.tsx
│   ├── breadcrumb-nav.tsx
│   ├── empty-state.tsx
│   ├── amount-display.tsx
│   ├── sparkline.tsx
│   └── data-table/                        # TanStack Table v8 wrapper
└── marketing/                             # landing page pieces

lib/
├── auth/                                  # iron-session config + guards
├── constants/                             # nav, status, routes
├── data/                                  # ⚠️ moved to /data (see below)
├── format.ts                              # currency, date, phone, initials
└── validation/                            # (zod schemas)

data/                                      # typed dummy data (firm, cases, bills, docs, etc.)
types/index.ts                             # all shared types
store/                                     # zustand stores (sidebar, theme, notifications)
```

---

## Design system

The portal uses the **AlignUI** token set exposed via Tailwind 4 `@theme` blocks in `app/globals.css`:

| Token family | Example utility classes |
| --- | --- |
| Backgrounds | `bg-bg-white-0`, `bg-bg-weak-25`, `bg-bg-weak-50`, `bg-bg-soft-200` |
| Text | `text-text-strong-950`, `text-text-sub-600`, `text-text-soft-400` |
| Borders | `border-stroke-soft-200`, `border-stroke-sub-300` |
| Brand (primary) | `bg-primary-base`, `bg-primary-light`, `bg-primary-lighter`, `text-primary-base` |
| Semantic | `bg-success-base/light/lighter`, `bg-error-…`, `bg-warning-…`, `bg-information-…` |

The primary brand color is `#3D5AFE` (indigo-blue), chosen for a fresh, modern look.

Dark mode is supported via the `.dark` class on `<html>` (toggle in the topbar).

---

## Tech notes

- **Server Components by default** — pages are RSC unless they require interactivity (forms, filters, tabs, command palette, theme toggle).
- **Server Actions** for mutations (`signInAction`, `forgotPasswordAction`, `signOutAction`).
- **iron-session** for cookie-based auth (`httpOnly`, `sameSite=lax`, signed with SESSION_SECRET).
- **TanStack Table v8** for server-side pagination, sorting, column filters, row selection, global search.
- **Zustand** for sidebar collapse, theme, and notification state — persisted to `localStorage` where appropriate.
- **Recharts** for analytics.
- **sonner** for toasts.
- **cmdk** for the ⌘K command palette.
- **lucide-react** for icons (with `@remixicon/react` available as well).

---

## License

This is a demo project. Not for production use.