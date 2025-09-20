import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '../translation/en.json';
import doi from '../translation/doi.json';
import ks from '../translation/ks.json';

type Language = "en" | "doi" | "ks";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof en) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = { en, doi, ks };

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  function t(key: keyof typeof en): string {
    const translation = translations[language][key] || key;
    console.log(`Translation [${language}]: ${key} -> ${translation}`);
    return translation;
  }

  const contextValue = {
    language,
    setLanguage,
    t
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}
