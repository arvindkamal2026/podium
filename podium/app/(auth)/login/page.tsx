"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithGoogle, signInWithApple, signInAsGuest } from "@/lib/firebase/auth";
import { createGuestProfile } from "@/lib/actions/guest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  const message = (err as { message?: string })?.message;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in popup was closed. Please try again.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups for this site.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Please contact support.";
    case "auth/unauthorized-domain":
      return "Sign-in is not authorised for this domain. Please contact support.";
    default:
      if (message === "guest-profile-failed") return "Couldn't set up guest session. Please try again.";
      return "Something went wrong. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestPrompt, setGuestPrompt] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace("/home");
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/home");
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleApple() {
    setError("");
    setLoading(true);
    try {
      await signInWithApple();
      router.replace("/home");
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestSetup() {
    setError("");
    setLoading(true);
    try {
      await signInAsGuest();
      router.replace("/onboarding");
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestBrowse() {
    setError("");
    setLoading(true);
    try {
      await signInAsGuest();
      const result = await createGuestProfile();
      if (!result.success) throw new Error("guest-profile-failed");
      router.replace("/home");
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          WELCOME BACK
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
          Sign in to Podium
        </h1>
        <p className="text-on-surface-variant text-base">
          Pick up where you left off
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-6 space-y-4 transition-colors">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-transparent border-none text-lg font-semibold text-on-surface placeholder:text-outline"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="bg-transparent border-none text-lg font-semibold text-on-surface placeholder:text-outline"
            />
          </div>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full gradient-cta py-6 shadow-xl shadow-primary/10 text-base font-bold rounded-xl"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-outline-variant/20" />
        <span className="text-on-surface-variant text-xs">or</span>
        <div className="flex-1 h-px bg-outline-variant/20" />
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full bg-surface-container-low ghost-border hover:bg-surface-container text-on-surface py-6 text-base font-semibold rounded-xl"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Apple Sign In */}
      <Button
        type="button"
        onClick={handleApple}
        disabled={loading}
        className="w-full bg-surface-container-low ghost-border hover:bg-surface-container text-on-surface py-6 text-base font-semibold rounded-xl"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
        Continue with Apple
      </Button>

      {/* Link to signup */}
      <p className="text-center text-on-surface-variant text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>

      {/* Guest preview */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-outline-variant/20" />
        <span className="text-on-surface-variant text-xs">just browsing?</span>
        <div className="flex-1 h-px bg-outline-variant/20" />
      </div>

      {!guestPrompt ? (
        <Button
          type="button"
          onClick={() => setGuestPrompt(true)}
          disabled={loading}
          className="w-full bg-surface-container-low ghost-border hover:bg-surface-container text-outline hover:text-on-surface py-6 text-base font-semibold rounded-xl"
        >
          <span className="material-symbols-outlined text-lg mr-2">visibility</span>
          Preview as Guest
        </Button>
      ) : (
        <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary-ds text-xl mt-0.5">info</span>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <span className="text-on-surface font-semibold">Changes won&apos;t be saved</span> in guest mode. Your progress, scores, and settings will be lost when you leave.
            </p>
          </div>
          <p className="text-sm text-on-surface font-medium">
            Want to set up your DECA event first for a personalised experience?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={handleGuestSetup}
              disabled={loading}
              className="w-full gradient-cta py-3 text-sm font-bold rounded-xl"
            >
              {loading ? "Loading..." : "Yes, set up my event"}
            </Button>
            <Button
              type="button"
              onClick={handleGuestBrowse}
              disabled={loading}
              className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant py-3 text-sm font-semibold rounded-xl"
            >
              {loading ? "Loading..." : "No, just browse"}
            </Button>
            <button
              type="button"
              onClick={() => setGuestPrompt(false)}
              className="text-xs text-outline hover:text-on-surface-variant transition-colors text-center pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
