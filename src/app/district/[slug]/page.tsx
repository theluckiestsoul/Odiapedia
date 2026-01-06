import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { getDistrictById } from "@/data/districts";
import { getBlocksByDistrictId } from "@/data/blocks";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import Link from "next/link";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const regionColors: Record<string, string> = {
    coastal: "#3b82f6", // Blue
    central: "#8b5cf6", // Violet
    northern: "#10b981", // Emerald
    southern: "#f43f5e", // Rose
    western: "#f59e0b", // Amber
};

export async function generateStaticParams() {
    const slugs = getAllDistrictSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const district = getDistrictBySlug(slug);

    if (!district) {
        return { title: "District Not Found" };
    }

    return {
        title: `${district.title} - The Diary of Odisha`,
        description: district.description,
        openGraph: {
            title: district.title,
            description: district.description,
            type: "article",
        },
    };
}

function TehsilList({ districtSlug }: { districtSlug: string }) {
    const tehsils = getAllTehsilsForDistrict(districtSlug);
    const blocks = getBlocksByDistrictId(districtSlug);

    // Check if we have any administrative content
    if (tehsils.length === 0 && blocks.length === 0) {
        return (
            <div className="col-span-full text-amber-500/40 italic text-sm py-4">
                Administrative entries coming soon...
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
                    className="group block p-4 rounded-lg bg-amber-950/20 border border-amber-900/30 hover:border-amber-500/50 hover:bg-amber-900/30 transition-all"
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-amber-100 group-hover:text-amber-300 font-bold">{tehsil.title}</span>
                        <span className="text-amber-500/50 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div className="text-xs text-amber-500/60 uppercase tracking-wider">Tehsil (Diary Entry)</div>
                </Link>
            ))}

            {/* Data Blocks (Data Only) */}
            {blocks.map((block) => {
                // Determine if this block corresponds to a tehsil we already showed to avoid duplication?
                // For now, listing both is safer as they might not 1:1 map in all cases, or names differ.
                return (
                    <div
                        key={block.id}
                        className="group block p-4 rounded-lg bg-neutral-900/40 border border-amber-800/20"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-amber-100/80 font-medium">{block.name_en}</span>
                        </div>
                        <div className="text-xs text-amber-500/40 odia-text mb-1">{block.name_od}</div>
                        <div className="text-xs text-amber-500/30 uppercase tracking-wider flex gap-2">
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
    const districtData = getDistrictById(slug);      // Map Data

    if (!districtContent) {
        notFound();
    }

    const components = useMDXComponents({});

    return (
        <div className="min-h-screen bg-black text-amber-100">
            {districtData && (
                <div
                    className="absolute top-0 left-0 right-0 h-[50vh] opacity-20 pointer-events-none"
                    style={{
                        background: `linear-gradient(to bottom, ${regionColors[districtData.region]}40, transparent)`,
                    }}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <nav className="flex items-center gap-2 text-sm mb-8 text-amber-500/60">
                    <Link href="/" className="hover:text-amber-400">Home</Link>
                    <span>/</span>
                    <Link href="/districts" className="hover:text-amber-400">Districts</Link>
                    <span>/</span>
                    <span className="text-amber-300">{districtContent.title}</span>
                </nav>

                <header className="mb-12 text-center">
                    {districtData && (
                        <div
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border"
                            style={{
                                borderColor: `${regionColors[districtData.region]}50`,
                                backgroundColor: `${regionColors[districtData.region]}20`,
                                color: regionColors[districtData.region]
                            }}
                        >
                            {districtData.region} Odisha
                        </div>
                    )}
                    <h1 className="text-5xl md:text-8xl font-bold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                        {districtContent.title}
                    </h1>
                    {districtData && (
                        <p className="text-3xl text-amber-500/60 odia-text mb-6">
                            {districtData.name_od}
                        </p>
                    )}
                    <p className="text-xl text-amber-100/60 max-w-2xl mx-auto leading-relaxed">
                        {districtContent.description}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Narrative */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* At a Glance Section */}
                        <section className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-display font-bold text-amber-500 mb-6 flex items-center gap-2">
                                <span>📊</span> At a Glance
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                                    <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Headquarters</span>
                                    <span className="text-lg font-semibold text-amber-100">{districtContent.headquarters || districtData?.headquarters || "N/A"}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                                    <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Population</span>
                                    <span className="text-lg font-semibold text-amber-100">{districtContent.population || (districtData ? `${(districtData.population / 100000).toFixed(2)}L` : "N/A")}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                                    <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Area</span>
                                    <span className="text-lg font-semibold text-amber-100">{districtContent.area || (districtData ? `${districtData.area_sq_km} sq km` : "N/A")}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                                    <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Literacy</span>
                                    <span className="text-lg font-semibold text-amber-100">{districtData ? `${districtData.literacy}%` : "N/A"}</span>
                                </div>
                            </div>
                        </section>

                        {/* Main Content */}
                        <article className="prose prose-lg prose-invert prose-amber max-w-none">
                            <MDXRemote source={districtContent.content} components={components} />
                        </article>
                    </div>

                    {/* RIGHT COLUMN: Map & Admin */}
                    <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                        {/* Location Map */}
                        {districtData && (
                            <div className="bg-neutral-900/50 rounded-2xl border border-amber-800/30 overflow-hidden">
                                <div className="p-4 border-b border-amber-800/30 bg-neutral-900">
                                    <h3 className="font-bold text-amber-100 flex items-center gap-2">
                                        <span>📍</span> Location
                                    </h3>
                                </div>
                                <div className="h-[250px] relative">
                                    <iframe
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${districtData.bounds[0][1] - 0.5},${districtData.bounds[0][0] - 0.5},${districtData.bounds[1][1] + 0.5},${districtData.bounds[1][0] + 0.5}&layer=mapnik&marker=${districtData.centroid[0]},${districtData.centroid[1]}`}
                                        style={{ width: '100%', height: '100%', border: 0 }}
                                        title={`Map of ${districtData.name_en}`}
                                    />
                                </div>
                                <div className="p-4 bg-neutral-900">
                                    <a
                                        href={`https://www.google.com/maps/search/${districtData.name_en}+district+odisha/@${districtData.centroid[0]},${districtData.centroid[1]},9z`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center px-4 py-2 bg-amber-900/30 hover:bg-amber-800/50 border border-amber-700/30 rounded-lg text-amber-300 text-sm transition-colors"
                                    >
                                        Open in Google Maps ↗
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Tehsils/Blocks List */}
                        <div className="bg-neutral-900/30 rounded-2xl border border-amber-800/20 p-6">
                            <h2 className="text-xl font-display font-bold text-amber-500 mb-4 flex items-center gap-2">
                                <span>🏙️</span> Administration
                            </h2>
                            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                <TehsilList districtSlug={slug} />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 pt-8 border-t border-amber-900/30 text-center text-amber-500/40 text-sm">
                    <p>Part of Odiapedia - The Diary of Odisha</p>
                </footer>
            </div>
        </div>
    );
}
