export interface ParsedQuestion {
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
}

export type ParseResult =
  | { questions: ParsedQuestion[]; error?: never }
  | { questions?: never; error: string };

const PARSE_ERROR =
  "We couldn't parse this PDF — make sure it's a text-based PDF with questions in A/B/C/D format and an answer key.";

export function parsePdfText(rawText: string): ParseResult {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Matches question starts: "1. text" or "1) text"
  const questionStartRe = /^(\d+)[\.\)]\s+(.+)/;
  // Matches option lines: "A. text" or "A) text"
  const optionRe = /^([A-D])[\.\)]\s+(.+)/;
  // Matches answer key lines: "1. A" or "1) A" or "1. A." — number, then a SINGLE letter, nothing else
  const answerKeyLineRe = /^(\d+)[\.\)]\s*([A-D])\.?\s*$/;

  // --- Pass 1: build answer key map ---
  const answerMap: Record<number, "A" | "B" | "C" | "D"> = {};
  for (const line of lines) {
    const m = line.match(answerKeyLineRe);
    if (m) {
      answerMap[parseInt(m[1], 10)] = m[2] as "A" | "B" | "C" | "D";
    }
  }

  // --- Pass 2: parse questions and options ---
  type RawQ = {
    number: number;
    text: string;
    options: Partial<Record<"A" | "B" | "C" | "D", string>>;
    lastOptionKey: "A" | "B" | "C" | "D" | null;
  };

  const rawQuestions: RawQ[] = [];
  let current: RawQ | null = null;

  for (const line of lines) {
    // Skip answer key lines so they don't get appended to question text
    if (line.match(answerKeyLineRe)) {
      if (current) {
        rawQuestions.push(current);
        current = null;
      }
      continue;
    }

    const qm = line.match(questionStartRe);
    const om = line.match(optionRe);

    if (qm) {
      if (current) rawQuestions.push(current);
      current = { number: parseInt(qm[1], 10), text: qm[2], options: {}, lastOptionKey: null };
    } else if (om && current) {
      const key = om[1] as "A" | "B" | "C" | "D";
      current.options[key] = om[2];
      current.lastOptionKey = key;
    } else if (current) {
      if (current.lastOptionKey) {
        // Continuation of the most recently seen option text
        current.options[current.lastOptionKey] += " " + line;
      } else {
        // Continuation of question text (before any options appear)
        current.text += " " + line;
      }
    }
  }
  if (current) rawQuestions.push(current);

  // --- Validate ---
  if (rawQuestions.length < 5) {
    return { error: PARSE_ERROR };
  }

  const completeCount = rawQuestions.filter(
    (q) => q.options.A && q.options.B && q.options.C && q.options.D
  ).length;
  if (completeCount < rawQuestions.length * 0.8) {
    return { error: PARSE_ERROR };
  }

  if (Object.keys(answerMap).length < rawQuestions.length * 0.8) {
    return { error: PARSE_ERROR };
  }

  // --- Build output (skip any question missing options or answer) ---
  const questions: ParsedQuestion[] = [];
  for (const q of rawQuestions) {
    const { A, B, C, D } = q.options;
    const correctAnswer = answerMap[q.number];
    if (!A || !B || !C || !D || !correctAnswer) continue;
    questions.push({
      questionNumber: q.number,
      questionText: q.text.trim(),
      optionA: A,
      optionB: B,
      optionC: C,
      optionD: D,
      correctAnswer,
    });
  }

  if (questions.length < 5) {
    return { error: PARSE_ERROR };
  }

  return { questions };
}
