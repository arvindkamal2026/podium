export type ThemeMode = "dark" | "light";

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  mode: ThemeMode;
  swatches: string[];
  /** If set, this theme is a light/dark variant of the named theme id. */
  variantOf?: string;
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
    swatches: ["#1a3520", "#F8BC16", "#f5f5f0", "#204321"],
  },
  {
    id: "richland-raiders",
    label: "Richland Raiders",
    description: "Deep purple, black & lavender. Richland High School spirit colors.",
    mode: "light",
    swatches: ["#4D1979", "#000000", "#D4B8E0", "#ffffff"],
  },
  {
    id: "prosper-eagles-dark",
    label: "Prosper Eagles Dark",
    description: "Forest green & gold. Dark variant.",
    mode: "dark",
    swatches: ["#0b1e0d", "#F8BC16", "#4edea5", "#132c15"],
    variantOf: "prosper-eagles",
  },
];

export const DEFAULT_THEME = "podium-default";
