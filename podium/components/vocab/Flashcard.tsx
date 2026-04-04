"use client";
import { useState } from "react";

interface FlashcardProps {
  term: string;
  definition: string;
  example: string;
  onResult: (correct: boolean) => void;
}

export function Flashcard({ term, definition, example, onResult }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-6">
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer perspective-1000"
      >
        <div
          className={`relative w-full min-h-[280px] transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-surface-container-low rounded-2xl p-8 flex flex-col items-center justify-center">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
              Term
            </p>
            <p className="font-headline text-2xl font-bold text-on-surface text-center">
              {term}
            </p>
            <p className="text-xs text-outline mt-6">Click to reveal definition</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-surface-container-low rounded-2xl p-8 flex flex-col justify-center">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-3">
              Definition
            </p>
            <p className="text-sm text-on-surface leading-relaxed mb-4">
              {definition}
            </p>
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-2">
              Example
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed italic">
              {example}
            </p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onResult(false);
              setFlipped(false);
            }}
            className="flex items-center gap-2 bg-error/10 text-error rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-error/20 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
            Didn&apos;t Know
          </button>
          <button
            onClick={() => {
              onResult(true);
              setFlipped(false);
            }}
            className="flex items-center gap-2 bg-tertiary/10 text-tertiary rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-tertiary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">check</span>
            Got It
          </button>
        </div>
      )}
    </div>
  );
}
