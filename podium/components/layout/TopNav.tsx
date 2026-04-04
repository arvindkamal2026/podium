"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";

export function TopNav() {
  const { user } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "?";
  const photoURL = user?.photoURL;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    router.push("/login");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 frosted-glass flex items-center justify-between px-6 h-16">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-2xl">
          trophy
        </span>
        <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
          Podium
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline hidden md:block">
          BFS — Business Finance Series
        </span>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform hover:scale-105"
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-headline font-bold text-sm">
                {initial}
              </div>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-low rounded-xl py-1 shadow-xl shadow-black/30 z-50">
              <div className="px-4 py-2.5 text-xs text-outline truncate">
                {user?.email}
              </div>
              <div className="h-px mx-3 bg-outline-variant/15" />
              <button
                onClick={() => { setMenuOpen(false); router.push("/profile"); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error hover:bg-error/[0.04] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
    </header>
  );
}
