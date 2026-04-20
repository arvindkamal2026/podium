"use client";

import { RolePlayDisclaimer } from "@/components/legal/RolePlayDisclaimer";

export default function RolePlayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Role Play Coach
        </h1>
        <p className="text-outline mt-1">AI-powered scenario practice with per-PI scoring</p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-outline">
            record_voice_over
          </span>
        </div>
        <div>
          <p className="font-headline text-xl font-semibold text-on-surface mb-2">
            Coming Soon
          </p>
          <p className="text-sm text-outline max-w-sm">
            AI role play coaching with real-time scenario generation and scored feedback on every PI is in the works. Stay tuned.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-ds/15 text-secondary-ds">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-ds animate-pulse" />
          In Development
        </span>
      </div>

      <RolePlayDisclaimer eventName="DECA" />
    </div>
  );
}
