import { glob } from 'glob';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Using a flexible path structure: content/spots/[district]/[filename].mdx
const spotsDirectory = path.join(process.cwd(), 'content/spots');

export type SpotCategory = 'Temple' | 'Nature' | 'Heritage' | 'Food' | 'Market' | 'Art' | 'Other';

export interface SpotMeta {
    slug: string;
    title: string;
    district: string; // Slug of parent district
    tehsil: string;   // Slug of parent tehsil
    category: SpotCategory;
    description: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    best_time?: string;
    tags?: string[];
    featured_image?: string;
}

export interface Spot extends SpotMeta {
    content: string;
}

export function getAllSpots(): SpotMeta[] {
    if (!fs.existsSync(spotsDirectory)) {
        return [];
    }

    // Search specifically in district subdirectories
    const files = glob.sync(`${spotsDirectory}/**/*.mdx`);

    const spots = files.map((file) => {
        const source = fs.readFileSync(file, 'utf8');
        const { data } = matter(source);
        const relativePath = path.relative(spotsDirectory, file);
        // Extract district from path if needed, but we rely on frontmatter
        const slug = path.basename(file, '.mdx');

        return {
            slug,
            ...data,
        } as SpotMeta;
    });

    return spots;
}

export function getSpotsByTehsil(districtSlug: string, tehsilSlug: string): SpotMeta[] {
    const allSpots = getAllSpots();
    return allSpots.filter(
        (spot) => spot.district === districtSlug && spot.tehsil === tehsilSlug
    );
}

export function getNearbySpots(currentSpot: SpotMeta, limit: number = 3): SpotMeta[] {
    const allSpots = getAllSpots();

    // 1. Same Tehsil (Highest Priority)
    const sameTehsil = allSpots.filter(
        s => s.district === currentSpot.district &&
            s.tehsil === currentSpot.tehsil &&
            s.slug !== currentSpot.slug
    );

    if (sameTehsil.length >= limit) {
        return sameTehsil.slice(0, limit);
    }

    // 2. Same District (Lower Priority)
    const sameDistrict = allSpots.filter(
        s => s.district === currentSpot.district &&
            s.tehsil !== currentSpot.tehsil &&
            s.slug !== currentSpot.slug
    );

    // Combine and slice
    return [...sameTehsil, ...sameDistrict].slice(0, limit);
}

export function getSpotBySlug(districtSlug: string, spotSlug: string): Spot | null {
    // We assume the file is at content/spots/[districtSlug]/[spotSlug].mdx
    const filePath = path.join(spotsDirectory, districtSlug, `${spotSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(source);

    return {
        slug: spotSlug,
        ...data,
        content,
    } as Spot;
}
