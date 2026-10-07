import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Crawl policy.
 * - Everything public is crawlable, including /_next/ (Google needs JS/CSS to render pages).
 * - Search engines and AI assistants are explicitly welcome: Odiapedia wants to be found and cited.
 *   Review this list quarterly — crawler names change. To opt out of AI *training* while staying in
 *   AI *search*, move GPTBot, ClaudeBot, Google-Extended, Applebot-Extended and CCBot to a disallow rule.
 */
const AI_AND_SEARCH_AGENTS = [
    "Googlebot",
    "Bingbot",
    "DuckDuckBot",
    "Applebot",
    "YandexBot",
    // OpenAI (ChatGPT search, user-initiated browsing, training)
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    // Anthropic (Claude search, user-initiated fetches, training)
    "Claude-SearchBot",
    "Claude-User",
    "ClaudeBot",
    // Perplexity
    "PerplexityBot",
    "Perplexity-User",
    // Google Gemini / Vertex grounding, Apple Intelligence
    "Google-Extended",
    "Applebot-Extended",
    // Others
    "Meta-ExternalAgent",
    "Amazonbot",
    "CCBot",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: AI_AND_SEARCH_AGENTS,
                allow: "/",
                disallow: ["/api/", "/search"],
            },
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/search"],
            },
        ],
        sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/sitemaps/articles.xml`, `${SITE.url}/sitemaps/cinema.xml`, `${SITE.url}/sitemaps/places.xml`],
        host: SITE.url,
    };
}
