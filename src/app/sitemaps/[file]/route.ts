import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/site";
import { ADMIN_DISTRICTS, getAdminDistrict, villageId } from "@/lib/admin";

/**
 * Section sitemaps (/sitemaps/articles.xml, /sitemaps/cinema.xml, /sitemaps/places.xml).
 * They hold the same URLs as /sitemap.xml, split by section, so Search Console's
 * Pages report can be filtered per sitemap to see which part of the site is (not) indexed.
 *
 * Village pages (~52,000) are too many for one sitemap (limit 50,000 URLs), so /sitemaps/villages.xml
 * is a sitemap index pointing to one sitemap per district: /sitemaps/villages-<district>.xml.
 */
const SECTIONS: Record<string, (path: string) => boolean> = {
    "cinema.xml": (p) => p.startsWith("/cinema"),
    "places.xml": (p) => p.startsWith("/district") || p.startsWith("/travel"),
    "articles.xml": (p) => !p.startsWith("/cinema") && !p.startsWith("/district") && !p.startsWith("/travel"),
};

export const dynamic = "force-static";

export function generateStaticParams() {
    return [...Object.keys(SECTIONS), "villages.xml", ...ADMIN_DISTRICTS.map((d) => `villages-${d}.xml`)].map((file) => ({ file }));
}

const XML_HEADERS = { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
    const { file } = await params;
    if (file === "villages.xml") {
        const body = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...ADMIN_DISTRICTS.map((d) => `<sitemap><loc>${SITE.url}/sitemaps/villages-${d}.xml</loc></sitemap>`),
            "</sitemapindex>",
        ].join("\n");
        return new Response(body, { headers: XML_HEADERS });
    }
    const vm = /^villages-([a-z]+)\.xml$/.exec(file);
    if (vm) {
        const a = ADMIN_DISTRICTS.includes(vm[1]) ? await getAdminDistrict(vm[1]) : null;
        if (!a) return new Response("Not found", { status: 404 });
        const body = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...a.villages.map((v) => `<url><loc>${SITE.url}/district/${vm[1]}/village/${esc(villageId(v))}</loc></url>`),
            "</urlset>",
        ].join("\n");
        return new Response(body, { headers: XML_HEADERS });
    }
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
    return new Response(body, { headers: XML_HEADERS });
}
