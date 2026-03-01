import { MetadataRoute } from "next";
import { getAllArticlesMetadata } from "@/lib/mdx";
import { getAllDistrictSlugs } from "@/lib/districts";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";
import { getAllSpots } from "@/lib/spots";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://odiapedia.com";

    // Static pages
    const staticPages = [
        "",
        "/language",
        "/culture",
        "/history",
        "/food",
        "/people",
        "/about",
        "/districts",
        "/map",
        "/learn",
        "/panjika",
        "/panjika/biraja",
        "/panjika/jagannath",
        '/culture/cinema/timeline', // Cinema Timeline
        '/culture/cinema/reviews',  // Movie Reviews
        '/latest',                  // Latest Updates
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic article pages (existing)
    const articles = getAllArticlesMetadata();
    const articlePages = articles.map((article) => {
        const languages: Record<string, string> = {};

        // Map the alternate language paths
        if (article.alternates) {
            for (const [lang, path] of Object.entries(article.alternates)) {
                const hreflang = lang === 'od' ? 'or' : lang;
                languages[hreflang] = `${baseUrl}${path}`;
            }
        }

        // Add the current canonical language
        if (article.lang) {
            const currentHreflang = article.lang === 'od' ? 'or' : article.lang;
            languages[currentHreflang] = `${baseUrl}/${article.category}/${article.slug}`;
        }

        return {
            url: `${baseUrl}/${article.category}/${article.slug}`,
            lastModified: new Date(article.date),
            changeFrequency: "monthly" as const,
            priority: 0.6,
            alternates: Object.keys(languages).length > 0 ? { languages } : undefined,
        };
    });

    // District pages
    const districtSlugs = getAllDistrictSlugs();
    const districtPages = districtSlugs.map((slug) => ({
        url: `${baseUrl}/district/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9, // High priority - core content
    }));

    // Tehsil pages
    const tehsilPages: MetadataRoute.Sitemap = [];
    for (const districtSlug of districtSlugs) {
        const tehsils = getAllTehsilsForDistrict(districtSlug);
        for (const tehsil of tehsils) {
            tehsilPages.push({
                url: `${baseUrl}/district/${districtSlug}/${tehsil.slug}`,
                lastModified: new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.7,
            });
        }
    }

    // Spot pages (POIs)
    const spots = getAllSpots();
    const spotPages = spots.map((spot) => ({
        url: `${baseUrl}/district/${spot.district}/${spot.tehsil}/${spot.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...articlePages, ...districtPages, ...tehsilPages, ...spotPages];
}
