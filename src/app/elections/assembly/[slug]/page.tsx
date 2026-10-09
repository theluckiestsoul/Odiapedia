import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ElectionResult from "@/components/ElectionResult";
import { SITE } from "@/lib/site";
import { districtName } from "@/lib/districts";
import { getAdminDistrict, gpId } from "@/lib/admin";
import { ASSEMBLY, ELECTION_SOURCE, acBySlug, pcOf, latest, winner, partyColor, wikiUrl, acDistrictSlug, acForGp, acForUlb } from "@/lib/elections";
import { getDistrictAreas } from "@/lib/census-areas";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
    return ASSEMBLY.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const a = acBySlug((await params).slug);
    if (!a) return { title: "Constituency not found", robots: { index: false } };
    const l = latest(a.results), w = winner(l);
    return {
        title: [`${a.name} Assembly Constituency: MLA & Election Results`, `${a.name} Assembly Seat: MLA & Results`, `${a.name} (Odisha) Election Results`].find((t) => t.length <= 58) || `${a.name} Election Results`,
        description: `${a.name} (No. ${a.no}${a.reservation !== "None" ? `, ${a.reservation}` : ""}) is an Odisha Vidhan Sabha seat in ${a.district} district${w ? `, won by ${w.name} (${w.party}) in ${l!.year}` : ""}. Candidate-wise results, past MLAs since 1952 and the blocks and panchayats it covers.`,
        alternates: { canonical: `/elections/assembly/${a.slug}` },
    };
}

