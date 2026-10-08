import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import AreaProfile from "@/components/AreaProfile";
import { AreaAmenitiesView } from "@/components/Amenities";
import { ADMIN_SOURCE, getAdminDistrict, gpId, villageId } from "@/lib/admin";
import { districtName } from "@/lib/districts";
import { SITE } from "@/lib/site";
import { CENSUS_SOURCE, CENSUS_SOURCE_URL, getDistrictRural, getVillageRows, shapeCensusRow, sumVillages } from "@/lib/census";
import { getAmenitiesFor, summariseAmenities } from "@/lib/amenities";

type Props = { params: Promise<{ slug: string; gp: string }> };

// ~6,800 gram panchayat pages, rendered per request like the village pages (see village/[village]/page.tsx).
export const dynamic = "force-dynamic";

async function load(slug: string, id: string) {
    const admin = await getAdminDistrict(slug);
    const code = id.split("-")[0];
    if (!admin || !code || code === "0") return null;
    for (const b of admin.blocks) {
        const gp = b.gps.find((g) => g.code === code);
        if (gp && b.code !== "0") return { admin, block: b, gp };
    }
    return null;
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, gp } = await params;
    const r = await load(slug, gp);
    if (!r) return { title: "Gram panchayat not found", robots: { index: false } };
    const d = districtName(slug) || r.admin.lgdName;
    const rows = await getVillageRows(slug);
    const vs = r.admin.villages.filter((v) => v.g === r.gp.code && v.b === r.block.code);
    const c = sumVillages(vs.map((v) => rows[v.c]));
    return {
        title: [`${r.gp.name} Gram Panchayat, ${r.block.name}, ${d}: Villages & Population`, `${r.gp.name} Gram Panchayat, ${r.block.name}, ${d}`, `${r.gp.name} GP, ${r.block.name}, ${d}`].find((t) => t.length <= 58) || `${r.gp.name} GP, ${r.block.name}`,
        description: `${r.gp.name} gram panchayat in ${r.block.name} block, ${d} district, Odisha: ${vs.length} villages${c ? ` with ${fmt(c.population)} people in Census 2011` : ""} — village list, population, literacy and facilities.`,
        alternates: { canonical: `/district/${slug}/gp/${gpId(r.gp)}` },
    };
}

