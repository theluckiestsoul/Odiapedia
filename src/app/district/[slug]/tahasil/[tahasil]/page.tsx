import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import VillageDirectory, { type DirGroup } from "@/components/VillageDirectory";
import { ADMIN_DISTRICTS, ADMIN_SOURCE, getAdminDistrict, subdistrictSlug, villageId } from "@/lib/admin";
import { districtName } from "@/lib/districts";
import AreaProfile from "@/components/AreaProfile";
import { AREA_CENSUS_SOURCE, AREA_CENSUS_SOURCE_URL, getDistrictAreas } from "@/lib/census-areas";

type Props = { params: Promise<{ slug: string; tahasil: string }> };

export async function generateStaticParams() {
    const out: { slug: string; tahasil: string }[] = [];
    for (const d of ADMIN_DISTRICTS) {
        const a = await getAdminDistrict(d);
        a?.subdistricts.forEach((s) => out.push({ slug: d, tahasil: subdistrictSlug(s) }));
    }
    return out;
}

async function load(slug: string, id: string) {
    const admin = await getAdminDistrict(slug);
    const sd = admin?.subdistricts.find((s) => subdistrictSlug(s) === id);
    return admin && sd ? { admin, sd } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, tahasil } = await params;
    const r = await load(slug, tahasil);
    if (!r) return { title: "Not found", robots: { index: false } };
    const d = districtName(slug) || r.admin.lgdName;
    return {
        title: [`${r.sd.name} Sub-district, ${d}: Population & Villages`, `${r.sd.name} Sub-district, ${d}`, `${r.sd.name}, ${d}`].find((t) => t.length <= 58) || `${r.sd.name}, ${d}`,
        description: `${r.sd.name} census sub-district of ${d} district, Odisha: Census 2011 population, literacy and work, its towns, and ${r.sd.villages} villages grouped by block and gram panchayat.`,
        alternates: { canonical: `/district/${slug}/tahasil/${tahasil}` },
    };
}

export default async function TahasilPage({ params }: Props) {
    const { slug, tahasil } = await params;
    const r = await load(slug, tahasil);
    if (!r) notFound();
    const { admin, sd } = r;
    const dName = districtName(slug) || admin.lgdName;
    const villages = admin.villages.filter((v) => v.s === sd.code);
    const blocks = admin.blocks.filter((b) => villages.some((v) => v.b === b.code));
    const areas = getDistrictAreas(slug);
    const ac = areas?.subdistricts.find((x) => x.code === sd.code);
    const towns = (areas?.towns ?? []).filter((t) => t.subdistrict === sd.code);
    const groups: DirGroup[] = [];
    for (const b of blocks) {
        for (const g of b.gps) {
            const vs = villages.filter((v) => v.b === b.code && v.g === g.code);
            if (vs.length) groups.push({ code: `${b.code}-${g.code}`, name: g.code === "0" ? `${b.name}: ${g.name}` : `${g.name} (${b.name})`, odia: g.odia || undefined, villages: vs.map((v) => ({ c: v.c, n: v.n, o: v.o, u: v.u, href: `/district/${slug}/village/${villageId(v)}` })) });
        }
    }

    return (
        <div>
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: dName, href: `/district/${slug}` }, { name: `${sd.name} tahasil`, href: `/district/${slug}/tahasil/${tahasil}` }]} />
                    <p className="eyebrow mt-6"><Icon name="pin" className="h-4 w-4" />Census sub-district · {dName} district</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{sd.name}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {sd.name} is a sub-district of {dName} district, Odisha, with {sd.villages.toLocaleString("en-IN")} villages in the Local Government Directory, spread across {blocks.filter((b) => b.code !== "0").length} block{blocks.length === 1 ? "" : "s"}.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {blocks.filter((b) => b.code !== "0").map((b) => <Link key={b.code} href={`/district/${slug}/block/${b.slug}`} className="chip !bg-white hover:border-laterite-300">{b.name} block</Link>)}
                    </div>
                </div>
            </header>
            {ac?.total && ac.total.population > 0 && (
                <section className="container-page pt-10">
                    <h2 className="font-display text-3xl font-semibold">People of {sd.name}</h2>
                    <p className="mt-2 max-w-3xl text-ink-700">
                        Census 2011 counted {ac.total.population.toLocaleString("en-IN")} people in {sd.name}
                        {ac.urban && ac.urban.population > 0 ? `, ${ac.urban.population.toLocaleString("en-IN")} of them in towns` : ", all in villages"}.
                    </p>
                    <div className="mt-5">
                        <AreaProfile
                            census={ac.total}
                            rural={ac.rural}
                            urban={ac.urban}
                            compare={areas?.total ? { label: `${dName} district`, census: areas.total } : undefined}
                            source={<>Source: <a href={AREA_CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{AREA_CENSUS_SOURCE}</a>.</>}
                        />
                    </div>
                    {towns.length > 0 && (
                        <p className="mt-5 text-sm text-ink-700">
                            Towns: {towns.map((t, i) => <span key={t.code}>{i ? ", " : ""}<Link href={`/district/${slug}/town/${t.slug}`} className="font-semibold text-laterite-600 hover:underline">{t.name}</Link> ({t.kind.toLowerCase()}, {t.census.population.toLocaleString("en-IN")})</span>)}.
                        </p>
                    )}
                </section>
            )}
            <section className="container-page py-10">
                <h2 className="mb-6 font-display text-3xl font-semibold">Villages of {sd.name}</h2>
                <VillageDirectory groups={groups} groupLabel="Gram panchayat" />
                <p className="mt-8 text-xs text-ink-500">Source: {ADMIN_SOURCE}. For Odisha the Directory&apos;s sub-districts are the Census sub-districts (police-station areas), which differ from revenue tahasils.</p>
            </section>
        </div>
    );
}
