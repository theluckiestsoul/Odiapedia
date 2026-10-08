import towns from "@/data/census/_towns.json";

/**
 * Census 2011 District Census Handbook (Village and Town Directories) for Odisha: what each village and town had —
 * schools, health centres, water, roads, transport, banks, markets, power, products and land use.
 * The reference year of most amenity data is 2009. Built by scripts/build-amenities.py.
 */
export const AMENITY_SOURCE = "Census of India 2011, District Census Handbook: Village and Town Directory (Odisha)";
export const AMENITY_SOURCE_URL = "https://censusindia.gov.in/nada/index.php/catalog/920";

/** 1 = in the village; "a" = under 5 km away, "b" = 5–10 km, "c" = over 10 km; 0 = not recorded. */
export type Reach = 1 | "a" | "b" | "c" | 0;
export type VillageAmenities = Record<string, number | string> & { area: number };

const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
    angul: () => import("@/data/amenities/angul.json"),
    balangir: () => import("@/data/amenities/balangir.json"),
    balasore: () => import("@/data/amenities/balasore.json"),
    bargarh: () => import("@/data/amenities/bargarh.json"),
    bhadrak: () => import("@/data/amenities/bhadrak.json"),
    boudh: () => import("@/data/amenities/boudh.json"),
    cuttack: () => import("@/data/amenities/cuttack.json"),
    deogarh: () => import("@/data/amenities/deogarh.json"),
    dhenkanal: () => import("@/data/amenities/dhenkanal.json"),
    gajapati: () => import("@/data/amenities/gajapati.json"),
    ganjam: () => import("@/data/amenities/ganjam.json"),
    jagatsinghpur: () => import("@/data/amenities/jagatsinghpur.json"),
    jajpur: () => import("@/data/amenities/jajpur.json"),
    jharsuguda: () => import("@/data/amenities/jharsuguda.json"),
    kalahandi: () => import("@/data/amenities/kalahandi.json"),
    kandhamal: () => import("@/data/amenities/kandhamal.json"),
    kendrapara: () => import("@/data/amenities/kendrapara.json"),
    kendujhar: () => import("@/data/amenities/kendujhar.json"),
    khordha: () => import("@/data/amenities/khordha.json"),
    koraput: () => import("@/data/amenities/koraput.json"),
    malkangiri: () => import("@/data/amenities/malkangiri.json"),
    mayurbhanj: () => import("@/data/amenities/mayurbhanj.json"),
    nabarangpur: () => import("@/data/amenities/nabarangpur.json"),
    nayagarh: () => import("@/data/amenities/nayagarh.json"),
    nuapada: () => import("@/data/amenities/nuapada.json"),
    puri: () => import("@/data/amenities/puri.json"),
    rayagada: () => import("@/data/amenities/rayagada.json"),
    sambalpur: () => import("@/data/amenities/sambalpur.json"),
    subarnapur: () => import("@/data/amenities/subarnapur.json"),
    sundargarh: () => import("@/data/amenities/sundargarh.json"),
};

type Raw = { fields: string[]; villages: Record<string, (number | string)[]> };
const cache = new Map<string, Raw | null>();

async function load(district: string): Promise<Raw | null> {
    const key = district.replace(/-od$/, "");
    if (cache.has(key)) return cache.get(key)!;
    const l = LOADERS[key];
    const raw = l ? ((await l()).default as Raw) : null;
    cache.set(key, raw);
    return raw;
}

const toObj = (fields: string[], r: (number | string)[]) => Object.fromEntries(fields.map((f, i) => [f, r[i]])) as VillageAmenities;

export async function getVillageAmenities(district: string, lgdCode: string): Promise<VillageAmenities | null> {
    const raw = await load(district);
    const r = raw?.villages[lgdCode];
    return raw && r ? toObj(raw.fields, r) : null;
}

/** Amenities of many villages at once (for gram panchayat and block summaries). */
export async function getAmenitiesFor(district: string, codes: string[]): Promise<VillageAmenities[]> {
    const raw = await load(district);
    if (!raw) return [];
    return codes.filter((c) => raw.villages[c]).map((c) => ({ ...toObj(raw.fields, raw.villages[c]), code: c }));
}

export type TownDirectory = {
    area: number;
    class: string;
    block: string;
    ref: number;
    history: [number, number][];
    rain: number;
    tmax: number;
    tmin: number;
    stateKm: number;
    dhq: string;
    dhqKm: number;
    city1: string;
    city1Km: number;
    city5: string;
    city5Km: number;
    rail: string;
    railKm: number;
    roadPucca: number;
    roadKutcha: number;
    fire: number;
    fireAt: string;
    fireKm: number;
    electricHomes: number;
    hospitals: number;
    hospitalBeds: number;
    altHospitals: number;
    dispensaries: number;
    familyWelfare: number;
    mcw: number;
    maternity: number;
    tb: number;
    nursingHomes: number;
    vet: number;
    medicineShops: number;
    primary: [number, number];
    middle: [number, number];
    secondary: [number, number];
    senior: [number, number];
    colleges: number;
    medical: number;
    engineering: number;
    management: number;
    polytechnic: number;
    stadium: number;
    cinema: number;
    auditorium: number;
    library: number;
    readingRoom: number;
    banks: [number, number, number];
    products: string[];
};

