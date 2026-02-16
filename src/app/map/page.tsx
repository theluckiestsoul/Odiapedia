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
        <div className="w-full h-[500px] md:h-[600px] bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
            <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse">🗺️</div>
                <div className="text-teal-600 font-medium">Loading map...</div>
            </div>
        </div>
    );
}

export default function MapPage() {
    // Calculate totals
    const totalPopulation = odishaDistricts.reduce((sum, d) => sum + d.population, 0);
    const totalArea = odishaDistricts.reduce((sum, d) => sum + d.area_sq_km, 0);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-6xl mb-4 block animate-float">🗺️</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                        Map of Odisha
                    </h1>
                    <p className="text-2xl text-teal-200 odia-text mb-4">
                        ଓଡ଼ିଶା ମାନଚିତ୍ର
                    </p>
                    <p className="text-lg text-teal-50 max-w-2xl mx-auto text-shadow-sm">
                        Explore all 30 districts of Odisha. Click on any district to see details.
                    </p>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 border-y border-slate-200 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
                            <p className="text-3xl font-bold text-slate-800">30</p>
                            <p className="text-slate-500 text-sm font-medium">Districts</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
                            <p className="text-3xl font-bold text-slate-800">{(totalPopulation / 10000000).toFixed(1)}Cr</p>
                            <p className="text-slate-500 text-sm font-medium">Population</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
                            <p className="text-3xl font-bold text-slate-800">{(totalArea / 1000).toFixed(0)}K</p>
                            <p className="text-slate-500 text-sm font-medium">Area (sq km)</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
                            <p className="text-3xl font-bold text-slate-800">4</p>
                            <p className="text-slate-500 text-sm font-medium">Regions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map + District List */}
            <section className="py-12 bg-slate-50">
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
                                    <div key={region.name} className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-200">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: region.color }}
                                        />
                                        <span className="text-slate-700 text-sm font-medium">{region.name}</span>
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
            <section className="py-12 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center font-display">
                        Regions of Odisha
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Coastal */}
                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-blue-700 mb-2">🌊 Coastal</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Stretches along the Bay of Bengal. Home to major cities and rich cultural heritage.
                            </p>
                            <p className="text-blue-600 text-xs font-medium">
                                Puri, Cuttack, Khurda, Bhadrak, Balasore, Jajpur, Kendrapara, Jagatsinghpur
                            </p>
                        </div>

                        {/* Central */}
                        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-green-700 mb-2">🌲 Central</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Forest-rich interior with mineral resources and agricultural lands.
                            </p>
                            <p className="text-green-600 text-xs font-medium">
                                Angul, Dhenkanal, Bolangir, Boudh, Deogarh, Nayagarh, Sonepur
                            </p>
                        </div>

                        {/* Northern */}
                        <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-amber-700 mb-2">⛏️ Northern</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Industrial heartland with rich iron ore and coal reserves.
                            </p>
                            <p className="text-amber-600 text-xs font-medium">
                                Sundargarh, Sambalpur, Jharsuguda, Bargarh, Mayurbhanj, Keonjhar
                            </p>
                        </div>

                        {/* Southern */}
                        <div className="bg-pink-50/50 rounded-xl p-5 border border-pink-100 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-pink-700 mb-2">🏔️ Southern</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Eastern Ghats region with tribal heritage and natural beauty.
                            </p>
                            <p className="text-pink-600 text-xs font-medium">
                                Ganjam, Koraput, Kalahandi, Kandhamal, Rayagada, Malkangiri, and more
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Related */}
            <section className="py-12 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Explore More</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/history/timeline"
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                            📜 History Timeline
                        </Link>
                        <Link
                            href="/calendar"
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                            🗓️ Odia Calendar
                        </Link>
                        <Link
                            href="/culture"
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                            🎭 Explore Culture
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
