"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, Tooltip } from 'react-leaflet';
import { District, odishaDistricts, odishaCentroid, regionColors } from '@/data/districts';
import { getDistrictGeoJSON, districtPolygons } from '@/data/districtPolygons';
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

// Component to handle map bounds
function MapBounds({ bounds }: { bounds: [[number, number], [number, number]] }) {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds);
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

export default function OdishaMap({
    onDistrictClick,
    selectedDistrict,
    showLabels = true
}: OdishaMapProps) {
    const [mounted, setMounted] = useState(false);
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Style function for GeoJSON features
    const getStyle = useCallback((feature: Feature<Geometry, DistrictProperties> | undefined) => {
        if (!feature?.properties) return {};

        const isHovered = hoveredDistrict === feature.properties.id;
        const isSelected = selectedDistrict === feature.properties.id;

        return {
            fillColor: feature.properties.color,
            weight: isHovered || isSelected ? 3 : 1.5,
            opacity: 1,
            color: isHovered || isSelected ? '#fbbf24' : '#ffffff',
            fillOpacity: isHovered ? 0.8 : isSelected ? 0.9 : 0.6,
        };
    }, [hoveredDistrict, selectedDistrict]);

    // Event handlers for each feature
    const onEachFeature = useCallback((feature: Feature<Geometry, DistrictProperties>, layer: Layer) => {
        if (!feature.properties) return;

        const props = feature.properties;

        layer.on({
            mouseover: (e: LeafletMouseEvent) => {
                setHoveredDistrict(props.id);
                e.target.bringToFront();
            },
            mouseout: () => {
                setHoveredDistrict(null);
            },
            click: () => {
                const district = odishaDistricts.find(d => d.id === props.id);
                if (district) {
                    if (onDistrictClick) {
                        onDistrictClick(district);
                    } else {
                        router.push(`/map/district/${props.id}`);
                    }
                }
            },
        });

        // Bind tooltip
        if (showLabels) {
            layer.bindTooltip(
                `<div class="text-center">
                    <div class="font-bold">${props.name_en}</div>
                    <div class="text-xs">${props.name_od}</div>
                    <div class="text-xs text-gray-500">Pop: ${(props.population / 100000).toFixed(1)}L</div>
                </div>`,
                {
                    permanent: false,
                    direction: 'top',
                    className: 'district-tooltip',
                }
            );
        }
    }, [onDistrictClick, router, showLabels]);

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
        <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-amber-800/30">
            <MapContainer
                center={odishaCentroid}
                zoom={7}
                style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
                zoomControl={true}
                scrollWheelZoom={true}
            >
                <MapBounds bounds={odishaBounds} />

                {/* Dark theme tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* District Polygons */}
                <GeoJSON
                    key={`districts-${hoveredDistrict}-${selectedDistrict}`}
                    data={geoJsonData as GeoJSON.FeatureCollection}
                    style={getStyle as (feature: Feature<Geometry, unknown> | undefined) => Record<string, unknown>}
                    onEachFeature={onEachFeature as (feature: Feature<Geometry, unknown>, layer: Layer) => void}
                />
            </MapContainer>
        </div>
    );
}

// Legend component
export function MapLegend() {
    const regions = [
        { name: 'Coastal', color: regionColors.coastal, count: 8 },
        { name: 'Central', color: regionColors.central, count: 7 },
        { name: 'Northern', color: regionColors.northern, count: 6 },
        { name: 'Southern', color: regionColors.southern, count: 9 },
    ];

    return (
        <div className="bg-neutral-900/90 backdrop-blur-sm rounded-lg p-4 border border-amber-800/30">
            <h3 className="text-amber-100 font-bold mb-3">Regions</h3>
            <div className="space-y-2">
                {regions.map((region) => (
                    <div key={region.name} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full"
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
                        href={`/map/district/${district.id}`}
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
                                className="w-3 h-3 rounded-full mt-1"
                                style={{ backgroundColor: regionColors[district.region] }}
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
