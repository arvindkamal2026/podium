"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getClientDb, getClientAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

async function userDocExists(uid: string): Promise<boolean> {
  const ref = doc(getClientDb(), `users/${uid}`);
  const snap = await getDoc(ref);
  return snap.exists();
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      router.push("/onboarding");
    } catch (err: unknown) {
      // If account already exists, sign them in with the same credentials
      if ((err as { code?: string }).code === "auth/email-already-in-use") {
        try {
          await signInWithEmail(email, password);
          router.push("/home");
          return;
        } catch {
          setError("An account with this email already exists. Please sign in.");
          setLoading(false);
          return;
        }
      }
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
      const uid = getClientAuth().currentUser?.uid;
      const hasProfile = uid ? await userDocExists(uid) : false;
      router.push(hasProfile ? "/home" : "/onboarding");
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
          GET STARTED
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight">
          Create your account
        </h1>
        <p className="text-on-surface-variant text-base">Free forever</p>
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
              placeholder="At least 6 characters"
              required
              className="bg-transparent border-none text-lg font-semibold text-on-surface placeholder:text-outline"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold tracking-widest text-primary uppercase">
              Confirm Password
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
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
          {loading ? "Creating account..." : "Create Account"}
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

      {/* Link to login */}
      <p className="text-center text-on-surface-variant text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
