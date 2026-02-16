import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Odiapedia - Discover Odia Culture, Language & Heritage",
    template: "%s | Odiapedia"
  },
  description: "Explore the rich heritage of Odisha - its classical language, vibrant culture, ancient history, delicious cuisine, and remarkable people.",
  keywords: ["Odia", "Odisha", "Orissa", "Odia culture", "Odia language", "Odia food", "Odia history", "Jagannath", "Puri", "Konark"],
  authors: [{ name: "Odiapedia Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Odiapedia",
  },
  openGraph: {
    title: "Odiapedia - Discover Odia Culture, Language & Heritage",
    description: "Explore the rich heritage of Odisha - its classical language, vibrant culture, ancient history, delicious cuisine, and remarkable people.",
    url: "https://odiapedia.com",
    siteName: "Odiapedia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odiapedia - Discover Odia Culture, Language & Heritage",
    description: "Explore the rich heritage of Odisha",
  },
  robots: {
    index: true,
    follow: true,
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
        "name": "Odiapedia",
        "url": "https://odiapedia.com",
        "logo": "https://odiapedia.com/icon-512.png",
        "sameAs": [
          "https://twitter.com/odiapedia"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "contact@odiapedia.com",
          "contactType": "customer support"
        }
      },
      {
        "@type": "WebSite",
        "name": "Odiapedia",
        "url": "https://odiapedia.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://odiapedia.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Google Analytics - Replace GA_MEASUREMENT_ID with your actual ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`min-h-screen flex flex-col antialiased bg-background text-foreground selection:bg-teal-100 selection:text-teal-900 ${playfair.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
