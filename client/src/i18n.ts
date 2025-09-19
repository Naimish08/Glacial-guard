// This is a simplified i18n file for Dogri translation.
// In a real application, you would manage this with a proper library.
import doiTranslations from './translation/doi.json';

// Define a type for your translation keys for type safety
type TranslationKeys = keyof typeof doiTranslations;

// A simple function to get the translated string
export const t = (key: TranslationKeys): string => {
  return doiTranslations[key] || key; // Fallback to the key if translation is not found
};
