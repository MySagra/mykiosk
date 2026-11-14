import { getKioskConfig } from "./lib/config";

try {
  const config = getKioskConfig();
  const apps = config.apps.map((app) => `${app.name}=${app.url}`).join(", ");
  console.log(
    `[mykiosk ${process.env.APP_VERSION ?? "dev"}] "${config.title}" · app: ${apps || "nessuna"} · controllo stato: ${
      config.checkIntervalSec > 0 ? `ogni ${config.checkIntervalSec}s` : "disattivato"
    }`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
