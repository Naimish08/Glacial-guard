import { useState } from "react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useTranslations } from "../../lib/TranslationContext";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslations();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "doi", name: "डोगरी", flag: "🇮🇳" },
    { code: "ks", name: "کشمیری", flag: "🇮🇳" }
  ];

  const handleLanguageChange = (langCode: "en" | "doi" | "ks") => {
    console.log(`Language switcher: Changing to ${langCode}`);
    setLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{t("language")}</span>
          <span className="text-xs">
            {languages.find(lang => lang.code === language)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as "en" | "doi" | "ks")}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
