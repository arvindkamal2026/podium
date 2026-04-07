"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, type DocumentReference } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getClientDb, getClientAuth } from "@/lib/firebase/client";

export function useDocument<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }

    // Reset loading when path changes so consumers don't see stale data + loading=false
    setLoading(true);

    let unsubscribeSnapshot: (() => void) | undefined;
    let cancelled = false;

    const unsubscribeAuth = onAuthStateChanged(getClientAuth(), async (user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = undefined;
      }

      if (!user) {
        setData(null);
        setLoading(false);
        return;
      }

      // Force-refresh the ID token so Firestore's internal auth is synced
      try {
        await user.getIdToken(true);
      } catch {
        // Token refresh failed — likely offline or expired session
      }

      if (cancelled) return;

      const ref = doc(getClientDb(), path) as DocumentReference<T>;
      unsubscribeSnapshot = onSnapshot(
        ref,
        (snap) => {
          setData(snap.exists() ? (snap.data() as T) : null);
          setLoading(false);
        },
        (error) => {
          console.error(`Firestore listener error for ${path}:`, error.message);
          setLoading(false);
        }
      );
    });

    return () => {
      cancelled = true;
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [path]);

  return { data, loading };
}
