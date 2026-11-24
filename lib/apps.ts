/**
 * Registro delle app mostrate nel kiosk.
 *
 * Per aggiungere un'app basta aggiungere una voce qui, il suo logo in
 * public/logos/<id>.svg e la sua descrizione in lib/i18n/locales (it.ts ed en.ts, controllati da TypeScript): il
 * pulsante compare quando la variabile d'ambiente `envVar` contiene un URL
 * valido. Un collegamento diretto a una pagina di un'altra app usa invece
 * `from`: compare insieme a quell'app, con il suo URL più `path`.
 * L'ordine dell'array è l'ordine dei pulsanti.
 */
interface AppBase {
  /** Identificatore stabile, usato anche come chiave in /api/health. */
  id: string;
  name: string;
  /** Logo dell'app, servito da public/ (SVG quadrato). */
  logo: string;
  /** Colore d'accento (qualsiasi colore CSS). */
  accent: string;
}

export type AppDefinition = AppBase &
  (
    | {
        /** Variabile d'ambiente che contiene l'URL dell'app. */
        envVar: string;
      }
    | {
        /** Pagina di un'altra app: il suo id e il percorso da aggiungere al suo URL. */
        from: { app: string; path: string };
      }
  );

export const APPS = [
  {
    id: "myamministratore",
    name: "MyAmministratore",
    envVar: "MYAMMINISTRATORE_URL",
    logo: "/logos/myamministratore.svg",
    accent: "oklch(0.852 0.199 91.936)", // giallo MySagra (--primary)
  },
  {
    id: "mycassa",
    name: "MyCassa",
    envVar: "MYCASSA_URL",
    logo: "/logos/mycassa.svg",
    accent: "oklch(0.765 0.177 163.223)", // emerald-400
  },
  {
    id: "mynumeri",
    name: "MyNumeri",
    envVar: "MYNUMERI_URL",
    logo: "/logos/mynumeri.svg",
    accent: "oklch(0.746 0.16 232.661)", // sky-400
  },
  {
    // Schermo pubblico di MyNumeri, aperto direttamente.
    id: "mydisplay",
    name: "MyDisplay",
    from: { app: "mynumeri", path: "/display" },
    logo: "/logos/mydisplay.svg",
    accent: "oklch(0.746 0.16 232.661)", // come MyNumeri
  },
  {
    id: "mycomanda",
    name: "MyComanda",
    envVar: "MYCOMANDA_URL",
    logo: "/logos/mycomanda.svg",
    accent: "oklch(0.702 0.183 293.541)", // violet-400
  },
  {
    id: "myclienti",
    name: "MyClienti",
    envVar: "MYCLIENTI_URL",
    logo: "/logos/myclienti.svg",
    accent: "oklch(0.712 0.194 13.428)", // rose-400
  },
] as const satisfies readonly AppDefinition[];

export type AppId = (typeof APPS)[number]["id"];

const APPS_BY_ID: ReadonlyMap<string, AppDefinition> = new Map(
  APPS.map((app) => [app.id, app]),
);

export function getAppDefinition(id: string): AppDefinition | undefined {
  return APPS_BY_ID.get(id);
}
