import { Logo } from '@/components/marketing/logo';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <aside className="relative hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col bg-[#0F172A] text-white px-10 py-8 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(61,90,254,0.45) 0%, rgba(124,58,237,0.0) 45%), radial-gradient(circle at 85% 75%, rgba(34,211,238,0.32) 0%, rgba(15,23,42,0.0) 50%), radial-gradient(circle at 60% 50%, rgba(168,85,247,0.20) 0%, rgba(15,23,42,0.0) 55%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <Link href="/" className="relative flex items-center gap-2.5 text-text-white-0">
          <Logo size={32} />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">Mediflow</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Attorney Portal
            </span>
          </div>
        </Link>

        <div className="relative flex-1 flex flex-col justify-center max-w-md">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live with 247 active clients
            </span>
            <h1 className="text-title-h2 font-semibold tracking-tight leading-[1.1]">
              The attorney portal built for{' '}
              <span className="bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                personal injury
              </span>{' '}
              practices.
            </h1>
            <p className="text-paragraph-md text-white/70 leading-relaxed">
              Negotiate liens. Track every imaging appointment. Get paid faster. Mediflow is the only portal
              that connects your case managers, your adjusters, and your billing team in one place.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <blockquote className="text-sm text-white/90 leading-relaxed">
                “We closed 38% more cases in our first quarter on Mediflow. The lien workflow alone
                paid for the platform.”
              </blockquote>
              <div className="mt-3 flex items-center gap-2.5">
                <div
                  className="flex size-8 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ background: 'linear-gradient(135deg,#3D5AFE,#7C3AED)' }}
                >
                  MR
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium">Maria Reyes</span>
                  <span className="text-[11px] text-white/50">Managing Partner · Bay Legal</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/50">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white tabular-nums">$48M+</span>
                <span>recovered in 2025</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white tabular-nums">38</span>
                <span>avg days to payment</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white tabular-nums">99.97%</span>
                <span>platform uptime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative text-[11px] text-white/40">
          © 2026 Mediflow, Inc. SOC 2 Type II · HIPAA · CCPA
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:py-16 bg-bg-white-0">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Logo size={32} />
            <span className="text-base font-semibold tracking-tight">Mediflow</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}