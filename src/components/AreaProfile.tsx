import type { ReactNode } from "react";
import type { VillageCensus } from "@/lib/census";
import type { AreaCensus } from "@/lib/census-areas";

type Lang = "en" | "or";
const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (part: number, whole: number) => (whole <= 0 ? "–" : `${((part / whole) * 100).toFixed(1)}%`);

const L = {
    en: {
        population: "Population",
        households: "Households",
        perHh: (x: string) => `about ${x} people each`,
        literacy: "Literacy (age 7+)",
        sexRatio: "Females per 1,000 males",
        childSexRatio: "Girls per 1,000 boys (0–6)",
        children: "Children aged 0–6",
        of: (x: string) => `${x} of residents`,
        workers: "Workers",
        density: "People per km²",
        rural: "Rural",
        urban: "Urban",
        sc: "Scheduled Castes",
        st: "Scheduled Tribes",
        mf: (m: string, f: string) => `${m} male · ${f} female`,
        litMf: (m: string, f: string) => `men ${m} · women ${f}`,
        work: (n: string) => `What the ${n} workers did`,
        cultivators: "Cultivators",
        agri: "Agricultural labourers",
        hhInd: "Household industry",
        other: "Other work",
        marginal: "Marginal workers",
        marginalNote: "Marginal workers worked less than six months of the year.",
        vs: (word: string, label: string, v: string) => `${word} ${label} (${v})`,
        above: "above",
        below: "below",
        same: "about the same as",
    },
    or: {
        population: "ଜନସଂଖ୍ୟା",
        households: "ପରିବାର",
        perHh: (x: string) => `ପରିବାର ପିଛା ପ୍ରାୟ ${x} ଜଣ`,
        literacy: "ସାକ୍ଷରତା (୭ ବର୍ଷରୁ ଅଧିକ)",
        sexRatio: "ପ୍ରତି ୧,୦୦୦ ପୁରୁଷରେ ମହିଳା",
        childSexRatio: "ପ୍ରତି ୧,୦୦୦ ପୁଅରେ ଝିଅ (୦–୬)",
        children: "୦–୬ ବର୍ଷର ପିଲା",
        of: (x: string) => `ଜନସଂଖ୍ୟାର ${x}`,
        workers: "କର୍ମୀ",
        density: "ପ୍ରତି ବର୍ଗ କି.ମି.ରେ ଲୋକ",
        rural: "ଗ୍ରାମାଞ୍ଚଳ",
        urban: "ସହରାଞ୍ଚଳ",
        sc: "ଅନୁସୂଚିତ ଜାତି",
        st: "ଅନୁସୂଚିତ ଜନଜାତି",
        mf: (m: string, f: string) => `ପୁରୁଷ ${m} · ମହିଳା ${f}`,
        litMf: (m: string, f: string) => `ପୁରୁଷ ${m} · ମହିଳା ${f}`,
        work: (n: string) => `${n} କର୍ମୀଙ୍କ କାମ`,
        cultivators: "ଚାଷୀ",
        agri: "କୃଷି ଶ୍ରମିକ",
        hhInd: "ଘରୋଇ ଶିଳ୍ପ",
        other: "ଅନ୍ୟ କାମ",
        marginal: "ସୀମାନ୍ତ କର୍ମୀ",
        marginalNote: "ସୀମାନ୍ତ କର୍ମୀମାନେ ବର୍ଷକୁ ଛଅ ମାସରୁ କମ୍ କାମ କରିଥିଲେ।",
        vs: (word: string, label: string, v: string) => `${label} (${v}) ${word}`,
        above: "ଠାରୁ ଅଧିକ",
        below: "ଠାରୁ କମ୍",
        same: "ସହ ପ୍ରାୟ ସମାନ",
    },
};

function isArea(c: VillageCensus | AreaCensus): c is AreaCensus {
    return "maleLiteracy" in c;
}

/**
 * Census 2011 profile for an area (district, sub-district, block, gram panchayat or town): headline tiles,
 * rural/urban split, SC/ST shares and what workers did. `compare` adds "above/below X" notes.
 */