export function getTownDirectory(censusCode: string): TownDirectory | null {
    return ((towns as unknown as Record<string, TownDirectory>)[censusCode]) ?? null;
}

/** Facilities summarised for an area: in how many of its villages each one was available. */
export const AREA_FACILITIES: { key: string; label: string; group: string }[] = [
    { key: "primary", label: "Primary school", group: "Education" },
    { key: "middle", label: "Middle school", group: "Education" },
    { key: "secondary", label: "Secondary school", group: "Education" },
    { key: "senior", label: "Senior secondary school", group: "Education" },
    { key: "college", label: "Degree college", group: "Education" },
    { key: "phc", label: "Primary health centre", group: "Health" },
    { key: "subCentre", label: "Health sub-centre", group: "Health" },
    { key: "anganwadi", label: "Anganwadi centre", group: "Health" },
    { key: "tapTreated", label: "Treated tap water", group: "Water & power" },
    { key: "handPump", label: "Hand pump", group: "Water & power" },
    { key: "power", label: "Electricity for homes", group: "Water & power" },
    { key: "allWeather", label: "All-weather road", group: "Roads & transport" },
    { key: "publicBus", label: "Public bus", group: "Roads & transport" },
    { key: "mobile", label: "Mobile phone coverage", group: "Roads & transport" },
    { key: "postOffice", label: "Post office or sub post office", group: "Services" },
    { key: "bank", label: "Commercial bank", group: "Services" },
    { key: "pds", label: "Ration (PDS) shop", group: "Services" },
    { key: "haat", label: "Weekly haat", group: "Services" },
];

/** True when the facility was in the village itself. */
export function hasFacility(v: VillageAmenities, key: string): boolean {
    switch (key) {
        case "primary":
            return Number(v.primaryG) + Number(v.primaryP) > 0;
        case "middle":
            return Number(v.middleG) + Number(v.middleP) > 0;
        case "secondary":
            return Number(v.secondaryG) + Number(v.secondaryP) > 0;
        case "senior":
            return Number(v.seniorG) + Number(v.seniorP) > 0;
        case "college":
        case "phc":
        case "subCentre":
            return Number(v[key]) > 0;
        case "postOffice":
            return v.postOffice === 1 || v.subPostOffice === 1;
        default:
            return v[key] === 1;
    }
}

export type AreaAmenities = {
    villages: number;
    inhabited: number;
    facilities: { key: string; label: string; group: string; count: number }[];
    schools: { primary: number; middle: number; secondary: number; senior: number; colleges: number };
    health: { chc: number; phc: number; subCentre: number; hospital: number; dispensary: number; vet: number };
    land: { area: number; netSown: number; irrigated: number; forest: number; culturableWaste: number; nonAgri: number };
    crops: { name: string; villages: number }[];
    crafts: { name: string; villages: number }[];
};

/** Summarise the directory entries of a set of villages (only inhabited villages count towards facilities). */
export function summariseAmenities(list: VillageAmenities[], inhabited: (v: VillageAmenities) => boolean = () => true): AreaAmenities {
    const live = list.filter(inhabited);
    const sum = (k: string, l = list) => l.reduce((s, v) => s + (Number(v[k]) || 0), 0);
    const tally = (k: string) => {
        const m = new Map<string, number>();
        live.forEach((v) => String(v[k] || "").split("|").filter(Boolean).forEach((x) => m.set(x, (m.get(x) || 0) + 1)));
        return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, villages]) => ({ name, villages }));
    };
    return {
        villages: list.length,
        inhabited: live.length,
        facilities: AREA_FACILITIES.map((f) => ({ ...f, count: live.filter((v) => hasFacility(v, f.key)).length })),
        schools: {
            primary: sum("primaryG") + sum("primaryP"),
            middle: sum("middleG") + sum("middleP"),
            secondary: sum("secondaryG") + sum("secondaryP"),
            senior: sum("seniorG") + sum("seniorP"),
            colleges: sum("college"),
        },
        health: { chc: sum("chc"), phc: sum("phc"), subCentre: sum("subCentre"), hospital: sum("hospital"), dispensary: sum("dispensary"), vet: sum("vet") },
        land: { area: sum("area"), netSown: sum("netSown"), irrigated: sum("irrigated"), forest: sum("forest"), culturableWaste: sum("culturableWaste"), nonAgri: sum("nonAgri") },
        crops: tally("agri"),
        crafts: tally("handicraft"),
    };
}
