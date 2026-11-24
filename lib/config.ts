import { z } from "zod";
import { APPS } from "@/lib/apps";

/** Variabili d'ambiente degli URL, nell'ordine dei pulsanti. */
const APP_ENV_VARS_LIST: string[] = APPS.flatMap((app) =>
  "envVar" in app ? [app.envVar] : [],
);

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
  logo: string;
  url: string;
}

export interface KioskConfig {
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
  KIOSK_CHECK_INTERVAL: z.preprocess(
    blankToUndefined,
    z.coerce
      .number({ error: "deve essere un numero di secondi" })
      .int("deve essere un numero intero")
      .min(0)
      .max(3600)
      .default(15),
  ),
  ...Object.fromEntries(APP_ENV_VARS_LIST.map((name) => [name, appUrl])),
});

let cached: KioskConfig | undefined;

/** URL di una pagina di un'altra app: il suo URL (senza "/" finale) più il percorso. */
function joinPath(base: string, path: string): string {
  return base.replace(/\/+$/, "") + path;
}

export function getKioskConfig(): KioskConfig {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Configurazione MySagra Kiosk non valida:\n${z.prettifyError(parsed.error)}`,
    );
  }

  const env = parsed.data as Record<string, unknown>;
  const urls = new Map<string, string>();
  const apps: KioskApp[] = [];
  for (const app of APPS) {
    // Le app con `from` seguono l'app a cui puntano: nascoste se lei è nascosta.
    const parentUrl = "from" in app ? urls.get(app.from.app) : undefined;
    const url =
      "envVar" in app
        ? env[app.envVar]
        : parentUrl && joinPath(parentUrl, app.from.path);
    if (typeof url === "string") {
      urls.set(app.id, url);
      apps.push({
        id: app.id,
        name: app.name,
        accent: app.accent,
        logo: app.logo,
        url,
      });
    }
  }

  cached = {
    checkIntervalSec: parsed.data.KIOSK_CHECK_INTERVAL,
    apps,
  };
  return cached;
}

/** Nomi delle variabili per gli URL, per il messaggio "nessuna app configurata". */
export const APP_ENV_VARS: string[] = APP_ENV_VARS_LIST;
