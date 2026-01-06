"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, Popup } from 'react-leaflet';
import { District, odishaDistricts, odishaCentroid, regionColors } from '@/data/districts';
import { getDistrictGeoJSON } from '@/data/districtPolygons';
import { getBlocksByDistrictId } from '@/data/blocks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import type { Feature, Geometry } from 'geojson';

interface OdishaMapProps {
    onDistrictClick?: (district: District) => void;
    selectedDistrict?: string | null;
    showLabels?: boolean;
}

// Unique colors for each district (vibrant palette)
const districtColors: Record<string, string> = {
    // Coastal - Blues & Teals
    balasore: '#0ea5e9',
    bhadrak: '#06b6d4',
    cuttack: '#0891b2',
    jagatsinghpur: '#22d3d1',
    jajpur: '#14b8a6',
    kendrapara: '#2dd4bf',
    khurda: '#0d9488',
    puri: '#0f766e',

    // Central - Greens
    angul: '#22c55e',
    bolangir: '#16a34a',
    boudh: '#15803d',
    deogarh: '#84cc16',
    dhenkanal: '#65a30d',
    nayagarh: '#4ade80',
    sonepur: '#86efac',

    // Northern - Ambers & Oranges
    bargarh: '#f59e0b',
    jharsuguda: '#d97706',
    keonjhar: '#ea580c',
    mayurbhanj: '#f97316',
    sambalpur: '#fb923c',
    sundargarh: '#fbbf24',

    // Southern - Pinks & Purples
    gajapati: '#ec4899',
    ganjam: '#db2777',
    kalahandi: '#c026d3',
    kandhamal: '#a855f7',
    koraput: '#9333ea',
    malkangiri: '#7c3aed',
    nabarangpur: '#8b5cf6',
    nuapada: '#d946ef',
    rayagada: '#f472b6',
};

// Component to handle map bounds
function MapBounds({ bounds }: { bounds: [[number, number], [number, number]] }) {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds, { padding: [20, 20] });
    }, [map, bounds]);
    return null;
}

// District properties type
interface DistrictProperties {
    id: string;
    name_en: string;
    name_od: string;
    region: 'coastal' | 'central' | 'northern' | 'southern' | 'western';
    population: number;
    area_sq_km: number;
    headquarters: string;
    color: string;
}

