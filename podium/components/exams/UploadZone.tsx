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
      setDragging(false);
      if (disabled) return;
      validate(e.dataTransfer.files[0]);
    },
    [validate, disabled]
  );

  const displayError = localError || error;

  return (
    <div className="space-y-2">
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !disabled && inputRef.current?.click()}
        className={[
          "rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          "border-2 border-dashed",
          dragging
            ? "border-primary bg-primary/5"
            : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-4xl text-outline">
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
          onChange={(e) => validate(e.target.files?.[0])}
        />
      </div>
      {displayError && (
        <p className="text-sm text-error px-1">{displayError}</p>
      )}
    </div>
  );
}
