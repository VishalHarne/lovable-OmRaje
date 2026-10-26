import { themes, useTheme, type Theme } from "@/lib/theme";

const labels: Record<Theme, { en: string; mr: string }> = {
  classic: { en: "Classic", mr: "क्लासिक" },
  ivory: { en: "Ivory", mr: "आयव्हरी" },
  saffron: { en: "Saffron", mr: "केशरी" },
  orange: { en: "Orange", mr: "नारिंगी" },
  monsoon: { en: "Monsoon", mr: "पावसाळी" },
  indigo: { en: "Indigo", mr: "इंडिगो" },
  "bottle-green": { en: "Bottle Green", mr: "बॉटल ग्रीन" },
};

export function ThemeSwitcher({ language }: { language: "en" | "mr" }) {
  const [theme, setTheme] = useTheme();

  return (
    <div
      className="theme-switcher"
      role="radiogroup"
      aria-label={language === "en" ? "Colour theme" : "रंगसंगती"}
    >
      {themes.map((id) => {
        const label = labels[id][language];
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={theme === id}
            aria-label={label}
            title={label}
            className="theme-option"
            data-theme-option={id}
            onClick={() => setTheme(id)}
          >
            <span className="theme-swatch" aria-hidden="true" />
            <span className="theme-label" aria-hidden="true">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
