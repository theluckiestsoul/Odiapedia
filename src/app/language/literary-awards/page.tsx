import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import data from "@/data/literary-awards.json";

type W = { year?: number; author: string; wiki: string; work: string; category?: string; posthumous?: boolean; no?: number; period?: string };
const D = data as unknown as { sahityaAkademi: W[]; jnanpith: W[]; saraswati: W[]; odishaSahityaAkademi: W[]; source: string };

export const metadata = hubMetadata({
    title: "Odia Literary Awards: Jnanpith & Sahitya Akademi Winners",
    description: `Every Odia winner of the Jnanpith Award (${D.jnanpith.length}), the Saraswati Samman (${D.saraswati.length}) and the Sahitya Akademi Award (${D.sahityaAkademi.length}, since 1955), plus ${D.odishaSahityaAkademi.length} books honoured by the Odisha Sahitya Akademi.`,
    path: "/language/literary-awards",
    keywords: ["odia sahitya akademi award", "jnanpith award odia", "odia literature awards", "sahitya akademi award odia list", "odisha sahitya akademi award"],
});

const OUR_PEOPLE: Record<string, string> = { "Gopinath Mohanty": "/people/gopinath-mohanty" };
const wiki = (t: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, "_"))}`;
function Who({ w }: { w: W }) {
    const ours = OUR_PEOPLE[w.author];
    if (ours) return <Link href={ours} className="font-semibold text-laterite-600 hover:underline">{w.author}</Link>;
    return w.wiki ? <a href={wiki(w.wiki)} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink-900 hover:text-laterite-600 hover:underline">{w.author}</a> : <span className="font-semibold text-ink-900">{w.author}</span>;
}

export default function AwardsPage() {
    const periods = [...new Set(D.odishaSahityaAkademi.map((w) => w.period || ""))];
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Odia winners of the Sahitya Akademi Award", url: `${SITE.url}/language/literary-awards`, numberOfItems: D.sahityaAkademi.length, itemListElement: D.sahityaAkademi.map((w, i) => ({ "@type": "ListItem", position: i + 1, name: `${w.year}: ${w.author} — ${w.work}` })) }} />
            <PageHero title="Odia literary awards" odia="ଓଡ଼ିଆ ସାହିତ୍ୟ ପୁରସ୍କାର" description="The writers and books honoured with India's highest literary awards for Odia, from Gopinath Mohanty's Jnanpith to the latest Sahitya Akademi Award." icon="book" eyebrow="Language & literature" crumbs={[{ name: "Language", href: "/language" }, { name: "Literary awards", href: "/language/literary-awards" }]} />
            <div className="container-page space-y-14 py-12">
                <div className="grid gap-6 md:grid-cols-2">
                    <section className="rounded-2xl border border-sand-200 bg-white p-6">
                        <h2 className="font-display text-2xl font-semibold">Jnanpith Award</h2>
                        <p className="mt-1 text-sm text-ink-600">India&apos;s highest literary honour, given by the Bharatiya Jnanpith.</p>
                        <ul className="mt-4 space-y-2 text-sm">{D.jnanpith.map((w) => <li key={w.author} className="flex gap-3"><span className="w-12 tabular-nums text-ink-500">{w.year}</span><span><Who w={w} /> <span className="text-ink-600">— {w.work}</span></span></li>)}</ul>
                    </section>
                    <section className="rounded-2xl border border-sand-200 bg-white p-6">
                        <h2 className="font-display text-2xl font-semibold">Saraswati Samman</h2>
                        <p className="mt-1 text-sm text-ink-600">Given by the K. K. Birla Foundation for an outstanding work in an Indian language.</p>
                        <ul className="mt-4 space-y-2 text-sm">{D.saraswati.map((w) => <li key={w.author} className="flex gap-3"><span className="w-12 tabular-nums text-ink-500">{w.year}</span><span><Who w={w} /> <span className="text-ink-600">— <i>{w.work}</i>{w.category ? ` (${w.category})` : ""}</span></span></li>)}</ul>
                    </section>
                </div>

                <section>
                    <h2 className="font-display text-3xl font-semibold">Sahitya Akademi Award for Odia</h2>
                    <p className="mt-2 max-w-3xl text-ink-600">Given each year since 1955 by India&apos;s National Academy of Letters to the best book in Odia. † awarded after the writer&apos;s death.</p>
                    <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                        <table className="w-full min-w-[36rem] text-sm">
                            <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-4 py-2.5">Year</th><th className="px-4 py-2.5">Writer</th><th className="px-4 py-2.5">Book</th><th className="px-4 py-2.5">Genre</th></tr></thead>
                            <tbody className="divide-y divide-sand-100">{[...D.sahityaAkademi].reverse().map((w, i) => <tr key={i}><td className="px-4 py-2 tabular-nums text-ink-600">{w.year}</td><td className="px-4 py-2"><Who w={w} />{w.posthumous ? " †" : ""}</td><td className="px-4 py-2 italic">{w.work}</td><td className="px-4 py-2 text-ink-600">{w.category}</td></tr>)}</tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="font-display text-3xl font-semibold">Odisha Sahitya Akademi Award</h2>
                    <p className="mt-2 max-w-3xl text-ink-600">Books honoured by the state&apos;s own academy of letters, grouped by the publication years each round covered (the list here runs to 2008).</p>
                    <div className="mt-6 space-y-6">
                        {periods.map((p) => (
                            <details key={p} className="group rounded-2xl border border-sand-200 bg-white">
                                <summary className="cursor-pointer list-none px-5 py-3 font-semibold text-ink-900">{p || "Other years"} <span className="font-normal text-ink-500">· {D.odishaSahityaAkademi.filter((w) => (w.period || "") === p).length} books</span></summary>
                                <ul className="divide-y divide-sand-100 border-t border-sand-200 text-sm">
                                    {D.odishaSahityaAkademi.filter((w) => (w.period || "") === p).map((w) => <li key={w.no} className="grid grid-cols-[1fr_1fr_1fr] gap-3 px-5 py-2"><i>{w.work}</i><Who w={w} /><span className="text-ink-600">{w.category}</span></li>)}
                                </ul>
                            </details>
                        ))}
                    </div>
                </section>
                <p className="max-w-3xl text-xs text-ink-500">Source: {D.source}. Spellings of titles follow those sources. Spotted a missing year or an error? <Link href="/about/corrections-policy" className="underline">Tell us</Link>.</p>
            </div>
        </div>
    );
}
