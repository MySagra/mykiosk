import type { Locale } from "./it";

export const en: Locale = {
  translation: {
    language: {
      label: "Language",
      italian: "Italiano",
      english: "English",
    },
    theme: {
      light: "Light theme",
      dark: "Dark theme",
    },
    apps: {
      myamministratore: { description: "Administration: menu, orders, statistics" },
      mycassa: { description: "Till: taking and paying for orders" },
      mynumeri: { description: "Number management and calling" },
      mydisplay: { description: "Public number display screen" },
      mycomanda: { description: "Kitchen order monitor" },
      myclienti: { description: "Ordering from customers' phones" },
    },
    status: {
      checking: "Checking…",
      online: "Online",
      offline: "Not responding",
      unknown: "Unknown status",
    },
    emptyState: {
      title: "No apps configured",
      description:
        "Set at least one of these environment variables on the container and restart it:",
    },
  },
};
