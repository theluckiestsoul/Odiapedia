import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Noto_Sans_Oriya, Noto_Serif_Oriya } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getLanguagePairs } from "@/lib/lang-map";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { getSearchIndex } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSansOriya = Noto_Sans_Oriya({
  variable: "--font-noto-sans-oriya",
  subsets: ["oriya"],
  display: "swap",
});

const notoSerifOriya = Noto_Serif_Oriya({
  variable: "--font-noto-serif-oriya",
  subsets: ["oriya"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#b8522b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Odiapedia – Encyclopedia of Odisha, Odia Language, Culture & Travel",
    template: "%s | Odiapedia",
  },
  description:
    "Odiapedia is a free bilingual encyclopedia of Odisha: the Odia language and script, history, Jagannath culture, festivals, food, crafts, people, all 30 districts, the Odia calendar and travel guides — written from cited sources.",
  applicationName: SITE.name,
  keywords: [
    "Odia", "Odisha", "Orissa", "Odia language", "Odia culture", "Odisha history", "Odisha tourism", "Odisha travel guide",
    "Odia food", "Odisha festivals", "Jagannath", "Puri", "Konark", "Odia calendar", "Odia panjika", "ଓଡ଼ିଆ", "ଓଡ଼ିଶା",
  ],
  authors: [{ name: "Odiapedia Editorial Team", url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "reference",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.name,
  },
  openGraph: {
    title: "Odiapedia – Encyclopedia of Odisha and the Odia language",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@TheOdiaPedia",
    title: "Odiapedia – Encyclopedia of Odisha and the Odia language",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Add verification tokens via env vars once Search Console / Bing Webmaster Tools are set up.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        alternateName: [SITE.odiaName, "Odia Pedia"],
        url: SITE.url,
        logo: { "@type": "ImageObject", url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
        description: SITE.description,
        sameAs: Object.values(SITE.social),
        email: SITE.email,
        knowsAbout: ["Odisha", "Odia language", "Odia literature", "Jagannath culture", "Odisha tourism", "Odia cuisine", "Odisha history"],
        areaServed: { "@type": "State", name: "Odisha" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        alternateName: SITE.odiaName,
        url: SITE.url,
        inLanguage: ["en", "or"],
        publisher: { "@id": `${SITE.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  const searchIndex = getSearchIndex();

  return (
    <html lang="en" className={`${fraunces.variable} ${geistSans.variable} ${notoSansOriya.variable} ${notoSerifOriya.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" type="text/plain" title="LLM-readable site summary" href="/llms.txt" />
        {/* Google Analytics — set NEXT_PUBLIC_GA_ID in your hosting environment to enable */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <LanguageProvider>
          <Navbar searchIndex={searchIndex} languagePairs={getLanguagePairs()} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
