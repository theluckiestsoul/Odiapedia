import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content", "districts");

export interface DistrictMeta {
    title: string;
    slug: string;
    description: string;
    population?: string;
    area?: string;
    headquarters?: string;
    mla_mp?: string;
    image?: string;
    titleOdia?: string;
    updated?: string;
    keywords: string[];
    facts: { label: string; value: string }[];
    sources: { title: string; url: string; publisher?: string }[];
    faq: { q: string; a: string }[];
}

export interface District extends DistrictMeta {
    content: string;
}

export function getAllDistrictSlugs(): string[] {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }
    return fs
        .readdirSync(contentDirectory)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""));
}

export function getDistrictBySlug(slug: string): District | null {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        title: data.title || slug,
        slug,
        description: data.description || "",
        population: data.population,
        area: data.area,
        headquarters: data.headquarters,
        mla_mp: data.mla_mp,
        image: data.image,
        titleOdia: data.titleOdia,
        updated: data.updated ? String(data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated).slice(0, 10) : undefined,
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        facts: Array.isArray(data.facts) ? data.facts.filter((f: { label?: string; value?: unknown }) => f && f.label && f.value != null).map((f: { label: string; value: unknown }) => ({ label: f.label, value: String(f.value) })) : [],
        sources: Array.isArray(data.sources) ? data.sources.filter((x: { url?: string; title?: string }) => x && x.url && x.title) : [],
        faq: Array.isArray(data.faq) ? data.faq.filter((x: { q?: string; a?: string }) => x && x.q && x.a) : [],
        content,
    };
}

export function getAllDistricts(): DistrictMeta[] {
    const slugs = getAllDistrictSlugs();
    return slugs
        .map((slug) => {
            const dist = getDistrictBySlug(slug);
            if (!dist) return null;
            const { content, ...meta } = dist;
            return meta;
        })
        .filter((d): d is DistrictMeta => d !== null)
        .sort((a, b) => a.title.localeCompare(b.title));
}

/** English display name of a district page slug (uses the English page title, e.g. "Khordha"). */
export function districtName(slug: string): string | undefined {
    return getDistrictBySlug(slug.replace(/-od$/, ""))?.title;
}
