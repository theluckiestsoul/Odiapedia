import areas from "@/data/census/_areas.json";
import { slugify } from "@/lib/admin";
import type { VillageCensus } from "@/lib/census";

/**
 * Census 2011 Primary Census Abstract totals for districts (total / rural / urban), sub-districts and towns.
 * Built by scripts/build-census-areas.py from the same PCA workbooks as the village figures.
 */
export const AREA_CENSUS_SOURCE = "Census of India 2011, Primary Census Abstract (district, sub-district and town level)";
export const AREA_CENSUS_SOURCE_URL = "https://censusindia.gov.in/nada/index.php/catalog/6561";

export type AreaCensus = VillageCensus & {
    /** Literacy rates (age 7+) by sex, in %. */
    maleLiteracy: number | null;
    femaleLiteracy: number | null;
    /** Girls per 1,000 boys aged 0–6. */
    childSexRatio: number | null;
};

type RawTown = { code: string; name: string; kind: string; sd: string; v: number[]; vOg?: number[]; wards?: number };
type RawDistrict = {
    fields: string[];
    district: { total?: number[]; rural?: number[]; urban?: number[] };
    subdistricts: Record<string, { name: string; total?: number[]; rural?: number[]; urban?: number[] }>;
    towns: RawTown[];
};

export function shapeArea(r: number[]): AreaCensus {
    const [households, population, males, females, children, sc, st, literate, maleLit, femaleLit, workers, mainWorkers, cultivators, agriLabourers, householdIndustry, otherWorkers, marginalWorkers, nonWorkers, boys, girls] = r;
    const rate = (lit: number, pop: number) => (pop > 0 ? (lit / pop) * 100 : null);
    return {
        households, population, males, females, children, sc, st, literate, workers, mainWorkers,
        cultivators, agriLabourers, householdIndustry, otherWorkers, marginalWorkers, nonWorkers,
        literacyRate: rate(literate, population - children),
        maleLiteracy: rate(maleLit, males - boys),
        femaleLiteracy: rate(femaleLit, females - girls),
        sexRatio: males > 0 ? Math.round((females / males) * 1000) : null,
        childSexRatio: boys > 0 ? Math.round((girls / boys) * 1000) : null,
    };
}

export type Town = {
    code: string;
    name: string;
    slug: string;
    kind: string;
    subdistrict: string;
    wards?: number;
    census: AreaCensus;
    /** Town together with its outgrowths, when the census reports outgrowths. */
    withOutgrowths?: AreaCensus;
};

export type DistrictAreas = {
    total: AreaCensus | null;
    rural: AreaCensus | null;
    urban: AreaCensus | null;
    subdistricts: { code: string; name: string; total: AreaCensus | null; rural: AreaCensus | null; urban: AreaCensus | null }[];
    towns: Town[];
};

const cache = new Map<string, DistrictAreas | null>();

export function getDistrictAreas(slug: string): DistrictAreas | null {
    const key = slug.replace(/-od$/, "");
    if (cache.has(key)) return cache.get(key)!;
    const raw = (areas as unknown as Record<string, RawDistrict>)[key];
    if (!raw) {
        cache.set(key, null);
        return null;
    }
    const s = (r?: number[]) => (r ? shapeArea(r) : null);
    const seen = new Map<string, number>();
    raw.towns.forEach((t) => seen.set(slugify(t.name), (seen.get(slugify(t.name)) || 0) + 1));
    const res: DistrictAreas = {
        total: s(raw.district.total),
        rural: s(raw.district.rural),
        urban: s(raw.district.urban),
        subdistricts: Object.entries(raw.subdistricts).map(([code, x]) => ({ code, name: x.name, total: s(x.total), rural: s(x.rural), urban: s(x.urban) })),
        towns: raw.towns.map((t) => ({
            code: t.code,
            name: t.name,
            slug: (seen.get(slugify(t.name)) || 0) > 1 ? `${slugify(t.name)}-${t.code}` : slugify(t.name),
            kind: t.kind,
            subdistrict: t.sd,
            wards: t.wards,
            census: shapeArea(t.v),
            withOutgrowths: t.vOg ? shapeArea(t.vOg) : undefined,
        })),
    };
    cache.set(key, res);
    return res;
}

export function getTown(slug: string, townSlug: string): Town | null {
    return getDistrictAreas(slug)?.towns.find((t) => t.slug === townSlug) ?? null;
}
