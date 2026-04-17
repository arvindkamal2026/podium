"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocument } from "@/lib/hooks/useFirestore";
import { collection, onSnapshot } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { VOCAB_WORDS } from "@/data/vocab-words";
import { Flashcard } from "@/components/vocab/Flashcard";
import { MultipleChoice } from "@/components/vocab/MultipleChoice";
import { TypeAnswer } from "@/components/vocab/TypeAnswer";
import { VocabProgress } from "@/components/vocab/VocabProgress";
import { VocabAttribution } from "@/components/legal/VocabAttribution";
import { updateVocabProgress } from "@/lib/actions/vocab";

interface UserProfile {
  eventId: string;
  cluster: string;
}

interface VocabProgressData {
  status: "mastered" | "learning" | "untested";
  lastTested: string | null;
}

type StudyMode = "flashcard" | "multiple-choice" | "type-answer";
type StatusFilter = "all" | "learning" | "mastered" | "untested";

const STATUS_DOT: Record<string, string> = {
  mastered: "bg-tertiary",
  learning: "bg-secondary-ds",
  untested: "bg-error",
};

export default function VocabPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );
  const [progress, setProgress] = useState<Record<string, VocabProgressData>>(
    {}
  );
  const [progressLoading, setProgressLoading] = useState(true);
  const [mode, setMode] = useState<StudyMode>("flashcard");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [listExpanded, setListExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const ref = collection(getClientDb(), `users/${user.uid}/vocabProgress`);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const map: Record<string, VocabProgressData> = {};
      snap.forEach((doc) => {
        map[doc.id] = doc.data() as VocabProgressData;
      });
      setProgress(map);
      setProgressLoading(false);
    });
    return unsubscribe;
  }, [user]);

  // All cluster words sorted by spaced repetition
  const allWords = useMemo(() => {
    const clusterWords = VOCAB_WORDS.filter(
      (w) => w.cluster === profile?.cluster
    );
    return clusterWords.sort((a, b) => {
      const pa = progress[a.id];
      const pb = progress[b.id];
      const statusOrder = { untested: 0, learning: 1, mastered: 2 };
      const sa = statusOrder[pa?.status || "untested"];
      const sb = statusOrder[pb?.status || "untested"];
      if (sa !== sb) return sa - sb;
      const ta = pa?.lastTested || "0";
      const tb = pb?.lastTested || "0";
      return ta.localeCompare(tb);
    });
  }, [profile?.cluster, progress]);

  // Apply status filter to study queue
  const words = useMemo(() => {
    if (statusFilter === "all") return allWords;
    return allWords.filter((w) => {
      const status = progress[w.id]?.status ?? "untested";
      return status === statusFilter;
    });
  }, [allWords, statusFilter, progress]);

  const currentWord = words[currentIndex] ?? words[0];

  // Reset to start when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [statusFilter]);

  const handleResult = useCallback(
    async (correct: boolean) => {
      if (currentWord) {
        await updateVocabProgress(currentWord.id, correct);
      }
      setCurrentIndex((i) => (i + 1) % Math.max(words.length, 1));
    },
    [currentWord, words.length]
  );

  const mastered = allWords.filter((w) => progress[w.id]?.status === "mastered").length;
  const learning = allWords.filter((w) => progress[w.id]?.status === "learning").length;
  const untested = allWords.length - mastered - learning;

  const STATUS_FILTERS: { key: StatusFilter; label: string; count: number; color: string; activeClass: string }[] = [
    { key: "all",      label: "All",         count: allWords.length, color: "text-on-surface",    activeClass: "bg-primary text-on-primary" },
    { key: "learning", label: "Didn't Know", count: learning,        color: "text-secondary-ds",  activeClass: "bg-secondary-ds/20 text-secondary-ds border border-secondary-ds/30" },
    { key: "mastered", label: "Mastered",    count: mastered,        color: "text-tertiary",       activeClass: "bg-tertiary/20 text-tertiary border border-tertiary/30" },
    { key: "untested", label: "Not Started", count: untested,        color: "text-error",          activeClass: "bg-error/20 text-error border border-error/30" },
  ];

  if (authLoading || profileLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Vocab Flashcards
        </h1>
        <p className="text-outline mt-1">
          {profile?.cluster?.replace("-", " ")} cluster &middot; {allWords.length}{" "}
          terms
        </p>
      </div>

      <VocabProgress mastered={mastered} learning={learning} total={allWords.length} />

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              statusFilter === f.key
                ? f.activeClass
                : "bg-surface-container-low text-outline hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            {f.label}
            <span className={`text-xs font-bold tabular-nums ${statusFilter === f.key ? "" : f.color}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        {(["flashcard", "multiple-choice", "type-answer"] as StudyMode[]).map(
          (m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-surface-container text-on-surface"
                  : "bg-surface-container-low text-outline hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {m === "flashcard"
                ? "Flashcards"
                : m === "multiple-choice"
                  ? "Multiple Choice"
                  : "Type Answer"}
            </button>
          )
        )}
      </div>

      {/* Study Area */}
      {words.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-8 text-center">
          <p className="text-sm text-outline">
            {statusFilter === "all"
              ? "No vocab words available for your cluster yet."
              : `No words in this category yet. Keep studying!`}
          </p>
        </div>
      ) : currentWord ? (
        <div>
          <p className="text-xs text-outline mb-4">
            {currentIndex + 1} of {words.length}
          </p>
          {mode === "flashcard" && (
            <Flashcard
              term={currentWord.term}
              definition={currentWord.definition}
              example={currentWord.example}
              onResult={handleResult}
            />
          )}
          {mode === "multiple-choice" && (
            <MultipleChoice
              word={currentWord}
              allWords={words}
              onResult={handleResult}
            />
          )}
          {mode === "type-answer" && (
            <TypeAnswer
              term={currentWord.term}
              definition={currentWord.definition}
              onResult={handleResult}
            />
          )}
        </div>
      ) : null}

      {/* Word List */}
      {allWords.length > 0 && (
        <div className="bg-surface-container-low rounded-2xl overflow-hidden">
          <button
            onClick={() => setListExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            <span>
              {statusFilter === "all" ? "All words" : STATUS_FILTERS.find((f) => f.key === statusFilter)?.label}{" "}
              <span className="text-outline font-normal">({words.length})</span>
            </span>
            <span className="material-symbols-outlined text-outline text-lg transition-transform" style={{ transform: listExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
              expand_more
            </span>
          </button>

          {listExpanded && (
            <div className="divide-y divide-outline-variant/10 max-h-96 overflow-y-auto">
              {words.map((w, idx) => {
                const status = progress[w.id]?.status ?? "untested";
                return (
                  <button
                    key={w.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors hover:bg-surface-container ${
                      idx === currentIndex ? "bg-surface-container" : ""
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{w.term}</p>
                      <p className="text-xs text-outline truncate">{w.definition}</p>
                    </div>
                    <span className={`text-xs font-semibold flex-shrink-0 capitalize ${
                      status === "mastered" ? "text-tertiary" :
                      status === "learning" ? "text-secondary-ds" :
                      "text-error"
                    }`}>
                      {status === "untested" ? "new" : status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <VocabAttribution />
    </div>
  );
}
