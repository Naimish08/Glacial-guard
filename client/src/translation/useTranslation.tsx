import { useState } from "react";
import en from "./en.json";
import doi from "./doi.json";

type Language = "en" | "doi";

const translations = { en, doi };

export function useTranslations() {
  const [language, setLanguage] = useState<Language>("en");

  function t(key: keyof typeof en) {
    return translations[language][key] || key;
  }

  return { t, language, setLanguage };
}