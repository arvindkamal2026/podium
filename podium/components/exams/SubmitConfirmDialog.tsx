"use client";

interface SubmitConfirmDialogProps {
  unansweredCount: number;
  flaggedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitConfirmDialog({
  unansweredCount,
  flaggedCount,
  onConfirm,
  onCancel,
}: SubmitConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-surface-container rounded-2xl w-full max-w-sm p-8 space-y-5">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="material-symbols-outlined text-2xl text-secondary-ds shrink-0">
            warning
          </span>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Submit anyway?
            </h3>
            <div className="mt-2 space-y-1 text-sm text-outline">
              {unansweredCount > 0 && (
                <p>
                  {unansweredCount} question{unansweredCount !== 1 ? "s" : ""} unanswered
                </p>
              )}
              {flaggedCount > 0 && (
                <p>
                  {flaggedCount} question{flaggedCount !== 1 ? "s" : ""} flagged for review
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 gradient-cta rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
