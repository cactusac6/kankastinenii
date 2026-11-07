"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { resetConsent, setConsent, useConsent } from "@/lib/cookieConsent";
import { faqs, YEAR_FOUNDED } from "@/lib/faqs";

const NAV = [["#", "Domů"], ["#sluzby", "Služby"], ["#o-nas", "O nás"], ["#kontakt", "Kontakt"]];

const FATHER_YEARS = new Date().getFullYear() - YEAR_FOUNDED;
const JAN_YEARS = new Date().getFullYear() - 2018;

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(el);
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [progress, setProgress] = useState(0);
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
      setErrorMsg("Vyplňte alespoň telefon nebo e-mail, ať se vám mohu ozvat.");
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
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("reveal-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 800);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
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
    { img: "https://images.pexels.com/photos/9270061/pexels-photo-9270061.jpeg?auto=compress&cs=tinysrgb&w=800", t: "Vertikální žaluzie", s: "Velká okna, kanceláře, prosklené stěny." },
    { img: "https://images.pexels.com/photos/15021456/pexels-photo-15021456.jpeg?auto=compress&cs=tinysrgb&w=800", t: "Horizontální žaluzie", s: "Hliník nebo dřevo, v jakékoli barvě." },
    { img: "https://images.pexels.com/photos/16153504/pexels-photo-16153504.jpeg?auto=compress&cs=tinysrgb&w=800", t: "Rolety den a noc", s: "Přes den světlo, večer tma a soukromí." },
    { img: "https://images.pexels.com/photos/17756267/pexels-photo-17756267.jpeg?auto=compress&cs=tinysrgb&w=800", t: "Sítě proti hmyzu", s: "Rámové i rolovací. Větrá se, komáři ne." },
    { img: "https://images.pexels.com/photos/12394619/pexels-photo-12394619.jpeg?auto=compress&cs=tinysrgb&w=800", t: "Servis a opravy", s: "Nefunguje žaluzie, roleta nebo markýza? Opravím i to, co jiní vyhodí." },
  ];

  const steps = [
    { n: "01", t: "Kontaktujete nás", s: "Napíšete nebo zavoláte — řeknete, jaká máte okna a co potřebujete." },
    { n: "02", t: "Zaměříme", s: "Přijedeme k vám a rozměry vezmeme přímo na místě, žádné odhady." },
    { n: "03", t: "Pošleme cenovou nabídku", s: "Konkrétní částka podle zaměření, bez skrytých poplatků." },
    { n: "04", t: "Objednáme materiál", s: "Když nabídku odsouhlasíte, objednáme materiál — uhradíte zálohovou fakturu předem." },
    { n: "05", t: "Přijedeme a namontujeme", s: "Materiál dovezeme a nainstalujeme, obvykle s otcem spolu." },
    { n: "06", t: "Doplatíte po dokončení", s: "Zbytek ceny platíte až po hotové montáži, ne dřív." },
  ];

  const trustBadges = [
    { icon: "⚖", t: "Férové ceny" },
    { icon: "✓", t: "Kvalitní materiály" },
    { icon: "★", t: "Jsme perfekcionisti" },
  ];

  const realizace = [
    { img: "/realizace/pred-montazi.jpeg", t: "Před montáží", s: "Vysoké historické okno bez stínění." },
    { img: "/realizace/montaz.jpeg", t: "Při montáži", s: "Okno vysoké přes 3 metry, montáž ze žebříku." },
    { img: "/realizace/hotovo.jpeg", t: "Hotovo", s: "Látková roleta na místě." },
  ];

  const regions = [
    { kraj: "Středočeský kraj", mesta: ["Mladá Boleslav", "Kosmonosy", "Bakov nad Jizerou", "Benátky nad Jizerou", "Mnichovo Hradiště", "Dobrovice", "Bělá pod Bezdězem", "Nymburk", "Lysá nad Labem", "Brandýs nad Labem", "Mělník", "Luštěnice"] },
    { kraj: "Liberecký kraj", mesta: ["Turnov", "Český Dub", "Semily", "Železný Brod", "Liberec", "Jilemnice"] },
    { kraj: "Královéhradecký kraj", mesta: ["Jičín", "Sobotka", "Kopidlno", "Hořice", "Nová Paka"] },
  ];

  return (
    <main className="bg-[#faf8f5] text-stone-900 overflow-x-hidden">

      {/* ── SCROLL PROGRESS ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
        <div className="h-full bg-amber-600 transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      </div>

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
            <p className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4 sm:mb-5">
              Žaluzie · Rolety · Sítě
            </p>
            <h1 className="text-[40px] sm:text-[56px] md:text-[68px] xl:text-[78px] font-black leading-[0.93] tracking-tight text-white">
              Žaluzie<br />Mladá<br /><span className="text-amber-500">Boleslav</span>
            </h1>
            <p className="mt-5 md:mt-6 text-stone-200 text-base sm:text-lg md:text-xl leading-relaxed max-w-md">
              Jsme Kaňka stínění — žaluzie, rolety a sítě prodáváme, montujeme a opravujeme
              už {FATHER_YEARS} let. Táta s tím začal v roce {YEAR_FOUNDED}, dnes jezdíme na zakázky spolu jako otec a syn.
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
            <div className="mt-8 md:mt-10 pt-7 md:pt-8 border-t border-white/20 grid grid-cols-3 gap-4 sm:gap-6">
              {[[`${FATHER_YEARS} let`, "na trhu"], ["50 km", "dojezd od Kosmonos"], ["Zdarma", "zaměření"]].map(([val, label]) => (
                <div key={label}>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">{val}</p>
                  <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <div id="sluzby" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 scroll-mt-16 md:scroll-mt-20">
        <div className="mb-10 md:mb-14" data-reveal>
          <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Co děláme</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Žaluzie, rolety,<br className="sm:hidden" /> sítě a servis
          </h2>
          <p className="mt-4 text-stone-500 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Montujeme a opravujeme žaluzie, rolety, markýzy, plisé, japonské stěny, sítě proti hmyzu
            i garážová vrata. Co jde opravit, radši opravíme, než abyste kupovali nové.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {services.map((c, idx) => (
            <div
              key={idx}
              data-reveal
              style={{ transitionDelay: `${idx * 55}ms` }}
              className="group relative rounded-xl overflow-hidden border border-stone-200 last:col-span-2 lg:last:col-span-1 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] bg-white cursor-default"
            >
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
                <Image
                  src={c.img}
                  alt={c.t}
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-[13px] sm:text-sm md:text-base text-stone-900 leading-snug">{c.t}</h3>
                <p className="text-stone-500 text-[11px] sm:text-xs md:text-sm leading-relaxed mt-1 hidden sm:block">{c.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JAK TO FUNGUJE ── */}
      <div className="bg-[#f0ebe0] border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24">
          <div className="mb-10 md:mb-16" data-reveal>
            <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Jak probíhá spolupráce</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">Od kontaktu<br />po doplatek</h2>
            <p className="mt-4 text-stone-500 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Žádné platby dopředu za celou zakázku — materiál objednáme až po vašem souhlasu
              s cenou a doplácíte, až když je montáž hotová.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10">
            {steps.map((step, idx) => (
              <div key={idx} data-reveal style={{ transitionDelay: `${idx * 70}ms` }} className="relative">
                {idx < steps.length - 1 && (idx + 1) % 3 !== 0 && (
                  <div className="hidden sm:block absolute top-7 left-[60%] right-0 h-px bg-stone-300/60" />
                )}
                <p className="text-[44px] sm:text-[52px] font-black leading-none text-stone-400 select-none mb-3 md:mb-4">{step.n}</p>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-stone-900 mb-1.5">{step.t}</h3>
                <p className="text-stone-500 text-[13px] sm:text-sm md:text-[15px] leading-relaxed">{step.s}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 md:mt-14 flex flex-wrap gap-3 md:gap-4" data-reveal>
            {trustBadges.map((b) => (
              <span key={b.t} className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full pl-3 pr-4 py-2 text-xs sm:text-sm font-semibold text-stone-800">
                <span className="text-amber-600">{b.icon}</span> {b.t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── REALIZACE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
        <div className="mb-10 md:mb-14" data-reveal>
          <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Ukázka práce</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight">
            Historická okna —<br className="hidden sm:block" /> přes 3 metry výšky
          </h2>
          <p className="mt-4 text-stone-500 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
            Starší budova, vysoká okna, montáž ze žebříku.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {realizace.map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLightbox(idx)}
              data-reveal
              style={{ transitionDelay: `${idx * 80}ms` }}
              className="group text-left rounded-xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-md cursor-zoom-in"
            >
              <div className="h-[220px] sm:h-[300px] md:h-[360px] overflow-hidden bg-stone-100 relative">
                <Image
                  src={r.img}
                  alt={r.t}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-stone-700 text-lg">⤢</span>
                </div>
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
          <div data-reveal className="order-2 lg:order-1">
            <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Kdo jsme</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-5 md:mb-6">
              Otec a syn<br />z Kosmonos
            </h2>
            <p className="text-stone-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Jsme Kaňka stínění — otec v oboru začal v roce {YEAR_FOUNDED}, já (Jan) jsem se přidal v roce 2018
              a na zakázky jezdíme spolu dodnes.
            </p>
            <p className="text-stone-500 text-sm sm:text-base md:text-lg leading-relaxed mb-8 md:mb-10">
              Montujeme v bytech, domech, kancelářích i ve starých budovách. Žádní brigádníci
              ani subdodavatelé — přijedeme my dva.
            </p>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t border-stone-300/70 pt-7 md:pt-8">
              <div>
                <p className="text-2xl sm:text-3xl font-black"><AnimatedNumber value={FATHER_YEARS} suffix=" let" /></p>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug">na trhu</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black"><AnimatedNumber value={50} suffix=" km" /></p>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug">maximální dojezd</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black"><AnimatedNumber value={JAN_YEARS} suffix=" let" /></p>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug">Jan v oboru</p>
              </div>
            </div>
          </div>
          <div data-reveal className="order-1 lg:order-2 rounded-xl overflow-hidden h-[240px] sm:h-[340px] md:h-[460px] bg-stone-200 relative">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
        <div className="mb-10 md:mb-14" data-reveal>
          <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Kde jezdíme</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Mladá Boleslav<br />a okolí do 50 km
          </h2>
          <p className="mt-4 text-stone-500 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
            Sídlíme v Kosmonosech. Do hodiny jízdy se většinou domluvíme.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {regions.map((r, idx) => (
            <div key={idx} data-reveal style={{ transitionDelay: `${idx * 70}ms` }} className="rounded-xl border border-stone-200 bg-white p-5 md:p-6 hover:border-amber-200 transition-colors duration-200">
              <h3 className="font-bold text-sm md:text-base text-stone-900 mb-4 flex items-center gap-2">
                <span className="text-amber-600 text-base">📍</span> {r.kraj}
              </h3>
              <ul className="space-y-1.5 md:space-y-2">
                {r.mesta.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-stone-600 text-[13px] md:text-[15px]">
                    <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-stone-400 text-xs sm:text-sm text-center">
          Svou obec tu nevidíte? Napište nám, pravděpodobně přijedeme.
        </p>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-[#f0ebe0] border-y border-stone-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24">
          <div className="mb-10 md:mb-14" data-reveal>
            <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Co se lidé ptají</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">Nejčastější<br />otázky</h2>
          </div>
          <div className="space-y-2.5 md:space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} data-reveal style={{ transitionDelay: `${idx * 45}ms` }}>
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

      {/* ── PROČ MY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28">
        <div className="mb-10 md:mb-14" data-reveal>
          <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Proč my dva</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">Co od nás<br />čekat</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {[
            { t: `${FATHER_YEARS} let zkušeností v rodině`, s: "Otec dělá žaluzie od roku 1992, já se u něj učím od roku 2018. Víme, jak se co montuje." },
            { t: "Jezdíme osobně", s: "Žádní brigádníci ani subdodavatelé. Na zakázku přijedeme my dva." },
            { t: "Opravíme, co jde", s: "Když se stará žaluzie nebo roleta dá opravit, opravím ji. Nové vám cpát nebudu." },
          ].map((r, idx) => (
            <div key={idx} data-reveal style={{ transitionDelay: `${idx * 70}ms` }}
              className="bg-white rounded-xl border border-stone-200 p-5 md:p-6">
              <h3 className="font-bold text-base md:text-lg text-stone-900 mb-2">{r.t}</h3>
              <p className="text-stone-500 text-sm md:text-base leading-relaxed">{r.s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KONTAKT ── */}
      <div id="kontakt" className="bg-[#f0ebe0] border-y border-stone-200 scroll-mt-16 md:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div data-reveal>
            <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Kontakt</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-8">Napište nám<br />nebo zavolejte</h2>
            <div className="space-y-5">
              <a href="tel:+420776385776" className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 uppercase tracking-wider">Telefon</p>
                  <p className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors">776 385 776</p>
                </div>
              </a>
              <a href="mailto:jankanka6@seznam.cz" className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 uppercase tracking-wider">E-mail</p>
                  <p className="font-bold text-base text-stone-900 group-hover:text-amber-700 transition-colors break-all">jankanka6@seznam.cz</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 uppercase tracking-wider">Sídlo</p>
                  <p className="font-bold text-base text-stone-900">Kosmonosy, 293 06</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 uppercase tracking-wider">Pracovní doba</p>
                  <p className="font-bold text-base text-stone-900">Po–Ne, 9:00–19:00</p>
                </div>
              </div>
            </div>
            <button onClick={openModal} className="btn-primary mt-8">
              Nezávazná poptávka
            </button>
          </div>

          {/* MAPA */}
          <div data-reveal className="rounded-xl overflow-hidden border border-stone-200 h-[280px] sm:h-[340px] lg:h-auto min-h-[320px]">
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
                  Mapu zobrazím po souhlasu s cookies — načte se z Google Maps.
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
        <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/4 w-[320px] h-[320px] rounded-full bg-white/10 blur-[80px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Chcete cenovou nabídku?</h2>
            <p className="mt-1 text-amber-100 text-sm sm:text-base">Zavolejte nebo napište — zaměření je zdarma.</p>
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
                  <p className="text-amber-700 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1">Napište nám</p>
                  <h2 id="poptavka-title" className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">Přijedeme se podívat</h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Zavřít" className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 text-2xl ml-4 shrink-0 mt-0.5">×</button>
              </div>

              {status === "ok" ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-600">✓</div>
                  <h3 className="text-xl font-black mb-2">Poptávka odeslána!</h3>
                  <p className="text-stone-500 text-sm mb-6">Děkujeme, ozveme se vám co nejdříve.</p>
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
                      {status === "sending" ? "Odesílám…" : "Odeslat poptávku"}
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
        [data-reveal] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1);
        }
        [data-reveal].reveal-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
          * { animation-duration: .01ms !important; }
        }
      `}</style>
    </main>
  );
}
