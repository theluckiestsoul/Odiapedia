import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { districtName } from "@/lib/districts";
import { ASSEMBLY, LOKSABHA, ELECTION_SOURCE, latest, winner, seatTally, partyColor, partyAbbr, acDistrictSlug, acsOfPc } from "@/lib/elections";

export const metadata = hubMetadata({
    title: "Odisha Elections: All 147 MLA & 21 MP Seats, Results",
    description: "Every Odisha assembly and Lok Sabha constituency: current MLA and MP, candidate-wise results of recent elections, members since 1952, and which blocks, towns and panchayats each seat covers.",
    path: "/elections",
    keywords: ["odisha election results", "odisha assembly constituencies", "odisha mla list", "odisha lok sabha constituencies", "odisha mp list", "vidhan sabha odisha"],
});

export default function ElectionsPage() {
    const tally = seatTally();
    const byDistrict = new Map<string, typeof ASSEMBLY>();
    ASSEMBLY.forEach((a) => byDistrict.set(acDistrictSlug(a), [...(byDistrict.get(acDistrictSlug(a)) || []), a]));
    const pcTally = new Map<string, number>();
    LOKSABHA.forEach((p) => { const w = winner(latest(p.results)); if (w) pcTally.set(w.party, (pcTally.get(w.party) || 0) + 1); });
    const pcYear = Math.max(...LOKSABHA.map((p) => latest(p.results)?.year ?? 0));
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Assembly constituencies of Odisha", numberOfItems: ASSEMBLY.length, itemListElement: ASSEMBLY.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: `${a.name} assembly constituency`, url: `${SITE.url}/elections/assembly/${a.slug}` })) }} />
            <PageHero
                title="Odisha elections"
                odia="ଓଡ଼ିଶା ନିର୍ବାଚନ"
                description={`All ${ASSEMBLY.length} Vidhan Sabha and ${LOKSABHA.length} Lok Sabha constituencies of Odisha — who represents each seat, how it voted, and which blocks and towns it covers.`}
                icon="people"
                eyebrow="Government"
                crumbs={[{ name: "Elections", href: "/elections" }]}
            />
            <div className="container-page space-y-14 py-12">
                <section className="grid gap-6 md:grid-cols-2">
                    {[
                        { t: `Vidhan Sabha ${tally.year}`, total: ASSEMBLY.length, parties: tally.parties },
                        { t: `Lok Sabha ${pcYear}`, total: LOKSABHA.length, parties: [...pcTally.entries()].sort((a, b) => b[1] - a[1]) },
                    ].map((x) => (
                        <div key={x.t} className="rounded-2xl border border-sand-200 bg-white p-5">
                            <h2 className="font-display text-xl font-semibold">{x.t}: seats won</h2>
                            <div className="mt-3 flex h-5 overflow-hidden rounded-full bg-sand-100" role="img" aria-label={x.parties.map(([p, n]) => `${p} ${n}`).join(", ")}>
                                {x.parties.map(([p, n]) => <span key={p} style={{ width: `${(n / x.total) * 100}%`, background: partyColor(p) }} />)}
                            </div>
                            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                                {x.parties.map(([p, n]) => <li key={p} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: partyColor(p) }} />{partyAbbr(p)} <strong>{n}</strong></li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <section>
                    <h2 className="font-display text-3xl font-semibold">Lok Sabha constituencies</h2>
                    <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                        <table className="w-full min-w-[40rem] text-sm">
                            <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-4 py-2.5">#</th><th className="px-4 py-2.5">Constituency</th><th className="px-4 py-2.5">Member ({pcYear})</th><th className="px-4 py-2.5">Party</th><th className="px-4 py-2.5 text-right">Segments</th></tr></thead>
                            <tbody className="divide-y divide-sand-100">
                                {LOKSABHA.map((p) => { const w = winner(latest(p.results)); return (
                                    <tr key={p.slug}><td className="px-4 py-2 text-ink-500">{p.no}</td><td className="px-4 py-2"><Link href={`/elections/lok-sabha/${p.slug}`} className="font-semibold text-laterite-600 hover:underline">{p.name}</Link>{p.reservation !== "None" && <span className="ml-1 text-xs text-ink-500">({p.reservation})</span>}</td><td className="px-4 py-2">{w?.name ?? "–"}</td><td className="px-4 py-2"><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: partyColor(w?.party ?? "") }} />{w ? partyAbbr(w.party) : "–"}</span></td><td className="px-4 py-2 text-right tabular-nums">{acsOfPc(p).length}</td></tr>
                                ); })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="font-display text-3xl font-semibold">Assembly constituencies by district</h2>
                    <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {[...byDistrict.entries()].sort((a, b) => (districtName(a[0]) || a[0]).localeCompare(districtName(b[0]) || b[0])).map(([d, list]) => (
                            <div key={d}>
                                <h3 className="font-display text-xl font-semibold"><Link href={`/district/${d}`} className="hover:underline">{districtName(d) || d}</Link></h3>
                                <ul className="mt-2 space-y-1 text-sm">
                                    {list.map((a) => { const w = winner(latest(a.results)); return (
                                        <li key={a.no} className="flex items-baseline gap-2">
                                            <span className="w-7 text-right text-xs text-ink-400">{a.no}</span>
                                            <Link href={`/elections/assembly/${a.slug}`} className="font-semibold text-laterite-600 hover:underline">{a.name}</Link>
                                            {a.reservation !== "None" && <span className="text-xs text-ink-500">{a.reservation}</span>}
                                            {w && <span className="ml-auto flex items-center gap-1 text-xs text-ink-600"><span className="h-2 w-2 rounded-full" style={{ background: partyColor(w.party) }} />{partyAbbr(w.party)}</span>}
                                        </li>
                                    ); })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
                <p className="max-w-3xl text-xs text-ink-500">Source: {ELECTION_SOURCE}. Party shown is the winner of the latest general election; by-elections since are on each seat&apos;s page. For official figures see <a href="https://results.eci.gov.in" className="underline" target="_blank" rel="noopener noreferrer">results.eci.gov.in</a>.</p>
            </div>
        </div>
    );
}
