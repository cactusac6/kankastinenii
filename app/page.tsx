"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { resetConsent, setConsent, useConsent } from "@/lib/cookieConsent";
import { faqs, YEAR_FOUNDED } from "@/lib/faqs";

const NAV = [["#", "Domů"], ["#sluzby", "Služby"], ["#o-nas", "O nás"], ["#kontakt", "Kontakt"]];

const FATHER_YEARS = new Date().getFullYear() - YEAR_FOUNDED;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [showTop, setShowTop] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const mapsAllowed = useConsent() === "all";
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openModal = () => {
    setErrorMsg("");
    setStatus("idle");
    setOpen(true);
  };

  async function odeslat(e?: React.FormEvent) {
    e?.preventDefault();

    if (!form.name.trim()) {
      setErrorMsg("Vyplňte prosím jméno.");
      setStatus("error");
      return;
    }
    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMsg("Vyplňte alespoň telefon nebo e-mail, ať se vám můžeme ozvat.");
      setStatus("error");
      return;
    }
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      setErrorMsg("Zkontrolujte prosím formát e-mailu.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setStatus("ok");
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setErrorMsg("Nepodařilo se odeslat. Zkuste to prosím znovu, nebo nám rovnou zavolejte na 776 385 776.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Nepodařilo se odeslat — zkontrolujte připojení a zkuste to znovu, nebo nám zavolejte na 776 385 776.");
      setStatus("error");
    }
  }

  useEffect(() => {
    document.body.style.overflow = open || menu || lightbox !== null ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setMenu(false); }
      if (e.key === "Tab" && open && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, menu, lightbox]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") setLightbox((i) => (i !== null && i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight") setLightbox((i) => (i !== null && i < 2 ? i + 1 : i));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const services = [
    ["https://images.pexels.com/photos/9270061/pexels-photo-9270061.jpeg?auto=compress&cs=tinysrgb&w=1200", "Vertikální žaluzie", "Velká okna, prosklené stěny, kanceláře."],
    ["https://images.pexels.com/photos/15021456/pexels-photo-15021456.jpeg?auto=compress&cs=tinysrgb&w=1200", "Horizontální žaluzie", "Hliníkové i dřevěné, na míru a v libovolné barvě."],
    ["https://images.pexels.com/photos/16153504/pexels-photo-16153504.jpeg?auto=compress&cs=tinysrgb&w=1200", "Rolety den a noc", "Přes den světlo, večer tma."],
    ["https://images.pexels.com/photos/17756267/pexels-photo-17756267.jpeg?auto=compress&cs=tinysrgb&w=1200", "Sítě proti hmyzu", "Rámové do okna, rolovací do dveří."],
    ["https://images.pexels.com/photos/12394619/pexels-photo-12394619.jpeg?auto=compress&cs=tinysrgb&w=1200", "Opravy", "Zasekla se roleta, praskla šňůrka, nejde markýza? Většinou to jde spravit a nové nekupujete."],
  ];

  const steps = [
    ["Ozvete se", "Zavoláte nebo napíšete, jaká máte okna a co byste chtěli."],
    ["Přijedeme zaměřit", "Rozměry bereme na místě. Zdarma a bez závazku."],
    ["Pošleme cenu", "Konkrétní částka podle zaměření."],
    ["Objednáme materiál", "Až když cenu odsouhlasíte. Za materiál platíte zálohovou fakturou."],
    ["Namontujeme", "Přijedeme a namontujeme, obvykle to zabere jedno odpoledne."],
    ["Doplatíte", "Zbytek až po hotové montáži."],
  ];

  const realizace = [
    { img: "/realizace/pred-montazi.jpeg", t: "Před montáží", s: "Vysoké historické okno bez stínění." },
    { img: "/realizace/montaz.jpeg", t: "Při montáži", s: "Okno vysoké přes 3 metry, montáž ze žebříku." },
    { img: "/realizace/hotovo.jpeg", t: "Hotovo", s: "Látková roleta na místě." },
  ];

  const regions = [
    ["Středočeský kraj", "Mladá Boleslav, Kosmonosy, Bakov nad Jizerou, Benátky nad Jizerou, Mnichovo Hradiště, Dobrovice, Bělá pod Bezdězem, Nymburk, Lysá nad Labem, Brandýs nad Labem, Mělník, Luštěnice"],
    ["Liberecký kraj", "Turnov, Český Dub, Semily, Železný Brod, Liberec, Jilemnice"],
    ["Královéhradecký kraj", "Jičín, Sobotka, Kopidlno, Hořice, Nová Paka"],
  ];

  return (
    <main className="bg-[#faf8f5] text-stone-900 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-[0_1px_12px_rgba(0,0,0,0.07)] border-b border-stone-200" : "border-b border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-[58px] md:h-[68px]">
          <a href="#" className="flex items-center gap-2.5 group">
            <Image
              src="/logo/kanka-stineni-mark.png"
              alt="Kaňka stínění"
              width={48}
              height={46}
              className="h-9 md:h-11 w-auto"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] md:text-xl font-bold tracking-tight group-hover:text-amber-700 transition-colors">Kaňka stínění</span>
              <span className="text-[10px] md:text-[11px] text-stone-400 mt-0.5">Mladá Boleslav a okolí</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] lg:text-[15px] text-stone-500">
            {NAV.map(([href, label]) => (
              <a key={label} href={href} className="relative py-1 text-stone-600 hover:text-amber-700 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-amber-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:rounded-full">{label}</a>
            ))}
          </nav>

          <a href="tel:+420776385776" className="hidden md:inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 transition-all duration-150 text-white px-5 lg:px-6 py-2.5 rounded-lg font-semibold text-[14px] lg:text-[15px] shadow-[0_2px_8px_rgba(180,83,9,0.3)] hover:shadow-[0_4px_16px_rgba(146,64,14,0.4)]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            776 385 776
          </a>

          {/* mobile */}
          <div className="flex md:hidden items-center gap-3">
            <a href="tel:+420776385776" className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              776 385 776
            </a>
            <button onClick={() => setMenu(true)} aria-label="Menu" className="w-9 h-9 flex flex-col items-center justify-center gap-[5px]">
              <span className="block w-[18px] h-[2px] bg-stone-800 rounded-full transition-all" />
              <span className="block w-[18px] h-[2px] bg-stone-800 rounded-full transition-all" />
              <span className="block w-[18px] h-[2px] bg-stone-800 rounded-full transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-[58px] md:pt-[68px] overflow-hidden">
        {/* background photo */}
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/hero/hero-desktop.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="hidden md:block object-cover"
          />
          <Image
            src="/hero/hero-mobile.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="block md:hidden object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/75 to-stone-950/40 md:from-stone-950/92 md:via-stone-950/70 md:to-stone-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent md:hidden" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 min-h-[calc(100svh-58px)] md:min-h-[calc(100svh-68px)] flex items-center">
          <div className="py-16 sm:py-20 md:py-24 max-w-xl" style={{ animation: "heroIn .7s cubic-bezier(.16,1,.3,1) both" }}>
            <h1 className="font-serif text-[44px] sm:text-[60px] md:text-[72px] xl:text-[84px] font-semibold leading-[0.95] tracking-tight text-white">
              Žaluzie<br />Mladá<br /><span className="text-amber-500">Boleslav</span>
            </h1>
            <p className="mt-5 md:mt-6 text-stone-200 text-base sm:text-lg md:text-xl leading-relaxed max-w-md">
              Žaluzie, rolety a sítě proti hmyzu. Jsme tu pro vás už od roku {YEAR_FOUNDED}.
              Zaměříme, namontujeme i opravíme.
            </p>
            <div className="mt-7 md:mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={openModal}
                className="btn-primary"
              >
                Nezávazná poptávka
              </button>
              <a href="#sluzby" className="inline-flex items-center justify-center border border-white/40 hover:bg-white/10 active:scale-95 transition-all text-white font-semibold px-6 py-3.5 rounded-lg whitespace-nowrap">
                Naše služby
              </a>
            </div>
            <p className="mt-8 text-stone-300 text-sm">
              Zaměření zdarma · jezdíme do 50 km od Kosmonos
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <div id="sluzby" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 scroll-mt-16 md:scroll-mt-20 grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-20">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Co děláme
          </h2>
          <p className="mt-4 text-stone-600 text-base md:text-lg max-w-sm leading-relaxed">
            Montáž a servis stínicí techniky v bytech, domech, kancelářích i ve starých budovách.
          </p>
        </div>
        <div>
          <ul className="border-t border-stone-300">
            {services.map(([img, t, d]) => (
              <li key={t} className="grid grid-cols-[7rem_1fr] sm:grid-cols-[11rem_1fr] gap-4 sm:gap-6 py-4 border-b border-stone-300 items-center">
                <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-stone-200">
                  <Image src={img} alt={t} fill quality={90} sizes="(min-width: 640px) 352px, 224px" className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-stone-900">{t}</h3>
                  <p className="mt-1 text-stone-600 text-[15px] md:text-base leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-stone-600 text-[15px] md:text-base">
            Dále montujeme plisé, japonské stěny, markýzy a garážová vrata.
          </p>
        </div>
      </div>

      {/* ── JAK TO FUNGUJE ── */}
      <div className="bg-[#f0ebe0] border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24 grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-20">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">Jak to probíhá</h2>
            <p className="mt-4 text-stone-600 text-base md:text-lg max-w-sm leading-relaxed">
              Celou částku nikdo dopředu nechce. Materiál objednáváme po vašem souhlasu s cenou a doplácíte po montáži.
            </p>
          </div>
          <ol className="space-y-5 md:space-y-6">
            {steps.map(([t, d], idx) => (
              <li key={t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-serif text-xl text-amber-700 leading-snug">{idx + 1}.</span>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base md:text-lg">{t}</h3>
                  <p className="text-stone-600 text-[15px] md:text-base leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── REALIZACE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
        <div className="mb-10 md:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Vysoká okna, starý dům
          </h2>
          <p className="mt-4 text-stone-600 text-base md:text-lg max-w-xl leading-relaxed">
            Poslední větší zakázka: historická okna přes tři metry. Roletu jsme montovali ze žebříku.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {realizace.map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLightbox(idx)}
             
              className="group text-left rounded-xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-300 cursor-zoom-in"
            >
              <div className="h-[260px] sm:h-[300px] md:h-[360px] overflow-hidden bg-stone-100 relative">
                <Image
                  src={r.img}
                  alt={r.t}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 md:p-5 bg-white">
                <h3 className="font-bold text-sm md:text-base mb-1">{r.t}</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{r.s}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── O NÁS ── */}
      <div id="o-nas" className="bg-[#f0ebe0] border-y border-stone-200 scroll-mt-16 md:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5 md:mb-6">
              Jsme tu pro vás od roku {YEAR_FOUNDED}
            </h2>
            <p className="text-stone-800 text-base md:text-lg leading-relaxed mb-4">
              Kaňka stínění začínal můj táta v roce {YEAR_FOUNDED}. Já jsem se přidal v roce 2018 a dnes jezdíme na zakázky spolu.
            </p>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed">
              Žádní brigádníci ani subdodavatelé, přijedeme my dva. Když jde stará roleta spravit,
              raději ji spravíme, než abychom vám prodávali novou.
            </p>
          </div>
          <div className="order-1 lg:order-2 rounded-xl overflow-hidden h-[240px] sm:h-[340px] md:h-[460px] bg-stone-200 relative">
            <Image
              src="/realizace/montaz.jpeg"
              alt="Jan Kaňka při montáži rolety na vysoké okno"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── PŮSOBNOST ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-20">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">Kam jezdíme</h2>
          <p className="mt-4 text-stone-600 text-base md:text-lg max-w-sm leading-relaxed">
            Bydlíme v Kosmonosech, do 50 km od nás je to většinou do hodiny jízdy.
          </p>
        </div>
        <div className="space-y-6">
          {regions.map(([kraj, mesta]) => (
            <div key={kraj}>
              <h3 className="font-semibold text-stone-900 mb-1">{kraj}</h3>
              <p className="text-stone-600 text-[15px] md:text-base leading-relaxed">{mesta}</p>
            </div>
          ))}
          <p className="text-stone-600 text-[15px] md:text-base">
            Vaši obec tu nevidíte? Napište, kde bydlíte, a hned vám řekneme, jestli dojedeme.
          </p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-[#f0ebe0] border-y border-stone-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24">
          <div className="mb-10 md:mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">Na co se ptáte</h2>
          </div>
          <div className="space-y-2.5 md:space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                <div className={`rounded-xl border bg-white transition-colors duration-200 ${isOpen ? "border-amber-300" : "border-stone-200 hover:border-stone-300"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
                  >
                    <span className="font-semibold text-sm sm:text-base md:text-lg text-stone-900 leading-snug">{item.q}</span>
                    <span className={`shrink-0 w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-amber-600 text-lg font-light transition-transform duration-300 ${isOpen ? "rotate-45 border-amber-300 bg-amber-50" : ""}`}>+</span>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 md:px-6 md:pb-5 text-stone-500 text-[13px] sm:text-sm md:text-base leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── KONTAKT ── */}
      <div id="kontakt" className="bg-[#f0ebe0] border-y border-stone-200 scroll-mt-16 md:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-8">Zavolejte nebo napište</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-stone-500">Telefon</dt>
                <dd><a href="tel:+420776385776" className="font-serif text-3xl font-semibold text-stone-900 hover:text-amber-700 transition-colors">776 385 776</a></dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">E-mail</dt>
                <dd><a href="mailto:jankanka6@seznam.cz" className="text-lg text-stone-900 hover:text-amber-700 transition-colors break-all">jankanka6@seznam.cz</a></dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Kde nás najdete</dt>
                <dd className="text-lg text-stone-900">Kosmonosy, 293 06</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Kdy to bereme</dt>
                <dd className="text-lg text-stone-900">Každý den 9:00 až 19:00</dd>
              </div>
            </dl>
            <button onClick={openModal} className="btn-primary mt-8">
              Nezávazná poptávka
            </button>
          </div>

          {/* MAPA */}
          <div className="rounded-xl overflow-hidden border border-stone-200 h-[280px] sm:h-[340px] lg:h-auto min-h-[320px]">
            {mapsAllowed ? (
              <iframe
                src="https://www.google.com/maps?q=Kosmonosy+293+06&hl=cs&z=13&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kaňka stínění — Kosmonosy"
              />
            ) : (
              <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center text-center p-6 gap-3">
                <p className="text-stone-600 text-sm max-w-xs leading-relaxed">
                  Mapa se zobrazí po souhlasu s cookies — načte se z Google Maps.
                </p>
                <button
                  type="button"
                  onClick={() => setConsent("all")}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
                >
                  Povolit a zobrazit mapu
                </button>
                <a
                  href="https://www.google.com/maps?q=Kosmonosy+293+06"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 text-xs underline hover:text-amber-800"
                >
                  Nebo otevřít mapu v Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CTA PRUH ── */}
      <div className="relative overflow-hidden bg-amber-600">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white">Chcete znát cenu?</h2>
            <p className="mt-1 text-amber-100 text-sm sm:text-base">Přijedeme zaměřit, nic to nestojí.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a href="tel:+420776385776" className="flex items-center justify-center gap-2 bg-white text-amber-700 hover:bg-amber-50 active:scale-95 transition-all font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg whitespace-nowrap shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              776 385 776
            </a>
            <button onClick={openModal} className="flex items-center justify-center border border-white/40 hover:bg-amber-700 active:scale-95 transition-all text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg whitespace-nowrap">
              Napsat poptávku
            </button>
          </div>
        </div>
      </div>

      {/* ── PATIČKA ── */}
      <footer className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo/kanka-stineni-mark.png"
                alt="Kaňka stínění"
                width={40}
                height={38}
                className="h-8 w-auto"
              />
              <h3 className="text-base md:text-lg font-bold">Kaňka stínění</h3>
            </div>
            <p className="text-stone-400 mt-2 text-sm leading-relaxed">Kosmonosy / Mladá Boleslav</p>
          </div>
          <div>
            <h4 className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest mb-4">Navigace</h4>
            {NAV.map(([href, label]) => (
              <a key={label} href={href} className="block text-stone-300 hover:text-white transition-colors mb-2 text-sm">{label}</a>
            ))}
          </div>
          <div>
            <h4 className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest mb-4">Kontakt</h4>
            <a href="tel:+420776385776" className="block text-white hover:text-amber-400 transition-colors font-semibold mb-2 text-sm">776 385 776</a>
            <a href="mailto:jankanka6@seznam.cz" className="block text-stone-400 hover:text-white transition-colors text-sm mb-4 break-all">jankanka6@seznam.cz</a>
            <p className="text-stone-400 text-sm"><span className="text-stone-300 font-medium block">Pracovní doba</span>Po–Ne 9:00–19:00</p>
          </div>
          <div>
            <h4 className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest mb-4">Firma</h4>
            <p className="text-stone-300 text-sm">Jan Kaňka</p>
            <p className="text-stone-300 text-sm">Kosmonosy, 293 06</p>
            <p className="text-stone-300 text-sm">IČO: 23200928</p>
            <p className="text-stone-500 text-xs mt-1">Neplátce DPH</p>
          </div>
        </div>
        <div className="border-t border-stone-800 py-4 pb-[88px] md:pb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-stone-500 text-xs text-center px-4">
          <span>© {new Date().getFullYear()} Kaňka stínění — Jan Kaňka</span>
          <a href="/ochrana-osobnich-udaju" className="hover:text-stone-300 transition-colors">Zásady ochrany osobních údajů</a>
          <button type="button" onClick={resetConsent} className="hover:text-stone-300 transition-colors">Nastavení cookies</button>
        </div>
      </footer>

      {/* ── MOBILNÍ MENU ── */}
      {menu && (
        <div className="fixed inset-0 z-[90] md:hidden" onClick={() => setMenu(false)} style={{ animation: "fadeIn .2s ease" }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <nav
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 h-full w-[72%] max-w-[280px] bg-white flex flex-col shadow-2xl"
            style={{ animation: "slideIn .28s cubic-bezier(.16,1,.3,1)" }}
          >
            <div className="flex items-center justify-between px-5 h-[58px] border-b border-stone-100">
              <span className="font-bold text-sm">Menu</span>
              <button onClick={() => setMenu(false)} aria-label="Zavřít menu" className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 text-xl">×</button>
            </div>
            <div className="flex flex-col flex-1 px-5 pt-4">
              {NAV.map(([href, label]) => (
                <a key={label} onClick={() => setMenu(false)} href={href} className="py-3.5 text-base font-medium border-b border-stone-100 text-stone-700 hover:text-amber-700 transition-colors">{label}</a>
              ))}
            </div>
            <div className="p-5">
              <a href="tel:+420776385776" className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-base font-bold px-6 py-4 rounded-xl w-full transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                776 385 776
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* ── MODAL – POPTÁVKA ── */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6" onClick={() => setOpen(false)} style={{ animation: "fadeIn .2s ease" }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="poptavka-title"
            className="relative z-10 w-full sm:max-w-md md:max-w-lg max-h-[96svh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
            style={{ animation: "modalIn .32s cubic-bezier(.16,1,.3,1)" }}
          >
            <div className="px-5 py-4 sm:px-7 sm:py-5 md:px-8 md:py-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                                    <h2 id="poptavka-title" className="font-serif text-2xl md:text-3xl font-semibold leading-tight">Přijedeme se podívat</h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Zavřít" className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 text-2xl ml-4 shrink-0 mt-0.5">×</button>
              </div>

              {status === "ok" ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-600">✓</div>
                  <h3 className="text-xl font-black mb-2">Zpráva odeslána</h3>
                  <p className="text-stone-500 text-sm mb-6">Ozveme se vám, většinou ještě dnes.</p>
                  <button onClick={() => setOpen(false)} className="btn-primary">Zavřít</button>
                </div>
              ) : (
                <form onSubmit={odeslat} noValidate>
                  <p className="text-stone-500 text-sm mb-5 leading-relaxed">
                    Napište jméno a telefon nebo e-mail. Ozveme se co nejdřív a domluvíme zaměření — zdarma, bez závazku.
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="poptavka-name" className="sr-only">Jméno</label>
                        <input ref={firstFieldRef} id="poptavka-name" name="name" value={form.name} onChange={onChange} type="text" autoComplete="name" placeholder="Jméno" className="input-field" />
                      </div>
                      <div>
                        <label htmlFor="poptavka-phone" className="sr-only">Telefon</label>
                        <input id="poptavka-phone" name="phone" value={form.phone} onChange={onChange} type="tel" inputMode="tel" autoComplete="tel" placeholder="Telefon" className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="poptavka-email" className="sr-only">E-mail</label>
                      <input id="poptavka-email" name="email" value={form.email} onChange={onChange} type="email" autoComplete="email" placeholder="E-mail" className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="poptavka-message" className="sr-only">Zpráva</label>
                      <textarea id="poptavka-message" name="message" value={form.message} onChange={onChange} rows={3} placeholder="O co jde — typ oken, kolik jich je, kde bydlíte…" className="input-field resize-none" />
                    </div>
                  </div>

                  {status === "error" && (
                    <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
                      {errorMsg}
                    </p>
                  )}

                  <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <p className="text-stone-400 text-xs sm:text-sm">Ozýváme se zpravidla ještě ten den.</p>
                    <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed shrink-0">
                      {status === "sending" ? "Odesíláme…" : "Odeslat poptávku"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX – REALIZACE ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
          style={{ animation: "fadeIn .2s ease" }}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <button
            onClick={() => setLightbox(null)}
            aria-label="Zavřít"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-colors"
          >
            ×
          </button>
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! > 0 ? i! - 1 : i)); }}
              aria-label="Předchozí"
              className="absolute left-2 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
            >
              ‹
            </button>
          )}
          {lightbox < realizace.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! < realizace.length - 1 ? i! + 1 : i)); }}
              aria-label="Další"
              className="absolute right-2 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
            >
              ›
            </button>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-3xl max-h-[85svh] aspect-[946/2047] sm:aspect-auto sm:h-[80svh]"
            style={{ animation: "modalIn .3s cubic-bezier(.16,1,.3,1)" }}
          >
            <Image
              src={realizace[lightbox].img}
              alt={realizace[lightbox].t}
              fill
              sizes="90vw"
              className="object-contain"
            />
            <p className="absolute left-0 right-0 -bottom-9 text-center text-white/70 text-sm">{realizace[lightbox].t}</p>
          </div>
        </div>
      )}

      {/* ── BACK TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Zpět nahoru"
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
      >
        ↑
      </button>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-stone-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.08)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <a href="tel:+420776385776" className="flex-1 flex items-center justify-center gap-2 py-3.5 text-stone-700 font-semibold text-sm border-r border-stone-200 active:bg-stone-50">
          <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          Zavolat
        </a>
        <button onClick={openModal} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-600 active:bg-amber-700 text-white font-bold text-sm">
          Nezávazná poptávka
        </button>
      </div>

      <style>{`
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          background: #b45309; color: white; padding: 14px 28px; border-radius: 6px;
          font-weight: 700; font-size: 15px; transition: background .15s, transform .1s, box-shadow .15s;
          box-shadow: 3px 3px 0 #1c1917; cursor: pointer; border: none;
        }
        .btn-primary:hover { background: #92400e; transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #1c1917; }
        .btn-primary:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 #1c1917; }
        .btn-secondary {
          display: inline-flex; align-items: center; justify-content: center;
          border: 1.5px solid #d6d3cd; background: white; color: #1c1917;
          padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px;
          transition: border-color .15s, background .15s, transform .1s; cursor: pointer;
        }
        .btn-secondary:hover { border-color: #a8a29e; background: #faf8f5; }
        .btn-secondary:active { transform: scale(.97); }
        .input-field {
          width: 100%; border-radius: 10px; border: 1.5px solid #e7e5e0;
          background: #faf9f7; padding: 12px 14px; font-size: 14px; color: #1c1917;
          outline: none; transition: border-color .15s, background .15s;
        }
        .input-field:focus { border-color: #b45309; background: white; }
        .input-field::placeholder { color: #a8a29e; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes heroImgIn {
          from { opacity: 0; transform: translateX(24px) scale(1.02); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(.99); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: .01ms !important; }
        }
      `}</style>
    </main>
  );
}
