import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <TopNav />
      <Sidebar />
      <main className="md:ml-[220px] pt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
        <Footer />
      </main>
      <BottomNav />
    </AppShell>
  );
}
