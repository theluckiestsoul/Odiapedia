import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDistrictById, regionColors } from '@/data/districts';
import { getBlockById, getBlocksByDistrictId, Block } from '@/data/blocks';
import VillageList from '@/components/map/VillageList';

interface PageProps {
    params: Promise<{ slug: string; blockSlug: string }>;
}

export async function generateStaticParams() {
    // Import here to avoid circular dependency
    const { blocksByDistrict } = await import('@/data/blocks');

    const params: { slug: string; blockSlug: string }[] = [];

    Object.entries(blocksByDistrict).forEach(([districtId, blocks]) => {
        blocks.forEach((block) => {
            params.push({
                slug: districtId,
                blockSlug: block.id,
            });
        });
    });

    return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, blockSlug } = await params;
    const district = getDistrictById(slug);
    const block = getBlockById(blockSlug);

    if (!district || !block) {
        return { title: 'Block Not Found' };
    }

    return {
        title: `${block.name_en} Block - ${block.name_od} | ${district.name_en} District`,
        description: `Explore ${block.name_en} block in ${district.name_en} district of Odisha. Headquarters: ${block.headquarters}. Part of ${district.region} Odisha.`,
    };
}

export default async function BlockPage({ params }: PageProps) {
    const { slug, blockSlug } = await params;
    const district = getDistrictById(slug);
    const block = getBlockById(blockSlug);

    if (!district || !block) {
        notFound();
    }

    // Get sibling blocks (same district)
    const siblingBlocks = getBlocksByDistrictId(slug).filter(b => b.id !== block.id).slice(0, 6);

    return (
        <div className="min-h-screen bg-black">
            {/* Breadcrumb */}
            <section className="py-4 border-b border-amber-900/30 bg-neutral-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm flex-wrap">
                        <Link href="/" className="text-amber-500/70 hover:text-amber-400">Home</Link>
                        <span className="text-amber-700">/</span>
                        <Link href="/map" className="text-amber-500/70 hover:text-amber-400">Map</Link>
                        <span className="text-amber-700">/</span>
                        <Link href={`/map/district/${district.id}`} className="text-amber-500/70 hover:text-amber-400">
                            {district.name_en}
                        </Link>
                        <span className="text-amber-700">/</span>
                        <span className="text-amber-100">{block.name_en}</span>
                    </nav>
                </div>
            </section>

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to bottom, ${regionColors[district.region]}20, transparent)`,
                    }}
                ></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-3xl">🏘️</span>
                        <div
                            className="px-4 py-1 rounded-full text-sm"
                            style={{
                                backgroundColor: `${regionColors[district.region]}30`,
                                color: regionColors[district.region],
                                border: `1px solid ${regionColors[district.region]}50`,
                            }}
                        >
                            Block in {district.name_en}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4 font-display">
                        {block.name_en}
                    </h1>
                    <p className="text-2xl text-amber-500/80 odia-text mb-6">
                        {block.name_od}
                    </p>
                    <p className="text-lg text-amber-100/70">
                        Headquarters: <span className="text-amber-300">{block.headquarters}</span>
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-8 border-y border-amber-900/30 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {block.gps_count || 'N/A'}
                            </p>
                            <p className="text-amber-500/70 text-sm">Gram Panchayats</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {block.population ? (block.population / 1000).toFixed(0) + 'K' : 'N/A'}
                            </p>
                            <p className="text-amber-500/70 text-sm">Population</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {block.area_sq_km || 'N/A'}
                            </p>
                            <p className="text-amber-500/70 text-sm">Area (sq km)</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-xl font-bold text-amber-100">
                                {district.name_en}
                            </p>
                            <p className="text-amber-500/70 text-sm">District</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Info */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 font-display">
                        📍 Location Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Map iframe */}
                        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-amber-800/30 h-[300px]">
                            <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${block.centroid[1] - 0.2},${block.centroid[0] - 0.2},${block.centroid[1] + 0.2},${block.centroid[0] + 0.2}&layer=mapnik&marker=${block.centroid[0]},${block.centroid[1]}`}
                                style={{ width: '100%', height: '100%', border: 0 }}
                                title={`Map of ${block.name_en}`}
                            />
                        </div>

                        {/* Details */}
                        <div className="bg-neutral-900/50 rounded-xl p-6 border border-amber-800/30">
                            <h3 className="text-lg font-bold text-amber-100 mb-4">Administrative Details</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">Block Name</span>
                                    <span className="text-amber-100">{block.name_en}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">Odia Name</span>
                                    <span className="text-amber-100 odia-text">{block.name_od}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">Headquarters</span>
                                    <span className="text-amber-100">{block.headquarters}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">District</span>
                                    <Link href={`/map/district/${district.id}`} className="text-amber-400 hover:text-amber-300">
                                        {district.name_en}
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">Region</span>
                                    <span
                                        className="px-2 py-0.5 rounded text-sm"
                                        style={{
                                            backgroundColor: `${regionColors[district.region]}30`,
                                            color: regionColors[district.region],
                                        }}
                                    >
                                        {district.region.charAt(0).toUpperCase() + district.region.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">Coordinates</span>
                                    <span className="text-amber-100 font-mono text-xs">
                                        {block.centroid[0].toFixed(4)}°N, {block.centroid[1].toFixed(4)}°E
                                    </span>
                                </div>
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/${block.name_en}+block+${district.name_en}+odisha/@${block.centroid[0]},${block.centroid[1]},12z`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 block w-full text-center px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-black font-medium transition-colors"
                            >
                                Open in Google Maps →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Villages - Lazy Loaded */}
            <section className="py-12 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <VillageList blockId={blockSlug} districtId={slug} />
                </div>
            </section>

            {/* Other Blocks in District */}
            {siblingBlocks.length > 0 && (
                <section className="py-12 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl font-bold text-amber-100 mb-6">
                            Other Blocks in {district.name_en}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {siblingBlocks.map((b) => (
                                <Link
                                    key={b.id}
                                    href={`/map/district/${district.id}/block/${b.id}`}
                                    className="bg-neutral-900/50 hover:bg-amber-900/20 rounded-lg p-4 border border-amber-800/30 hover:border-amber-600/50 transition-all"
                                >
                                    <div className="font-medium text-amber-100">{b.name_en}</div>
                                    <div className="text-amber-500/70 text-sm odia-text">{b.name_od}</div>
                                    {b.gps_count && (
                                        <div className="text-amber-100/50 text-xs mt-1">
                                            {b.gps_count} GPs
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-6">
                            <Link
                                href={`/map/district/${district.id}`}
                                className="text-amber-400 hover:text-amber-300"
                            >
                                View all blocks in {district.name_en} →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Navigation */}
            <section className="py-12 bg-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href={`/map/district/${district.id}`}
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            ← Back to {district.name_en}
                        </Link>
                        <Link
                            href="/map"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🗺️ All Districts
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
