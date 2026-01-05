import { MetadataRoute } from "next";
import { getAllArticlesMetadata } from "@/lib/mdx";

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
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic article pages
    const articles = getAllArticlesMetadata();
    const articlePages = articles.map((article) => ({
        url: `${baseUrl}/${article.category}/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...articlePages];
}
