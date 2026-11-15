import { themes, useTheme, type Theme } from "@/lib/theme";

const labels: Record<Theme, { hi: string; mr: string }> = {
  classic: { hi: "क्लासिक", mr: "क्लासिक" },
  ivory: { hi: "सफ़ेद", mr: "पांढरी" },
  navy: { hi: "नेवी", mr: "नेव्ही" },
};

export function ThemeSwitcher({ language }: { language: "hi" | "mr" }) {
  const [theme, setTheme] = useTheme();

  return (
    <div
      className="theme-switcher"
      role="radiogroup"
      aria-label={language === "mr" ? "रंगसंगती" : "रंग रूप"}
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
