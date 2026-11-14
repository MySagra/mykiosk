"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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
    // Allineato all'inizio di ogni secondo, così il lampeggio resta regolare.
    let id: number;
    const tick = () => {
      setNow(new Date());
      id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    return () => window.clearTimeout(id);
  }, []);

  const parts = now ? timeFormat.formatToParts(now) : [];
  const hours = parts.find((part) => part.type === "hour")?.value ?? "--";
  const minutes = parts.find((part) => part.type === "minute")?.value ?? "--";
  // I due punti si vedono nei secondi pari e spariscono in quelli dispari.
  const colonVisible = !now || now.getSeconds() % 2 === 0;

  return (
    <div className="shrink-0 text-right" aria-live="off">
      <div className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">
        {hours}
        <span
          className={cn(
            "transition-opacity duration-200 motion-reduce:opacity-100",
            colonVisible ? "opacity-100" : "opacity-0",
          )}
        >
          :
        </span>
        {minutes}
      </div>
      <div className="text-base text-muted-foreground first-letter:uppercase sm:text-lg">
        {now ? dateFormat.format(now) : " "}
      </div>
    </div>
  );
}
