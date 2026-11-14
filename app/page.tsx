import { connection } from "next/server";
import { Logo } from "@/components/logo";
import { AppGrid } from "@/components/kiosk/app-grid";
import { Clock } from "@/components/kiosk/clock";
import { EmptyState } from "@/components/kiosk/empty-state";
import { LanguageSwitcher } from "@/components/kiosk/language-switcher";
import { APP_ENV_VARS, getKioskConfig } from "@/lib/config";

export default async function KioskPage() {
  // Rendering a ogni richiesta: la config arriva da process.env al runtime.
  await connection();
  const config = getKioskConfig();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 sm:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <Logo className="size-14 shrink-0" width={56} height={56} />
          <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">
            {config.title}
          </h1>
        </div>
        <Clock />
      </header>

      {/* pb-20: spazio in fondo per il selettore lingua (fixed). */}
      <main className="flex flex-1 flex-col justify-center px-6 pb-20 sm:px-10">
        {config.apps.length > 0 ? (
          <AppGrid apps={config.apps} checkIntervalSec={config.checkIntervalSec} />
        ) : (
          <EmptyState envVars={APP_ENV_VARS} />
        )}
      </main>

      <LanguageSwitcher />
    </div>
  );
}
