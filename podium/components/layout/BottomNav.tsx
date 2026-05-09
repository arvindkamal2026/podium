"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/home",       label: "Home",       icon: "dashboard"         },
  { href: "/pi-tracker", label: "PI Tracker", icon: "target"            },
  { href: "/exams",      label: "Exams",      icon: "quiz"              },
  { href: "/vocab",      label: "Vocab",      icon: "style"             },
  { href: "/roleplay",   label: "Role Play",  icon: "record_voice_over" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="bg-surface-container-low rounded-3xl flex items-center justify-around px-2 py-3">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-0 flex-1"
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors ${
                  isActive ? "text-primary-container" : "text-outline"
                }`}
              >
                {tab.icon}
              </span>
              {isActive && (
                <>
                  <span className="text-[10px] font-semibold text-primary-container leading-none">
                    {tab.label}
                  </span>
                  <span className="h-0.5 w-4 rounded-full bg-primary-container" />
                </>
              )}
            </Link>
          );
        })}
      </div>
      {/* iOS-style handle bar */}
      <div className="flex justify-center mt-1.5">
        <div className="w-24 h-1 rounded-full bg-outline-variant/30" />
      </div>
    </nav>
  );
}