export default async function AcPage({ params }: Props) {
    const a = acBySlug((await params).slug);
    if (!a) notFound();
    const d = acDistrictSlug(a);
    const dn = districtName(d) || a.district;
    const pc = pcOf(a);
    const results = [...a.results].sort((x, y) => y.year - x.year || Number(y.bypoll) - Number(x.bypoll));
    const l = latest(a.results), w = winner(l);
    const admin = await getAdminDistrict(d);
    // GPs and towns mapped to this seat
    const gps = admin ? admin.blocks.filter((b) => b.code !== "0").flatMap((b) => b.gps.filter((g) => g.code !== "0" && acForGp(d, b.code, g.code)?.no === a.no).map((g) => ({ b, g }))) : [];
    const blocks = [...new Map(gps.map((x) => [x.b.code, x.b])).values()];
    const towns = admin ? admin.ulbs.filter((u) => acForUlb(d, u.code)?.no === a.no) : [];
    const areas = getDistrictAreas(d);
    const neighbours = ASSEMBLY.filter((x) => acDistrictSlug(x) === d && x.no !== a.no);
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "AdministrativeArea", name: `${a.name} assembly constituency`, url: `${SITE.url}/elections/assembly/${a.slug}`, containedInPlace: { "@type": "AdministrativeArea", name: `${dn} district`, url: `${SITE.url}/district/${d}` }, identifier: { "@type": "PropertyValue", propertyID: "Assembly constituency number", value: a.no } }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Elections", href: "/elections" }, { name: `${a.name} (${a.no})`, href: `/elections/assembly/${a.slug}` }]} />
                    <p className="eyebrow mt-6"><Icon name="people" className="h-4 w-4" />Vidhan Sabha constituency No. {a.no}{a.reservation !== "None" ? ` · reserved for ${a.reservation}` : ""}</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{a.name} assembly constituency</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {a.name} is one of {ASSEMBLY.length} seats in the Odisha Legislative Assembly, in <Link href={`/district/${d}`} className="text-laterite-600 hover:underline">{dn} district</Link>
                        {pc ? <> and the <Link href={`/elections/lok-sabha/${pc.slug}`} className="text-laterite-600 hover:underline">{pc.name} Lok Sabha constituency</Link></> : null}.
                        {w ? ` In ${l!.year} it elected ${w.name} of the ${w.party}${l!.majority?.votes ? `, by ${l!.majority.votes.toLocaleString("en-IN")} votes` : ""}.` : ""}
                    </p>
                    <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
                        {[
                            ["MLA (" + (l?.year ?? "") + ")", w?.name ?? "–"],
                            ["Party", w?.party ?? "–"],
                            ["Electors", a.electors ? a.electors.toLocaleString("en-IN") : "–"],
                            ["Turnout (" + (l?.year ?? "") + ")", l?.turnout?.pct != null ? `${l.turnout.pct}%` : "–"],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-sand-200 bg-white/80 p-4"><dt className="text-xs uppercase tracking-wider text-ink-500">{k}</dt><dd className="mt-1 font-display text-lg font-semibold">{v}</dd></div>
                        ))}
                    </dl>
                </div>
            </header>
            <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-10">
                    <section>
                        <h2 className="font-display text-3xl font-semibold">Election results</h2>
                        <div className="mt-4 space-y-5">{results.map((r) => <ElectionResult key={r.title} r={r} />)}</div>
                    </section>
                    {a.members.length > 0 && (
                        <section>
                            <h2 className="font-display text-3xl font-semibold">Members elected since {a.members[a.members.length - 1].year.slice(0, 4)}</h2>
                            <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                                <table className="w-full text-sm">
                                    <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-4 py-2.5">Year</th><th className="px-4 py-2.5">Member</th><th className="px-4 py-2.5">Party</th></tr></thead>
                                    <tbody className="divide-y divide-sand-100">
                                        {a.members.map((m, i) => (
                                            <tr key={i}><td className="px-4 py-2 tabular-nums text-ink-600">{m.year}</td><td className="px-4 py-2 font-semibold text-ink-900">{m.member}</td><td className="px-4 py-2"><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: partyColor(m.party) }} />{m.party}</span></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                    {(a.extentText || a.extent.length > 0 || gps.length > 0) && (
                        <section>
                            <h2 className="font-display text-3xl font-semibold">Area covered</h2>
                            {(a.extentText || a.extent.length > 0) && <p className="mt-3 text-ink-800">{a.extentText || a.extent.join("; ")}</p>}
                            <p className="mt-1 text-xs text-ink-500">As set by the Delimitation of Parliamentary and Assembly Constituencies Order, 2008.</p>
                            {towns.length > 0 && (
                                <p className="mt-4 text-sm">Towns: {towns.map((u, i) => { const t = areas?.towns.find((x) => x.code === u.census2011); return <span key={u.code}>{i ? ", " : ""}{t ? <Link href={`/district/${d}/town/${t.slug}`} className="text-laterite-600 hover:underline">{u.name}</Link> : u.name}</span>; })}</p>
                            )}
                            {blocks.map((b) => (
                                <div key={b.code} className="mt-4">
                                    <h3 className="text-sm font-semibold"><Link href={`/district/${d}/block/${b.slug}`} className="text-laterite-600 hover:underline">{b.name} block</Link> <span className="font-normal text-ink-500">· {gps.filter((x) => x.b.code === b.code).length} of {b.gps.filter((g) => g.code !== "0").length} gram panchayats</span></h3>
                                    <ul className="mt-1.5 flex flex-wrap gap-1.5 text-sm">
                                        {gps.filter((x) => x.b.code === b.code).map(({ g }) => <li key={g.code}><Link prefetch={false} href={`/district/${d}/gp/${gpId(g)}`} className="chip !bg-white !px-2.5 !py-0.5 hover:border-laterite-300">{g.name}</Link></li>)}
                                    </ul>
                                </div>
                            ))}
                            {gps.length > 0 && <p className="mt-3 text-xs text-ink-500">Panchayats matched by Odiapedia from the order&apos;s wording to the Local Government Directory (2022) names; boundaries may have changed since 2008.</p>}
                        </section>
                    )}
                </div>
                <aside className="space-y-5">
                    {pc && <Link href={`/elections/lok-sabha/${pc.slug}`} className="card-link block p-5"><p className="text-xs uppercase tracking-wider text-ink-500">Lok Sabha seat</p><p className="mt-1 font-display text-xl font-semibold">{pc.name}</p></Link>}
                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <p className="text-xs uppercase tracking-wider text-ink-500">Other seats in {dn}</p>
                        <ul className="mt-2 space-y-1 text-sm">{neighbours.map((x) => <li key={x.no}><Link href={`/elections/assembly/${x.slug}`} className="text-laterite-600 hover:underline">{x.name}</Link> <span className="text-xs text-ink-400">{x.no}</span></li>)}</ul>
                    </div>
                    <p className="text-xs leading-relaxed text-ink-500">Source: {ELECTION_SOURCE} — <a href={wikiUrl(a.wiki)} className="underline" target="_blank" rel="noopener noreferrer">article</a>. Official results: <a href="https://results.eci.gov.in" className="underline" target="_blank" rel="noopener noreferrer">Election Commission of India</a>.</p>
                </aside>
            </div>
        </div>
    );
}
