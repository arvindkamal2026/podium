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
  {
    id: "rock-hill-hawks",
    label: "Rock Hill Hawks",
    description: "Electric blue and black. Rock Hill Hawks spirit colors.",
    mode: "light",
    swatches: ["#1A8BBE", "#0D0D0D", "#D6EEF8", "#FFFFFF"],
  },
  {
    id: "rock-hill-hawks-dark",
    label: "Rock Hill Hawks (Dark)",
    description: "Deep navy blacks with electric blue. Rock Hill Hawks spirit colors.",
    mode: "dark",
    swatches: ["#1A8BBE", "#3DB8F5", "#0E2A3A", "#0D0F11"],
    variantOf: "rock-hill-hawks",
  },
  {
    id: "richland-raiders-dark",
    label: "Richland Raiders Dark",
    description: "Deep purple & lavender. Dark variant.",
    mode: "dark",
    swatches: ["#0d0810", "#D4B8E0", "#6b3fa0", "#1a0d2e"],
    variantOf: "richland-raiders",
  },
];

export const DEFAULT_THEME = "podium-default";
