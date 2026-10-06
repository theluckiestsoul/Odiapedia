import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

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
