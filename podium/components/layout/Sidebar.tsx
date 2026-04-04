"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/firebase/auth";

const NAV_ITEMS = [
  { href: "/home", label: "Dashboard", icon: "dashboard" },
  { href: "/pi-tracker", label: "PI Tracker", icon: "target" },
  { href: "/events", label: "Events", icon: "category" },
  { href: "/exams", label: "Practice Exams", icon: "quiz" },
  { href: "/roleplay", label: "Role Play Coach", icon: "record_voice_over" },
  { href: "/vocab", label: "Vocab Flashcards", icon: "style" },
];

const SECONDARY_ITEMS = [
  { href: "/profile", label: "Profile", icon: "person" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-[220px] bg-surface-container-low py-6 flex flex-col gap-0.5 z-40">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
              isActive
                ? "text-primary bg-primary/[0.04] border-l-primary"
                : "text-outline hover:text-on-surface-variant hover:bg-surface-container border-l-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <div className="h-px my-4 mx-6 bg-outline-variant/15" />

      {SECONDARY_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
              isActive
                ? "text-primary bg-primary/[0.04] border-l-primary"
                : "text-outline hover:text-on-surface-variant hover:bg-surface-container border-l-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto pb-6">
        <div className="h-px my-4 mx-6 bg-outline-variant/15" />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-outline hover:text-error hover:bg-error/[0.04] transition-all duration-200 border-l-[3px] border-l-transparent w-full"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
