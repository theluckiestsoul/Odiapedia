import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { getDistrictById } from "@/data/districts";
import { getBlocksByDistrictId } from "@/data/blocks";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "../../../../mdx-components";
import Link from "next/link";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";
import remarkGfm from "remark-gfm";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import ArticleCard from "@/components/ArticleCard";
import { ChariotWheel } from "@/components/Motifs";
import { getAllArticlesMetadata } from "@/lib/mdx";
import { SITE } from "@/lib/site";

interface PageProps {
    params: Promise<{ slug: string }>;
}


export async function generateStaticParams() {
    const slugs = getAllDistrictSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const district = getDistrictBySlug(slug);

    if (!district) {
        return { title: "District not found", robots: { index: false } };
    }

    const isOdia = slug.endsWith("-od");
    const base = slug.replace(/-od$/, "");
    const data = getDistrictById(base);
    const nameEn = data?.name_en || district.title;
    const title = isOdia ? `${district.title} ଜିଲ୍ଲା – ${nameEn} District, Odisha (ଓଡ଼ିଆ)` : `${district.title} District, Odisha: Places, History & Facts`;
    const description =
        district.description ||
        `${nameEn} district of Odisha: headquarters, population, places to visit, history, food and administrative blocks.`;
    const hasOdia = getAllDistrictSlugs().includes(`${base}-od`);

    return {
        title,
        description,
        alternates: {
            canonical: `/district/${slug}`,
            ...(hasOdia
                ? { languages: { en: `${SITE.url}/district/${base}`, or: `${SITE.url}/district/${base}-od`, "x-default": `${SITE.url}/district/${base}` } }
                : {}),
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: `${SITE.url}/district/${slug}`,
            locale: isOdia ? "or_IN" : "en_IN",
        },
    };
}

