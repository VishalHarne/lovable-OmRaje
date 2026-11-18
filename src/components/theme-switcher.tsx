import { themes, useTheme, type Theme } from "@/lib/theme";

const labels: Record<Theme, { en: string; hi: string; mr: string }> = {
  classic: { en: "Classic", hi: "क्लासिक", mr: "क्लासिक" },
  ivory: { en: "Ivory", hi: "सफ़ेद", mr: "पांढरी" },
  navy: { en: "Navy", hi: "नेवी", mr: "नेव्ही" },
};

const themeGroupLabel = { en: "Colour theme", hi: "रंग रूप", mr: "रंगसंगती" };

export function ThemeSwitcher({ language }: { language: "en" | "hi" | "mr" }) {
  const [theme, setTheme] = useTheme();

  return (
    <div
      className="theme-switcher"
      role="radiogroup"
      aria-label={themeGroupLabel[language]}
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
