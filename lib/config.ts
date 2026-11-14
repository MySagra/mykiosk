import { z } from "zod";
import { APPS } from "@/lib/apps";

/**
 * Configurazione a runtime letta da process.env (solo lato server).
 * Nessuna variabile NEXT_PUBLIC_*: la stessa immagine Docker si configura
 * al lancio del container, senza rebuild.
 */

/** App configurata, serializzabile verso i client component. */
export interface KioskApp {
  id: string;
  name: string;
  accent: string;
  url: string;
}

export interface KioskConfig {
  title: string;
  footer: string;
  /** Secondi tra un controllo di stato e l'altro; 0 = disattivato. */
  checkIntervalSec: number;
  apps: KioskApp[];
}

/** Stringhe vuote o solo spazi contano come "non impostata". */
const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const appUrl = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .pipe(z.url({ protocol: /^https?$/, error: "deve essere un URL http(s) completo" }))
    .optional(),
);

const envSchema = z.object({
  KIOSK_TITLE: z.preprocess(blankToUndefined, z.string().trim().max(80).default("MySagra")),
  KIOSK_FOOTER: z.preprocess(blankToUndefined, z.string().trim().max(200).default("")),
  KIOSK_CHECK_INTERVAL: z.preprocess(
    blankToUndefined,
    z.coerce
      .number({ error: "deve essere un numero di secondi" })
      .int("deve essere un numero intero")
      .min(0)
      .max(3600)
      .default(15),
  ),
  ...Object.fromEntries(APPS.map((app) => [app.envVar, appUrl])),
});

let cached: KioskConfig | undefined;

export function getKioskConfig(): KioskConfig {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Configurazione MySagra Kiosk non valida:\n${z.prettifyError(parsed.error)}`,
    );
  }

  const env = parsed.data as Record<string, unknown>;
  const apps: KioskApp[] = [];
  for (const app of APPS) {
    const url = env[app.envVar];
    if (typeof url === "string") {
      apps.push({
        id: app.id,
        name: app.name,
        accent: app.accent,
        url,
      });
    }
  }

  cached = {
    title: parsed.data.KIOSK_TITLE,
    footer: parsed.data.KIOSK_FOOTER,
    checkIntervalSec: parsed.data.KIOSK_CHECK_INTERVAL,
    apps,
  };
  return cached;
}

/** Nomi delle variabili per gli URL, per il messaggio "nessuna app configurata". */
export const APP_ENV_VARS: string[] = APPS.map((app) => app.envVar);
