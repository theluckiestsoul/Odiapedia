import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSpotBySlug, getAllSpots, Spot } from "@/lib/spots";
import { getTehsilBySlug } from "@/lib/tehsils";
import { getDistrictBySlug } from "@/lib/districts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import Link from "next/link";

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
        title: `${spotData.title} - ${spotData.category} | Odiapedia`,
        description: spotData.description,
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

    const components = useMDXComponents({});

    return (
        <div className="min-h-screen bg-black text-amber-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Visual Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-2 text-sm mb-8 text-amber-500/60">
                    <Link href="/" className="hover:text-amber-400">Home</Link>
                    <span>/</span>
                    <Link href="/districts" className="hover:text-amber-400">Districts</Link>
                    <span>/</span>
                    <Link href={`/district/${slug}`} className="hover:text-amber-400 capitalize">
                        {districtData?.title || slug}
                    </Link>
                    <span>/</span>
                    <Link href={`/district/${slug}/${tehsil}`} className="hover:text-amber-400 capitalize">
                        {tehsilData?.title || tehsil}
                    </Link>
                    <span>/</span>
                    <span className="text-amber-300">{spotData.title}</span>
                </nav>

                <header className="mb-10 border-b border-amber-900/30 pb-10">
                    <div className="flex gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-amber-900/30 border border-amber-800/30 text-amber-400 text-xs font-bold tracking-wide uppercase">
                            {spotData.category}
                        </span>
                        {spotData.tags?.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-amber-100">
                        {spotData.title}
                    </h1>

                    <p className="text-xl text-amber-100/60 max-w-3xl leading-relaxed italic">
                        "{spotData.description}"
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Narrative */}
                    <div className="lg:col-span-2">
                        <article className="prose prose-lg prose-invert prose-amber max-w-none">
                            <MDXRemote source={spotData.content} components={components} />
                        </article>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-6 backdrop-blur-sm sticky top-24">
                            <h3 className="font-bold text-amber-500 mb-4 flex items-center gap-2">
                                <span>ℹ️</span> Visitor Info
                            </h3>

                            <dl className="space-y-4 text-sm">
                                {spotData.best_time && (
                                    <div>
                                        <dt className="text-amber-500/60 text-xs uppercase tracking-wider mb-1">Best Time to Visit</dt>
                                        <dd className="text-amber-100 font-medium">{spotData.best_time}</dd>
                                    </div>
                                )}

                                {spotData.coordinates && (
                                    <div>
                                        <dt className="text-amber-500/60 text-xs uppercase tracking-wider mb-1">Coordinates</dt>
                                        <dd className="text-amber-100 font-mono text-xs">
                                            {spotData.coordinates.lat.toFixed(4)}, {spotData.coordinates.lng.toFixed(4)}
                                        </dd>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${spotData.coordinates.lat},${spotData.coordinates.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-2 text-amber-500 hover:text-amber-400 border-b border-amber-500/30 hover:border-amber-400"
                                        >
                                            View on Google Maps ↗
                                        </a>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