export default function AreaProfile({
    census: c,
    compare,
    rural,
    urban,
    areaKm2,
    lang = "en",
    source,
}: {
    census: VillageCensus | AreaCensus;
    compare?: { label: string; census: VillageCensus | AreaCensus };
    rural?: VillageCensus | AreaCensus | null;
    urban?: VillageCensus | AreaCensus | null;
    areaKm2?: number;
    lang?: Lang;
    source: ReactNode;
}) {
    const t = L[lang];
    const vs = (value: number | null, avg: number | null, unit: "%" | "") => {
        if (!compare || value == null || avg == null) return null;
        const diff = value - avg;
        const word = Math.abs(diff) < (unit === "%" ? 1 : 10) ? t.same : diff > 0 ? t.above : t.below;
        return <span className="mt-1 block text-xs text-ink-500">{t.vs(word, compare.label, unit === "%" ? `${avg.toFixed(1)}%` : fmt(Math.round(avg)))}</span>;
    };
    const area = isArea(c) ? c : null;
    const tiles: [string, string, ReactNode?][] = [
        [t.population, fmt(c.population), <span key="mf" className="mt-1 block text-xs text-ink-500">{t.mf(fmt(c.males), fmt(c.females))}</span>],
        [t.households, fmt(c.households), <span key="hh" className="mt-1 block text-xs text-ink-500">{t.perHh((c.population / Math.max(c.households, 1)).toFixed(1))}</span>],
        [
            t.literacy,
            c.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–",
            area?.maleLiteracy != null && area.femaleLiteracy != null ? (
                <span key="lmf" className="mt-1 block text-xs text-ink-500">{t.litMf(`${area.maleLiteracy.toFixed(1)}%`, `${area.femaleLiteracy.toFixed(1)}%`)}{vs(c.literacyRate, compare?.census.literacyRate ?? null, "%")}</span>
            ) : (
                vs(c.literacyRate, compare?.census.literacyRate ?? null, "%")
            ),
        ],
        [t.sexRatio, c.sexRatio != null ? fmt(c.sexRatio) : "–", vs(c.sexRatio, compare?.census.sexRatio ?? null, "")],
        ...(area?.childSexRatio != null ? ([[t.childSexRatio, fmt(area.childSexRatio)]] as [string, string][]) : ([[t.children, fmt(c.children), <span key="ch" className="mt-1 block text-xs text-ink-500">{t.of(pct(c.children, c.population))}</span>]] as [string, string, ReactNode][])),
        ...(areaKm2 ? ([[t.density, fmt(Math.round(c.population / areaKm2))]] as [string, string][]) : ([[t.workers, fmt(c.workers), <span key="wk" className="mt-1 block text-xs text-ink-500">{t.of(pct(c.workers, c.population))}</span>]] as [string, string, ReactNode][])),
    ];
    const work = [
        { k: t.cultivators, v: c.cultivators, color: "#5f8f4e" },
        { k: t.agri, v: c.agriLabourers, color: "#c9a227" },
        { k: t.hhInd, v: c.householdIndustry, color: "#cf6a43" },
        { k: t.other, v: c.otherWorkers, color: "#3f6fa8" },
        { k: t.marginal, v: c.marginalWorkers, color: "#a98a5c" },
    ];
    const bars: { k: string; v: number; color: string }[] = [
        ...(rural && urban && c.population > 0
            ? [
                  { k: t.rural, v: rural.population, color: "#5f8f4e" },
                  { k: t.urban, v: urban.population, color: "#3f6fa8" },
              ]
            : []),
    ];
    return (
        <div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tiles.map(([k, v, note]) => (
                    <div key={k} className="rounded-2xl border border-sand-200 bg-white p-4">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">{k}</dt>
                        <dd className="mt-1 font-display text-2xl font-semibold text-ink-900">{v}</dd>
                        {note && <dd className="font-sans">{note}</dd>}
                    </div>
                ))}
            </dl>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                    {bars.length > 0 && (
                        <div className="mb-5">
                            <div className="flex h-4 overflow-hidden rounded-full bg-sand-100" role="img" aria-label={bars.map((b) => `${b.k} ${pct(b.v, c.population)}`).join(", ")}>
                                {bars.filter((b) => b.v > 0).map((b) => <span key={b.k} style={{ width: `${(b.v / c.population) * 100}%`, background: b.color }} />)}
                            </div>
                            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                                {bars.map((b) => (
                                    <li key={b.k} className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-sm" style={{ background: b.color }} aria-hidden="true" />
                                        <span className="text-ink-700">{b.k}</span>
                                        <span className="tabular-nums text-ink-900">{fmt(b.v)} <span className="text-ink-500">({pct(b.v, c.population)})</span></span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            [t.sc, c.sc],
                            [t.st, c.st],
                        ].map(([k, v]) => (
                            <div key={k as string} className="rounded-xl border border-sand-200 bg-sand-50 px-4 py-3">
                                <dt className="text-ink-600">{k}</dt>
                                <dd className="mt-0.5 font-semibold tabular-nums text-ink-900">{fmt(v as number)} <span className="font-normal text-ink-500">({pct(v as number, c.population)})</span></dd>
                            </div>
                        ))}
                    </dl>
                </div>
                {c.workers > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-ink-800">{t.work(fmt(c.workers))}</h3>
                        <div className="mt-2 flex h-4 overflow-hidden rounded-full bg-sand-100" role="img" aria-label={work.map((w) => `${w.k} ${pct(w.v, c.workers)}`).join(", ")}>
                            {work.filter((w) => w.v > 0).map((w) => <span key={w.k} style={{ width: `${(w.v / c.workers) * 100}%`, background: w.color }} />)}
                        </div>
                        <ul className="mt-3 space-y-1 text-sm">
                            {work.map((w) => (
                                <li key={w.k} className="flex items-center gap-2">
                                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: w.color }} aria-hidden="true" />
                                    <span className="text-ink-700">{w.k}</span>
                                    <span className="ml-auto tabular-nums text-ink-900">{fmt(w.v)} <span className="text-ink-500">({pct(w.v, c.workers)})</span></span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 text-xs text-ink-500">{t.marginalNote}</p>
                    </div>
                )}
            </div>
            <p className="mt-4 text-xs text-ink-500">{source}</p>
        </div>
    );
}
