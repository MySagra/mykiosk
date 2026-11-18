"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { HealthResponse } from "@/app/api/health/route";
import { Badge } from "@/components/ui/badge";
import type { KioskApp } from "@/lib/config";
import { cn } from "@/lib/utils";

type Status = "checking" | "online" | "offline" | "unknown";

const STATUS_DOT: Record<Status, string> = {
  checking: "bg-muted-foreground animate-pulse",
  online: "bg-emerald-500",
  offline: "bg-red-500",
  unknown: "bg-muted-foreground",
};

/** Interroga /api/health ogni `intervalSec` secondi (0 = mai). */
function useAppStatuses(appIds: string[], intervalSec: number) {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  useEffect(() => {
    if (intervalSec <= 0) return;

    let timer: number | undefined;
    let controller: AbortController | undefined;
    let stopped = false;

    const check = async () => {
      controller = new AbortController();
      try {
        const res = await fetch("/api/health", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as HealthResponse;
        setStatuses(
          Object.fromEntries(
            appIds.map((id) => [id, data.apps[id]?.online ? "online" : "offline"]),
          ),
        );
      } catch {
        if (stopped) return;
        // Il server del kiosk non risponde: non sappiamo nulla delle app.
        setStatuses(Object.fromEntries(appIds.map((id) => [id, "unknown"])));
      }
      // Il prossimo controllo parte solo quando il precedente è finito.
      if (!stopped) timer = window.setTimeout(check, intervalSec * 1000);
    };

    check();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      controller?.abort();
    };
    // appIds viene dalla config del server e non cambia durante la sessione.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appIds.join(","), intervalSec]);

  return statuses;
}

/** Con 3 app tre colonne; altrimenti al massimo due, in un riquadro centrato. */
function gridColumns(count: number) {
  if (count === 1) return "max-w-xl mx-auto";
  if (count === 3) return "sm:grid-cols-2 lg:grid-cols-3";
  return "sm:grid-cols-2 max-w-6xl mx-auto";
}

/**
 * Nella griglia a due colonne, con un numero dispari di app l'ultima va da
 * sola su una nuova riga: centrata e larga come le altre (metà meno il gap).
 */
function lastItemClass(count: number, index: number) {
  const twoColumns = count > 1 && count !== 3;
  if (!twoColumns || count % 2 === 0 || index !== count - 1) return undefined;
  return "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)]";
}

export function AppGrid({
  apps,
  checkIntervalSec,
}: {
  apps: KioskApp[];
  checkIntervalSec: number;
}) {
  const statuses = useAppStatuses(
    apps.map((app) => app.id),
    checkIntervalSec,
  );
  const showStatus = checkIntervalSec > 0;

  return (
    <ul className={cn("grid w-full grid-cols-1 gap-6", gridColumns(apps.length))}>
      {apps.map((app, index) => (
        <li key={app.id} className={lastItemClass(apps.length, index)}>
          <AppCard
            app={app}
            status={showStatus ? (statuses[app.id] ?? "checking") : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

function AppCard({ app, status }: { app: KioskApp; status?: Status }) {
  const { t } = useTranslation();
  const description = t(`apps.${app.id}.description`, { defaultValue: "" });
  const statusLabel = status ? t(`status.${status}`) : "";
  const offline = status === "offline";

  return (
    <a
      href={app.url}
      draggable={false}
      aria-label={`${app.name}${description ? `: ${description}` : ""}${status ? ` (${statusLabel})` : ""}`}
      className={cn(
        "@container group relative flex h-full min-h-56 flex-col gap-5 overflow-hidden rounded-2xl border bg-card p-7 text-card-foreground shadow-sm short:min-h-0 short:gap-3 short:p-4",
        // Hover leggero (solo dove esiste un puntatore): la card si alza di
        // poco, ombra più marcata e bordo giallo MySagra tenue.
        "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:ring-2 hover:ring-primary/20",
        "active:translate-y-0 active:scale-[0.98] active:bg-accent",
        "outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Riquadro uguale per tutte le app, dello stesso colore dello sfondo
            pagina (su cui sta anche il logo MySagra in alto). */}
        <span
          className={cn(
            "flex size-24 shrink-0 items-center justify-center rounded-3xl border bg-background short:size-14 short:rounded-2xl",
            offline && "opacity-40 grayscale",
          )}
        >
          <Image
            src={app.logo}
            alt=""
            width={96}
            height={96}
            unoptimized
            draggable={false}
            // Riempie il riquadro (96px meno il bordo) in entrambe le
            // dimensioni: niente logo schiacciato né warning di next/image.
            className="size-full"
          />
        </span>
        {status && (
          <Badge variant="outline" className="gap-2 px-3 py-1 text-sm">
            <span className={cn("size-3 rounded-full", STATUS_DOT[status])} aria-hidden />
            {statusLabel}
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 items-end justify-between gap-4",
          offline && "opacity-40",
        )}
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight break-words @3xs:text-xl @2xs:text-2xl @xs:text-3xl @md:text-4xl">{app.name}</h2>
          {description && (
            <p className="mt-2 text-lg text-muted-foreground short:mt-1 short:text-base">{description}</p>
          )}
        </div>
        <ChevronRight
          className="size-10 shrink-0 text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover:translate-x-1 group-hover:text-foreground group-active:translate-x-1"
          aria-hidden
        />
      </div>
    </a>
  );
}