// Info Card Component for hovered district
function DistrictInfoCard({ district, blocks }: { district: District; blocks: number }) {
    return (
        <div className="min-w-[220px] p-0 overflow-hidden">
            {/* Header with gradient */}
            <div
                className="p-3 text-white"
                style={{
                    background: `linear-gradient(135deg, ${districtColors[district.id] || '#f59e0b'}, ${districtColors[district.id] || '#f59e0b'}dd)`
                }}
            >
                <h3 className="text-lg font-bold">{district.name_en}</h3>
                <p className="text-sm opacity-90 odia-text">{district.name_od}</p>
            </div>

            {/* Stats */}
            <div className="bg-neutral-900 p-3 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Population</span>
                    <span className="text-white font-medium">{(district.population / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Area</span>
                    <span className="text-white font-medium">{district.area_sq_km.toLocaleString()} km²</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Headquarters</span>
                    <span className="text-white font-medium">{district.headquarters}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Blocks</span>
                    <span className="text-white font-medium">{blocks}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Literacy</span>
                    <span className="text-white font-medium">{district.literacy}%</span>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-neutral-950 px-3 py-2 text-center">
                <span className="text-xs text-amber-400">Click to explore →</span>
            </div>
        </div>
    );
}

export default function OdishaMap({
    onDistrictClick,
    selectedDistrict,
    showLabels = true
}: OdishaMapProps) {
    const [mounted, setMounted] = useState(false);
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
    const [hoveredDistrictData, setHoveredDistrictData] = useState<District | null>(null);
    const [hoveredBlocks, setHoveredBlocks] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Style function for GeoJSON features with unique colors
    const getStyle = useCallback((feature: Feature<Geometry, DistrictProperties> | undefined) => {
        if (!feature?.properties) return {};

        const districtId = feature.properties.id;
        const isHovered = hoveredDistrict === districtId;
        const isSelected = selectedDistrict === districtId;
        const color = districtColors[districtId] || feature.properties.color;

        return {
            fillColor: color,
            weight: isHovered || isSelected ? 4 : 2,
            opacity: 1,
            color: isHovered || isSelected ? '#ffffff' : '#000000',
            fillOpacity: isHovered ? 0.9 : isSelected ? 0.85 : 0.7,
            // Simulate 3D effect with shadow
            className: isHovered ? 'district-hovered' : '',
        };
    }, [hoveredDistrict, selectedDistrict]);

    // Event handlers for each feature
    const onEachFeature = useCallback((feature: Feature<Geometry, DistrictProperties>, layer: Layer) => {
        if (!feature.properties) return;

        const props = feature.properties;

        layer.on({
            mouseover: (e: LeafletMouseEvent) => {
                setHoveredDistrict(props.id);
                const district = odishaDistricts.find(d => d.id === props.id);
                if (district) {
                    setHoveredDistrictData(district);
                    setHoveredBlocks(getBlocksByDistrictId(props.id).length);
                }
                e.target.bringToFront();
                e.target.setStyle({
                    weight: 4,
                    color: '#ffffff',
                    fillOpacity: 0.9,
                });
            },
            mouseout: (e: LeafletMouseEvent) => {
                setHoveredDistrict(null);
                setHoveredDistrictData(null);
                const color = districtColors[props.id] || props.color;
                e.target.setStyle({
                    weight: 2,
                    color: '#000000',
                    fillOpacity: 0.7,
                    fillColor: color,
                });
            },
            click: () => {
                const district = odishaDistricts.find(d => d.id === props.id);
                if (district) {
                    if (onDistrictClick) {
                        onDistrictClick(district);
                    } else {
                        router.push(`/district/${props.id}`);
                    }
                }
            },
        });
    }, [onDistrictClick, router]);

    if (!mounted) {
        return (
            <div className="w-full h-[500px] bg-neutral-900 rounded-xl flex items-center justify-center">
                <div className="text-amber-400 animate-pulse">Loading map...</div>
            </div>
        );
    }

    const odishaBounds: [[number, number], [number, number]] = [
        [17.8, 81.3],
        [22.8, 87.5]
    ];

    const geoJsonData = getDistrictGeoJSON();

    return (
        <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-amber-800/30 relative">
            {/* CSS for 3D hover effect */}
            <style jsx global>{`
                .leaflet-interactive:hover {
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
                    transform: translateY(-2px);
                    transition: all 0.2s ease;
                }
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                    padding: 0 !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                    width: auto !important;
                }
                .leaflet-popup-tip {
                    background: #171717 !important;
                }
                .leaflet-popup-close-button {
                    display: none !important;
                }
            `}</style>

            <MapContainer
                center={odishaCentroid}
                zoom={7}
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                zoomControl={true}
                scrollWheelZoom={true}
            >
                <MapBounds bounds={odishaBounds} />

                {/* Very dark base map */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />

                {/* District Polygons with unique colors */}
                <GeoJSON
                    key={`districts-${hoveredDistrict}-${selectedDistrict}`}
                    data={geoJsonData as GeoJSON.FeatureCollection}
                    style={getStyle as (feature: Feature<Geometry, unknown> | undefined) => Record<string, unknown>}
                    onEachFeature={onEachFeature as (feature: Feature<Geometry, unknown>, layer: Layer) => void}
                />

                {/* Popup for hovered district */}
                {hoveredDistrictData && (
                    <Popup
                        position={hoveredDistrictData.centroid}
                        closeButton={false}
                        autoPan={false}
                    >
                        <DistrictInfoCard
                            district={hoveredDistrictData}
                            blocks={hoveredBlocks}
                        />
                    </Popup>
                )}
            </MapContainer>

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-amber-800/30">
                <div className="text-xs text-amber-100 mb-2 font-medium">Regions</div>
                <div className="space-y-1">
                    {[
                        { name: 'Coastal', color: '#0ea5e9' },
                        { name: 'Central', color: '#22c55e' },
                        { name: 'Northern', color: '#f59e0b' },
                        { name: 'Southern', color: '#ec4899' },
                    ].map((r) => (
                        <div key={r.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: r.color }} />
                            <span className="text-xs text-amber-100/70">{r.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hover instruction */}
            <div className="absolute top-4 right-4 z-[1000] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-800/30">
                <span className="text-xs text-amber-400">Hover to see details • Click to explore</span>
            </div>
        </div>
    );
}

// Legend component
export function MapLegend() {
    const regions = [
        { name: 'Coastal', color: '#0ea5e9', count: 8 },
        { name: 'Central', color: '#22c55e', count: 7 },
        { name: 'Northern', color: '#f59e0b', count: 6 },
        { name: 'Southern', color: '#ec4899', count: 9 },
    ];

    return (
        <div className="bg-neutral-900/90 backdrop-blur-sm rounded-lg p-4 border border-amber-800/30">
            <h3 className="text-amber-100 font-bold mb-3">Regions</h3>
            <div className="space-y-2">
                {regions.map((region) => (
                    <div key={region.name} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: region.color }}
                        />
                        <span className="text-amber-100/80 text-sm">
                            {region.name} ({region.count})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// District list panel
export function DistrictListPanel({
    districts = odishaDistricts,
    selectedDistrict,
    onDistrictSelect
}: {
    districts?: District[];
    selectedDistrict?: string | null;
    onDistrictSelect?: (district: District) => void;
}) {
    const [filter, setFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState<string>('all');

    const filteredDistricts = districts.filter(d => {
        const matchesName = d.name_en.toLowerCase().includes(filter.toLowerCase()) ||
            d.name_od.includes(filter);
        const matchesRegion = regionFilter === 'all' || d.region === regionFilter;
        return matchesName && matchesRegion;
    });

    return (
        <div className="bg-neutral-900/50 rounded-xl border border-amber-800/30 p-4 h-[500px] md:h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-amber-100 mb-4">
                Districts of Odisha
                <span className="text-amber-500 text-sm ml-2">({districts.length})</span>
            </h3>

            {/* Search */}
            <input
                type="text"
                placeholder="Search district..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-amber-800/30 text-amber-100 placeholder-amber-600/50 mb-3"
            />

            {/* Region filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {['all', 'coastal', 'central', 'northern', 'southern'].map((region) => (
                    <button
                        key={region}
                        onClick={() => setRegionFilter(region)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${regionFilter === region
                            ? 'bg-amber-600 text-black'
                            : 'bg-amber-900/30 text-amber-300 hover:bg-amber-800/50'
                            }`}
                    >
                        {region.charAt(0).toUpperCase() + region.slice(1)}
                    </button>
                ))}
            </div>

            {/* District List */}
            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredDistricts.map((district) => (
                    <Link
                        key={district.id}
                        href={`/district/${district.id}`}
                        className={`block p-3 rounded-lg transition-all ${selectedDistrict === district.id
                            ? 'bg-amber-600/30 border border-amber-500'
                            : 'bg-black/30 hover:bg-amber-900/20 border border-transparent hover:border-amber-800/30'
                            }`}
                        onClick={() => onDistrictSelect?.(district)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-medium text-amber-100">{district.name_en}</div>
                                <div className="text-amber-500/70 text-sm odia-text">{district.name_od}</div>
                            </div>
                            <div
                                className="w-4 h-4 rounded mt-1"
                                style={{ backgroundColor: districtColors[district.id] || regionColors[district.region] }}
                            />
                        </div>
                        <div className="text-xs text-amber-100/50 mt-1">
                            {district.headquarters} • {(district.population / 100000).toFixed(1)}L pop
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
