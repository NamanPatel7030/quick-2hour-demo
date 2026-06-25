import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  FileText,
  Handshake,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Workflow,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/marketing/logo';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: FileText,
    title: 'Case workspace',
    body: 'Every case, every document, every signature — in one tabbed workspace with real-time activity.',
  },
  {
    icon: Handshake,
    title: 'Lien negotiation',
    body: 'Run multi-round negotiations with insurance carriers and track every counter in one place.',
  },
  {
    icon: CalendarCheck,
    title: 'Imaging schedule',
    body: 'See today\'s MRI, CT, and EMG appointments across all your clients without leaving the portal.',
  },
  {
    icon: Receipt,
    title: 'Billing & offers',
    body: 'A kanban view of every bill, every offer, and every dollar recovered. Updated in real time.',
  },
  {
    icon: TrendingUp,
    title: 'Recovery analytics',
    body: 'Track your recovery rate, days-to-pay, and top modalities at a glance.',
  },
  {
    icon: ShieldCheck,
    title: 'SOC 2 + HIPAA',
    body: 'Enterprise-grade security. Signed cookies. Encrypted at rest. Audit log on every action.',
  },
];

const stats = [
  { value: '$48M+', label: 'recovered in 2025' },
  { value: '38%', label: 'faster case resolution' },
  { value: '71%', label: 'average recovery rate' },
  { value: '99.97%', label: 'platform uptime' },
];

