"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { collection, onSnapshot } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { DECA_EVENTS } from "@/data/events";
import { PERFORMANCE_INDICATORS } from "@/data/performance-indicators";
import { MasteryBadge } from "@/components/pi/MasteryBadge";
import { PIAttribution } from "@/components/legal/PIAttribution";
import Link from "next/link";

interface PIProgress {
  status: "mastered" | "learning" | "untested";
  timesTested: number;
  timesCorrect: number;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user } = useAuth();
  const event = DECA_EVENTS.find((e) => e.id === slug);
  const [progress, setProgress] = useState<Record<string, PIProgress>>({});

  useEffect(() => {
    if (!user) return;
    const ref = collection(getClientDb(), `users/${user.uid}/piProgress`);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const map: Record<string, PIProgress> = {};
      snap.forEach((doc) => {
        map[doc.id] = doc.data() as PIProgress;
      });
      setProgress(map);
    });
    return unsubscribe;
  }, [user]);

  if (!event) {
    return (
      <div className="text-center py-20">
        <h1 className="font-headline text-2xl font-bold">Event Not Found</h1>
        <p className="text-outline mt-2">The event you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/events"
          className="text-primary hover:underline mt-4 inline-block"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  const eventPIs = PERFORMANCE_INDICATORS.filter((pi) => pi.eventId === slug);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/events"
          className="text-sm text-outline hover:text-on-surface-variant mb-4 inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          All Events
        </Link>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="font-mono text-sm text-outline bg-surface-container-high px-3 py-1 rounded-full">
            {event.code}
          </span>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {event.name}
          </h1>
        </div>
        <p className="text-outline mt-2">{event.overview}</p>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Cluster",
            value: event.cluster.replace(/-/g, " "),
            icon: "category",
          },
          { label: "Category", value: event.category, icon: "label" },
          { label: "Participants", value: event.participants, icon: "group" },
          {
            label: "Format",
            value: event.hasExam
              ? `${event.prepTimeMins}min prep + ${event.interviewTimeMins}min interview + Exam`
              : `${event.interviewTimeMins}min presentation`,
            icon: "schedule",
          },
        ].map((d) => (
          <div key={d.label} className="bg-surface-container-low rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-sm text-outline">
                {d.icon}
              </span>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">
                {d.label}
              </p>
            </div>
            <p className="text-sm text-on-surface capitalize">{d.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {event.hasExam && (
          <Link
            href="/exams"
            className="gradient-cta rounded-xl px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">quiz</span>
            Practice Exam
          </Link>
        )}
        <Link
          href="/roleplay"
          className="bg-surface-container-low rounded-xl px-5 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">record_voice_over</span>
          Role Play Practice
        </Link>
        <Link
          href="/pi-tracker"
          className="bg-surface-container-low rounded-xl px-5 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">target</span>
          PI Tracker
        </Link>
      </div>

      {/* Performance Indicators */}
      {eventPIs.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
            Performance Indicators ({eventPIs.length})
          </p>
          <div className="space-y-2">
            {eventPIs.map((pi) => {
              const prog = progress[pi.id];
              return (
                <div
                  key={pi.id}
                  className="bg-surface-container-low rounded-xl px-5 py-3 flex items-center justify-between hover:bg-surface-container transition-colors gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-xs font-mono text-outline">{pi.code}</span>
                      <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                        {pi.category}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface">{pi.text}</p>
                  </div>
                  <MasteryBadge status={prog?.status || "untested"} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Resources */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
          Official Resources
        </p>
        <div className="flex flex-wrap gap-3">
          {event.officialGuidelinesUrl && (
            <a
              href={event.officialGuidelinesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-low rounded-xl px-5 py-2.5 text-sm text-primary hover:bg-surface-container transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">description</span>
              Event Guidelines →
            </a>
          )}
          {event.officialPiPdfUrl && (
            <a
              href={event.officialPiPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-low rounded-xl px-5 py-2.5 text-sm text-primary hover:bg-surface-container transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">checklist</span>
              PI Document →
            </a>
          )}
          {event.officialSampleExamUrl && (
            <a
              href={event.officialSampleExamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-low rounded-xl px-5 py-2.5 text-sm text-primary hover:bg-surface-container transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">assignment</span>
              Sample Exam →
            </a>
          )}
        </div>
      </div>

      <PIAttribution pdfUrl={event.officialPiPdfUrl} />
    </div>
  );
}
