import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import VillageDirectory, { type DirGroup } from "@/components/VillageDirectory";
import { ADMIN_DISTRICTS, ADMIN_SOURCE, getAdminDistrict, subdistrictSlug, villageId, gpId } from "@/lib/admin";
import AreaProfile from "@/components/AreaProfile";
import { AreaAmenitiesView } from "@/components/Amenities";
import { getAmenitiesFor, summariseAmenities, getTownDirectory } from "@/lib/amenities";
import { getDistrictAreas } from "@/lib/census-areas";
import { acForGp } from "@/lib/elections";
import { getDistrictById } from "@/data/districts";
import { districtName } from "@/lib/districts";
import { SITE } from "@/lib/site";
import { CENSUS_SOURCE, CENSUS_SOURCE_URL, getDistrictPopulations, getVillageRows, getDistrictRural, sumVillages } from "@/lib/census";

type Props = { params: Promise<{ slug: string; block: string }> };

export async function generateStaticParams() {
    const out: { slug: string; block: string }[] = [];
    for (const d of ADMIN_DISTRICTS) {
        const a = await getAdminDistrict(d);
        a?.blocks.filter((b) => b.code !== "0").forEach((b) => out.push({ slug: d, block: b.slug }));
    }
    return out;
}

async function load(slug: string, blockSlug: string) {
    const admin = await getAdminDistrict(slug);
    const block = admin?.blocks.find((b) => b.slug === blockSlug && b.code !== "0");
    return admin && block ? { admin, block } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, block } = await params;
    const r = await load(slug, block);
    if (!r) return { title: "Block not found", robots: { index: false } };
    const d = districtName(slug) || r.admin.lgdName;
    const gps = r.block.gps.filter((g) => g.code !== "0").length;
    return {
        title: [`${r.block.name} Block, ${d}: Panchayats, Villages & Population`, `${r.block.name} Block, ${d}: Villages & Population`, `${r.block.name} Block, ${d}`].find((t) => t.length <= 58),
        description: `${r.block.name} block in ${d} district, Odisha: ${gps} gram panchayats and ${r.block.villages} villages — population, literacy, schools, health centres and the full list of panchayats and villages.`,
        alternates: { canonical: `/district/${slug}/block/${block}` },
    };
}

