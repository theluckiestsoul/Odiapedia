import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { odishaDistricts, getDistrictById, regionColors, District } from '@/data/districts';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return odishaDistricts.map((district) => ({
        slug: district.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const district = getDistrictById(slug);

    if (!district) {
        return { title: 'District Not Found' };
    }

    return {
        title: `${district.name_en} District - ${district.name_od} | Map`,
        description: `Explore ${district.name_en} district of Odisha. Population: ${(district.population / 100000).toFixed(1)} Lakh, Area: ${district.area_sq_km} sq km. Headquarters: ${district.headquarters}.`,
    };
}

export default async function DistrictPage({ params }: PageProps) {
    const { slug } = await params;
    const district = getDistrictById(slug);

    if (!district) {
        notFound();
    }

    // Get neighboring districts (same region)
    const relatedDistricts = odishaDistricts
        .filter(d => d.region === district.region && d.id !== district.id)
        .slice(0, 4);

    return (
        <div className="min-h-screen bg-black">
            {/* Breadcrumb */}
            <section className="py-4 border-b border-amber-900/30 bg-neutral-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-amber-500/70 hover:text-amber-400">Home</Link>
                        <span className="text-amber-700">/</span>
                        <Link href="/map" className="text-amber-500/70 hover:text-amber-400">Map</Link>
                        <span className="text-amber-700">/</span>
                        <span className="text-amber-100">{district.name_en}</span>
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
                    <div
                        className="inline-block px-4 py-1 rounded-full text-sm mb-6"
                        style={{
                            backgroundColor: `${regionColors[district.region]}30`,
                            color: regionColors[district.region],
                            border: `1px solid ${regionColors[district.region]}50`,
                        }}
                    >
                        {district.region.charAt(0).toUpperCase() + district.region.slice(1)} Odisha
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        {district.name_en}
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-6">
                        {district.name_od}
                    </p>
                    <p className="text-lg text-amber-100/70">
                        Headquarters: <span className="text-amber-300">{district.headquarters}</span>
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-8 border-y border-amber-900/30 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {(district.population / 100000).toFixed(1)}L
                            </p>
                            <p className="text-amber-500/70 text-sm">Population</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {district.area_sq_km.toLocaleString()}
                            </p>
                            <p className="text-amber-500/70 text-sm">Area (sq km)</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {district.density}
                            </p>
                            <p className="text-amber-500/70 text-sm">Density (/km²)</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-5 text-center">
                            <p className="text-3xl font-bold text-amber-100">
                                {district.literacy}%
                            </p>
                            <p className="text-amber-500/70 text-sm">Literacy Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Location */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 font-display">
                        📍 Location
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Mini Map iframe */}
                        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-amber-800/30 h-[300px]">
                            <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${district.bounds[0][1] - 0.5},${district.bounds[0][0] - 0.5},${district.bounds[1][1] + 0.5},${district.bounds[1][0] + 0.5}&layer=mapnik&marker=${district.centroid[0]},${district.centroid[1]}`}
                                style={{ width: '100%', height: '100%', border: 0 }}
                                title={`Map of ${district.name_en}`}
                            />
                        </div>

                        {/* Coordinates & Details */}
                        <div className="bg-neutral-900/50 rounded-xl p-6 border border-amber-800/30">
                            <h3 className="text-lg font-bold text-amber-100 mb-4">Geographic Details</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">Centroid (Lat, Lng)</span>
                                    <span className="text-amber-100 font-mono text-sm">
                                        {district.centroid[0].toFixed(4)}°N, {district.centroid[1].toFixed(4)}°E
                                    </span>
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
                                    <span className="text-amber-500/70">Headquarters</span>
                                    <span className="text-amber-100">{district.headquarters}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-amber-500/70">State</span>
                                    <span className="text-amber-100">Odisha, India</span>
                                </div>
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/${district.name_en}+district+odisha/@${district.centroid[0]},${district.centroid[1]},10z`}
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

            {/* Related Districts */}
            {relatedDistricts.length > 0 && (
                <section className="py-12 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl font-bold text-amber-100 mb-6">
                            Other {district.region.charAt(0).toUpperCase() + district.region.slice(1)} Districts
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedDistricts.map((d) => (
                                <Link
                                    key={d.id}
                                    href={`/map/district/${d.id}`}
                                    className="bg-neutral-900/50 hover:bg-amber-900/20 rounded-lg p-4 border border-amber-800/30 hover:border-amber-600/50 transition-all"
                                >
                                    <div className="font-medium text-amber-100">{d.name_en}</div>
                                    <div className="text-amber-500/70 text-sm odia-text">{d.name_od}</div>
                                    <div className="text-amber-100/50 text-xs mt-1">
                                        {(d.population / 100000).toFixed(1)}L pop
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Navigation */}
            <section className="py-12 bg-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/map"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            ← Back to Map
                        </Link>
                        <Link
                            href="/history"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            📜 History
                        </Link>
                        <Link
                            href="/culture"
                            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-black font-medium transition-colors"
                        >
                            🎭 Explore Culture
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
