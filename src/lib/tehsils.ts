import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content", "tehsils");

export interface TehsilMeta {
    title: string;
    slug: string;
    district: string;
    description: string;
    population?: string;
    villages_count?: string;
    famous_for?: string;
    image?: string;
}

export interface Tehsil extends TehsilMeta {
    content: string;
}

export function getAllTehsilsForDistrict(districtSlug: string): TehsilMeta[] {
    const districtDir = path.join(contentDirectory, districtSlug);

    if (!fs.existsSync(districtDir)) {
        return [];
    }

    return fs
        .readdirSync(districtDir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            const tehsil = getTehsilBySlug(districtSlug, slug);
            if (!tehsil) return null;
            const { content, ...meta } = tehsil;
            return meta;
        })
        .filter((t): t is TehsilMeta => t !== null)
        .sort((a, b) => a.title.localeCompare(b.title));
}

export function getTehsilBySlug(districtSlug: string, tehsilSlug: string): Tehsil | null {
    const filePath = path.join(contentDirectory, districtSlug, `${tehsilSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        title: data.title || tehsilSlug,
        slug: tehsilSlug,
        district: districtSlug,
        description: data.description || "",
        population: data.population,
        villages_count: data.villages_count,
        famous_for: data.famous_for,
        image: data.image,
        content,
    };
}
