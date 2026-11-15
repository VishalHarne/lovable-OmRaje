import { useSyncExternalStore } from "react";

export const themes = ["classic", "ivory", "navy"] as const;
export type Theme = (typeof themes)[number];

export const defaultTheme: Theme = "ivory";

const listeners = new Set<() => void>();

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value);
}

function currentTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  const applied = document.documentElement.dataset["theme"];
  return isTheme(applied) ? applied : defaultTheme;
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset["theme"] === theme) return;

  // A short-lived class lets every surface cross-fade instead of snapping to the new palette.
  root.classList.add("theme-transition");
  root.dataset["theme"] = theme;
  window.setTimeout(() => root.classList.remove("theme-transition"), 450);

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme(): readonly [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => defaultTheme);
  return [theme, setTheme] as const;
}

// Apply the default palette before first paint; theme selections last for this visit only.
function applyDefaultTheme(theme: Theme) {
  document.documentElement.dataset["theme"] = theme;
}

export const themeBootstrapScript = `(${applyDefaultTheme.toString()})(${JSON.stringify(defaultTheme)})`;
