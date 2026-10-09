import { getAllArticlesMetadata } from "@/lib/mdx";
import { SITE } from "@/lib/site";

/** RSS 2.0 feed of the latest English articles — helps Bing, Yandex and feed readers find new pages quickly. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
    const items = getAllArticlesMetadata()
        .filter((a) => (!a.lang || a.lang === "en") && !a.noindex && a.category !== "about")
        .sort((a, b) => (b.updated || b.date).localeCompare(a.updated || a.date))
        .slice(0, 50);
    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "<channel>",
        `<title>${esc(SITE.name)}</title>`,
        `<link>${SITE.url}</link>`,
        `<description>${esc("New and updated articles about Odisha and the Odia language")}</description>`,
        "<language>en-in</language>",
        `<atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>`,
        ...items.map((a) => {
            const url = `${SITE.url}/${a.category}/${a.slug}`;
            return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(a.updated || a.date).toUTCString()}</pubDate><category>${esc(a.category)}</category><description>${esc(a.description || "")}</description></item>`;
        }),
        "</channel>",
        "</rss>",
    ].join("\n");
    return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
