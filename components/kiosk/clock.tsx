"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

/** Locale Intl per lingua: en-GB per avere comunque l'orario a 24 ore. */
const INTL_LOCALE: Record<string, string> = { it: "it-IT", en: "en-GB" };

export function Clock() {
  const { i18n } = useTranslation();
  // null fino al mount: l'ora del server non deve finire nell'HTML (hydration).
  const [now, setNow] = useState<Date | null>(null);

  const { timeFormat, dateFormat } = useMemo(() => {
    const locale = INTL_LOCALE[i18n.language] ?? "it-IT";
    return {
      timeFormat: new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }),
      dateFormat: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  }, [i18n.language]);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="shrink-0 text-right" aria-live="off">
      <div className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">
        {now ? timeFormat.format(now) : "--:--"}
      </div>
      <div className="text-base text-muted-foreground first-letter:uppercase sm:text-lg">
        {now ? dateFormat.format(now) : " "}
      </div>
    </div>
  );
}
