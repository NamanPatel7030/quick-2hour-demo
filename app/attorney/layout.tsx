import { requireUser } from '@/lib/auth/guards';
import { Sidebar } from '@/components/portal/shell/sidebar';
import { Topbar } from '@/components/portal/shell/topbar';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <div className="min-h-screen bg-bg-weak-25">
      <Sidebar session={session} />
      <div className="lg:pl-[248px] transition-[padding] duration-200 data-[collapsed=true]:lg:pl-[68px]">
        <Topbar session={session} />
        <main id="main-content" className="px-6 py-6 md:px-8 md:py-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}