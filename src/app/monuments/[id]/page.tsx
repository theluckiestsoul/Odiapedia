import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { districtName } from "@/lib/districts";
import { villageId } from "@/lib/admin";
import { MONUMENTS, MONUMENT_SOURCE, MONUMENT_SOURCE_URL, monumentTitle, monumentsNear, nearestStations } from "@/lib/geo-data";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
    return MONUMENTS.map((m) => ({ id: m.id }));
}

const get = (id: string) => MONUMENTS.find((m) => m.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const m = get((await params).id);
    if (!m) return { title: "Monument not found", robots: { index: false } };
    const d = districtName(m.district) || m.districtName;
    const t = monumentTitle(m);
    return {
        title: [`${t} (${d}) – ASI Protected Monument`, `${t}, ${d}`, `${t.slice(0, 50).replace(/\s+\S*$/, "")}…, ${d}`].find((x) => x.length <= 58) || t.slice(0, 55),
        description: `${m.description} — a Monument of National Importance (${m.number}) protected by the Archaeological Survey of India at ${m.location}, ${d} district, Odisha. Location, map and how to get there.`.slice(0, 300),
        alternates: { canonical: `/monuments/${m.id}` },
    };
}

export default async function MonumentPage({ params }: Props) {
    const m = get((await params).id);
    if (!m) notFound();
    const d = districtName(m.district) || m.districtName;
    const title = monumentTitle(m);
    const has = m.lat != null && m.lon != null;
    const stations = has ? nearestStations(m.lat!, m.lon!, 3) : [];
    const near = has ? monumentsNear(m.lat!, m.lon!, 15).filter((x) => x.id !== m.id).slice(0, 8) : [];
    const sameDistrict = MONUMENTS.filter((x) => x.district === m.district && x.id !== m.id && !near.some((n) => n.id === x.id));
    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": ["LandmarksOrHistoricalBuildings", "TouristAttraction"],
                    name: title,
                    description: m.description,
                    url: `${SITE.url}/monuments/${m.id}`,
                    address: { "@type": "PostalAddress", addressLocality: m.location, addressRegion: "Odisha", addressCountry: "IN" },
                    ...(has ? { geo: { "@type": "GeoCoordinates", latitude: m.lat, longitude: m.lon } } : {}),
                    containedInPlace: { "@type": "AdministrativeArea", name: `${d} district`, url: `${SITE.url}/district/${m.district}` },
                    identifier: { "@type": "PropertyValue", propertyID: "ASI monument number", value: m.number },
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Monuments", href: "/monuments" }, { name: title, href: `/monuments/${m.id}` }]} />
                    <p className="eyebrow mt-6"><Icon name="temple" className="h-4 w-4" />Monument of National Importance · {m.number}</p>
                    <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold md:text-5xl">{title}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        Protected by the Archaeological Survey of India (ASI) at {m.location}, <Link href={`/district/${m.district}`} className="text-laterite-600 hover:underline">{d} district</Link>, Odisha.
                    </p>
                </div>
            </header>
            <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-10">
                    <section>
                        <h2 className="font-display text-2xl font-semibold">What is protected</h2>
                        <p className="mt-3 text-lg leading-relaxed text-ink-800">{m.description}</p>
                        <p className="mt-3 text-sm text-ink-600">This is the description in the ASI&apos;s list of protected monuments. Monuments of National Importance are protected under the Ancient Monuments and Archaeological Sites and Remains Act, 1958: building and mining are restricted within 100 metres, and within 300 metres only with permission.</p>
                    </section>
                    {stations.length > 0 && (
                        <section>
                            <h2 className="font-display text-2xl font-semibold">Getting there</h2>
                            <ul className="mt-3 space-y-2 text-sm">
                                {stations.map((s) => (
                                    <li key={`${s.name}${s.lat}`} className="flex flex-wrap items-baseline gap-x-3">
                                        <span className="font-semibold text-ink-900">{s.name}{s.code ? ` (${s.code})` : ""}</span>
                                        <span className="text-ink-600">{s.halt ? "halt" : "railway station"}, about {s.km.toFixed(0)} km away in a straight line</span>
                                        <a className="text-xs font-semibold text-laterite-600 hover:underline" target="_blank" rel="noopener noreferrer nofollow" href={`https://www.google.com/maps/dir/?api=1&origin=${s.lat},${s.lon}&destination=${m.lat},${m.lon}`}>Directions ↗</a>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 text-xs text-ink-500">Stations: OpenStreetMap. Road distances are longer than straight-line ones.</p>
                        </section>
                    )}
                    {near.length > 0 && (
                        <section>
                            <h2 className="font-display text-2xl font-semibold">Other protected monuments within 15 km</h2>
                            <ul className="mt-3 space-y-1.5 text-sm">
                                {near.map((x) => <li key={x.id}><Link href={`/monuments/${x.id}`} className="font-semibold text-laterite-600 hover:underline">{monumentTitle(x)}</Link> <span className="text-ink-500">· {x.km.toFixed(1)} km</span></li>)}
                            </ul>
                        </section>
                    )}
                    {sameDistrict.length > 0 && (
                        <section>
                            <h2 className="font-display text-2xl font-semibold">More protected monuments in {d}</h2>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {sameDistrict.map((x) => <li key={x.id}><Link href={`/monuments/${x.id}`} className="chip !bg-white !px-3.5 !py-1.5 !text-sm hover:border-laterite-300">{monumentTitle(x)}</Link></li>)}
                            </ul>
                        </section>
                    )}
                </div>
                <aside className="space-y-4">
                    <dl className="overflow-hidden rounded-2xl border border-sand-200 bg-white text-sm">
                        {[
                            ["ASI number", m.number],
                            ["Location", m.location],
                            ["Address", m.address],
                            ["District", d],
                            ["Coordinates", has ? `${m.lat!.toFixed(4)}°N, ${m.lon!.toFixed(4)}°E` : "Not recorded"],
                        ].filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 border-b border-sand-100 px-5 py-3 last:border-0">
                                <dt className="text-ink-500">{k}</dt>
                                <dd className="text-ink-900">{v}</dd>
                            </div>
                        ))}
                        {m.village && (
                            <div className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3">
                                <dt className="text-ink-500">Village</dt>
                                <dd><Link href={`/district/${m.district}/village/${villageId({ c: m.village.code, n: m.village.name })}`} className="text-laterite-600 hover:underline">{m.village.name}</Link></dd>
                            </div>
                        )}
                    </dl>
                    {has && <a href={`https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lon}`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full"><Icon name="map" className="h-4 w-4" />Open in Google Maps</a>}
                    {m.commons && <a href={`https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(m.commons.replace(/ /g, "_"))}`} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">Photos on Wikimedia Commons ↗</a>}
                    <p className="text-xs leading-relaxed text-ink-500">Source: {MONUMENT_SOURCE} (<a href={MONUMENT_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">list</a>). Check visiting hours and any entry fee with the ASI Bhubaneswar Circle before you go.</p>
                </aside>
            </div>
        </div>
    );
}
