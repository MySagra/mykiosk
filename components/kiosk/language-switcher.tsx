"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { SUPPORTED_LANGUAGES as LANGUAGES } from "@/lib/i18n/i18n";

/**
 * Selettore IT/EN, come nelle pagine di login delle altre app MySagra.
 * Due pulsanti, non un menu: un menu sul bordo inferiore si aprirebbe
 * sopra il pulsante. La scelta viene salvata da I18nProvider.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  return (
    <ButtonGroup aria-label={t("language.label")}>
      <ButtonGroupText className="px-2.5" title={t("language.label")}>
        <Languages className="h-4 w-4" aria-hidden />
      </ButtonGroupText>
      {LANGUAGES.map((code) => (
        <Button
          key={code}
          variant={language === code ? "default" : "outline"}
          className="cursor-pointer select-none uppercase"
          title={code === "it" ? t("language.italian") : t("language.english")}
          aria-pressed={language === code}
          onClick={() => i18n.changeLanguage(code)}
        >
          {code}
        </Button>
      ))}
    </ButtonGroup>
  );
}
