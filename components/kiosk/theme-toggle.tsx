"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

/**
 * Passa da tema chiaro a scuro, come nel login di MyCassa.
 * Usa resolvedTheme così funziona anche quando il tema segue il sistema.
 * Nessun controllo "mounted": I18nProvider mostra la pagina solo sul client.
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const label = isDark ? t("theme.light") : t("theme.dark");

  return (
    <Button
      variant="outline"
      size="icon"
      className="cursor-pointer"
      title={label}
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
