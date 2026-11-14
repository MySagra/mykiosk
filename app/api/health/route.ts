import { getKioskConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/** Oltre questo tempo l'app è considerata "non risponde". */
const TIMEOUT_MS = 4000;

export interface AppHealth {
  online: boolean;
  /** Codice HTTP, se l'app ha risposto. */
  status?: number;
  latencyMs?: number;
  /** Motivo dell'errore (es. ECONNREFUSED, TimeoutError, SELF_SIGNED_CERT_IN_CHAIN). */
  error?: string;
}

export interface HealthResponse {
  checkedAt: string;
  apps: Record<string, AppHealth>;
}

type ErrorWithCode = Error & { code?: unknown; cause?: unknown; errors?: unknown[] };

/** Estrae un codice leggibile (ECONNREFUSED, CERT_..., TimeoutError) dall'errore di fetch. */
function errorCode(error: unknown): string {
  if (!(error instanceof Error)) return "UnknownError";
  const err = error as ErrorWithCode;
  // DOMException (es. TimeoutError) ha un .code numerico legacy: lo ignoriamo.
  if (typeof err.code === "string") return err.code;
  // undici: TypeError("fetch failed") con la causa reale in .cause,
  // a volte un AggregateError (IPv4 + IPv6) con i singoli errori in .errors.
  if (err.cause instanceof Error) return errorCode(err.cause);
  if (err.errors?.[0] instanceof Error) return errorCode(err.errors[0]);
  return err.name;
}

async function probe(url: string): Promise<AppHealth> {
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      // Un redirect (es. verso il login) vuol dire che l'app risponde.
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    await res.body?.cancel();
    return {
      // 5xx: tipicamente il reverse proxy risponde ma l'app dietro è giù.
      online: res.status < 500,
      status: res.status,
      latencyMs: Math.round(performance.now() - start),
    };
  } catch (error) {
    return { online: false, error: errorCode(error) };
  }
}

/**
 * Stato delle app configurate. Interroga solo gli URL presi dalla
 * configurazione (nessun parametro dal client), lato server: niente CORS.
 */
export async function GET() {
  const { apps } = getKioskConfig();
  const results = await Promise.all(apps.map((app) => probe(app.url)));

  const body: HealthResponse = {
    checkedAt: new Date().toISOString(),
    apps: Object.fromEntries(apps.map((app, i) => [app.id, results[i]])),
  };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
