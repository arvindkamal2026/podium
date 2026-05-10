"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/firebase/auth";

const PRIMARY_TABS = [
  { href: "/home",       label: "Home",       icon: "dashboard"         },
  { href: "/pi-tracker", label: "PI Tracker", icon: "target"            },
  { href: "/exams",      label: "Exams",      icon: "quiz"              },
  { href: "/vocab",      label: "Vocab",      icon: "style"             },
];

const MORE_ITEMS = [
  { href: "/roleplay", label: "Role Play",  icon: "record_voice_over" },
  { href: "/events",   label: "Events",     icon: "category"          },
  { href: "/themes",   label: "Themes",     icon: "palette"           },
  { href: "/profile",  label: "Profile",    icon: "person"            },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  async function handleSignOut() {
    setMoreOpen(false);
    await signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Backdrop */}
      {moreOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More panel — slides up above the nav bar */}
      <div
        className={`md:hidden fixed left-4 right-4 z-50 transition-all duration-300 ease-out ${
          moreOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ bottom: "96px" }}
      >
        <div className="bg-surface-container rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="grid grid-cols-2">
            {MORE_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 transition-colors ${
                    isActive
                      ? "text-primary-container bg-primary/10"
                      : "text-on-surface-variant hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider + sign out */}
          <div className="h-px bg-outline-variant/15 mx-4" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-5 py-4 w-full text-sm font-medium text-outline hover:text-error hover:bg-white/[0.06] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-surface-container-low rounded-3xl flex items-center justify-around px-2 py-3">
          {PRIMARY_TABS.map((tab) => {
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

          {/* More button */}
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-0 flex-1"
          >
            <span
              className={`material-symbols-outlined text-2xl transition-colors ${
                moreOpen || isMoreActive ? "text-primary-container" : "text-outline"
              }`}
            >
              {moreOpen ? "close" : "more_horiz"}
            </span>
            {(moreOpen || isMoreActive) && (
              <>
                <span className="text-[10px] font-semibold text-primary-container leading-none">
                  More
                </span>
                <span className="h-0.5 w-4 rounded-full bg-primary-container" />
              </>
            )}
          </button>
        </div>

        {/* iOS-style handle bar */}
        <div className="flex justify-center mt-1.5">
          <div className="w-24 h-1 rounded-full bg-outline-variant/30" />
        </div>
      </nav>
    </>
  );
}
