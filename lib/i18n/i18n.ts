import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { it } from "./locales/it";
import { en } from "./locales/en";

export const LANGUAGE_STORAGE_KEY = "app_lang";
export const SUPPORTED_LANGUAGES = ["it", "en"] as const;

const resources = {
  it,
  en,
};

/** Lingua salvata nel browser (stessa chiave delle altre app MySagra). */
function savedLanguage(): string {
  if (typeof window === "undefined") return "it";
  try {
    const lang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang) ? lang : "it";
  } catch {
    return "it";
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage(), // "it" on the server, the saved language on the client
    fallbackLng: "it",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
