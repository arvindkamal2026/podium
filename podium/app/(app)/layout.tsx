import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Sidebar />
      <main className="ml-[220px] pt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-8">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
