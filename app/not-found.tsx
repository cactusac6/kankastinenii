import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf8f5] text-stone-900 px-5">
      <div className="text-center max-w-md">
        <p className="text-amber-600 font-bold text-sm uppercase tracking-widest mb-3">Chyba 404</p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
          Tuto stránku jsme nenašli
        </h1>
        <p className="text-stone-600 leading-relaxed mb-8">
          Možná byla přesunuta nebo smazána, nebo jste zadali chybnou adresu.
          Zkuste se vrátit na úvodní stránku.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 transition-all duration-150 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-[0_2px_8px_rgba(180,83,9,0.3)]"
        >
          ← Zpět na úvodní stránku
        </Link>
      </div>
    </main>
  );
}
