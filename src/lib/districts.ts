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
