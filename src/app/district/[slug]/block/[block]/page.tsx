import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import VillageDirectory, { type DirGroup } from "@/components/VillageDirectory";
import { ADMIN_DISTRICTS, ADMIN_SOURCE, getAdminDistrict, subdistrictSlug, villageId } from "@/lib/admin";
import { getDistrictById } from "@/data/districts";
import { districtName } from "@/lib/districts";
import { SITE } from "@/lib/site";

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
        title: `${r.block.name} Block, ${d}: Villages & Panchayats`,
        description: `${r.block.name} community development block in ${d} district, Odisha: ${gps} gram panchayats and ${r.block.villages} villages, with the full list of panchayats and villages from the Local Government Directory.`,
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
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {block.name} is a community development block of {dName} district, Odisha, with {gps.length} gram panchayats and {block.villages.toLocaleString("en-IN")} villages
                        {uninhabited ? ` (${uninhabited} of them uninhabited)` : ""}, as listed in the Government of India&apos;s Local Government Directory.
                    </p>
                    <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
                        {[
                            ["Gram panchayats", gps.length.toLocaleString("en-IN")],
                            ["Villages", block.villages.toLocaleString("en-IN")],
                            ["Tahasils covered", String(subdistricts.length)],
                            ["LGD block code", block.code],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                <dt className="text-xs uppercase tracking-wider text-ink-500">{k}</dt>
                                <dd className="mt-1 font-display text-lg font-semibold">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    {subdistricts.length > 0 && (
                        <p className="mt-5 text-sm text-ink-600">
                            Tahasils: {subdistricts.map((s, i) => (
                                <span key={s.code}>{i ? ", " : ""}<Link href={`/district/${slug}/tahasil/${subdistrictSlug(s)}`} className="text-laterite-600 hover:underline">{s.name}</Link></span>
                            ))}
                        </p>
                    )}
                </div>
            </header>

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
