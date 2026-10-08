import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { readFileSync } from "node:fs";

// Old cinema URLs from a mis-parsed 2022–2023 film table (people imported as film titles), kept alive as redirects.
const cinemaRedirects: { source: string; destination: string }[] = JSON.parse(readFileSync("./src/data/cinema/redirects.json", "utf8"));

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // The Docker image (see Dockerfile) sets NEXT_OUTPUT=standalone: Next.js then writes a self-contained
  // server (.next/standalone/server.js + only the node_modules it needs). Vercel builds leave it unset.
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),

  // Files read with fs at request time (on-demand village pages and share images) must ship with the server functions.
  outputFileTracingIncludes: {
    "/district/**": ["./public/data/map/*-villages.json"],
    "/**/opengraph-image*": ["./content/**/*"],
  },

  // Duplicate English pages were merged into one canonical URL each (keeps link equity, avoids keyword cannibalisation).
  async redirects() {
    return [
      { source: "/culture/ratha-yatra-en", destination: "/culture/rath-yatra", permanent: true },
      { source: "/food/pakhala-en", destination: "/food/pakhala-bhata", permanent: true },
      { source: "/people/biju-patnaik-en", destination: "/people/biju-patnaik", permanent: true },
      { source: "/panchanga", destination: "/calendar", permanent: true },
      // Old or mistyped URLs that Google Search Console still reports
      { source: "/culture/durga-pooja", destination: "/culture/durga-puja", permanent: true },
      { source: "/learning", destination: "/learn", permanent: true },
      { source: "/learning/:slug", destination: "/learn/:slug", permanent: true },
      { source: "/panjika/today", destination: "/calendar", permanent: true },
      ...cinemaRedirects.map((r) => ({ ...r, permanent: true })),
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
