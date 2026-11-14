/**
 * Valida le variabili d'ambiente all'avvio del server: con una
 * configurazione non valida il container si ferma subito con un errore
 * leggibile invece di servire una pagina rotta.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
