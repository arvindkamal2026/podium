"use client";

import { useTheme } from "@/context/ThemeContext";
import { THEMES } from "@/lib/themes";

export default function ThemesPage() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Themes</h1>
        <p className="text-outline mt-1">Choose a look for the entire app</p>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-8 space-y-5">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-outline">Appearance</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {THEMES.filter((t) => !t.variantOf).map((theme) => {
            const darkVariant = THEMES.find((t) => t.variantOf === theme.id && t.mode === "dark");
            const isFamilyActive = currentTheme.id === theme.id || currentTheme.variantOf === theme.id;
            const isDarkVariantActive = currentTheme.id === darkVariant?.id;
            const activeSwatches = isDarkVariantActive && darkVariant ? darkVariant.swatches : theme.swatches;

            return (
              <button
                key={theme.id}
                onClick={() => { if (!isFamilyActive) setTheme(darkVariant ? darkVariant.id : theme.id); }}
                className="text-left relative rounded-xl p-4 transition-colors bg-surface-container"
                style={{
                  border: isFamilyActive ? "2px solid var(--color-primary)" : "0.5px solid rgba(255,255,255,0.08)",
                  cursor: isFamilyActive ? "default" : "pointer",
                }}
              >
                {/* Sun/moon variant toggle — shown when this family is active and has a dark variant */}
                {isFamilyActive && darkVariant ? (
                  <div
                    className="absolute top-2.5 right-2.5 flex items-center rounded-full p-0.5"
                    style={{ background: "rgba(128,128,128,0.15)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setTheme(theme.id)}
                      title="Light"
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{
                        width: 24,
                        height: 24,
                        background: !isDarkVariantActive ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: !isDarkVariantActive ? "#F8BC16" : "currentColor" }}>
                        light_mode
                      </span>
                    </button>
                    <button
                      onClick={() => setTheme(darkVariant.id)}
                      title="Dark"
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{
                        width: 24,
                        height: 24,
                        background: isDarkVariantActive ? "rgba(255,255,255,0.2)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: isDarkVariantActive ? "#F8BC16" : "currentColor" }}>
                        dark_mode
                      </span>
                    </button>
                  </div>
                ) : !isFamilyActive && theme.mode === "light" ? (
                  <span
                    className="absolute top-2.5 right-2.5 text-[11px] font-medium rounded-full px-2 py-0.5"
                    style={{ background: "rgba(255,185,95,0.15)", color: "#FFB95F" }}
                  >
                    Light
                  </span>
                ) : !isFamilyActive ? (
                  null
                ) : (
                  <span
                    className="absolute top-2.5 right-2.5 text-[11px] font-medium rounded-full px-2 py-0.5"
                    style={{ background: "rgba(77,142,255,0.15)", color: "#ADC6FF" }}
                  >
                    Active
                  </span>
                )}

                {/* Mini UI preview — hardcoded hex so it always shows correctly */}
                {theme.id === "richland-raiders" && !isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(77,25,121,0.2)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#000000" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#D4B8E0" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#1a1a1a" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#1a1a1a" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#f0e8f8" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#4D1979" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#ffffff" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#d4c0e8" }} />
                    </div>
                  </div>
                )}
                {theme.id === "richland-raiders" && isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(212,184,224,0.15)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#0d0810" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#D4B8E0" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#1a0d2e" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#1a0d2e" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#130a1e" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#D4B8E0" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#6b3fa0" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#1a0d2e" }} />
                    </div>
                  </div>
                )}
                {theme.id === "podium-default" && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#0a0a0f" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#ADC6FF" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#1a1a2e" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#1a1a2e" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#111118" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#4D8EFF" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#FFB95F" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#1e1e2c" }} />
                    </div>
                  </div>
                )}
                {theme.id === "prosper-eagles" && !isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(0,0,0,0.1)" }}>
                    <div className="flex" style={{ height: 66 }}>
                      <div className="flex flex-col justify-center gap-1 px-1.5" style={{ width: 32, background: "#1a3520" }}>
                        <div className="rounded-sm" style={{ height: 4, background: "#F8BC16" }} />
                        <div className="rounded-sm" style={{ height: 4, background: "rgba(255,255,255,0.2)" }} />
                        <div className="rounded-sm" style={{ height: 4, background: "rgba(255,255,255,0.2)" }} />
                        <div className="rounded-sm" style={{ height: 4, background: "rgba(255,255,255,0.2)" }} />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5 px-2 justify-center" style={{ background: "#f5f5f0" }}>
                        <div className="rounded" style={{ width: 40, height: 8, background: "#204321" }} />
                        <div className="rounded" style={{ width: 28, height: 8, background: "#F8BC16" }} />
                        <div className="rounded" style={{ width: 50, height: 5, background: "#e8f0e9" }} />
                      </div>
                    </div>
                  </div>
                )}
                {theme.id === "prosper-eagles" && isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#070f08" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#F8BC16" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#132c15" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#132c15" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#0b1e0d" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#F8BC16" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#4edea5" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#132c15" }} />
                    </div>
                  </div>
                )}

                {theme.id === "rock-hill-hawks" && !isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(26,139,190,0.2)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#0D0D0D" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#1A8BBE" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#1a1a1a" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#1a1a1a" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#EEF4F8" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#1A8BBE" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#0D0D0D" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#C0D8E8" }} />
                    </div>
                  </div>
                )}
                {theme.id === "rock-hill-hawks" && isDarkVariantActive && (
                  <div className="rounded-lg overflow-hidden mb-3" style={{ border: "0.5px solid rgba(26,139,190,0.15)" }}>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 22, background: "#090C0F" }}>
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#3DB8F5" }} />
                      <div className="rounded" style={{ width: 32, height: 6, background: "#151A1F" }} />
                      <div className="rounded ml-auto" style={{ width: 20, height: 6, background: "#151A1F" }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2" style={{ height: 44, background: "#151A1F" }}>
                      <div className="rounded" style={{ width: 40, height: 14, background: "#1A8BBE" }} />
                      <div className="rounded" style={{ width: 28, height: 14, background: "#3DB8F5" }} />
                      <div className="rounded ml-auto" style={{ width: 50, height: 6, background: "#1C2329" }} />
                    </div>
                  </div>
                )}

                {/* Swatch row */}
                <div className="flex gap-1.5 mb-3">
                  {activeSwatches.map((color, i) => (
                    <div
                      key={i}
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        background: color,
                        border: color === "#f5f5f0" || color === "#ffffff" ? "0.5px solid #ddd" : undefined,
                      }}
                    />
                  ))}
                </div>

                <p className="text-sm font-medium text-on-surface mb-0.5">{theme.label}</p>
                <p className="text-xs text-outline leading-relaxed">{theme.description}</p>
              </button>
            );
          })}

          {/* Coming soon */}
          <div
            className="rounded-xl p-4 bg-surface-container"
            style={{
              opacity: 0.5,
              pointerEvents: "none",
              border: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-sm font-medium text-on-surface mb-0.5">More coming soon</p>
            <p className="text-xs text-outline leading-relaxed">Submit your school&apos;s colors to get featured.</p>
          </div>
        </div>

        <p className="text-xs text-outline">Themes change the overall look and feel of the entire app.</p>
      </div>
    </div>
  );
}
