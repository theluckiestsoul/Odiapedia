/**
 * Census 2011 Primary Census Abstract figures per village, keyed by LGD village code.
 * Built by scripts/build-census.py from the Census of India PCA town/village workbooks.
 */
export const CENSUS_SOURCE = "Census of India 2011, Primary Census Abstract (village level)";
export const CENSUS_SOURCE_URL = "https://censusindia.gov.in/nada/index.php/catalog/6561";

type Raw = { fields: string[]; districtRural: number[] | null; villages: Record<string, number[]> };

export type VillageCensus = {
    households: number;
    population: number;
    males: number;
    females: number;
    children: number; // aged 0–6
    sc: number;
    st: number;
    literate: number;
    workers: number;
    mainWorkers: number;
    cultivators: number;
    agriLabourers: number;
    householdIndustry: number;
    otherWorkers: number;
    marginalWorkers: number;
    nonWorkers: number;
    /** Literate share of people aged 7 and over, in % (the census definition). */
    literacyRate: number | null;
    /** Females per 1,000 males. */
    sexRatio: number | null;
};

const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
    angul: () => import("@/data/census/angul.json"),
    balangir: () => import("@/data/census/balangir.json"),
    balasore: () => import("@/data/census/balasore.json"),
    bargarh: () => import("@/data/census/bargarh.json"),
    bhadrak: () => import("@/data/census/bhadrak.json"),
    boudh: () => import("@/data/census/boudh.json"),
    cuttack: () => import("@/data/census/cuttack.json"),
    deogarh: () => import("@/data/census/deogarh.json"),
    dhenkanal: () => import("@/data/census/dhenkanal.json"),
    gajapati: () => import("@/data/census/gajapati.json"),
    ganjam: () => import("@/data/census/ganjam.json"),
    jagatsinghpur: () => import("@/data/census/jagatsinghpur.json"),
    jajpur: () => import("@/data/census/jajpur.json"),
    jharsuguda: () => import("@/data/census/jharsuguda.json"),
    kalahandi: () => import("@/data/census/kalahandi.json"),
    kandhamal: () => import("@/data/census/kandhamal.json"),
    kendrapara: () => import("@/data/census/kendrapara.json"),
    kendujhar: () => import("@/data/census/kendujhar.json"),
    khordha: () => import("@/data/census/khordha.json"),
    koraput: () => import("@/data/census/koraput.json"),
    malkangiri: () => import("@/data/census/malkangiri.json"),
    mayurbhanj: () => import("@/data/census/mayurbhanj.json"),
    nabarangpur: () => import("@/data/census/nabarangpur.json"),
    nayagarh: () => import("@/data/census/nayagarh.json"),
    nuapada: () => import("@/data/census/nuapada.json"),
    puri: () => import("@/data/census/puri.json"),
    rayagada: () => import("@/data/census/rayagada.json"),
    sambalpur: () => import("@/data/census/sambalpur.json"),
    subarnapur: () => import("@/data/census/subarnapur.json"),
    sundargarh: () => import("@/data/census/sundargarh.json"),
};

const cache = new Map<string, Raw>();
async function load(district: string): Promise<Raw | null> {
    const key = district.replace(/-od$/, "");
    if (cache.has(key)) return cache.get(key)!;
    const l = LOADERS[key];
    if (!l) return null;
    const raw = (await l()).default as Raw;
    cache.set(key, raw);
    return raw;
}

function shape(r: number[]): VillageCensus {
    const [households, population, males, females, children, sc, st, literate, , , workers, mainWorkers, cultivators, agriLabourers, householdIndustry, otherWorkers, marginalWorkers, nonWorkers] = r;
    const over6 = population - children;
    return {
        households, population, males, females, children, sc, st, literate, workers, mainWorkers,
        cultivators, agriLabourers, householdIndustry, otherWorkers, marginalWorkers, nonWorkers,
        literacyRate: over6 > 0 ? (literate / over6) * 100 : null,
        sexRatio: males > 0 ? Math.round((females / males) * 1000) : null,
    };
}

export async function getVillageCensus(district: string, lgdCode: string): Promise<{ village: VillageCensus; districtRural: VillageCensus | null } | null> {
    const raw = await load(district);
    const r = raw?.villages[lgdCode];
    if (!raw || !r) return null;
    return { village: shape(r), districtRural: raw.districtRural ? shape(raw.districtRural) : null };
}

/** Population of every village in a district that has census figures (for rankings on block pages). */
export async function getDistrictPopulations(district: string): Promise<Map<string, number>> {
    const raw = await load(district);
    return new Map(Object.entries(raw?.villages ?? {}).map(([c, r]) => [c, r[1]]));
}
