import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugifyHeading } from "./slug";
import { LIBRARY } from "@/data/library";

export { slugifyHeading };

const contentDirectory = path.join(process.cwd(), "content");

/** Categories rendered through the shared article template (order = nav/search order). */
export const ARTICLE_CATEGORIES = ["travel", "culture", "history", "food", "people", "language", "learn", "about"] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface ArticleSource {
    title: string;
    url: string;
    publisher?: string;
}

export interface ArticleFact {
    label: string;
    value: string;
}

export interface ArticleFaq {
    q: string;
    a: string;
}

export interface ArticleRecipe {
    yield: string;
    /** minutes */
    prep: number;
    cook: number;
    rest?: number;
    rest_label?: string;
    course?: string;
    diet?: string[];
    ingredients: string[];
    steps: string[];
    tips?: string[];
}

export interface ArticleMeta {
    title: string;
    description: string;
    category: string;
    /** First published (YYYY-MM-DD) */
    date: string;
    /** Last reviewed/updated (YYYY-MM-DD). Falls back to `date`. */
    updated: string;
    author: string;
    slug: string;
    image?: string;
    /** Caption/credit shown under the hero image. */
    imageCredit?: string;
    lang?: string;
    alternates?: Record<string, string>;
    odiaTitle?: string;
    keywords: string[];
    facts: ArticleFact[];
    sources: ArticleSource[];
    faq: ArticleFaq[];
    /** Exclude from search engines (e.g. time-bound news). */
    noindex?: boolean;
    /** Significant corrections/updates, newest first: [{ date: "YYYY-MM-DD", note: "..." }] */
    changelog: { date: string; note: string }[];
    /** Duplicate page merged into another URL (served as a permanent redirect). */
    mergedInto?: string;
    readingMinutes: number;
    recipe?: ArticleRecipe;
}

export interface Article extends ArticleMeta {
    content: string;
}

export interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

/** Normalise a YAML date (string or Date) to YYYY-MM-DD. */
function toIsoDate(value: unknown, fallback = "2024-01-01"): string {
    if (!value) return fallback;
    if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    const s = String(value).trim();
    const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(s);
    return isNaN(d.getTime()) ? fallback : d.toISOString().slice(0, 10);
}

function asArray<T>(v: unknown): T[] {
    return Array.isArray(v) ? (v.filter(Boolean) as T[]) : [];
}

/**
 * The page template renders the H1 from frontmatter, so a leading "# Title" in the MDX body
 * would create a duplicate H1 (bad for SEO and accessibility). Strip it.
 */
function stripLeadingH1(content: string): string {
    return content.replace(/^\s*#\s+[^\n]+\n+/, "");
}

/** Extract H2/H3 headings for the table of contents. */
export function extractToc(content: string): TocItem[] {
    const items: TocItem[] = [];
    let inCode = false;
    for (const line of content.split("\n")) {
        if (/^\s*```/.test(line)) inCode = !inCode;
        if (inCode) continue;
        const m = line.match(/^(##|###)\s+(.+?)\s*#*\s*$/);
        if (m) {
            const text = m[2].replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
            items.push({ id: slugifyHeading(text), text, level: m[1].length as 2 | 3 });
        }
    }
    return items;
}

function readingMinutes(content: string): number {
    const words = content.replace(/[#*>|`\-]/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
}

/**
 * Get all article slugs for a category
 */
export function getArticleSlugs(category: string): string[] {
    const categoryPath = path.join(contentDirectory, category);

    if (!fs.existsSync(categoryPath)) {
        return [];
    }

    return fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""));
}

/** Slugs that should be pre-rendered (excludes pages merged into another URL). */
export function getRoutableSlugs(category: string): string[] {
    return getArticleSlugs(category).filter((slug) => !getArticleBySlug(category, slug)?.mergedInto);
}

const cache = new Map<string, Article | null>();

/**
 * Get article by slug
 */
