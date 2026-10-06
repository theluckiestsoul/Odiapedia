import { MetadataRoute } from "next";
import { getAllArticlesMetadata, type ArticleMeta } from "@/lib/mdx";
import { getAllDistrictSlugs } from "@/lib/districts";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";
import { getAllSpots } from "@/lib/spots";
import { SITE } from "@/lib/site";
import { LIBRARY } from "@/data/library";

/**
 * XML sitemap. lastModified uses each article's real "updated" date — never "now" —
 * so search engines can trust it (Google ignores lastmod values that are always fresh).
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const base = SITE.url;
    const articles = getAllArticlesMetadata().filter((a) => !a.noindex);
    const latestIn = (pred: (a: ArticleMeta) => boolean) =>
        articles.filter(pred).reduce<string | undefined>((max, a) => (!max || a.updated > max ? a.updated : max), undefined);
    const newest = latestIn(() => true);

    const hubs: { path: string; category?: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
        { path: "", priority: 1, freq: "daily" },
        { path: "/travel", category: "travel", priority: 0.9, freq: "weekly" },
        { path: "/culture", category: "culture", priority: 0.9, freq: "weekly" },
        { path: "/history", category: "history", priority: 0.9, freq: "weekly" },
        { path: "/language", category: "language", priority: 0.9, freq: "weekly" },
        { path: "/food", category: "food", priority: 0.9, freq: "weekly" },
        { path: "/people", category: "people", priority: 0.8, freq: "weekly" },
        { path: "/learn", category: "learn", priority: 0.8, freq: "monthly" },
        { path: "/districts", priority: 0.8, freq: "monthly" },
        { path: "/calendar", priority: 0.9, freq: "daily" },
        { path: "/travel/plan", priority: 0.7, freq: "monthly" },
        { path: "/shop", priority: 0.6, freq: "monthly" },
        { path: "/partners", priority: 0.4, freq: "monthly" },
        { path: "/map", priority: 0.6, freq: "monthly" },
        { path: "/history/timeline", priority: 0.7, freq: "monthly" },
        { path: "/panjika", priority: 0.6, freq: "monthly" },
        { path: "/panjika/biraja", priority: 0.4, freq: "yearly" },
        { path: "/panjika/jagannath", priority: 0.4, freq: "yearly" },
        { path: "/culture/cinema/timeline", priority: 0.5, freq: "monthly" },
        { path: "/culture/cinema/reviews", priority: 0.4, freq: "monthly" },
        { path: "/latest", priority: 0.5, freq: "weekly" },
        { path: "/library", priority: 0.8, freq: "weekly" },
        { path: "/about", category: "about", priority: 0.5, freq: "monthly" },
    ];

    const hubPages: MetadataRoute.Sitemap = hubs.map((h) => {
        const lm = h.path === "" || h.path === "/latest" ? newest : h.category ? latestIn((a) => a.category === h.category) : undefined;
        return {
            url: `${base}${h.path}`,
            ...(lm ? { lastModified: lm } : {}),
            changeFrequency: h.freq,
            priority: h.priority,
        };
    });

    const articlePages: MetadataRoute.Sitemap = articles.map((a) => {
        const languages: Record<string, string> = {};
        if (a.alternates) {
            for (const [lang, path] of Object.entries(a.alternates)) languages[lang === "od" ? "or" : lang] = `${base}${path}`;
            languages[a.lang === "od" ? "or" : a.lang || "en"] = `${base}/${a.category}/${a.slug}`;
        }
        return {
            url: `${base}/${a.category}/${a.slug}`,
            lastModified: a.updated,
            changeFrequency: "monthly" as const,
            priority: a.category === "travel" || (a.sources?.length ?? 0) > 0 ? 0.8 : 0.6,
            ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
        };
    });

    const districtSlugs = getAllDistrictSlugs();
    const districtPages: MetadataRoute.Sitemap = districtSlugs.map((slug) => {
        const baseSlug = slug.replace(/-od$/, "");
        const hasPair = districtSlugs.includes(`${baseSlug}-od`) && districtSlugs.includes(baseSlug);
        return {
            url: `${base}/district/${slug}`,
            changeFrequency: "monthly" as const,
            priority: slug.endsWith("-od") ? 0.6 : 0.8,
            ...(hasPair ? { alternates: { languages: { en: `${base}/district/${baseSlug}`, or: `${base}/district/${baseSlug}-od` } } } : {}),
        };
    });

    const tehsilPages: MetadataRoute.Sitemap = [];
    for (const districtSlug of districtSlugs.filter((s) => !s.endsWith("-od"))) {
        for (const tehsil of getAllTehsilsForDistrict(districtSlug)) {
            tehsilPages.push({ url: `${base}/district/${districtSlug}/${tehsil.slug}`, changeFrequency: "monthly", priority: 0.5 });
        }
    }

    const spotPages: MetadataRoute.Sitemap = getAllSpots().map((spot) => ({
        url: `${base}/district/${spot.district}/${spot.tehsil}/${spot.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    const libraryPages: MetadataRoute.Sitemap = LIBRARY.map((i) => ({
        url: `${base}/library/${i.slug}`,
        lastModified: i.checked,
        changeFrequency: "yearly" as const,
        priority: 0.6,
    }));

    return [...hubPages, ...libraryPages, ...articlePages, ...districtPages, ...tehsilPages, ...spotPages];
}
