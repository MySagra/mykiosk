import {
  LayoutDashboard,
  MonitorPlay,
  Receipt,
  ChefHat,
  type LucideIcon,
} from "lucide-react";

/**
 * Registro delle app mostrate nel kiosk.
 *
 * Per aggiungere un'app basta aggiungere una voce qui e la sua descrizione
 * in lib/i18n/locales (it.ts ed en.ts, controllati da TypeScript): il
 * pulsante compare quando la variabile d'ambiente `envVar` contiene un URL
 * valido. L'ordine dell'array è l'ordine dei pulsanti.
 */
export interface AppDefinition {
  /** Identificatore stabile, usato anche come chiave in /api/health. */
  id: string;
  name: string;
  /** Variabile d'ambiente che contiene l'URL dell'app. */
  envVar: string;
  icon: LucideIcon;
  /** Colore d'accento (qualsiasi colore CSS). */
  accent: string;
}

export const APPS = [
  {
    id: "myamministratore",
    name: "MyAmministratore",
    envVar: "MYAMMINISTRATORE_URL",
    icon: LayoutDashboard,
    accent: "oklch(0.852 0.199 91.936)", // giallo MySagra (--primary)
  },
  {
    id: "mycassa",
    name: "MyCassa",
    envVar: "MYCASSA_URL",
    icon: Receipt,
    accent: "oklch(0.765 0.177 163.223)", // emerald-400
  },
  {
    id: "mynumeri",
    name: "MyNumeri",
    envVar: "MYNUMERI_URL",
    icon: MonitorPlay,
    accent: "oklch(0.746 0.16 232.661)", // sky-400
  },
  {
    id: "mycomanda",
    name: "MyComanda",
    envVar: "MYCOMANDA_URL",
    icon: ChefHat,
    accent: "oklch(0.702 0.183 293.541)", // violet-400
  },
] as const satisfies readonly AppDefinition[];

export type AppId = (typeof APPS)[number]["id"];

const APPS_BY_ID: ReadonlyMap<string, AppDefinition> = new Map(
  APPS.map((app) => [app.id, app]),
);

export function getAppDefinition(id: string): AppDefinition | undefined {
  return APPS_BY_ID.get(id);
}