export default async function GpPage({ params }: Props) {
    const { slug, gp: id } = await params;
    const r = await load(slug, id);
    if (!r) notFound();
    const { admin, block, gp } = r;
    const dName = districtName(slug) || admin.lgdName;
    const villages = admin.villages.filter((v) => v.g === gp.code && v.b === block.code);
    const rows = await getVillageRows(slug);
    const census = sumVillages(villages.map((v) => rows[v.c]));
    const blockCensus = sumVillages(admin.villages.filter((v) => v.b === block.code).map((v) => rows[v.c]));
    const districtRural = await getDistrictRural(slug);
    const amen = summariseAmenities(await getAmenitiesFor(slug, villages.map((v) => v.c)), (a) => !!rows[String(a.code)] && rows[String(a.code)][1] > 0);
    const others = block.gps.filter((g) => g.code !== "0" && g.code !== gp.code);
    const sorted = [...villages].filter((v) => v.c).sort((a, b) => (rows[b.c]?.[1] ?? -1) - (rows[a.c]?.[1] ?? -1));
    const url = `/district/${slug}/gp/${gpId(gp)}`;

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "AdministrativeArea",
                    name: `${gp.name} gram panchayat`,
                    alternateName: gp.odia || undefined,
                    url: `${SITE.url}${url}`,
                    containedInPlace: { "@type": "AdministrativeArea", name: `${block.name} block`, url: `${SITE.url}/district/${slug}/block/${block.slug}` },
                    identifier: { "@type": "PropertyValue", propertyID: "LGD gram panchayat code", value: gp.code },
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: dName, href: `/district/${slug}` }, { name: `${block.name} block`, href: `/district/${slug}/block/${block.slug}` }, { name: gp.name, href: url }]} />
                    <p className="eyebrow mt-6"><Icon name="people" className="h-4 w-4" />Gram panchayat · {block.name} block · {dName}</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{gp.name} gram panchayat</h1>
                    {gp.odia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{gp.odia} ଗ୍ରାମ ପଞ୍ଚାୟତ</p>}
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {gp.name} is a gram panchayat (village council) in {block.name} block of {dName} district, Odisha, covering {villages.length} village{villages.length === 1 ? "" : "s"}
                        {census ? `, home to ${fmt(census.population)} people in ${fmt(census.households)} households at the 2011 census` : ""}.
                    </p>
                    <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
                        {[
                            ["Villages", String(villages.length)],
                            ...(census ? [["Population (2011)", fmt(census.population)], ["Literacy", census.literacyRate != null ? `${census.literacyRate.toFixed(1)}%` : "–"]] : []),
                            ...(amen.land.area > 0 ? [["Area", `${(amen.land.area / 100).toLocaleString("en-IN", { maximumFractionDigits: 1 })} km²`]] : []),
                            ["LGD code", gp.code],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                <dt className="text-xs uppercase tracking-wider text-ink-500">{k}</dt>
                                <dd className="mt-1 font-display text-lg font-semibold">{v}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </header>

            <div className="container-page space-y-14 py-10">
                <section>
                    <h2 className="font-display text-3xl font-semibold">Villages of {gp.name}</h2>
                    <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                        <table className="w-full min-w-[38rem] text-sm">
                            <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500">
                                <tr><th className="px-4 py-2.5">Village</th><th className="px-4 py-2.5 text-right">Households</th><th className="px-4 py-2.5 text-right">Population</th><th className="px-4 py-2.5 text-right">Literacy</th><th className="px-4 py-2.5 text-right">SC</th><th className="px-4 py-2.5 text-right">ST</th></tr>
                            </thead>
                            <tbody className="divide-y divide-sand-100">
                                {sorted.map((v) => {
                                    const c = rows[v.c] ? shapeCensusRow(rows[v.c]) : null;
                                    const p = (x: number) => (c && c.population ? `${((x / c.population) * 100).toFixed(0)}%` : "–");
                                    return (
                                        <tr key={v.c}>
                                            <td className="px-4 py-2">
                                                <Link prefetch={false} href={`/district/${slug}/village/${villageId(v)}`} className="font-semibold text-laterite-600 hover:underline">{v.n}</Link>
                                                {v.o && <span lang="or" className="ml-2 font-odia text-ink-500">{v.o}</span>}
                                                {v.u ? <span className="ml-2 text-xs text-ink-400">uninhabited</span> : null}
                                            </td>
                                            <td className="px-4 py-2 text-right tabular-nums">{c ? fmt(c.households) : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{c ? fmt(c.population) : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{c?.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums text-ink-600">{c ? p(c.sc) : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums text-ink-600">{c ? p(c.st) : "–"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-ink-500">Villages: {ADMIN_SOURCE} (December 2022). Figures: <a href={CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{CENSUS_SOURCE}</a>; a dash means the census figures could not be matched to the village.</p>
                </section>

                {census && census.population > 0 && (
                    <section>
                        <h2 className="font-display text-3xl font-semibold">People and work in {gp.name}</h2>
                        <p className="mt-2 max-w-3xl text-sm text-ink-600">The panchayat&apos;s villages added together.</p>
                        <div className="mt-5">
                            <AreaProfile
                                census={census}
                                compare={blockCensus ? { label: `${block.name} block's villages`, census: blockCensus } : districtRural ? { label: `rural ${dName}`, census: districtRural } : undefined}
                                source={<>Source: <a href={CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{CENSUS_SOURCE}</a>, summed over the panchayat&apos;s villages (2011).</>}
                            />
                        </div>
                    </section>
                )}

                {amen.villages > 0 && <AreaAmenitiesView s={amen} name={gp.name} unit="gram panchayat" />}

                <section>
                    <h2 className="font-display text-2xl font-semibold">Other gram panchayats in {block.name} block</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {others.map((g) => <li key={g.code}><Link prefetch={false} href={`/district/${slug}/gp/${gpId(g)}`} className="chip !bg-white !px-3.5 !py-1.5 !text-sm hover:border-laterite-300">{g.name}</Link></li>)}
                    </ul>
                    <p className="mt-8 text-xs text-ink-500">Panchayat boundaries and village lists change with notifications by the Government of Odisha; check the block office for the current position. Know something about {gp.name}? <a className="underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Local knowledge: ${gp.name} GP, ${block.name}`)}`}>Share it with us</a>.</p>
                </section>
            </div>
        </div>
    );
}
