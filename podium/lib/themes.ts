export type ThemeMode = "dark" | "light";

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  mode: ThemeMode;
  swatches: string[];
}

export const THEMES: ThemePreset[] = [
  {
    id: "podium-default",
    label: "Podium Default",
    description: "Executive Brutalism. Obsidian dark, electric blue, amber gold.",
    mode: "dark",
    swatches: ["#0a0a0f", "#4D8EFF", "#FFB95F", "#ADC6FF"],
  },
  {
    id: "prosper-eagles",
    label: "Prosper Eagles",
    description: "Forest green & gold. Prosper High School spirit colors.",
    mode: "light",
    swatches: ["#204321", "#F8BC16", "#ffffff", "#E9EDEF"],
  },
];

export const DEFAULT_THEME = "podium-default";
