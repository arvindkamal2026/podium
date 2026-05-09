"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isGuest = user?.isAnonymous ?? false;

  return (
    <div
      className="min-h-screen"
      style={{ paddingTop: isGuest ? "36px" : "0px" }}
    >
      {children}
    </div>
  );
}
