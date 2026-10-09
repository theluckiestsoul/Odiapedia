import data from "@/data/elections.json";
import cmap from "@/data/constituency-map.json";

export type Candidate = { name: string; party: string; votes: number | null; pct: number | null; won: boolean };
export type Result = { title: string; year: number; bypoll: boolean; partial?: boolean; pctUnreliable?: boolean; candidates: Candidate[]; majority?: { votes: number | null; pct: number | null }; turnout?: { votes: number | null; pct: number | null } };
export type Member = { year: string; member: string; party: string };
export type AC = { no: number; name: string; slug: string; wiki: string; district: string; pc: string; reservation: string; electors: number | null; established: string; extent: string[]; extentText: string; members: Member[]; results: Result[] };
export type PC = { no: number | null; name: string; slug: string; wiki: string; reservation: string; electors: number | null; established: string; members: Member[]; results: Result[] };

const D = data as unknown as { source: string; assembly: AC[]; loksabha: PC[] };
export const ELECTION_SOURCE = D.source;
export const ASSEMBLY = D.assembly;
// Lok Sabha seats in ECI order: assembly segments are numbered in parliamentary-constituency order
export const LOKSABHA: PC[] = (() => {
    const key = (n: string) => n.toLowerCase().replace(/[^a-z]/g, "");
    const minAc = (p: PC) => Math.min(...D.assembly.filter((a) => key(a.pc) === key(p.name)).map((a) => a.no), 999);
    return [...D.loksabha].sort((a, b) => minAc(a) - minAc(b)).map((p, i) => ({ ...p, no: i + 1 }));
})();

export const acBySlug = (slug: string) => ASSEMBLY.find((a) => a.slug === slug);
export const pcBySlug = (slug: string) => LOKSABHA.find((p) => p.slug === slug);
export const pcOf = (ac: AC) => LOKSABHA.find((p) => p.name.toLowerCase() === ac.pc.toLowerCase() || p.name.toLowerCase().replace(/[^a-z]/g, "") === ac.pc.toLowerCase().replace(/[^a-z]/g, ""));
export const acsOfPc = (pc: PC) => ASSEMBLY.filter((a) => pcOf(a)?.slug === pc.slug);
export const wikiUrl = (title: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

/** Latest general (non-bypoll) result. */
export function latest(r: Result[]): Result | undefined {
    return [...r].filter((x) => !x.bypoll).sort((a, b) => b.year - a.year)[0];
}
export function winner(r?: Result): Candidate | undefined {
    return r?.candidates.find((c) => c.won);
}

const COLORS: [RegExp, string][] = [
    [/^Biju Janata Dal/i, "#1f8f4e"],
    [/^Bharatiya Janata Party/i, "#f28c28"],
    [/^Indian National Congress/i, "#2c6fbb"],
    [/^Janata Dal/i, "#2e7d32"],
    [/^Janata Party/i, "#6d9f39"],
    [/^Communist Party of India \(Marxist\)/i, "#b71c1c"],
    [/^Communist/i, "#d32f2f"],
    [/^Swatantra/i, "#7b5ea7"],
    [/^Ganatantra|Gantantra/i, "#8d6e63"],
    [/^Utkal Congress/i, "#00838f"],
    [/^Jharkhand Mukti Morcha/i, "#1b5e20"],
    [/^Independent/i, "#9e9e9e"],
    [/^None of the above/i, "#bdbdbd"],
];
export function partyColor(p: string): string {
    return COLORS.find(([re]) => re.test(p))?.[1] ?? "#8c8173";
}
const ABBR: [RegExp, string][] = [
    [/^Biju Janata Dal/i, "BJD"], [/^Bharatiya Janata Party/i, "BJP"], [/^Indian National Congress/i, "INC"], [/^Janata Dal/i, "JD"], [/^Janata Party/i, "JNP"],
    [/^Communist Party of India \(Marxist\)/i, "CPI(M)"], [/^Communist Party of India/i, "CPI"], [/^Independent/i, "IND"], [/^Jharkhand Mukti Morcha/i, "JMM"],
];
export function partyAbbr(p: string): string {
    return ABBR.find(([re]) => re.test(p))?.[1] ?? p;
}

/** Seats won by party in the latest general assembly election. */
export function seatTally(year?: number) {
    const y = year ?? Math.max(...ASSEMBLY.flatMap((a) => a.results.filter((r) => !r.bypoll).map((r) => r.year)));
    const m = new Map<string, number>();
    ASSEMBLY.forEach((a) => {
        const w = winner(a.results.find((r) => r.year === y && !r.bypoll));
        if (w) m.set(w.party, (m.get(w.party) || 0) + 1);
    });
    return { year: y, parties: [...m.entries()].sort((a, b) => b[1] - a[1]) };
}

const CMAP = cmap as unknown as Record<string, { gp: Record<string, number>; ulb: Record<string, number> }>;
/** Assembly constituency of a gram panchayat (by LGD block and GP code), from the Delimitation Order 2008 extents. */
export function acForGp(district: string, blockCode: string, gpCode: string): AC | undefined {
    const no = CMAP[district.replace(/-od$/, "")]?.gp[`${blockCode}:${gpCode}`];
    return no ? ASSEMBLY.find((a) => a.no === no) : undefined;
}
export function acForUlb(district: string, ulbCode: string): AC | undefined {
    const no = CMAP[district.replace(/-od$/, "")]?.ulb[ulbCode];
    return no ? ASSEMBLY.find((a) => a.no === no) : undefined;
}
const DIST_ALIASES: Record<string, string> = { baragada: "bargarh", khurda: "khordha", keonjhar: "kendujhar", bolangir: "balangir", sonepur: "subarnapur", baleswar: "balasore", baleshwar: "balasore", anugul: "angul", baudh: "boudh", debagarh: "deogarh", nabarangapur: "nabarangpur", jagatsinghapur: "jagatsinghpur" };
export function acDistrictSlug(a: AC): string {
    const k = a.district.toLowerCase().replace(/district/, "").replace(/[^a-z]/g, "");
    return DIST_ALIASES[k] || k;
}
export const acsOfDistrict = (district: string) => ASSEMBLY.filter((a) => acDistrictSlug(a) === district.replace(/-od$/, ""));
