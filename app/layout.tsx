import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import { faqs } from "@/lib/faqs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://kankastineni.cz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Žaluzie Mladá Boleslav – Kaňka stínění",
    template: "%s | Kaňka stínění",
  },
  description:
    "Žaluzie Mladá Boleslav a okolí do 50 km – montáž a opravy žaluzií, rolet, markýz, plisé, japonských stěn a sítí proti hmyzu. Středočeský, Liberecký i Královéhradecký kraj. Praxe od roku 1992. Zaměření zdarma, nezávazná nabídka.",
  keywords: [
    "žaluzie Mladá Boleslav",
    "stínící technika Mladá Boleslav",
    "žaluzie Středočeský kraj",
    "žaluzie Kosmonosy",
    "vertikální žaluzie",
    "horizontální žaluzie",
    "rolety den a noc",
    "plisé rolety",
    "japonské stěny",
    "markýzy",
    "garážová vrata",
    "sítě proti hmyzu",
    "montáž žaluzií",
    "oprava žaluzií",
    "servis stínicí techniky",
    "žaluzie Turnov",
    "žaluzie Jičín",
    "žaluzie Mnichovo Hradiště",
    "Kaňka stínění",
  ],
  authors: [{ name: "Jan Kaňka" }],
  creator: "Jan Kaňka",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: siteUrl,
    siteName: "Kaňka stínění",
    title: "Žaluzie Mladá Boleslav – Kaňka stínění",
    description:
      "Žaluzie Mladá Boleslav a okolí do 50 km – montáž žaluzií, rolet a sítí proti hmyzu. Praxe od roku 1992. Zaměření zdarma, nezávazná nabídka.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Žaluzie a stínicí technika – Kaňka stínění" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Žaluzie Mladá Boleslav – Kaňka stínění",
    description:
      "Žaluzie Mladá Boleslav a okolí do 50 km – montáž žaluzií, rolet a sítí proti hmyzu. Zaměření zdarma.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Kaňka stínění",
  image: `${siteUrl}/og-image.jpg`,
  url: siteUrl,
  telephone: "+420776385776",
  email: "jankanka6@seznam.cz",
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    ],
    opens: "09:00",
    closes: "19:00",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kosmonosy",
    postalCode: "293 06",
    addressRegion: "Středočeský kraj",
    addressCountry: "CZ",
  },
  areaServed: [
    { "@type": "City", name: "Mladá Boleslav" },
    { "@type": "City", name: "Kosmonosy" },
    { "@type": "City", name: "Bakov nad Jizerou" },
    { "@type": "City", name: "Benátky nad Jizerou" },
    { "@type": "City", name: "Mnichovo Hradiště" },
    { "@type": "City", name: "Dobrovice" },
    { "@type": "City", name: "Bělá pod Bezdězem" },
    { "@type": "City", name: "Nymburk" },
    { "@type": "City", name: "Lysá nad Labem" },
    { "@type": "City", name: "Brandýs nad Labem-Stará Boleslav" },
    { "@type": "City", name: "Mělník" },
    { "@type": "City", name: "Turnov" },
    { "@type": "City", name: "Český Dub" },
    { "@type": "City", name: "Semily" },
    { "@type": "City", name: "Železný Brod" },
    { "@type": "City", name: "Liberec" },
    { "@type": "City", name: "Jičín" },
    { "@type": "City", name: "Sobotka" },
    { "@type": "City", name: "Kopidlno" },
    { "@type": "City", name: "Hořice" },
    { "@type": "City", name: "Nová Paka" },
    { "@type": "AdministrativeArea", name: "Středočeský kraj" },
    { "@type": "AdministrativeArea", name: "Liberecký kraj" },
    { "@type": "AdministrativeArea", name: "Královéhradecký kraj" },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.4128,
    longitude: 14.9066,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Stínící technika",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vertikální žaluzie" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Horizontální žaluzie" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rolety den a noc" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Plisé rolety" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Japonské stěny" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Markýzy" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Garážová vrata" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sítě proti hmyzu" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Servis a oprava veškeré stínicí techniky" } },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf8f5]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
