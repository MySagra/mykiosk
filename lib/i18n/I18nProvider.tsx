"use client";

import { useEffect, useSyncExternalStore } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { LANGUAGE_STORAGE_KEY } from "./i18n";

const noopSubscribe = () => () => {};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // false on the server and during hydration, true afterwards: the page is
  // rendered only on the client, already in the saved language (no flash).
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    document.documentElement.lang = i18n.language;

    const handleLanguageChange = (lng: string) => {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      } catch {
        // Storage non disponibile: la lingua vale solo per questa sessione.
      }
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
