import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getClientAuth } from "./client";

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(getClientAuth(), email, password);
  await setSessionCookie(credential.user);
  return credential.user;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
  await setSessionCookie(credential.user);
  return credential.user;
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(getClientAuth(), googleProvider);
  await setSessionCookie(credential.user);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(getClientAuth());
  await fetch("/api/auth/session", { method: "DELETE" });
}

async function setSessionCookie(user: User) {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error("Failed to create session");
  }
  // Ensure the browser has processed the Set-Cookie header before navigating
  await res.json();
}
