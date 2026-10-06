import { getAllArticlesMetadata } from "@/lib/mdx";
import { getAllDistrictSlugs } from "@/lib/districts";

/**
 * English ↔ Odia page pairs, keyed by pathname, e.g. { "/food/dalma": "/food/dalma-od", "/food/dalma-od": "/food/dalma" }.
 * Used by the language switcher so it only ever links to pages that exist.
 */
export function getLanguagePairs(): Record<string, string> {
    const pairs: Record<string, string> = {};
    const add = (a: string, b: string) => { if (a !== b) { pairs[a] ??= b; pairs[b] ??= a; } };
    const articles = getAllArticlesMetadata().filter((a) => !a.mergedInto);
    const paths = new Set(articles.map((a) => `/${a.category}/${a.slug}`));
    for (const a of articles) {
        const self = `/${a.category}/${a.slug}`;
        for (const [lang, path] of Object.entries(a.alternates ?? {})) {
            if ((lang === "od" || lang === "en") && paths.has(path)) add(self, path);
        }
        if (a.slug.endsWith("-od")) {
            const base = a.slug.slice(0, -3);
            const en = [`/${a.category}/${base}`, `/${a.category}/${base}-en`].find((p) => paths.has(p));
            if (en) add(en, self);
        }
    }
    const districts = new Set(getAllDistrictSlugs());
    for (const d of districts) if (d.endsWith("-od") && districts.has(d.slice(0, -3))) add(`/district/${d.slice(0, -3)}`, `/district/${d}`);
    return pairs;
}

/** All Odia-language pages, for the /odia index. */
export function getOdiaPages() {
    return getAllArticlesMetadata().filter((a) => a.lang === "od" && !a.mergedInto && !a.noindex);
}
