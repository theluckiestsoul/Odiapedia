import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSpotBySlug, getAllSpots, Spot } from "@/lib/spots";
import { getTehsilBySlug } from "@/lib/tehsils";
import { getDistrictBySlug } from "@/lib/districts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";

interface PageProps {
    params: Promise<{ slug: string; tehsil: string; spot: string }>;
}

export async function generateStaticParams() {
    const allSpots = getAllSpots();
    return allSpots.map((spot) => ({
        slug: spot.district,
        tehsil: spot.tehsil,
        spot: spot.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, tehsil, spot } = await params;
    const spotData = getSpotBySlug(slug, spot);

    if (!spotData) {
        return { title: "Spot Not Found" };
    }

    return {
        title: `${spotData.title}, ${tehsil.charAt(0).toUpperCase() + tehsil.slice(1)} – ${spotData.category}`,
        description: spotData.description,
        alternates: { canonical: `/district/${slug}/${tehsil}/${spot}` },
    };
}

export default async function SpotPage({ params }: PageProps) {
    const { slug, tehsil, spot } = await params;

    // Fetch Data hierarchy
    const spotData = getSpotBySlug(slug, spot);
    const tehsilData = getTehsilBySlug(slug, tehsil);
    const districtData = getDistrictBySlug(slug);

    if (!spotData) {
        notFound();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const components = useMDXComponents({});

    // Schema.org Structured Data for POI
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LandmarksOrHistoricalBuildings",
                "name": spotData.title,
                "description": spotData.description,
                ...(spotData.coordinates && {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": spotData.coordinates.lat,
                        "longitude": spotData.coordinates.lng
                    }
                }),
                "containedInPlace": {
                    "@type": "AdministrativeArea",
                    "name": tehsilData?.title || tehsil
                }
            }
        ]
    };

    const crumbs = [
        { name: "Districts", href: "/districts" },
        { name: districtData?.title || slug, href: `/district/${slug}` },
        ...(tehsilData ? [{ name: tehsilData.title, href: `/district/${slug}/${tehsil}` }] : []),
        { name: spotData.title, href: `/district/${slug}/${tehsil}/${spot}` },
    ];

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-14">
                    <Breadcrumbs items={crumbs} />
                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="eyebrow">{spotData.category}</span>
                        {spotData.tags?.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                    </div>
                    <h1 className="mt-3 max-w-4xl text-balance font-display text-4xl font-semibold md:text-5xl">{spotData.title}</h1>
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-600">{spotData.description}</p>
                </div>
            </header>
            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                <article className="article-body min-w-0 max-w-[46rem]">
                    <MDXRemote
                        source={spotData.content.replace(/^\s*#\s+[^\n]+\n+/, "")}
                        components={components}
                        options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }}
                    />
                </article>
                <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
                    <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
                        <div className="flex items-center gap-2 border-b border-sand-200 bg-sand-100 px-5 py-3">
                            <Icon name="info" className="h-4 w-4 text-laterite-600" />
                            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">Visitor info</h2>
                        </div>
                        <dl className="space-y-4 p-5 text-sm">
                            {spotData.best_time && (
                                <div>
                                    <dt className="text-xs uppercase tracking-wider text-ink-500">Best time to visit</dt>
                                    <dd className="mt-1 font-medium text-ink-900">{spotData.best_time}</dd>
                                </div>
                            )}
                            {spotData.coordinates && (
                                <div>
                                    <dt className="text-xs uppercase tracking-wider text-ink-500">Coordinates</dt>
                                    <dd className="mt-1 font-mono text-xs text-ink-900">{spotData.coordinates.lat.toFixed(4)}, {spotData.coordinates.lng.toFixed(4)}</dd>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${spotData.coordinates.lat},${spotData.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-laterite-600 hover:underline">
                                        View on Google Maps <Icon name="external" className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            )}
                        </dl>
                    </div>
                    <Link href="/travel/plan" className="group block rounded-2xl bg-laterite-500 p-5 text-white hover:bg-laterite-600">
                        <p className="font-display text-lg font-semibold">Planning a visit?</p>
                        <p className="mt-1 text-sm text-laterite-50/90">Get a free custom Odisha itinerary.</p>
                    </Link>
                </aside>
            </div>
        </>
    );
}
