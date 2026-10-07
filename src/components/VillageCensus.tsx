import type { ReactNode } from "react";
import { CENSUS_SOURCE, CENSUS_SOURCE_URL, type VillageCensus as Census } from "@/lib/census";

const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (part: number, whole: number) => (whole <= 0 ? "–" : part === 0 ? "0%" : `${((part / whole) * 100).toFixed(1)}%`);

/** One-sentence summary of the Census 2011 figures, for the page lead and the meta description. */
export function censusSentence(name: string, c: Census): string {
    if (c.population === 0) return `Census 2011 recorded no residents in ${name}.`;
    return `In Census 2011, ${name} had ${fmt(c.population)} people in ${fmt(c.households)} households${c.literacyRate != null ? `, with a literacy rate of ${c.literacyRate.toFixed(1)}%` : ""}.`;
}

function Compare({ value, avg, unit, label }: { value: number | null; avg: number | null; unit: string; label: string }) {
    if (value == null || avg == null) return null;
    const diff = value - avg;
    const word = Math.abs(diff) < (unit === "%" ? 1 : 10) ? "about the same as" : diff > 0 ? "above" : "below";
    return (
        <span className="mt-1 block text-xs text-ink-500">
            {word} the district&apos;s rural {label} ({unit === "%" ? `${avg.toFixed(1)}%` : fmt(Math.round(avg))})
        </span>
    );
}

export default function VillageCensus({ name, census, districtRural, districtName }: { name: string; census: Census; districtRural: Census | null; districtName: string }) {
    const c = census;
    if (c.population === 0) {
        return (
            <section className="mb-10">
                <h2 className="font-display text-2xl font-semibold">People</h2>
                <p className="mt-3 text-ink-700">{censusSentence(name, c)} It is an uninhabited revenue village: land recorded under this name, with no settlement.</p>
                <p className="mt-2 text-xs text-ink-500">Source: <a href={CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{CENSUS_SOURCE}</a>.</p>
            </section>
        );
    }
    const work = [
        { k: "Cultivators", v: c.cultivators, color: "#5f8f4e" },
        { k: "Agricultural labourers", v: c.agriLabourers, color: "#c9a227" },
        { k: "Household industry", v: c.householdIndustry, color: "#cf6a43" },
        { k: "Other work", v: c.otherWorkers, color: "#3f6fa8" },
        { k: "Marginal workers", v: c.marginalWorkers, color: "#a98a5c" },
    ];
    const tiles: [string, string, ReactNode?][] = [
        ["Population", fmt(c.population), <span key="mf" className="mt-1 block text-xs text-ink-500">{fmt(c.males)} male · {fmt(c.females)} female</span>],
        ["Households", fmt(c.households), <span key="hh" className="mt-1 block text-xs text-ink-500">about {(c.population / Math.max(c.households, 1)).toFixed(1)} people each</span>],
        ["Literacy (age 7+)", c.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–", <Compare key="lit" value={c.literacyRate} avg={districtRural?.literacyRate ?? null} unit="%" label="average" />],
        ["Females per 1,000 males", c.sexRatio != null ? fmt(c.sexRatio) : "–", <Compare key="sr" value={c.sexRatio} avg={districtRural?.sexRatio ?? null} unit="" label="ratio" />],
        ["Children aged 0–6", fmt(c.children), <span key="ch" className="mt-1 block text-xs text-ink-500">{pct(c.children, c.population)} of residents</span>],
        ["Workers", fmt(c.workers), <span key="wk" className="mt-1 block text-xs text-ink-500">{pct(c.workers, c.population)} of residents</span>],
    ];
    return (
        <section className="mb-10" aria-labelledby="people-h">
            <h2 id="people-h" className="font-display text-2xl font-semibold">People and work</h2>
            <p className="mt-3 text-ink-700">
                {censusSentence(name, c)} Scheduled Castes made up {pct(c.sc, c.population)} and Scheduled Tribes {pct(c.st, c.population)} of the population.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tiles.map(([k, v, note]) => (
                    <div key={k} className="rounded-2xl border border-sand-200 bg-white p-4">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">{k}</dt>
                        <dd className="mt-1 font-display text-2xl font-semibold text-ink-900">{v}</dd>
                        {note && <dd className="font-sans">{note}</dd>}
                    </div>
                ))}
            </dl>
            {c.workers > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-ink-800">What the {fmt(c.workers)} workers did</h3>
                    <div className="mt-2 flex h-4 overflow-hidden rounded-full bg-sand-100" role="img"
                        aria-label={work.map((w) => `${w.k} ${pct(w.v, c.workers)}`).join(", ")}>
                        {work.filter((w) => w.v > 0).map((w) => (
                            <span key={w.k} style={{ width: `${(w.v / c.workers) * 100}%`, background: w.color }} />
                        ))}
                    </div>
                    <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                        {work.map((w) => (
                            <li key={w.k} className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: w.color }} aria-hidden="true" />
                                <span className="text-ink-700">{w.k}</span>
                                <span className="ml-auto tabular-nums text-ink-900">{fmt(w.v)} <span className="text-ink-500">({pct(w.v, c.workers)})</span></span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 text-xs text-ink-500">Marginal workers worked less than six months of the year.</p>
                </div>
            )}
            <p className="mt-4 text-xs text-ink-500">
                Source: <a href={CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{CENSUS_SOURCE}</a>. Figures are from 2011, the most recent census with published village figures; district comparisons use rural {districtName}.
            </p>
        </section>
    );
}
