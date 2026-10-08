import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import AreaProfile from "@/components/AreaProfile";
import { TownDirectoryView } from "@/components/Amenities";
import { ADMIN_DISTRICTS, getAdminDistrict, subdistrictSlug } from "@/lib/admin";
import { districtName } from "@/lib/districts";
import { SITE } from "@/lib/site";
import { AREA_CENSUS_SOURCE, AREA_CENSUS_SOURCE_URL, getDistrictAreas, getTown } from "@/lib/census-areas";
import { getTownDirectory } from "@/lib/amenities";

type Props = { params: Promise<{ slug: string; town: string }> };

export function generateStaticParams() {
    return ADMIN_DISTRICTS.flatMap((d) => (getDistrictAreas(d)?.towns ?? []).map((t) => ({ slug: d, town: t.slug })));
}

const fmt = (n: number) => n.toLocaleString("en-IN");

const KIND_NOTE: Record<string, string> = {
    "Municipal Corporation": "a municipal corporation — the largest form of urban local government in Odisha",
    Municipality: "a municipality, governed by an elected municipal council",
    "Notified Area Council": "a notified area council (NAC), the urban local body for smaller towns in Odisha",
    "Industrial township": "an industrial township, administered by the industrial undertaking rather than an elected council",
    "Census town": "a census town: a place the census counts as urban (5,000+ people, at least three-quarters of male main workers outside farming, 400+ people per km²) but which has no municipal body and is governed as part of a gram panchayat",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, town } = await params;
    const t = getTown(slug, town);
    if (!t) return { title: "Town not found", robots: { index: false } };
    const d = districtName(slug) || slug;
    return {
        title: (getDistrictAreas(slug)!.towns.filter((x) => x.name === t.name).length > 1
            ? [`${t.name} (${t.kind}), ${d}: Population & Facilities`, `${t.name} (${t.kind}), ${d}`]
            : [`${t.name}, ${d}: Population, Literacy & Facilities`, `${t.name}, ${d}: Population & Facilities`, `${t.name} Town, ${d}`]
        ).find((x) => x.length <= 58) || `${t.name}, ${d}`,
        description: `${t.name} is a ${t.kind.toLowerCase()} in ${d} district, Odisha, with ${fmt(t.census.population)} people in Census 2011${t.census.literacyRate != null ? ` and a literacy rate of ${t.census.literacyRate.toFixed(1)}%` : ""} — population history, schools, hospitals and banks from the census town directory.`,
        alternates: { canonical: `/district/${slug}/town/${t.slug}` },
    };
}

export default async function TownPage({ params }: Props) {
    const { slug, town } = await params;
    const t = getTown(slug, town);
    if (!t) notFound();
    const areas = getDistrictAreas(slug)!;
    const admin = await getAdminDistrict(slug);
    const dName = districtName(slug) || admin?.lgdName || slug;
    const ulb = admin?.ulbs.find((u) => u.census2011 === t.code);
    const sd = admin?.subdistricts.find((s) => s.code === t.subdistrict);
    const dir = getTownDirectory(t.code);
    const c = t.census;
    const others = areas.towns.filter((x) => x.code !== t.code);
    const url = `/district/${slug}/town/${t.slug}`;
    const prev = dir?.history.length ? dir.history[dir.history.length - 1] : null;
    const growth = prev && prev[0] === 2001 && prev[1] > 0 ? ((c.population - prev[1]) / prev[1]) * 100 : null;

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": t.kind === "Census town" ? "Place" : "City",
                    name: t.name,
                    url: `${SITE.url}${url}`,
                    containedInPlace: { "@type": "AdministrativeArea", name: `${dName} district`, url: `${SITE.url}/district/${slug}` },
                    identifier: [
                        { "@type": "PropertyValue", propertyID: "Census 2011 town code", value: t.code },
                        ...(ulb ? [{ "@type": "PropertyValue", propertyID: "LGD urban local body code", value: ulb.code }] : []),
                    ],
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: dName, href: `/district/${slug}` }, { name: t.name, href: url }]} />
                    <p className="eyebrow mt-6"><Icon name="pin" className="h-4 w-4" />{t.kind} · {dName} district</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{t.name}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {t.name} is {KIND_NOTE[t.kind] || `a town (${t.kind})`}, in {dName} district, Odisha. Census 2011 counted {fmt(c.population)} people in {fmt(c.households)} households
                        {growth != null ? `, ${growth >= 0 ? "up" : "down"} ${Math.abs(growth).toFixed(1)}% from ${fmt(prev![1])} in 2001` : ""}.
                    </p>
                    <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
                        {[
                            ["Population (2011)", fmt(c.population)],
                            ["Literacy", c.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–"],
                            ...(dir?.area ? [["Area", `${dir.area} km²`]] : []),
                            ...(t.wards ? [["Wards (2011)", String(t.wards)]] : []),
                            ...(sd ? [["Sub-district", sd.name]] : []),
                            ...(ulb ? [["LGD body code", ulb.code]] : [["Census town code", t.code]]),
                        ].slice(0, 6).map(([k, v]) => (
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
                    <h2 className="font-display text-3xl font-semibold">People and work in {t.name}</h2>
                    <div className="mt-5">
                        <AreaProfile
                            census={c}
                            compare={areas.urban ? { label: `urban ${dName}`, census: areas.urban } : undefined}
                            areaKm2={dir?.area || undefined}
                            source={<>Source: <a href={AREA_CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{AREA_CENSUS_SOURCE}</a>.</>}
                        />
                    </div>
                    {t.withOutgrowths && (
                        <p className="mt-4 max-w-3xl text-sm text-ink-700">
                            Including its outgrowths — built-up areas next to the town that the census counts with it — {t.name} had {fmt(t.withOutgrowths.population)} people in 2011.
                        </p>
                    )}
                </section>

                {dir && <TownDirectoryView t={dir} name={t.name} population2011={c.population} />}

                <section>
                    <h2 className="font-display text-2xl font-semibold">Other towns in {dName}</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {others.map((x) => <li key={x.code}><Link href={`/district/${slug}/town/${x.slug}`} className="chip !bg-white !px-3.5 !py-1.5 !text-sm hover:border-laterite-300">{x.name}</Link></li>)}
                    </ul>
                    {sd && <p className="mt-6 text-sm text-ink-600">See also: <Link href={`/district/${slug}/tahasil/${subdistrictSlug(sd)}`} className="text-laterite-600 hover:underline">{sd.name} sub-district</Link> · <Link href={`/district/${slug}#population`} className="text-laterite-600 hover:underline">People of {dName} district</Link></p>}
                    <p className="mt-6 text-xs text-ink-500">
                        Town status is as of the 2011 census{ulb ? `; the Local Government Directory lists ${t.name} as a ${ulb.type.toLowerCase()} (December 2022)` : ""}. Know the town&apos;s history, landmarks or festivals? <a className="underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Local knowledge: ${t.name}, ${dName}`)}`}>Share it with us</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
