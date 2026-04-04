"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { PERFORMANCE_INDICATORS } from "@/data/performance-indicators";
import { DECA_EVENTS } from "@/data/events";
import { MasterySummaryBar } from "@/components/pi/MasterySummaryBar";
import { PIList } from "@/components/pi/PIList";
import { PIExportButton } from "@/components/pi/PIExportButton";
import { PIAttribution } from "@/components/legal/PIAttribution";

interface UserProfile {
  eventId: string;
}

interface PIProgress {
  status: "mastered" | "learning" | "untested";
  timesTested: number;
  timesCorrect: number;
  lastTested: string | null;
}

export default function PITrackerPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );
  const [progress, setProgress] = useState<Record<string, PIProgress>>({});
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const ref = collection(getClientDb(), `users/${user.uid}/piProgress`);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const map: Record<string, PIProgress> = {};
      snap.forEach((doc) => {
        map[doc.id] = doc.data() as PIProgress;
      });
      setProgress(map);
      setProgressLoading(false);
    });
    return unsubscribe;
  }, [user]);

  if (authLoading || profileLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  const eventPIs = PERFORMANCE_INDICATORS.filter((pi) => pi.eventId === profile?.eventId);
  const event = DECA_EVENTS.find((e) => e.id === profile?.eventId);

  const items = eventPIs.map((pi) => {
    const prog = progress[pi.id];
    return {
      id: pi.id,
      code: pi.code,
      text: pi.text,
      category: pi.category,
      difficulty: pi.difficulty,
      status: (prog?.status ?? "untested") as "mastered" | "learning" | "untested",
      timesTested: prog?.timesTested ?? 0,
      timesCorrect: prog?.timesCorrect ?? 0,
      lastTested: prog?.lastTested ?? null,
    };
  });

  const mastered = items.filter((i) => i.status === "mastered").length;
  const learning = items.filter((i) => i.status === "learning").length;
  const untested = items.filter((i) => i.status === "untested").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">PI Tracker</h1>
          <p className="text-outline mt-1">{event?.name ?? "Select an event"}</p>
        </div>
        <PIExportButton items={items} eventName={event?.name ?? "Unknown"} />
      </div>

      <MasterySummaryBar
        total={items.length}
        mastered={mastered}
        learning={learning}
        untested={untested}
      />

      <PIList items={items} />

      <PIAttribution pdfUrl={event?.officialPiPdfUrl} />
    </div>
  );
}