export default function MarketingLanding() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white-0 text-text-strong-950">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-stroke-soft-200 bg-bg-white-0/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">Mediflow</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-soft-400">
                Attorney Portal
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-text-sub-600 md:flex">
            <a href="#features" className="hover:text-text-strong-950 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-text-strong-950 transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-text-strong-950 transition-colors">Pricing</a>
            <Link href="/auth/sign-in" className="hover:text-text-strong-950 transition-colors">Sign in</Link>
          </nav>
          <Button asChild variant="primary" size="md">
            <Link href="/auth/sign-in">
              Open portal
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(circle at 12% 10%, rgba(61,90,254,0.15) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 88% 30%, rgba(168,85,247,0.18) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 50% 80%, rgba(34,211,238,0.10) 0%, rgba(255,255,255,0) 50%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15,23,42,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.7) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-3 py-1.5 text-xs font-medium shadow-sm">
                  <Sparkles className="size-3.5 text-primary-base" />
                  <span>New · Lien negotiation in real time</span>
                </span>
                <h1 className="text-title-h1 font-semibold tracking-tight leading-[1.05]">
                  The attorney portal built for{' '}
                  <span className="bg-gradient-to-br from-primary-base via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                    personal injury
                  </span>
                </h1>
                <p className="text-paragraph-lg text-text-sub-600 max-w-xl leading-relaxed">
                  Mediflow connects your case managers, your adjusters, and your billing team in one modern workspace.
                  Negotiate liens. Track every imaging appointment. Get paid faster.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild variant="primary" size="xl">
                    <Link href="/auth/sign-in">
                      Try the demo
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl">
                    <a href="#features">See how it works</a>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-text-sub-600">
                  {['No credit card required', 'Free for firms under 5 attorneys', 'SOC 2 + HIPAA'].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-success-base" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero illustration — product mock */}
              <div className="relative">
                <div
                  className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.18)]"
                >
                  <div className="rounded-lg bg-bg-weak-25 p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-base to-[#7C3AED] text-white text-[11px] font-semibold">DR</div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold">Good afternoon, Danny</div>
                        <div className="text-[11px] text-text-sub-600">Tuesday, June 24, 2026</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Active cases', value: '16', trend: '+12%', tone: 'success' as const },
                        { label: 'Pending bills', value: '7', trend: '-3%', tone: 'success' as const },
                        { label: 'Unsigned liens', value: '3', trend: '-25%', tone: 'success' as const },
                        { label: 'Recovered MTD', value: '$18.4K', trend: '+24%', tone: 'success' as const },
                      ].map((k) => (
                        <div key={k.label} className="rounded-md border border-stroke-soft-200 bg-bg-white-0 p-2.5">
                          <div className="text-[10px] text-text-sub-600">{k.label}</div>
                          <div className="mt-0.5 flex items-baseline gap-1.5">
                            <span className="text-base font-semibold tabular-nums">{k.value}</span>
                            <span className={`text-[10px] font-medium tabular-nums ${k.tone === 'success' ? 'text-success-base' : 'text-error-base'}`}>
                              {k.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {['Needs attention', 'In progress', 'Completed'].map((c) => (
                        <div key={c} className="rounded-md border border-stroke-soft-200 bg-bg-white-0 p-2">
                          <div className="text-[10px] font-semibold text-text-sub-600 mb-1.5">{c}</div>
                          <div className="space-y-1.5">
                            {[1, 2].map((i) => (
                              <div key={i} className="rounded border border-stroke-soft-200 bg-bg-weak-25 p-1.5">
                                <div className="text-[9px] font-semibold truncate">CASE-2024-0142</div>
                                <div className="text-[9px] text-text-sub-600 truncate">State Farm · MVA</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 size-48 rounded-full bg-primary-lighter blur-2xl opacity-60" />
                <div className="absolute -top-6 -left-6 -z-10 size-48 rounded-full bg-feature-lighter blur-2xl opacity-50" />
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-2 gap-3 rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-title-h5 font-semibold tracking-tight tabular-nums">{s.value}</span>
                  <span className="text-xs text-text-sub-600">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-stroke-soft-200 bg-bg-weak-25 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center text-center gap-3 mb-12">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-stroke-soft-200 bg-bg-white-0 px-3 py-1 text-xs font-medium">
                <Workflow className="size-3.5 text-primary-base" />
                Built for your workflow
              </span>
              <h2 className="text-title-h2 font-semibold tracking-tight">
                Everything in one workspace
              </h2>
              <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
                Stop switching between five tools. Mediflow unifies case management, lien negotiation, billing,
                and scheduling into a single, polished experience.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-5 transition-all hover:border-stroke-sub-300 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.10)]"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary-lighter text-primary-base mb-3 group-hover:bg-primary-light transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-label-md font-semibold text-text-strong-950">{f.title}</h3>
                    <p className="mt-1.5 text-paragraph-sm text-text-sub-600 leading-relaxed">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div
              className="relative overflow-hidden rounded-2xl border border-stroke-soft-200 p-10 md:p-14"
              style={{
                background:
                  'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              }}
            >
              <div
                className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full opacity-30 blur-3xl"
                style={{ background: 'radial-gradient(circle, #3D5AFE 0%, transparent 70%)' }}
              />
              <div className="relative flex flex-col items-center text-center gap-5 text-text-white-0">
                <h2 className="text-title-h2 font-semibold tracking-tight max-w-2xl">
                  See your cases in a new light
                </h2>
                <p className="text-paragraph-lg text-white/70 max-w-2xl">
                  Open the demo with Danny&apos;s account and explore every screen — from the dashboard to
                  the lien workflow — in under two minutes.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button asChild variant="primary" size="xl">
                    <Link href="/auth/sign-in">
                      Open the demo
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-white/40">
                  Demo credentials: <span className="font-mono">danny@pathora.ai</span> · <span className="font-mono">abcd123</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stroke-soft-200 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-2 text-xs text-text-soft-400 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span>© 2026 Mediflow, Inc.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-text-strong-950">Privacy</a>
            <a href="#" className="hover:text-text-strong-950">Terms</a>
            <a href="#" className="hover:text-text-strong-950">Status</a>
            <a href="#" className="hover:text-text-strong-950">SOC 2</a>
          </div>
        </div>
      </footer>
    </div>
  );
}