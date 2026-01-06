"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { odishaDistricts, regionColors } from '@/data/districts';

// Dynamically import map component (no SSR for Leaflet)
const OdishaMap = dynamic(
    () => import('@/components/map/OdishaMap'),
    { ssr: false, loading: () => <MapLoadingPlaceholder /> }
);

const DistrictListPanel = dynamic(
    () => import('@/components/map/OdishaMap').then(mod => ({ default: mod.DistrictListPanel })),
    { ssr: false }
);

function MapLoadingPlaceholder() {
    return (
        <div className="w-full h-[500px] md:h-[600px] bg-neutral-900 rounded-xl flex items-center justify-center border border-amber-800/30">
            <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse">🗺️</div>
                <div className="text-amber-400">Loading map...</div>
            </div>
        </div>
    );
}

export default function MapPage() {
    // Calculate totals
    const totalPopulation = odishaDistricts.reduce((sum, d) => sum + d.population, 0);
    const totalArea = odishaDistricts.reduce((sum, d) => sum + d.area_sq_km, 0);

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-6xl mb-4 block">🗺️</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4 font-display">
                        Map of Odisha
                    </h1>
                    <p className="text-2xl text-amber-500/80 odia-text mb-4">
                        ଓଡ଼ିଶା ମାନଚିତ୍ର
                    </p>
                    <p className="text-lg text-amber-100/70 max-w-2xl mx-auto">
                        Explore all 30 districts of Odisha. Click on any district to see details.
                    </p>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 border-y border-amber-900/30 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/40 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-amber-100">30</p>
                            <p className="text-amber-500/70 text-sm">Districts</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-amber-100">{(totalPopulation / 10000000).toFixed(1)}Cr</p>
                            <p className="text-amber-500/70 text-sm">Population</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-amber-100">{(totalArea / 1000).toFixed(0)}K</p>
                            <p className="text-amber-500/70 text-sm">Area (sq km)</p>
                        </div>
                        <div className="bg-black/40 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-amber-100">4</p>
                            <p className="text-amber-500/70 text-sm">Regions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map + District List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Map */}
                        <div className="lg:col-span-2">
                            <OdishaMap showLabels={true} />

                            {/* Legend below map */}
                            <div className="mt-4 flex flex-wrap gap-4 justify-center">
                                {[
                                    { name: 'Coastal', color: regionColors.coastal },
                                    { name: 'Central', color: regionColors.central },
                                    { name: 'Northern', color: regionColors.northern },
                                    { name: 'Southern', color: regionColors.southern },
                                ].map((region) => (
                                    <div key={region.name} className="flex items-center gap-2 px-3 py-1 bg-neutral-900/50 rounded-full">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: region.color }}
                                        />
                                        <span className="text-amber-100/80 text-sm">{region.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* District List */}
                        <div>
                            <DistrictListPanel />
                        </div>
                    </div>
                </div>
            </section>

            {/* Region Overview */}
            <section className="py-12 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-8 text-center font-display">
                        Regions of Odisha
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Coastal */}
                        <div className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 rounded-xl p-5 border border-blue-700/30">
                            <h3 className="text-lg font-bold text-blue-300 mb-2">🌊 Coastal</h3>
                            <p className="text-amber-100/70 text-sm mb-3">
                                Stretches along the Bay of Bengal. Home to major cities and rich cultural heritage.
                            </p>
                            <p className="text-blue-400 text-xs">
                                Puri, Cuttack, Khurda, Bhadrak, Balasore, Jajpur, Kendrapara, Jagatsinghpur
                            </p>
                        </div>

                        {/* Central */}
                        <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 rounded-xl p-5 border border-green-700/30">
                            <h3 className="text-lg font-bold text-green-300 mb-2">🌲 Central</h3>
                            <p className="text-amber-100/70 text-sm mb-3">
                                Forest-rich interior with mineral resources and agricultural lands.
                            </p>
                            <p className="text-green-400 text-xs">
                                Angul, Dhenkanal, Bolangir, Boudh, Deogarh, Nayagarh, Sonepur
                            </p>
                        </div>

                        {/* Northern */}
                        <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 rounded-xl p-5 border border-amber-700/30">
                            <h3 className="text-lg font-bold text-amber-300 mb-2">⛏️ Northern</h3>
                            <p className="text-amber-100/70 text-sm mb-3">
                                Industrial heartland with rich iron ore and coal reserves.
                            </p>
                            <p className="text-amber-400 text-xs">
                                Sundargarh, Sambalpur, Jharsuguda, Bargarh, Mayurbhanj, Keonjhar
                            </p>
                        </div>

                        {/* Southern */}
                        <div className="bg-gradient-to-br from-pink-900/30 to-pink-950/30 rounded-xl p-5 border border-pink-700/30">
                            <h3 className="text-lg font-bold text-pink-300 mb-2">🏔️ Southern</h3>
                            <p className="text-amber-100/70 text-sm mb-3">
                                Eastern Ghats region with tribal heritage and natural beauty.
                            </p>
                            <p className="text-pink-400 text-xs">
                                Ganjam, Koraput, Kalahandi, Kandhamal, Rayagada, Malkangiri, and more
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Related */}
            <section className="py-12 bg-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xl font-bold text-amber-100 mb-6">Explore More</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/history/timeline"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            📜 History Timeline
                        </Link>
                        <Link
                            href="/calendar"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🗓️ Odia Calendar
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
