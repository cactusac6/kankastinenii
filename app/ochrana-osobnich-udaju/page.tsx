import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů",
  description:
    "Informace o zpracování osobních údajů v souvislosti s poptávkovým formulářem na webu Kaňka žaluzie.",
  alternates: { canonical: "/ochrana-osobnich-udaju" },
  robots: { index: true, follow: true },
};

export default function OchranaOsobnichUdaju() {
  return (
    <main className="bg-[#faf8f5] text-stone-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <Link href="/" className="text-orange-600 hover:text-orange-700 transition text-sm font-medium">
          ← Zpět na web
        </Link>

        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
          Zásady ochrany osobních údajů
        </h1>
        <p className="mt-3 text-stone-400">Platné od 31. 7. 2026</p>

        <div className="mt-10 space-y-8 text-stone-600 leading-relaxed text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">1. Správce osobních údajů</h2>
            <p>
              Správcem osobních údajů je Jan Kaňka, se sídlem Kosmonosy, 293 06, IČO: 23200928
              (neplátce DPH), e-mail:{" "}
              <a href="mailto:jankanka6@seznam.cz" className="text-orange-600 hover:underline">
                jankanka6@seznam.cz
              </a>
              , telefon:{" "}
              <a href="tel:+420776385776" className="text-orange-600 hover:underline">
                776 385 776
              </a>{" "}
              (dále jen „správce“).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">2. Jaké údaje zpracovávám</h2>
            <p>
              Prostřednictvím poptávkového formuláře na tomto webu zpracovávám údaje, které nám
              sami dobrovolně poskytnete: jméno a příjmení, telefonní číslo, e-mailovou adresu a
              obsah vaší zprávy. Žádné další osobní údaje web aktivně nesbírá.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">3. Účel a právní základ zpracování</h2>
            <p>
              Údaje zpracovávám za účelem vyřízení vaší poptávky, přípravy cenové nabídky a
              další komunikace související s objednávkou nebo realizací zakázky. Právním
              základem je jednání o uzavření smlouvy na vaši žádost (čl. 6 odst. 1 písm. b)
              GDPR), případně můj oprávněný zájem na vyřízení dotazu (čl. 6 odst. 1 písm. f)
              GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">4. Doba uchování</h2>
            <p>
              Údaje z poptávky uchovávám po dobu nezbytnou k jejímu vyřízení a případné
              navazující obchodní komunikaci, nejdéle však 2 roky od posledního kontaktu, pokud
              mezi námi nevznikne smluvní vztah zakládající delší zákonnou dobu uchování (např.
              z důvodu účetních nebo daňových předpisů).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">5. Předávání údajů třetím stranám</h2>
            <p>
              Poptávkový formulář je technicky zajištěn prostřednictvím služby Resend.com, která
              funguje jako zpracovatel a slouží výhradně k doručení zprávy z formuláře na e-mail
              správce. Na stránce dále používám vloženou mapu Google Maps (viz bod 6) — pokud s
              jejím zobrazením souhlasíte, dochází i k přenosu dat společnosti Google. Údaje
              jinak nepředávám, neprodávám ani nesdílím s žádnými dalšími třetími stranami pro
              marketingové účely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">6. Cookies a sledování</h2>
            <p>
              Tento web sám o sobě nepoužívá žádné analytické, marketingové ani sledovací
              cookies. Jedinou výjimkou je mapa Google Maps zobrazená u kontaktních údajů — ta se
              načte a může nastavit cookies třetí strany až po vašem souhlasu, který si
              vyžádám prostřednictvím cookie lišty při první návštěvě webu. Svou volbu můžete
              kdykoliv změnit pomocí odkazu „Nastavení cookies“ v patičce webu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">7. Vaše práva</h2>
            <p>V souvislosti se zpracováním osobních údajů máte právo:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5">
              <li>na přístup ke svým osobním údajům,</li>
              <li>na opravu nepřesných nebo neúplných údajů,</li>
              <li>na výmaz údajů („právo být zapomenut“),</li>
              <li>na omezení zpracování,</li>
              <li>na přenositelnost údajů,</li>
              <li>vznést námitku proti zpracování,</li>
              <li>podat stížnost u Úřadu pro ochranu osobních údajů (uoou.cz).</li>
            </ul>
            <p className="mt-3">
              Svá práva můžete uplatnit e-mailem na{" "}
              <a href="mailto:jankanka6@seznam.cz" className="text-orange-600 hover:underline">
                jankanka6@seznam.cz
              </a>{" "}
              nebo telefonicky na{" "}
              <a href="tel:+420776385776" className="text-orange-600 hover:underline">
                776 385 776
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">8. Zabezpečení údajů</h2>
            <p>
              Přenos dat z formuláře probíhá zabezpečeně přes HTTPS. Přijal jsem přiměřená
              technická a organizační opatření k ochraně vašich údajů před neoprávněným
              přístupem, ztrátou nebo zneužitím.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

