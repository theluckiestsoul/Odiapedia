import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { ADMIN_SOURCE, getAdminDistrict, subdistrictSlug, villageId, gpId } from "@/lib/admin";
import { getVillageAmenities } from "@/lib/amenities";
import { VillageAmenitiesView } from "@/components/Amenities";
import { districtName } from "@/lib/districts";
import { SITE } from "@/lib/site";
import { villageGeo } from "@/lib/village-geo";
import { getVillageCensus } from "@/lib/census";
import VillageCensus, { censusSentence } from "@/components/VillageCensus";

type Props = { params: Promise<{ slug: string; village: string }> };

// ~52,000 village pages, rendered per request. They are not built ahead or stored as ISR pages:
// with every village crawlable, storing them would re-write ~52,000 cache entries after each deploy
// (Vercel "ISR writes"). Rendering one is cheap — the district data stays in memory between requests.
export const dynamic = "force-dynamic";

async function load(slug: string, id: string) {
    const admin = await getAdminDistrict(slug);
    const code = id.split("-")[0];
    const v = admin?.villages.find((x) => x.c === code);
    if (!admin || !v) return null;
    const block = admin.blocks.find((b) => b.code === v.b);
    const gp = block?.gps.find((g) => g.code === v.g);
    const sd = admin.subdistricts.find((s) => s.code === v.s);
    const census = await getVillageCensus(slug, v.c);
    const amenities = await getVillageAmenities(slug, v.c);
    return { admin, v, block, gp, sd, census, amenities };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, village } = await params;
    const r = await load(slug, village);
    if (!r) return { title: "Village not found", robots: { index: false } };
    const d = districtName(slug) || r.admin.lgdName;
    return {
        title: `${r.v.n} village, ${r.block && r.block.code !== "0" ? `${r.block.name} block, ` : ""}${d}`,
        description: `${r.v.n} is a village in ${r.gp && r.gp.code !== "0" ? `${r.gp.name} gram panchayat, ` : ""}${r.block && r.block.code !== "0" ? `${r.block.name} block, ` : ""}${d} district, Odisha. ${r.census ? censusSentence(r.v.n, r.census.village) : "Location in the administrative hierarchy and official codes."}`,
        alternates: { canonical: `/district/${slug}/village/${villageId(r.v)}` },
    };
}

