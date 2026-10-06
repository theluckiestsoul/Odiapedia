import { getAllArticlesMetadata } from "@/lib/mdx";

export type UpdateType = "article" | "review" | "event";

export interface UpdateItem {
    id: string;
    type: UpdateType;
    title: string;
    description: string;
    /** YYYY-MM-DD — the article's real last-reviewed date (never synthetic). */
    date: string;
    image?: string;
    link: string;
    tag: string;
}

/**
 * Recently published or reviewed articles, newest first.
 * Uses the real `updated`/`date` frontmatter only — no synthetic "fresh" dates.
 */
export function getLatestUpdates(): UpdateItem[] {
    return getAllArticlesMetadata()
        .filter((a) => !a.noindex && (!a.lang || a.lang === "en") && a.category !== "about")
        .map((a) => ({
            id: `article-${a.category}-${a.slug}`,
            type: "article" as const,
            title: a.title,
            description: a.description,
            date: a.updated,
            image: a.image,
            link: `/${a.category}/${a.slug}`,
            tag: a.updated !== a.date ? "Reviewed" : "New",
        }))
        .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
