import { languageNames } from "@/i18n/translations";
import { useLanguage } from "@/context/LanguageContext";

function LanguageSelect({ className = "", testId = "select-language" }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="sr-only">{t("Select language")}</span>
      <select
        aria-label={t("Select language")}
        data-testid={testId}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="rounded-full border border-current/20 bg-transparent px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary))]"
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code} className="text-slate-900">
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSelect;