function TehsilList({ districtSlug }: { districtSlug: string }) {
    const tehsils = getAllTehsilsForDistrict(districtSlug);
    const blocks = getBlocksByDistrictId(districtSlug);

    // Check if we have any administrative content
    if (tehsils.length === 0 && blocks.length === 0) {
        return (
            <div className="py-2 text-sm italic text-ink-500">
                Administrative details are being added.
            </div>
        );
    }

    return (
        <div className="contents">
            {/* MDX Tehsils (Rich Content) */}
            {tehsils.map((tehsil) => (
                <Link
                    key={tehsil.slug}
                    href={`/district/${districtSlug}/${tehsil.slug}`}
                    className="group block rounded-xl border border-sand-200 bg-white p-3 transition-colors hover:border-laterite-300"
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-ink-900 group-hover:text-laterite-700">{tehsil.title}</span>
                        <span className="text-laterite-500 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-ink-500">Tehsil</div>
                </Link>
            ))}

            {/* Data Blocks (Data Only) */}
            {blocks.map((block) => {
                return (
                    <div
                        key={block.id}
                        className="rounded-xl border border-sand-200 bg-sand-50 p-3"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-ink-800">{block.name_en}</span>
                        </div>
                        <div lang="or" className="font-odia text-xs text-ink-500">{block.name_od}</div>
                        <div className="flex gap-2 text-xs uppercase tracking-wider text-ink-400">
                            <span>Block</span>
                            <span>•</span>
                            <span>{block.gps_count} GPs</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default async function DistrictPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch from both sources
    const districtContent = getDistrictBySlug(slug); // MDX Content
    const baseSlug = slug.replace(/-od$/, "");
    const isOdia = slug !== baseSlug;
    const districtData = getDistrictById(baseSlug);  // Map Data

    if (!districtContent) {
        notFound();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const components = useMDXComponents({});
    const body = districtContent.content.replace(/^\s*#\s+[^\n]+\n+/, "");

    // Related Odiapedia articles that mention this district (internal linking)
    const nameEn = districtData?.name_en || districtContent.title;
    const escaped = nameEn.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
    const nameRe = new RegExp("\\b" + escaped + "\\b", "i");
    const related = isOdia
        ? []
        : getAllArticlesMetadata()
              .filter((a) => (!a.lang || a.lang === "en") && !a.noindex && a.category !== "about")
              .filter((a) => a.facts.some((f) => /district|location|region|where/i.test(f.label) && nameRe.test(f.value)) || nameRe.test(a.title))
              .slice(0, 6);

    // Schema.org Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AdministrativeArea",
                "name": districtContent.title,
                "description": districtContent.description,
                "containedInPlace": {
                    "@type": "State",
                    "name": "Odisha"
                },
                ...(districtData && {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": districtData.centroid[0],
                        "longitude": districtData.centroid[1]
                    }
                })
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://odiapedia.com" },
                    { "@type": "ListItem", "position": 2, "name": "Districts", "item": "https://odiapedia.com/districts" },
                    { "@type": "ListItem", "position": 3, "name": districtContent.title, "item": `https://odiapedia.com/district/${slug}` }
                ]
            }
        ]
    };

    const stats = [
        { k: "Headquarters", v: districtContent.headquarters || districtData?.headquarters },
        { k: "Population (2011)", v: districtContent.population || (districtData ? districtData.population.toLocaleString("en-IN") : undefined) },
        { k: "Area", v: districtContent.area || (districtData ? `${districtData.area_sq_km.toLocaleString("en-IN")} sq km` : undefined) },
        { k: "Literacy (2011)", v: districtData ? `${districtData.literacy}%` : undefined },
    ].filter((x) => x.v);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <ChariotWheel className="pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] text-laterite-500/[0.07]" />
                <div className="container-page relative py-10 md:py-14">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: districtContent.title, href: `/district/${slug}` }]} />
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {districtData && (
                            <span className="eyebrow"><Icon name="pin" className="h-4 w-4" />{districtData.region} Odisha</span>
                        )}
                        <Link href={isOdia ? `/district/${baseSlug}` : `/district/${baseSlug}-od`} className="chip hover:border-laterite-300" lang={isOdia ? "en" : "or"}>
                            {isOdia ? "Read in English" : "ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ"}
                        </Link>
                    </div>
                    <h1 className="mt-3 font-display text-5xl font-semibold md:text-6xl" lang={isOdia ? "or" : "en"}>
                        {districtContent.title}{!isOdia && <span className="text-ink-400"> district</span>}
                    </h1>
                    {districtData && !isOdia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{districtData.name_od} ଜିଲ୍ଲା</p>}
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-600 md:text-xl" lang={isOdia ? "or" : "en"}>{districtContent.description}</p>
                    {stats.length > 0 && (
                        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
                            {stats.map((x) => (
                                <div key={x.k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                    <dt className="text-xs uppercase tracking-wider text-ink-500">{x.k}</dt>
                                    <dd className="mt-1 font-display text-lg font-semibold text-ink-900">{x.v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </header>

            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
                <article className="article-body min-w-0 max-w-[46rem]" lang={isOdia ? "or" : "en"}>
                    <MDXRemote source={body} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }} />
                </article>

                <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
                    {districtData && (
                        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
                            <div className="flex items-center gap-2 border-b border-sand-200 bg-sand-100 px-5 py-3">
                                <Icon name="map" className="h-4 w-4 text-laterite-600" />
                                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">Location</h2>
                            </div>
                            <div className="relative h-[240px]">
                                <iframe
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${districtData.bounds[0][1] - 0.5},${districtData.bounds[0][0] - 0.5},${districtData.bounds[1][1] + 0.5},${districtData.bounds[1][0] + 0.5}&layer=mapnik&marker=${districtData.centroid[0]},${districtData.centroid[1]}`}
                                    style={{ width: "100%", height: "100%", border: 0 }}
                                    loading="lazy"
                                    title={`Map of ${districtData.name_en} district`}
                                />
                            </div>
                            <div className="flex gap-2 p-4">
                                <Link href="/map" className="btn-ghost flex-1 !py-2">Odisha map</Link>
                                <a href={`https://www.google.com/maps/search/${encodeURIComponent(districtData.name_en + " district Odisha")}/@${districtData.centroid[0]},${districtData.centroid[1]},9z`} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 !py-2">Google Maps <Icon name="external" className="h-3.5 w-3.5" /></a>
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <h2 className="mb-4 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-600"><Icon name="list" className="h-4 w-4 text-laterite-600" />Tehsils &amp; blocks</h2>
                        <div className="flex max-h-[460px] flex-col gap-2 overflow-y-auto pr-1">
                            <TehsilList districtSlug={baseSlug} />
                        </div>
                    </div>

                    <Link href="/travel/plan" className="group block rounded-2xl bg-laterite-500 p-5 text-white transition-colors hover:bg-laterite-600">
                        <p className="font-display text-lg font-semibold">Visiting {districtData?.name_en || districtContent.title}?</p>
                        <p className="mt-1 text-sm text-laterite-50/90">Get a free custom Odisha itinerary.</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">Plan a trip <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </Link>
                </aside>
            </div>

            {related.length > 0 && (
                <section className="border-t border-sand-200 bg-sand-100/60 py-14">
                    <div className="container-page">
                        <h2 className="font-display text-3xl font-semibold">On Odiapedia: {nameEn}</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {related.map((a) => <ArticleCard key={`${a.category}/${a.slug}`} article={a} compact />)}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
