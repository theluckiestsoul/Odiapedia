import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { ADMIN_SOURCE, getAdminDistrict, subdistrictSlug, villageId } from "@/lib/admin";
import { districtName } from "@/lib/districts";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string; village: string }> };

// ~52,000 village pages: generated on first request and then cached, instead of at build time.
export const dynamicParams = true;
export async function generateStaticParams() {
    return [];
}

async function load(slug: string, id: string) {
    const admin = await getAdminDistrict(slug);
    const code = id.split("-")[0];
    const v = admin?.villages.find((x) => x.c === code);
    if (!admin || !v) return null;
    const block = admin.blocks.find((b) => b.code === v.b);
    const gp = block?.gps.find((g) => g.code === v.g);
    const sd = admin.subdistricts.find((s) => s.code === v.s);
    return { admin, v, block, gp, sd };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, village } = await params;
    const r = await load(slug, village);
    if (!r) return { title: "Village not found", robots: { index: false } };
    const d = districtName(slug) || r.admin.lgdName;
    return {
        title: `${r.v.n} village, ${r.block && r.block.code !== "0" ? `${r.block.name} block, ` : ""}${d}`,
        description: `${r.v.n} is a village in ${r.gp && r.gp.code !== "0" ? `${r.gp.name} gram panchayat, ` : ""}${r.block && r.block.code !== "0" ? `${r.block.name} block, ` : ""}${d} district, Odisha. Location in the administrative hierarchy and official codes.`,
        alternates: { canonical: `/district/${slug}/village/${villageId(r.v)}` },
        // Pages with only directory data are kept out of search results until they have real content.
        robots: { index: false, follow: true },
    };
}

export default async function VillagePage({ params }: Props) {
    const { slug, village } = await params;
    const r = await load(slug, village);
    if (!r) notFound();
    const { admin, v, block, gp, sd } = r;
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

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Place",
                    name: v.n,
                    alternateName: v.o,
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
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {v.n} is {v.u ? "an uninhabited (revenue) village" : "a village"}
                        {hasGp ? ` in ${gp!.name} gram panchayat` : ""}
                        {hasBlock ? `, ${block!.name} block` : ""}, {dName} district, Odisha.
                    </p>
                </div>
            </header>

            <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div>
                    <h2 className="font-display text-2xl font-semibold">Where {v.n} sits</h2>
                    <ol className="mt-5 space-y-2">
                        {[
                            ["State", "Odisha", "/history/odisha-at-a-glance"],
                            ["District", dName, `/district/${slug}`],
                            ...(sd ? [["Sub-district", sd.name, `/district/${slug}/tahasil/${subdistrictSlug(sd)}`]] : []),
                            ...(hasBlock ? [["Block", block!.name, `/district/${slug}/block/${block!.slug}`]] : []),
                            ...(hasGp ? [["Gram panchayat", gp!.name + (gp!.odia ? ` (${gp!.odia})` : ""), hasBlock ? `/district/${slug}/block/${block!.slug}` : ""]] : []),
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
                            <h2 className="font-display text-2xl font-semibold">Other villages in {hasGp ? `${gp!.name} gram panchayat` : "the same area"}</h2>
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
                            Every village has a story — its temple and festivals, its history, crafts, notable people and how to get there. If you know {v.n}, send us what you know (with a source or a photo you took) and we&apos;ll add it, labelled as community knowledge where needed.
                        </p>
                        <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Village information: ${v.n}, ${dName}`)}&body=${encodeURIComponent(`Village: ${v.n} (LGD ${v.c})\nBlock: ${hasBlock ? block!.name : ""}\nDistrict: ${dName}\n\nWhat you know (history, temples, festivals, people, how to reach):\n\nSource or how you know it:\n`)}`} className="btn-primary mt-4"><Icon name="mail" className="h-4 w-4" />Share local knowledge</a>
                    </section>
                </div>

                <aside className="space-y-5">
                    <dl className="overflow-hidden rounded-2xl border border-sand-200 bg-white text-sm">
                        {[
                            ["LGD village code", v.c],
                            ["Status", v.u ? "Uninhabited" : "Inhabited"],
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
