"use client";

import { setConsent, useConsent } from "@/lib/cookieConsent";

export default function CookieConsent() {
  const consent = useConsent();

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Souhlas s používáním cookies"
      className="fixed bottom-0 inset-x-0 z-[80] bg-stone-900 text-white px-4 py-4 md:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-stone-300 leading-relaxed flex-1">
          Tento web sám o sobě nepoužívá sledovací ani marketingové cookies. Pro zobrazení mapy
          používáme vložený Google Maps, který po vašem souhlasu může nastavit cookies třetí
          strany. Více v{" "}
          <a href="/ochrana-osobnich-udaju" className="underline hover:text-white">
            zásadách ochrany osobních údajů
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
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-sm font-semibold transition-colors"
          >
            Povolit vše
          </button>
        </div>
      </div>
    </div>
  );
}
