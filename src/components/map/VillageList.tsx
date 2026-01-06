"use client";

import { useState, useEffect } from 'react';

interface Village {
    id: string;
    name_en: string;
    name_od: string;
    gp: string;
    population?: number;
}

interface VillageData {
    block_id: string;
    district_id: string;
    villages: Village[];
}

interface VillageListProps {
    blockId: string;
    districtId: string;
}

export default function VillageList({ blockId, districtId }: VillageListProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [villages, setVillages] = useState<Village[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasData, setHasData] = useState<boolean | null>(null);

    // Check if village data exists (without loading it)
    useEffect(() => {
        fetch(`/data/villages/${blockId}.json`, { method: 'HEAD' })
            .then(res => setHasData(res.ok))
            .catch(() => setHasData(false));
    }, [blockId]);

    // Lazy load villages when expanded
    const loadVillages = async () => {
        if (villages.length > 0 || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/data/villages/${blockId}.json`);
            if (!res.ok) {
                throw new Error('Village data not available');
            }
            const data: VillageData = await res.json();
            setVillages(data.villages || []);
        } catch (err) {
            setError('Village data coming soon');
            setVillages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpand = () => {
        if (!isExpanded) {
            loadVillages();
        }
        setIsExpanded(!isExpanded);
    };

    // Filter villages based on search
    const filteredVillages = villages.filter(v =>
        v.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.name_od.includes(searchTerm) ||
        v.gp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group villages by GP
    const villagesByGP = filteredVillages.reduce((acc, village) => {
        if (!acc[village.gp]) {
            acc[village.gp] = [];
        }
        acc[village.gp].push(village);
        return acc;
    }, {} as Record<string, Village[]>);

    // Don't show if no data available
    if (hasData === false) {
        return null;
    }

    return (
        <div className="bg-neutral-900/50 rounded-xl border border-amber-800/30 overflow-hidden">
            {/* Header - Click to expand */}
            <button
                onClick={handleExpand}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-amber-900/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🏘️</span>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-amber-100">Villages & Localities</h3>
                        <p className="text-sm text-amber-500/70">
                            {villages.length > 0 ? `${villages.length} villages` : 'Click to load'}
                        </p>
                    </div>
                </div>
                <span className={`text-2xl text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Expandable content */}
            {isExpanded && (
                <div className="border-t border-amber-800/30">
                    {/* Loading state */}
                    {isLoading && (
                        <div className="p-8 text-center">
                            <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-amber-400">Loading villages...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
                        <div className="p-8 text-center">
                            <span className="text-4xl mb-3 block">🏗️</span>
                            <p className="text-amber-500">{error}</p>
                            <p className="text-amber-500/60 text-sm mt-1">We're adding village data progressively</p>
                        </div>
                    )}

                    {/* Villages loaded */}
                    {!isLoading && !error && villages.length > 0 && (
                        <div className="p-4">
                            {/* Search */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search villages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-black/50 border border-amber-800/30 text-amber-100 placeholder-amber-600/50"
                                />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-black/40 rounded-lg p-3 text-center">
                                    <p className="text-xl font-bold text-amber-100">{filteredVillages.length}</p>
                                    <p className="text-xs text-amber-500/70">Villages</p>
                                </div>
                                <div className="bg-black/40 rounded-lg p-3 text-center">
                                    <p className="text-xl font-bold text-amber-100">{Object.keys(villagesByGP).length}</p>
                                    <p className="text-xs text-amber-500/70">Gram Panchayats</p>
                                </div>
                            </div>

                            {/* Village list grouped by GP */}
                            <div className="max-h-[400px] overflow-y-auto space-y-4">
                                {Object.entries(villagesByGP).map(([gpName, gpVillages]) => (
                                    <div key={gpName} className="bg-black/30 rounded-lg p-3">
                                        <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                                            <span>📍</span> {gpName} GP
                                            <span className="text-amber-600 text-xs">({gpVillages.length})</span>
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {gpVillages.map((village) => (
                                                <div
                                                    key={village.id}
                                                    className="bg-neutral-900/50 rounded-lg p-2 hover:bg-amber-900/20 transition-colors"
                                                >
                                                    <div className="font-medium text-amber-100 text-sm">{village.name_en}</div>
                                                    <div className="text-amber-500/70 text-xs odia-text">{village.name_od}</div>
                                                    {village.population && (
                                                        <div className="text-amber-100/40 text-xs mt-1">
                                                            Pop: {(village.population / 1000).toFixed(1)}K
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No results */}
                            {filteredVillages.length === 0 && searchTerm && (
                                <div className="text-center py-8">
                                    <p className="text-amber-500">No villages matching &quot;{searchTerm}&quot;</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