export default async function VillagePage({ params }: Props) {
    const { slug, village } = await params;
    const r = await load(slug, village);
    if (!r) notFound();
    const { admin, v, block, gp, sd, census, amenities } = r;
    // Old or misspelt URLs (e.g. after a name correction) go to the current one
    if (village !== villageId(v)) permanentRedirect(`/district/${slug}/village/${villageId(v)}`);
    const dName = districtName(slug) || admin.lgdName;
    const siblings = admin.villages.filter((x) => x.g === v.g && x.b === v.b && x.c !== v.c);
    const hasBlock = block && block.code !== "0";
    const hasGp = gp && gp.code !== "0";
    const crumbs = [
        { name: "Districts", href: "/districts" },
        { name: dName, href: `/district/${slug}` },
        ...(hasBlock ? [{ name: `${block!.name} block`, href: `/district/${slug}/block/${block!.slug}` }] : []),
        { name: v.n, href: `/district/${slug}/village/${villageId(v)}` },
    ];
    const osm = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${v.n}, ${dName}, Odisha`)}`;
    const g = villageGeo(slug, v.c);
    const mapLink = `/map#d=${slug}${hasBlock ? `&b=${block!.code}&v=${v.c}` : ""}`;
    const fills = ["#f7e1d5", "#fbeac4", "#dfe6f4", "#d5ece8", "#efe5d3", "#f1d3c7"];

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Place",
                    name: v.n,
                    alternateName: [v.o, v.on].filter(Boolean),
                    containedInPlace: { "@type": "AdministrativeArea", name: hasBlock ? `${block!.name} block` : `${dName} district` },
                    identifier: { "@type": "PropertyValue", propertyID: "LGD village code", value: v.c },
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={crumbs} />
                    <p className="eyebrow mt-6"><Icon name="pin" className="h-4 w-4" />Village{v.u ? " · uninhabited" : ""}</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{v.n}</h1>
                    {v.o && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{v.o}</p>}
                    {v.on && <p className="mt-2 text-sm text-ink-500">Spelt &ldquo;{v.on}&rdquo; in the Local Government Directory and Census 2011 records.</p>}
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {v.n} is {v.u ? "an uninhabited (revenue) village" : "a village"}
                        {hasGp ? ` in ${gp!.name} gram panchayat` : ""}
                        {hasBlock ? `, ${block!.name} block` : ""}, {dName} district, Odisha.
                    </p>
                </div>
            </header>

            <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div>
                    {census && <VillageCensus name={v.n} census={census.village} districtRural={census.districtRural} districtName={dName} />}

                    {amenities && <VillageAmenitiesView a={amenities} name={v.n} />}

                    {g && (
                        <section className="mb-10">
                            <h2 className="font-display text-2xl font-semibold">Map of {v.n}</h2>
                            <figure className="mt-4 overflow-hidden rounded-2xl border border-sand-200 bg-[#f3eee4]">
                                <svg viewBox={g.view.join(" ")} className="block h-auto w-full" role="img" aria-label={`Boundary of ${v.n} village and its neighbours`}>
                                    {g.around.map((r) => (
                                        <path key={r[0] || `${r[8]}-${r[9]}`} d={r[7]} fill={fills[r[6] % fills.length]} stroke="#a98a5c" strokeWidth={g.view[2] / 900} />
                                    ))}
                                    <path d={g.row[7]} fill="#cf6a43" fillOpacity={0.85} stroke="#5f281a" strokeWidth={g.view[2] / 300} />
                                    {g.nearest.filter((r) => r[10] > g.view[2] / 40 && Math.hypot(r[8] - g.row[8], (r[9] - g.row[9]) * 3) > g.view[2] / 6).map((r) => (
                                        <text key={`t${r[0]}${r[8]}`} x={r[8]} y={r[9]} textAnchor="middle" dominantBaseline="middle" fontSize={g.view[2] / 45} fill="#24365c"
                                            style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: g.view[2] / 250 }}>{r[1]}</text>
                                    ))}
                                    <text x={g.row[8]} y={g.row[9]} textAnchor="middle" dominantBaseline="middle" fontSize={g.view[2] / 32} fontWeight={700} fill="#121c33"
                                        style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: g.view[2] / 200 }}>{v.n}</text>
                                </svg>
                                <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 bg-white px-4 py-3 text-sm">
                                    <span className="text-ink-600">Approximate area: <strong className="text-ink-900">{g.area < 1 ? `${Math.round(g.area * 100)} hectares` : `${g.area.toFixed(1)} km²`}</strong> · measured from the Census 2011 village boundary map</span>
                                    <Link href={mapLink} className="font-semibold text-laterite-600 hover:underline">Open in the interactive map →</Link>
                                </figcaption>
                            </figure>
                            {g.nearest.length > 0 && (
                                <p className="mt-3 text-sm text-ink-600">
                                    Nearby villages:{" "}
                                    {g.nearest.map((r, i) => (
                                        <span key={`n${r[0]}${r[8]}`}>{i > 0 && ", "}{r[0] ? <Link href={`/district/${slug}/village/${r[0]}-${r[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="text-laterite-600 hover:underline">{r[1]}</Link> : r[1]}</span>
                                    ))}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-ink-500">Boundaries: DataMeet, Indian Village Boundaries (Census 2011), © DataMeet contributors, ODbL 1.0 — simplified and indicative only; not a land or revenue record.</p>
                        </section>
                    )}

                    <h2 className="font-display text-2xl font-semibold">Where {v.n} sits</h2>
                    <ol className="mt-5 space-y-2">
                        {[
                            ["State", "Odisha", "/history/odisha-at-a-glance"],
                            ["District", dName, `/district/${slug}`],
                            ...(sd ? [["Sub-district", sd.name, `/district/${slug}/tahasil/${subdistrictSlug(sd)}`]] : []),
                            ...(hasBlock ? [["Block", block!.name, `/district/${slug}/block/${block!.slug}`]] : []),
                            ...(hasGp ? [["Gram panchayat", gp!.name + (gp!.odia ? ` (${gp!.odia})` : ""), `/district/${slug}/gp/${gpId(gp!)}`]] : []),
                            ["Village", v.n, ""],
                        ].map(([k, name, href], i) => (
                            <li key={k} className="flex items-center gap-3" style={{ paddingLeft: `${i * 14}px` }}>
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-laterite-50 text-xs font-semibold text-laterite-600">{i + 1}</span>
                                <span className="text-sm text-ink-500">{k}:</span>
                                {href ? <Link href={href} className="font-semibold text-laterite-600 hover:underline">{name}</Link> : <span className="font-semibold text-ink-900">{name}</span>}
                            </li>
                        ))}
                    </ol>

                    {siblings.length > 0 && (
                        <section className="mt-10">
                            <h2 className="font-display text-2xl font-semibold">Other villages in {hasGp ? <Link href={`/district/${slug}/gp/${gpId(gp!)}`} className="hover:text-laterite-700 hover:underline">{gp!.name} gram panchayat</Link> : "the same area"}</h2>
                            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                                {siblings.map((s) => (
                                    <li key={s.c}><Link href={`/district/${slug}/village/${villageId(s)}`} className="text-sm text-ink-800 hover:text-laterite-700 hover:underline">{s.n}</Link></li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className="mt-10 rounded-3xl border border-sand-200 bg-sand-100 p-6">
                        <h2 className="font-display text-xl font-semibold">Help write {v.n}&apos;s page</h2>
                        <p className="mt-2 text-sm text-ink-700">
                            Every village has a story — its temple and festivals, its history, crafts, notable people and how to get there. If you know {v.n}, send us what you know (with a source or a photo you took). We review every submission before adding it, record where it came from, and label it as community knowledge where needed. Spotted a wrong name, panchayat or boundary? Tell us too.
                        </p>
                        <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Village information: ${v.n}, ${dName}`)}&body=${encodeURIComponent(`Village: ${v.n} (LGD ${v.c})\nBlock: ${hasBlock ? block!.name : ""}\nDistrict: ${dName}\n\nWhat you know (history, temples, festivals, people, how to reach):\n\nSource or how you know it:\n`)}`} className="btn-primary mt-4"><Icon name="mail" className="h-4 w-4" />Share local knowledge</a>
                    </section>
                </div>

                <aside className="space-y-5">
                    <dl className="overflow-hidden rounded-2xl border border-sand-200 bg-white text-sm">
                        {[
                            ["LGD village code", v.c],
                            ...(v.on ? [["Official spelling", v.on]] : []),
                            ["Hierarchy as of", "LGD, December 2022"],
                            ["Status", v.u ? "Uninhabited" : "Inhabited"],
                            ...(census && census.village.population > 0 ? [["Population (2011)", census.village.population.toLocaleString("en-IN")]] : []),
                            ...(amenities && Number(amenities.area) > 0 ? [["Area", `${Number(amenities.area).toLocaleString("en-IN")} hectares`]] : []),
                            ...(amenities?.pin ? [["PIN code", String(amenities.pin)]] : []),
                            ...(amenities?.town ? [["Nearest town", `${amenities.town}, ${amenities.townKm} km`]] : []),
                            ["Gram panchayat", hasGp ? gp!.name : "Not mapped"],
                            ["Block", hasBlock ? block!.name : "Not mapped"],
                            ["Sub-district", sd?.name || ""],
                            ["District", dName],
                        ].filter(([, x]) => x).map(([k, x]) => (
                            <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 border-b border-sand-100 px-5 py-3 last:border-0">
                                <dt className="text-ink-500">{k}</dt>
                                <dd className="text-ink-900">{x}</dd>
                            </div>
                        ))}
                    </dl>
                    <a href={osm} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full"><Icon name="map" className="h-4 w-4" />Find on OpenStreetMap <Icon name="external" className="h-3.5 w-3.5" /></a>
                    <p className="text-xs leading-relaxed text-ink-500">Source: {ADMIN_SOURCE}. Names follow the official English spelling; local spellings may differ.</p>
                </aside>
            </div>
        </div>
    );
}
