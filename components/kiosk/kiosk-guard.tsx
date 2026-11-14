"use client";

import { useEffect } from "react";

/** Blocca menu contestuale, selezione e trascinamento (modalità kiosk). */
export function KioskGuard() {
  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    const events = ["contextmenu", "selectstart", "dragstart"] as const;
    for (const name of events) document.addEventListener(name, prevent);
    return () => {
      for (const name of events) document.removeEventListener(name, prevent);
    };
  }, []);

  return null;
}