export default async function BlockPage({ params }: Props) {
    const { slug, block: blockSlug } = await params;
    const r = await load(slug, blockSlug);
    if (!r) notFound();
    const { admin, block } = r;
    const dist = getDistrictById(slug);
    const dName = districtName(slug) || dist?.name_en || admin.lgdName;
    const villages = admin.villages.filter((v) => v.b === block.code);
    const gps = block.gps.filter((g) => g.code !== "0");
    const groups: DirGroup[] = block.gps.map((g) => ({
        code: g.code,
        name: g.name,
        odia: g.odia || undefined,
        villages: villages.filter((v) => v.g === g.code).map((v) => ({ c: v.c, n: v.n, o: v.o, u: v.u, href: `/district/${slug}/village/${villageId(v)}` })),
    }));
    const subdistricts = admin.subdistricts.filter((s) => block.subdistricts.includes(s.code));
    const uninhabited = villages.filter((v) => v.u).length;
    const others = admin.blocks.filter((b) => b.code !== "0" && b.code !== block.code);
    const pops = await getDistrictPopulations(slug);
    const counted = villages.filter((v) => pops.has(v.c));
    const ruralPop = counted.reduce((t, v) => t + (pops.get(v.c) || 0), 0);
    const rows = await getVillageRows(slug);
    const census = sumVillages(villages.map((v) => rows[v.c]));
    const districtRural = await getDistrictRural(slug);
    const amen = summariseAmenities(await getAmenitiesFor(slug, villages.map((v) => v.c)), (a) => !!rows[String(a.code)] && rows[String(a.code)][1] > 0);
    const gpStats = gps.map((g) => {
        const vs = villages.filter((v) => v.g === g.code);
        return { g, n: vs.length, c: sumVillages(vs.map((v) => rows[v.c])) };
    });
    const blockAcs = [...new Map(gps.map((g) => acForGp(slug, block.code, g.code)).filter((x) => !!x).map((x) => [x!.no, x!])).values()];
    const norm = (x: string) => x.toLowerCase().replace(/[^a-z]/g, "");
    const towns = (getDistrictAreas(slug)?.towns ?? []).filter((t) => norm(getTownDirectory(t.code)?.block || "") === norm(block.name));
    const largest = [...counted].sort((a, b) => (pops.get(b.c) || 0) - (pops.get(a.c) || 0)).slice(0, 10);

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "AdministrativeArea",
                    name: `${block.name} block`,
                    url: `${SITE.url}/district/${slug}/block/${blockSlug}`,
                    containedInPlace: { "@type": "AdministrativeArea", name: `${dName} district`, url: `${SITE.url}/district/${slug}` },
                    identifier: { "@type": "PropertyValue", propertyID: "LGD block code", value: block.code },
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: dName, href: `/district/${slug}` }, { name: `${block.name} block`, href: `/district/${slug}/block/${blockSlug}` }]} />
                    <p className="eyebrow mt-6"><Icon name="list" className="h-4 w-4" />Community development block · {dName} district</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{block.name} block</h1>
                    <Link href={`/map#d=${slug}&b=${block.code}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-laterite-600 hover:underline"><Icon name="map" className="h-4 w-4" />See {block.name} and its villages on the map</Link>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {block.name} is a community development block of {dName} district, Odisha, with {gps.length} gram panchayats and {block.villages.toLocaleString("en-IN")} villages
                        {uninhabited ? ` (${uninhabited} of them uninhabited)` : ""}, as listed in the Government of India&apos;s Local Government Directory.
                    </p>
                    <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-5">
                        {[
                            ["Gram panchayats", gps.length.toLocaleString("en-IN")],
                            ["Villages", block.villages.toLocaleString("en-IN")],
                            ...(ruralPop > 0 ? [["Village population (2011)", ruralPop.toLocaleString("en-IN")]] : []),
                            ["Sub-districts covered", String(subdistricts.length)],
                            ["LGD block code", block.code],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                <dt className="text-xs uppercase tracking-wider text-ink-500">{k}</dt>
                                <dd className="mt-1 font-display text-lg font-semibold">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    {blockAcs.length > 0 && (
                        <p className="mt-5 text-sm text-ink-600">
                            Assembly constituenc{blockAcs.length > 1 ? "ies" : "y"}: {blockAcs.map((a, i) => <span key={a.no}>{i ? ", " : ""}<Link href={`/elections/assembly/${a.slug}`} className="text-laterite-600 hover:underline">{a.name}</Link></span>)}
                        </p>
                    )}
                    {subdistricts.length > 0 && (
                        <p className="mt-2 text-sm text-ink-600">
                            Sub-districts: {subdistricts.map((s, i) => (
                                <span key={s.code}>{i ? ", " : ""}<Link href={`/district/${slug}/tahasil/${subdistrictSlug(s)}`} className="text-laterite-600 hover:underline">{s.name}</Link></span>
                            ))}
                        </p>
                    )}
                </div>
            </header>

            {census && census.population > 0 && (
                <section className="container-page pt-10">
                    <h2 className="font-display text-3xl font-semibold">People and work in {block.name} block</h2>
                    <p className="mt-2 max-w-3xl text-sm text-ink-600">The block&apos;s villages added together (towns are counted separately by the census).</p>
                    <div className="mt-5">
                        <AreaProfile
                            census={census}
                            compare={districtRural ? { label: `rural ${dName}`, census: districtRural } : undefined}
                            source={<>Source: <a href={CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{CENSUS_SOURCE}</a>, summed over the block&apos;s villages (2011).</>}
                        />
                    </div>
                </section>
            )}

            <section className="container-page pt-12">
                <h2 className="font-display text-3xl font-semibold">Gram panchayats of {block.name}</h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                    <table className="w-full min-w-[34rem] text-sm">
                        <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500">
                            <tr><th className="px-4 py-2.5">Gram panchayat</th><th className="px-4 py-2.5 text-right">Villages</th><th className="px-4 py-2.5 text-right">Population (2011)</th><th className="px-4 py-2.5 text-right">Literacy</th></tr>
                        </thead>
                        <tbody className="divide-y divide-sand-100">
                            {gpStats.map(({ g, n, c }) => (
                                <tr key={g.code}>
                                    <td className="px-4 py-2"><Link prefetch={false} href={`/district/${slug}/gp/${gpId(g)}`} className="font-semibold text-laterite-600 hover:underline">{g.name}</Link>{g.odia && <span lang="or" className="ml-2 font-odia text-ink-500">{g.odia}</span>}</td>
                                    <td className="px-4 py-2 text-right tabular-nums">{n}</td>
                                    <td className="px-4 py-2 text-right tabular-nums">{c ? c.population.toLocaleString("en-IN") : "–"}</td>
                                    <td className="px-4 py-2 text-right tabular-nums">{c?.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {towns.length > 0 && (
                <section className="container-page pt-12">
                    <h2 className="font-display text-2xl font-semibold">Towns in {block.name} block</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {towns.map((t) => <li key={t.code}><Link href={`/district/${slug}/town/${t.slug}`} className="chip !bg-white !px-3.5 !py-1.5 !text-sm hover:border-laterite-300">{t.name} <span className="text-ink-400">· {t.kind} · {t.census.population.toLocaleString("en-IN")}</span></Link></li>)}
                    </ul>
                    <p className="mt-2 text-xs text-ink-500">Towns placed in this block by the Census 2011 Town Directory.</p>
                </section>
            )}

            {amen.villages > 0 && (
                <div className="container-page pt-12">
                    <AreaAmenitiesView s={amen} name={block.name} unit="block" />
                </div>
            )}

            {largest.length > 0 && (
                <section className="container-page pt-10">
                    <h2 className="font-display text-2xl font-semibold">Largest villages in {block.name} by population</h2>
                    <ol className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                        {largest.map((v, i) => (
                            <li key={v.c} className="flex items-baseline gap-3 border-b border-sand-100 py-1.5 text-sm">
                                <span className="w-5 text-right tabular-nums text-ink-500">{i + 1}</span>
                                <Link prefetch={false} href={`/district/${slug}/village/${villageId(v)}`} className="font-semibold text-laterite-600 hover:underline">{v.n}</Link>
                                <span className="ml-auto tabular-nums text-ink-800">{(pops.get(v.c) || 0).toLocaleString("en-IN")}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-2 text-xs text-ink-500">Source: {CENSUS_SOURCE}. Village population only; towns in the block are counted separately by the census.</p>
                </section>
            )}

            <section className="container-page py-10">
                <h2 className="mb-6 font-display text-3xl font-semibold">Gram panchayats and villages of {block.name}</h2>
                <VillageDirectory groups={groups} groupLabel="Gram panchayat" />
            </section>

            <section className="container-page pb-14">
                <h2 className="font-display text-2xl font-semibold">Other blocks in {dName}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                    {others.map((b) => <li key={b.code}><Link href={`/district/${slug}/block/${b.slug}`} className="chip !bg-white !px-3.5 !py-1.5 !text-sm hover:border-laterite-300">{b.name}</Link></li>)}
                </ul>
                <p className="mt-8 text-xs text-ink-500">Source: {ADMIN_SOURCE}. Know something about a village here — its history, temples, festivals or people? <a className="underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Local knowledge: ${block.name} block`)}`}>Share it with us</a>.</p>
            </section>
        </div>
    );
}
