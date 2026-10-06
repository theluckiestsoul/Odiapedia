import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Duplicate English pages were merged into one canonical URL each (keeps link equity, avoids keyword cannibalisation).
  async redirects() {
    return [
      { source: "/culture/ratha-yatra-en", destination: "/culture/rath-yatra", permanent: true },
      { source: "/food/pakhala-en", destination: "/food/pakhala-bhata", permanent: true },
      { source: "/people/biju-patnaik-en", destination: "/people/biju-patnaik", permanent: true },
      { source: "/panchanga", destination: "/calendar", permanent: true },
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
