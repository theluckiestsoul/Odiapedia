import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface ArticleMeta {
    title: string;
    description: string;
    category: string;
    date: string;
    author: string;
    slug: string;
    image?: string;
    lang?: string;
    alternates?: Record<string, string>;
}

export interface Article extends ArticleMeta {
    content: string;
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

/**
 * Get article by slug
 */
export function getArticleBySlug(
    category: string,
    slug: string
): Article | null {
    const filePath = path.join(contentDirectory, category, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        title: data.title || slug,
        description: data.description || "",
        category: data.category || category,
        date: data.date || new Date().toISOString(),
        author: data.author || "Odiapedia Team",
        image: data.image,
        lang: data.lang,
        alternates: data.alternates,
        slug,
        content,
    };
}

/**
 * Get all articles for a category
 */
export function getAllArticles(category: string): ArticleMeta[] {
    const slugs = getArticleSlugs(category);

    return slugs
        .map((slug) => {
            const article = getArticleBySlug(category, slug);
            if (!article) return null;

            // Return only metadata, not content
            const { content, ...meta } = article;
            return meta;
        })
        .filter((article): article is ArticleMeta => article !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all articles across all categories
 */
export function getAllArticlesMetadata(): ArticleMeta[] {
    const categories = ["language", "culture", "history", "food", "people", "about"];

    return categories.flatMap((category) => getAllArticles(category));
}

/**
 * Get categories with article counts
 */
export function getCategoriesWithCounts(): { category: string; count: number }[] {
    const categories = ["language", "culture", "history", "food", "people", "about"];

    return categories.map((category) => ({
        category,
        count: getArticleSlugs(category).length,
    }));
}
