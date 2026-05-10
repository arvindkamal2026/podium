import type { UploadedTest } from "@/lib/actions/uploaded-tests";

interface TestCardProps {
  test: UploadedTest;
  onOpen: (testId: string) => void;
}

export function TestCard({ test, onOpen }: TestCardProps) {
  const date = new Date(test.uploadedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      onClick={() => onOpen(test.id)}
      className="w-full text-left bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container transition-colors group relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 rounded-l-2xl bg-primary transition-all duration-200" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="font-headline text-base font-semibold text-on-surface truncate">
            {test.testName}
          </p>
          <p className="text-xs text-outline">
            {test.questionCount} questions · Uploaded {date}
          </p>
        </div>
        <span className="material-symbols-outlined text-xl text-outline group-hover:text-primary transition-colors shrink-0">
          play_circle
        </span>
      </div>
    </button>
  );
}
