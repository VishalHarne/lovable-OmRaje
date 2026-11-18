import type { Lang } from "@/lib/fb-posts";

const options: { id: Lang; label: string; name: string }[] = [
  { id: "mr", label: "मराठी", name: "मराठी" },
  { id: "hi", label: "हिंदी", name: "हिंदी" },
  { id: "en", label: "EN", name: "English" },
];

export function LanguageSwitch({
  language,
  onChange,
}: {
  language: Lang;
  onChange: (language: Lang) => void;
}) {
  return (
    <div className="language-switch" role="group" aria-label="Language / भाषा">
      {options.map((option, index) => (
        <span className="language-option" key={option.id}>
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            className={language === option.id ? "language-current" : ""}
            aria-pressed={language === option.id}
            aria-label={option.name}
            lang={option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  );
}
