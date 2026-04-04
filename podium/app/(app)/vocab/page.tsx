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

  // Filter words by user's cluster, with spaced repetition ordering
  const words = useMemo(() => {
    const clusterWords = VOCAB_WORDS.filter(
      (w) => w.cluster === profile?.cluster
    );
    // Weighted ordering: untested first, then learning (oldest first), then mastered
    return clusterWords.sort((a, b) => {
      const pa = progress[a.id];
      const pb = progress[b.id];
      const statusOrder = { untested: 0, learning: 1, mastered: 2 };
      const sa = statusOrder[pa?.status || "untested"];
      const sb = statusOrder[pb?.status || "untested"];
      if (sa !== sb) return sa - sb;
      // Within same status, oldest tested first
      const ta = pa?.lastTested || "0";
      const tb = pb?.lastTested || "0";
      return ta.localeCompare(tb);
    });
  }, [profile?.cluster, progress]);

  const currentWord = words[currentIndex];

  const handleResult = useCallback(
    async (correct: boolean) => {
      if (currentWord) {
        await updateVocabProgress(currentWord.id, correct);
      }
      setCurrentIndex((i) => (i + 1) % Math.max(words.length, 1));
    },
    [currentWord, words.length]
  );

  if (authLoading || profileLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-outline animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  const mastered = words.filter(
    (w) => progress[w.id]?.status === "mastered"
  ).length;
  const learning = words.filter(
    (w) => progress[w.id]?.status === "learning"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Vocab Flashcards
        </h1>
        <p className="text-outline mt-1">
          {profile?.cluster?.replace("-", " ")} cluster &middot; {words.length}{" "}
          terms
        </p>
      </div>

      <VocabProgress mastered={mastered} learning={learning} total={words.length} />

      {/* Mode Selector */}
      <div className="flex gap-2">
        {(["flashcard", "multiple-choice", "type-answer"] as StudyMode[]).map(
          (m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-primary text-on-primary"
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
            No vocab words available for your cluster yet.
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

      <VocabAttribution />
    </div>
  );
}
