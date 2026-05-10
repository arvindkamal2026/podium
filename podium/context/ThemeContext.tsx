"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getClientAuth, getClientDb } from "@/lib/firebase/client";
import { updateTheme } from "@/lib/actions/profile";
import { THEMES, DEFAULT_THEME, type ThemePreset } from "@/lib/themes";

interface ThemeContextValue {
  currentTheme: ThemePreset;
  setTheme: (id: string) => Promise<void>;
  isThemeLoading: boolean;
}

const defaultTheme = THEMES.find((t) => t.id === DEFAULT_THEME)!;

const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: defaultTheme,
  setTheme: async () => {},
  isThemeLoading: true,
});

function applyTheme(themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId) ?? defaultTheme;
  document.documentElement.setAttribute("data-theme", themeId);
  document.documentElement.style.colorScheme = theme.mode;
  localStorage.setItem("podium-theme", themeId);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME);
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    let unsubSnapshot: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(getClientAuth(), (user) => {
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = undefined;
      }

      if (!user) {
        const stored = localStorage.getItem("podium-theme");
        if (stored && THEMES.some((t) => t.id === stored)) setThemeId(stored);
        setIsThemeLoading(false);
        return;
      }

      unsubSnapshot = onSnapshot(doc(getClientDb(), `users/${user.uid}`), (snap) => {
        if (snap.exists()) {
          const saved = snap.data().theme as string | undefined;
          if (saved && THEMES.some((t) => t.id === saved)) {
            setThemeId(saved);
          } else {
            updateTheme(DEFAULT_THEME);
          }
        }
        setIsThemeLoading(false);
      });
    });

    return () => {
      unsubAuth();
      unsubSnapshot?.();
    };
  }, []);

  async function handleSetTheme(id: string) {
    if (!THEMES.some((t) => t.id === id)) return;
    setThemeId(id);
    await updateTheme(id);
  }

  const currentTheme = THEMES.find((t) => t.id === themeId) ?? defaultTheme;

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme, isThemeLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
