import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Odiapedia - Discover Odia Culture, Language & Heritage",
    template: "%s | Odiapedia"
  },
  description: "Explore the rich heritage of Odisha - its classical language, vibrant culture, ancient history, delicious cuisine, and remarkable people.",
  keywords: ["Odia", "Odisha", "Orissa", "Odia culture", "Odia language", "Odia food", "Odia history", "Jagannath", "Puri", "Konark"],
  authors: [{ name: "Odiapedia Team" }],
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
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased bg-black text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