export function getArticleBySlug(category: string, slug: string): Article | null {
    const key = `${category}/${slug}`;
    if (cache.has(key)) return cache.get(key)!;

    const filePath = path.join(contentDirectory, category, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        cache.set(key, null);
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const body = stripLeadingH1(content);
    const date = toIsoDate(data.date);

    const article: Article = {
        title: data.title || slug,
        description: data.description || data.excerpt || "",
        category: data.category || category,
        date,
        updated: toIsoDate(data.updated, date),
        author: data.author || "Odiapedia Editorial Team",
        image: data.image,
        imageCredit: data.imageCredit,
        lang: data.lang,
        alternates: data.alternates,
        odiaTitle: data.odiaTitle,
        keywords: asArray<string>(data.keywords),
        facts: asArray<ArticleFact>(data.facts).filter((f) => f && f.label && f.value),
        sources: asArray<ArticleSource>(data.sources).filter((s) => s && s.url && s.title),
        faq: asArray<ArticleFaq>(data.faq).filter((f) => f && f.q && f.a),
        noindex: Boolean(data.noindex),
        mergedInto: data.mergedInto || undefined,
        changelog: asArray<{ date: unknown; note: string }>(data.changelog)
            .filter((c) => c && c.note)
            .map((c) => ({ date: toIsoDate(c.date, date), note: String(c.note) })),
        readingMinutes: readingMinutes(body),
        recipe: data.recipe && Array.isArray(data.recipe.ingredients) && Array.isArray(data.recipe.steps) ? (data.recipe as ArticleRecipe) : undefined,
        slug,
        content: body,
    };
    cache.set(key, article);
    return article;
}

/**
 * Get all articles for a category (newest update first)
 */
export function getAllArticles(category: string): ArticleMeta[] {
    const slugs = getArticleSlugs(category);

    return slugs
        .map((slug) => {
            const article = getArticleBySlug(category, slug);
            if (!article) return null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { content, ...meta } = article;
            return meta;
        })
        .filter((article): article is ArticleMeta => article !== null && !article.mergedInto)
        .sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title));
}

/** Articles in the primary (English) language only — used for listings so pages are not duplicated. */
export function getPrimaryArticles(category: string): ArticleMeta[] {
    return getAllArticles(category).filter((a) => !a.lang || a.lang === "en");
}

/**
 * Get all articles across all categories
 */
export function getAllArticlesMetadata(): ArticleMeta[] {
    return ARTICLE_CATEGORIES.flatMap((category) => getAllArticles(category));
}

/**
 * Get categories with article counts
 */
export function getCategoriesWithCounts(): { category: string; count: number }[] {
    return ARTICLE_CATEGORIES.map((category) => ({
        category,
        count: getArticleSlugs(category).length,
    }));
}

/**
 * Related articles: same category first, then keyword/title overlap across categories.
 * Only English/primary-language pages are suggested to English pages.
 */
export function getRelatedArticles(current: ArticleMeta, limit = 4): ArticleMeta[] {
    const all = getAllArticlesMetadata().filter(
        (a) => !(a.category === current.category && a.slug === current.slug) && (a.lang || "en") === (current.lang || "en") && !a.noindex
    );
    const words = (a: ArticleMeta) =>
        new Set(
            [a.title, ...(a.keywords || [])]
                .join(" ")
                .toLowerCase()
                .split(/[^a-z0-9଀-୿]+/)
                .filter((w) => w.length > 3 && !["odisha", "odia", "guide", "travel", "festival", "history"].includes(w))
        );
    const mine = words(current);
    return all
        .map((a) => {
            let score = a.category === current.category ? 2 : 0;
            for (const w of words(a)) if (mine.has(w)) score += 3;
            return { a, score };
        })
        .filter((x) => x.score > 0)
        .sort((x, y) => y.score - x.score || y.a.updated.localeCompare(x.a.updated))
        .slice(0, limit)
        .map((x) => x.a);
}

export interface SearchEntry {
    title: string;
    description: string;
    category: string;
    slug: string;
    href: string;
    odiaTitle?: string;
    keywords?: string[];
}

/** Lightweight index used by the search modal and /search page. */
export function getSearchIndex(): SearchEntry[] {
    return getAllArticlesMetadata()
        .filter((a) => !a.noindex)
        .map((a) => ({
            title: a.title,
            description: a.description,
            category: a.category,
            slug: a.slug,
            href: `/${a.category}/${a.slug}`,
            odiaTitle: a.odiaTitle,
            keywords: a.keywords?.slice(0, 8),
        }))
        .concat(
            LIBRARY.map((i) => ({
                title: i.title,
                description: `${i.author} · ${i.year} · ${i.language} PDF`,
                category: "library",
                slug: i.slug,
                href: `/library/${i.slug}`,
                odiaTitle: i.titleOdia,
                keywords: [i.author, i.category, "pdf", "book"],
            }))
        );
}
