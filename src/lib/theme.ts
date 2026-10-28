import { useSyncExternalStore } from "react";

export const themes = ["classic", "ivory", "navy"] as const;
export type Theme = (typeof themes)[number];

export const defaultTheme: Theme = "classic";
export const themeStorageKey = "om-raje-theme";

const listeners = new Set<() => void>();

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value);
}

function currentTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  const applied = document.documentElement.dataset.theme;
  return isTheme(applied) ? applied : defaultTheme;
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;

  // A short-lived class lets every surface cross-fade instead of snapping to the new palette.
  root.classList.add("theme-transition");
  root.dataset.theme = theme;
  window.setTimeout(() => root.classList.remove("theme-transition"), 450);

  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
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

// Runs in <head> before first paint so a saved theme never flashes the default palette.
// `?theme=...` in the address selects and remembers a theme, which makes demo links easy to share.
function applySavedTheme(key: string, allowed: readonly string[]) {
  try {
    const requested = new URLSearchParams(window.location.search).get("theme");
    const stored = window.localStorage.getItem(key);
    const choice = requested && allowed.includes(requested) ? requested : stored;
    if (choice && allowed.includes(choice)) {
      document.documentElement.dataset.theme = choice;
      if (choice === requested) window.localStorage.setItem(key, choice);
    }
  } catch {
    // Storage or URL access can be blocked; the default theme still renders.
  }
}

export const themeBootstrapScript = `(${applySavedTheme.toString()})(${JSON.stringify(themeStorageKey)},${JSON.stringify(themes)})`;
