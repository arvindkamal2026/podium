"use client";

import { useRef, useState, useCallback } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  error?: string;
  disabled?: boolean;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function UploadZone({ onFile, error, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      if (file.type !== "application/pdf") {
        setLocalError("Please upload a PDF file.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setLocalError("File is too large. Maximum size is 5 MB.");
        return;
      }
      setLocalError(null);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragging(false);
      if (disabled) return;
      if (e.dataTransfer.files.length > 1) {
        setLocalError("Please upload one PDF at a time.");
        return;
      }
      validate(e.dataTransfer.files[0]);
    },
    [validate, disabled]
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      dragCounter.current++;
      setDragging(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const displayError = localError || error;

  return (
    <div className="space-y-2">
      {/* border-dashed is intentional here — the design spec permits it as a drop-target affordance */}
      <div
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload PDF file"
        aria-disabled={disabled}
        className={[
          "rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          "border-2 border-dashed",
          dragging
            ? "border-primary bg-primary/5"
            : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span aria-hidden="true" className="material-symbols-outlined text-4xl text-outline">
          upload_file
        </span>
        <div className="text-center">
          <p className="text-sm font-medium text-on-surface">
            Drop your PDF here or{" "}
            <span className="text-primary underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-outline mt-1">
            PDF only · max 5 MB · must include an answer key
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            validate(e.target.files?.[0]);
            e.target.value = ""; // allow re-upload of the same file
          }}
        />
      </div>
      {displayError && (
        <p role="alert" className="text-sm text-error px-1">{displayError}</p>
      )}
    </div>
  );
}
