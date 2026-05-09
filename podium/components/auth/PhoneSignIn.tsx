"use client";

import { useState, useRef, useEffect } from "react";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneSignInProps {
  onSuccess: () => void;
  disabled?: boolean;
}

function friendlyPhoneError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  console.error("[PhoneSignIn] Firebase error:", code, err);
  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid phone number. Include your country code (e.g. +1 for US).";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/code-expired":
      return "Code expired. Please request a new one.";
    case "auth/invalid-verification-code":
      return "Incorrect code. Please try again.";
    case "auth/missing-phone-number":
      return "Please enter your phone number.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA check failed. Please refresh and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function PhoneSignIn({ onSuccess, disabled }: PhoneSignInProps) {
  const [step, setStep] = useState<"idle" | "phone" | "otp">("idle");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current?.clear();
    };
  }, []);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Clear any previous verifier
      recaptchaVerifierRef.current?.clear();

      const verifier = new RecaptchaVerifier(
        getClientAuth(),
        recaptchaContainerRef.current!,
        { size: "invisible" }
      );
      recaptchaVerifierRef.current = verifier;

      const result = await signInWithPhoneNumber(getClientAuth(), phone, verifier);
      setConfirmation(result);
      setStep("otp");
    } catch (err: unknown) {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      setError(friendlyPhoneError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmation) return;
    setError("");
    setLoading(true);
    try {
      const credential = await confirmation.confirm(otp);
      // Set session cookie
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Session creation failed");
      await res.json();
      onSuccess();
    } catch (err: unknown) {
      setError(friendlyPhoneError(err));
    } finally {
      setLoading(false);
    }
  }

  if (step === "idle") {
    return (
      <Button
        type="button"
        onClick={() => setStep("phone")}
        disabled={disabled}
        className="w-full bg-surface-container-low ghost-border hover:bg-surface-container text-on-surface py-6 text-base font-semibold rounded-xl"
      >
        <span className="material-symbols-outlined text-lg mr-2">phone</span>
        Continue with Phone
      </Button>
    );
  }

  if (step === "phone") {
    return (
      <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-on-surface">Enter your phone number</p>
          <button
            type="button"
            onClick={() => { setStep("idle"); setError(""); setPhone(""); }}
            className="text-xs text-outline hover:text-on-surface-variant transition-colors"
          >
            Cancel
          </button>
        </div>
        <form onSubmit={handleSendCode} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Phone Number
            </Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              autoFocus
              className="bg-surface-container border-none text-base font-semibold text-on-surface placeholder:text-outline"
            />
            <p className="text-[11px] text-outline">Include country code, e.g. +1 for US</p>
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          {/* Invisible recaptcha container */}
          <div ref={recaptchaContainerRef} />
          <Button
            type="submit"
            disabled={loading || !phone}
            className="w-full gradient-cta py-3 text-sm font-bold rounded-xl"
          >
            {loading ? "Sending..." : "Send Code"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-on-surface">Enter the code we sent to</p>
        <button
          type="button"
          onClick={() => { setStep("phone"); setError(""); setOtp(""); }}
          className="text-xs text-outline hover:text-on-surface-variant transition-colors"
        >
          Change number
        </button>
      </div>
      <p className="text-sm text-primary-container font-medium">{phone}</p>
      <form onSubmit={handleVerifyCode} className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
            Verification Code
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            autoFocus
            maxLength={6}
            className="bg-surface-container border-none text-2xl font-bold text-on-surface tracking-[0.5em] placeholder:text-outline placeholder:tracking-normal"
          />
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full gradient-cta py-3 text-sm font-bold rounded-xl"
        >
          {loading ? "Verifying..." : "Verify & Sign In"}
        </Button>
      </form>
    </div>
  );
}
