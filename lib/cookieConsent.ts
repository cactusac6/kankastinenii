import { useSyncExternalStore } from "react";

export type ConsentChoice = "all" | "essential";

const KEY = "kz-cookie-consent";
const EVENT = "kz-cookie-consent-change";

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

function emit(choice: ConsentChoice | null) {
  window.dispatchEvent(new CustomEvent<ConsentChoice | null>(EVENT, { detail: choice }));
}

export function setConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* úložiště nedostupné — volba platí jen do znovunačtení */
  }
  emit(choice);
}

export function resetConsent() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* viz výše */
  }
  emit(null);
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** `undefined` = ještě nevíme (SSR / hydratace), `null` = uživatel se nerozhodl. */
export function useConsent(): ConsentChoice | null | undefined {
  return useSyncExternalStore<ConsentChoice | null | undefined>(subscribe, getConsent, () => undefined);
}
