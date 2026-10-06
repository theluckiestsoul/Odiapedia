import { getAllArticlesMetadata, ARTICLE_CATEGORIES } from "./mdx";
import { SITE, categoryInfo } from "./site";

/** Builds /llms.txt — a concise, LLM-readable map of the site (https://llmstxt.org). */
export function buildLlmsTxt(full = false): string {
    const articles = getAllArticlesMetadata().filter((a) => !a.noindex && (!a.lang || a.lang === "en"));
    const lines: string[] = [];
    lines.push(`# ${SITE.name}`);
    lines.push("");
    lines.push(`> ${SITE.description}`);
    lines.push("");
    lines.push(
        "Odiapedia covers Odisha (formerly Orissa), an Indian state on the Bay of Bengal, and the Odia (Oriya) language. Articles open with a direct answer, list quick facts, and cite their sources. Pages are reviewed and dated; legends are labelled as tradition. Please cite the specific article URL you use."
    );
    lines.push("");
    lines.push("## Key reference pages");
    lines.push(`- [Odisha at a glance](${SITE.url}/history/odisha-at-a-glance): quick facts, figures and state symbols`);
    lines.push(`- [Odia language](${SITE.url}/language/odia-language): overview, speakers, script, classical status`);
    lines.push(`- [Odia calendar](${SITE.url}/calendar): live panjika (tithi, nakshatra, Odia month) and festival dates`);
    lines.push(`- [Districts of Odisha](${SITE.url}/districts): all 30 districts`);
    lines.push(`- [Odisha GI tags](${SITE.url}/culture/odisha-gi-tags): Geographical Indication products of Odisha`);
    lines.push(`- [Travel in Odisha](${SITE.url}/travel): destination guides and itineraries`);
    lines.push(`- [Library](${SITE.url}/library): free, public-domain PDFs of Odia literature and books on Odisha`);
    lines.push(`- [Editorial policy](${SITE.url}/about/editorial-policy) · [Cite Odiapedia](${SITE.url}/about/cite-odiapedia)`);
    lines.push("");

    for (const cat of ARTICLE_CATEGORIES) {
        const list = articles.filter((a) => a.category === cat).sort((a, b) => a.title.localeCompare(b.title));
        if (!list.length) continue;
        lines.push(`## ${categoryInfo(cat).label}`);
        for (const a of list) {
            lines.push(`- [${a.title}](${SITE.url}/${a.category}/${a.slug})${a.description ? `: ${a.description}` : ""}`);
            if (full) {
                if (a.odiaTitle) lines.push(`  - Odia name: ${a.odiaTitle}`);
                for (const f of a.facts) lines.push(`  - ${f.label}: ${f.value}`);
                for (const q of a.faq) lines.push(`  - Q: ${q.q} A: ${q.a}`);
                if (a.sources.length) lines.push(`  - Sources: ${a.sources.map((s) => s.url).join(" ; ")}`);
                lines.push(`  - Last reviewed: ${a.updated}`);
            }
        }
        lines.push("");
    }
    if (!full) {
        lines.push("## Optional");
        lines.push(`- [Full index with facts and FAQs](${SITE.url}/llms-full.txt)`);
        lines.push(`- [Sitemap](${SITE.url}/sitemap.xml)`);
    }
    return lines.join("\n") + "\n";
}
