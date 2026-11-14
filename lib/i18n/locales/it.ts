import type { AppId } from "@/lib/apps";

export const it = {
  translation: {
    language: {
      label: "Lingua",
      italian: "Italiano",
      english: "English",
    },
    theme: {
      light: "Tema chiaro",
      dark: "Tema scuro",
    },
    apps: {
      myamministratore: { description: "Amministrazione: menu, ordini, statistiche" },
      mycassa: { description: "Cassa: presa e pagamento degli ordini" },
      mynumeri: { description: "Chiamata dei numeri e schermo per il pubblico" },
      mycomanda: { description: "Monitor delle comande per la cucina" },
    } satisfies Record<AppId, { description: string }>,
    status: {
      checking: "Verifica…",
      online: "Online",
      offline: "Non risponde",
      unknown: "Stato sconosciuto",
    },
    emptyState: {
      title: "Nessuna app configurata",
      description:
        "Imposta almeno una di queste variabili d'ambiente nel container e riavvialo:",
    },
  },
};

export type Locale = typeof it;
