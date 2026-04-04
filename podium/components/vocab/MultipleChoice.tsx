"use client";
import { useState, useMemo } from "react";
import type { VocabWord } from "@/data/vocab-words";

interface MultipleChoiceProps {
  word: VocabWord;
  allWords: VocabWord[];
  onResult: (correct: boolean) => void;
}

export function MultipleChoice({ word, allWords, onResult }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = useMemo(() => {
    const others = allWords.filter((w) => w.id !== word.id);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [
      ...shuffled.map((w) => ({ id: w.id, text: w.definition })),
      { id: word.id, text: word.definition },
    ];
    return all.sort(() => Math.random() - 0.5);
  }, [word, allWords]);

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => {
      onResult(selected === word.id);
      setSelected(null);
      setSubmitted(false);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low rounded-2xl p-8 text-center">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline mb-4">
          What does this term mean?
        </p>
        <p className="font-headline text-2xl font-bold text-on-surface">
          {word.term}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((opt) => {
          let classes =
            "w-full text-left rounded-xl px-5 py-3 text-sm transition-all duration-200 border-l-[3px]";
          if (submitted && opt.id === word.id) {
            classes += " bg-tertiary/10 text-tertiary border-l-tertiary";
          } else if (submitted && opt.id === selected) {
            classes += " bg-error/10 text-error border-l-error";
          } else if (opt.id === selected) {
            classes += " bg-primary/[0.08] text-primary border-l-primary";
          } else {
            classes +=
              " bg-surface-container-low text-on-surface hover:bg-surface-container border-l-transparent";
          }

          return (
            <button
              key={opt.id}
              onClick={() => !submitted && setSelected(opt.id)}
              disabled={submitted}
              className={classes}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="gradient-cta rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
