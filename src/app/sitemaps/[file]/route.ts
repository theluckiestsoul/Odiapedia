import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/site";

/**
 * Section sitemaps (/sitemaps/articles.xml, /sitemaps/cinema.xml, /sitemaps/places.xml).
 * They hold the same URLs as /sitemap.xml, split by section, so Search Console's
 * Pages report can be filtered per sitemap to see which part of the site is (not) indexed.
 */
const SECTIONS: Record<string, (path: string) => boolean> = {
    "cinema.xml": (p) => p.startsWith("/cinema"),
    "places.xml": (p) => p.startsWith("/district") || p.startsWith("/travel"),
    "articles.xml": (p) => !p.startsWith("/cinema") && !p.startsWith("/district") && !p.startsWith("/travel"),
};

export const dynamic = "force-static";

export function generateStaticParams() {
    return Object.keys(SECTIONS).map((file) => ({ file }));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
    const { file } = await params;
    const keep = SECTIONS[file];
    if (!keep) return new Response("Not found", { status: 404 });
    const entries = (await sitemap()).filter((e) => keep(e.url.replace(SITE.url, "") || "/"));
    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...entries.map((e) => {
            const alts = Object.entries(e.alternates?.languages ?? {})
                .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(String(href))}"/>`).join("");
            const lm = e.lastModified ? `<lastmod>${new Date(e.lastModified).toISOString().slice(0, 10)}</lastmod>` : "";
            return `<url><loc>${esc(e.url)}</loc>${alts}${lm}</url>`;
        }),
        "</urlset>",
    ].join("\n");
    return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
