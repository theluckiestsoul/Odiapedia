import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ElectionResult from "@/components/ElectionResult";
import { SITE } from "@/lib/site";
import { districtName } from "@/lib/districts";
import { LOKSABHA, ELECTION_SOURCE, pcBySlug, acsOfPc, latest, winner, partyColor, partyAbbr, wikiUrl, acDistrictSlug } from "@/lib/elections";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
    return LOKSABHA.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = pcBySlug((await params).slug);
    if (!p) return { title: "Constituency not found", robots: { index: false } };
    const l = latest(p.results), w = winner(l);
    return {
        title: [`${p.name} Lok Sabha Constituency: MP & Election Results`, `${p.name} Lok Sabha Seat: MP & Results`].find((t) => t.length <= 58) || `${p.name} Lok Sabha Results`,
        description: `${p.name} Lok Sabha constituency in Odisha${w ? `: ${w.name} (${w.party}) won in ${l!.year}` : ""}. Candidate-wise results, past MPs and its assembly segments.`,
        alternates: { canonical: `/elections/lok-sabha/${p.slug}` },
    };
}

export default async function PcPage({ params }: Props) {
    const p = pcBySlug((await params).slug);
    if (!p) notFound();
    const acs = acsOfPc(p);
    const results = [...p.results].sort((x, y) => y.year - x.year || Number(y.bypoll) - Number(x.bypoll));
    const l = latest(p.results), w = winner(l);
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "AdministrativeArea", name: `${p.name} Lok Sabha constituency`, url: `${SITE.url}/elections/lok-sabha/${p.slug}`, containedInPlace: { "@type": "State", name: "Odisha" } }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Elections", href: "/elections" }, { name: `${p.name} (Lok Sabha)`, href: `/elections/lok-sabha/${p.slug}` }]} />
                    <p className="eyebrow mt-6"><Icon name="people" className="h-4 w-4" />Lok Sabha constituency No. {p.no} of Odisha{p.reservation !== "None" ? ` · reserved for ${p.reservation}` : ""}</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{p.name} Lok Sabha constituency</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">{p.name} is one of Odisha&apos;s {LOKSABHA.length} seats in the Lok Sabha, made up of {acs.length} assembly segments.{w ? ` In ${l!.year} it elected ${w.name} of the ${w.party}.` : ""}</p>
                </div>
            </header>
            <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-10">
                    <section>
                        <h2 className="font-display text-3xl font-semibold">Assembly segments</h2>
                        <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                            <table className="w-full min-w-[36rem] text-sm">
                                <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-4 py-2.5">#</th><th className="px-4 py-2.5">Seat</th><th className="px-4 py-2.5">District</th><th className="px-4 py-2.5">MLA</th></tr></thead>
                                <tbody className="divide-y divide-sand-100">
                                    {acs.map((a) => { const aw = winner(latest(a.results)); const d = acDistrictSlug(a); return (
                                        <tr key={a.no}><td className="px-4 py-2 text-ink-500">{a.no}</td><td className="px-4 py-2"><Link href={`/elections/assembly/${a.slug}`} className="font-semibold text-laterite-600 hover:underline">{a.name}</Link>{a.reservation !== "None" && <span className="ml-1 text-xs text-ink-500">({a.reservation})</span>}</td><td className="px-4 py-2"><Link href={`/district/${d}`} className="hover:underline">{districtName(d) || a.district}</Link></td><td className="px-4 py-2">{aw ? <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: partyColor(aw.party) }} />{aw.name} ({partyAbbr(aw.party)})</span> : "–"}</td></tr>
                                    ); })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section>
                        <h2 className="font-display text-3xl font-semibold">Election results</h2>
                        <div className="mt-4 space-y-5">{results.map((r) => <ElectionResult key={r.title} r={r} />)}</div>
                    </section>
                    {p.members.length > 0 && (
                        <section>
                            <h2 className="font-display text-3xl font-semibold">Members of Parliament</h2>
                            <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                                <table className="w-full text-sm">
                                    <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-4 py-2.5">Year</th><th className="px-4 py-2.5">Member</th><th className="px-4 py-2.5">Party</th></tr></thead>
                                    <tbody className="divide-y divide-sand-100">{p.members.map((m, i) => <tr key={i}><td className="px-4 py-2 tabular-nums text-ink-600">{m.year}</td><td className="px-4 py-2 font-semibold">{m.member}</td><td className="px-4 py-2"><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: partyColor(m.party) }} />{m.party}</span></td></tr>)}</tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>
                <aside className="space-y-4">
                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <p className="text-xs uppercase tracking-wider text-ink-500">Other Lok Sabha seats</p>
                        <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">{LOKSABHA.filter((x) => x.slug !== p.slug).map((x) => <li key={x.slug}><Link href={`/elections/lok-sabha/${x.slug}`} className="text-laterite-600 hover:underline">{x.name}</Link></li>)}</ul>
                    </div>
                    <p className="text-xs leading-relaxed text-ink-500">Source: {ELECTION_SOURCE} — <a href={wikiUrl(p.wiki)} className="underline" target="_blank" rel="noopener noreferrer">article</a>. Official results: <a href="https://results.eci.gov.in" className="underline" target="_blank" rel="noopener noreferrer">Election Commission of India</a>.</p>
                </aside>
            </div>
        </div>
    );
}
