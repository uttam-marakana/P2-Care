import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate } from "@/i18n/translations";

const STORAGE_KEY = "p2care-language";
const LANGUAGES = new Set(["gu", "hi", "en"]);
const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return LANGUAGES.has(savedLanguage) ? savedLanguage : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (text, values = {}) => {
        const translatedText = translate(text, language);
        if (typeof translatedText !== "string") return translatedText;
        return translatedText.replace(/\{(\w+)\}/g, (_, key) =>
          String(values[key] ?? `{${key}}`),
        );
      },
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
}
