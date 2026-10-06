import type { Metadata } from "next";
import type { Article, ArticleMeta } from "./mdx";
import { SITE, absoluteUrl, categoryInfo } from "./site";

const hreflang = (lang: string) => (lang === "od" ? "or" : lang);

/** Canonical path of an article. */
export const articlePath = (a: Pick<ArticleMeta, "category" | "slug">) => `/${a.category}/${a.slug}`;

/** SEO title: entity first, short, brand appended by the layout template. */
function seoTitle(a: ArticleMeta): string {
    // Keep "<title> | Odiapedia" under ~65 characters: drop a subtitle after " - ", " – ", " — " or ": " if needed.
    if (a.title.length + 12 <= 65) return a.title;
    const short = a.title.replace(/(\s+[-—–|]\s+|:\s+).*$/, "");
    return short.length >= 8 ? short : a.title;
}

export function buildArticleMetadata(a: Article | null): Metadata {
    if (!a) return { title: "Article not found", robots: { index: false, follow: true } };

    const path = articlePath(a);
    const languages: Record<string, string> = {};
    if (a.alternates) {
        for (const [lang, p] of Object.entries(a.alternates)) languages[hreflang(lang)] = absoluteUrl(p);
    }
    if (Object.keys(languages).length > 0) {
        languages[hreflang(a.lang || "en")] = absoluteUrl(path);
        // x-default points to the English version when one exists
        const en = languages["en"];
        if (en) languages["x-default"] = en;
    }
    const images = a.image ? [{ url: absoluteUrl(a.image), alt: a.title }] : undefined;
    const description = a.description || `${a.title} — ${categoryInfo(a.category).label} on Odiapedia.`;

    return {
        title: seoTitle(a),
        description,
        keywords: a.keywords.length ? a.keywords : undefined,
        authors: [{ name: a.author }],
        alternates: {
            canonical: path,
            ...(Object.keys(languages).length ? { languages } : {}),
        },
        robots: a.noindex ? { index: false, follow: true } : undefined,
        openGraph: {
            type: "article",
            url: absoluteUrl(path),
            siteName: SITE.name,
            title: a.title,
            description,
            publishedTime: a.date,
            modifiedTime: a.updated,
            authors: [a.author],
            section: categoryInfo(a.category).label,
            tags: a.keywords.slice(0, 6),
            locale: a.lang === "od" ? "or_IN" : a.lang === "hi" ? "hi_IN" : "en_IN",
            ...(images ? { images } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: a.title,
            description,
            ...(images ? { images: images.map((i) => i.url) } : {}),
        },
    };
}

export interface Crumb {
    name: string;
    href: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
        })),
    };
}

const TRAVEL_DESTINATION_HINT = /itinerary|best-time|how-to-reach/;

export function articleJsonLd(a: Article) {
    const url = absoluteUrl(articlePath(a));
    const inLanguage = a.lang === "od" ? "or" : a.lang || "en";
    const graph: Record<string, unknown>[] = [
        {
            "@type": "Article",
            "@id": `${url}#article`,
            headline: a.title.slice(0, 110),
            alternativeHeadline: a.odiaTitle,
            description: a.description,
            url,
            mainEntityOfPage: url,
            inLanguage,
            datePublished: a.date,
            dateModified: a.updated,
            author: { "@type": "Organization", name: a.author, url: SITE.url },
            publisher: { "@id": `${SITE.url}/#organization` },
            image: a.image ? absoluteUrl(a.image) : `${SITE.url}/opengraph-image`,
            keywords: a.keywords.join(", ") || undefined,
            articleSection: categoryInfo(a.category).label,
            isAccessibleForFree: true,
            citation: a.sources.length ? a.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url, publisher: s.publisher })) : undefined,
            about: { "@type": "Thing", name: a.title.replace(/\s+[-—–:|]\s+.*$/, ""), alternateName: a.odiaTitle },
        },
    ];

    if (a.category === "travel" && !TRAVEL_DESTINATION_HINT.test(a.slug)) {
        graph.push({
            "@type": "TouristDestination",
            name: a.title.replace(/\s+(Travel Guide|travel guide).*$/, ""),
            alternateName: a.odiaTitle,
            description: a.description,
            url,
            containedInPlace: { "@type": "State", name: "Odisha", containedInPlace: { "@type": "Country", name: "India" } },
        });
    }

    if (a.recipe) {
        const r = a.recipe;
        const iso = (m: number) => `PT${Math.floor(m / 60) ? `${Math.floor(m / 60)}H` : ""}${m % 60 ? `${m % 60}M` : ""}` || "PT0M";
        graph.push({
            "@type": "Recipe",
            "@id": `${url}#recipe`,
            name: a.title.replace(/\s+[-—–:|]\s+.*$/, ""),
            alternateName: a.odiaTitle,
            description: a.description,
            image: a.image ? absoluteUrl(a.image) : undefined,
            author: { "@type": "Organization", name: SITE.name, url: SITE.url },
            datePublished: a.date,
            recipeCuisine: "Odia",
            recipeCategory: r.course,
            recipeYield: r.yield,
            prepTime: iso(r.prep),
            cookTime: iso(r.cook),
            totalTime: iso(r.prep + r.cook + (r.rest || 0)),
            keywords: a.keywords.join(", ") || undefined,
            suitableForDiet: r.diet?.includes("Vegetarian") ? "https://schema.org/VegetarianDiet" : undefined,
            recipeIngredient: r.ingredients,
            recipeInstructions: r.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text, url: `${url}#recipe` })),
        });
    }

    if (a.faq.length) {
        graph.push({
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: a.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        });
    }

    return { "@context": "https://schema.org", "@graph": graph };
}

/** Metadata for hub/listing pages. */
export function hubMetadata(opts: { title: string; description: string; path: string; keywords?: string[] }): Metadata {
    return {
        title: opts.title,
        description: opts.description,
        keywords: opts.keywords,
        alternates: { canonical: opts.path },
        openGraph: { title: `${opts.title} | ${SITE.name}`, description: opts.description, url: absoluteUrl(opts.path), siteName: SITE.name, type: "website", locale: SITE.locale },
        twitter: { card: "summary_large_image", title: `${opts.title} | ${SITE.name}`, description: opts.description },
    };
}
