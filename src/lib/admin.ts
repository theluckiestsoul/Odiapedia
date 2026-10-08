import summary from "@/data/admin/_summary.json";

/**
 * Administrative hierarchy of Odisha from the Government of India's Local Government Directory (LGD):
 * district → sub-districts (tahasils) and community development blocks → gram panchayats → villages,
 * plus urban local bodies. Built by scripts/build-admin-data.py into src/data/admin/<district>.json
 * (a copy is served from /public/data/admin for the in-page explorer).
 */

export interface AdminVillage {
    /** LGD village code (equals the Census 2011 village code for most villages) */
    c: string;
    /** English name */
    n: string;
    /** Odia name, when LGD has one */
    o?: string;
    /** Official (LGD / Census 2011) spelling, when the name was corrected via src/data/name-corrections.json */
    on?: string;
    /** sub-district code, block code, gram panchayat code ("0" = not mapped) */
    s: string;
    b: string;
    g: string;
    /** 1 = uninhabited */
    u?: number;
}

export interface AdminGp {
    code: string;
    name: string;
    odia: string;
    villages: number;
}

export interface AdminBlock {
    code: string;
    name: string;
    slug: string;
    gps: AdminGp[];
    villages: number;
    subdistricts: string[];
}

export interface AdminSubdistrict {
    code: string;
    name: string;
    villages: number;
}

export interface AdminUlb {
    code: string;
    name: string;
    census2011: string;
    type: string;
}

export interface AdminDistrict {
    district: string;
    lgdName: string;
    lgdCode: string;
    census2011: string;
    subdistricts: AdminSubdistrict[];
    blocks: AdminBlock[];
    ulbs: AdminUlb[];
    villages: AdminVillage[];
}

export const ADMIN_SOURCE = (summary as { source: string }).source;
export const ADMIN_SUMMARY = (summary as { summary: Record<string, { villages: number; blocks: number; gps: number; subdistricts: number; ulbs: number }> }).summary;

const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
    angul: () => import("@/data/admin/angul.json"),
    balangir: () => import("@/data/admin/balangir.json"),
    balasore: () => import("@/data/admin/balasore.json"),
    bargarh: () => import("@/data/admin/bargarh.json"),
    bhadrak: () => import("@/data/admin/bhadrak.json"),
    boudh: () => import("@/data/admin/boudh.json"),
    cuttack: () => import("@/data/admin/cuttack.json"),
    deogarh: () => import("@/data/admin/deogarh.json"),
    dhenkanal: () => import("@/data/admin/dhenkanal.json"),
    gajapati: () => import("@/data/admin/gajapati.json"),
    ganjam: () => import("@/data/admin/ganjam.json"),
    jagatsinghpur: () => import("@/data/admin/jagatsinghpur.json"),
    jajpur: () => import("@/data/admin/jajpur.json"),
    jharsuguda: () => import("@/data/admin/jharsuguda.json"),
    kalahandi: () => import("@/data/admin/kalahandi.json"),
    kandhamal: () => import("@/data/admin/kandhamal.json"),
    kendrapara: () => import("@/data/admin/kendrapara.json"),
    kendujhar: () => import("@/data/admin/kendujhar.json"),
    khordha: () => import("@/data/admin/khordha.json"),
    koraput: () => import("@/data/admin/koraput.json"),
    malkangiri: () => import("@/data/admin/malkangiri.json"),
    mayurbhanj: () => import("@/data/admin/mayurbhanj.json"),
    nabarangpur: () => import("@/data/admin/nabarangpur.json"),
    nayagarh: () => import("@/data/admin/nayagarh.json"),
    nuapada: () => import("@/data/admin/nuapada.json"),
    puri: () => import("@/data/admin/puri.json"),
    rayagada: () => import("@/data/admin/rayagada.json"),
    sambalpur: () => import("@/data/admin/sambalpur.json"),
    subarnapur: () => import("@/data/admin/subarnapur.json"),
    sundargarh: () => import("@/data/admin/sundargarh.json"),
};

const cache = new Map<string, AdminDistrict>();

export async function getAdminDistrict(slug: string): Promise<AdminDistrict | null> {
    const key = slug.replace(/-od$/, "");
    if (cache.has(key)) return cache.get(key)!;
    const load = LOADERS[key];
    if (!load) return null;
    const data = (await load()).default as AdminDistrict;
    cache.set(key, data);
    return data;
}

export const ADMIN_DISTRICTS = Object.keys(LOADERS);

export function slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** URL segment for a village: "<LGD code>-<name>" — the code keeps it unique. */
export function villageId(v: Pick<AdminVillage, "c" | "n">): string {
    return `${v.c}-${slugify(v.n)}`;
}

export function subdistrictSlug(sd: Pick<AdminSubdistrict, "code" | "name">): string {
    return `${slugify(sd.name)}-${sd.code}`;
}

export function ulbTypeLabel(t: string): string {
    return t || "Urban local body";
}

/** URL segment for a gram panchayat: "<LGD code>-<name>". */
export function gpId(g: Pick<AdminGp, "code" | "name">): string {
    return `${g.code}-${slugify(g.name)}`;
}
