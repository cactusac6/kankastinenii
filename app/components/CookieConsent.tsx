"use client";

import { setConsent, useConsent } from "@/lib/cookieConsent";

export default function CookieConsent() {
  const consent = useConsent();

  // Na serveru (undefined) se lišta vykreslí hned, aby nečekala na JS; skript v layoutu ji schová, pokud už souhlas je.
  if (consent === "all" || consent === "essential") return null;

  return (
    <div
      role="dialog"
      aria-label="Souhlas s používáním cookies"
      className="kz-consent fixed bottom-0 inset-x-0 z-[80] bg-stone-900 text-white px-4 py-4 md:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-stone-300 leading-relaxed flex-1">
          Nesledujeme vás. Cookies třetí strany nastaví jen mapa Google, a to až po vašem souhlasu. Více v{" "}
          <a href="/ochrana-osobnich-udaju" className="underline hover:text-white">
            zásadách
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setConsent("essential")}
            className="px-4 py-2 rounded-lg border border-white/30 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Pouze nezbytné
          </button>
          <button
            type="button"
            onClick={() => setConsent("all")}
            className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-sm font-semibold transition-colors"
          >
            Povolit vše
          </button>
        </div>
      </div>
    </div>
  );
}
