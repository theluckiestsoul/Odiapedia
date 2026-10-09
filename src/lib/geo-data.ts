import stationsData from "@/data/stations.json";
import monumentsData from "@/data/monuments.json";

/** Straight-line distance in km. */
export function km(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371, r = Math.PI / 180;
    const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

export type Station = { name: string; code: string; lat: number; lon: number; halt: boolean; odia: string; district: string };
export const STATION_SOURCE = "Railway stations and halts mapped on OpenStreetMap (© OpenStreetMap contributors, ODbL)";

const STATIONS: Station[] = (stationsData as { stations: [string, string, number, number, number, string, string][] }).stations.map(
    ([name, code, lat, lon, halt, odia, district]) => ({ name, code, lat, lon, halt: !!halt, odia, district }),
);

export function nearestStations(lat: number, lon: number, n = 3): (Station & { km: number })[] {
    return STATIONS.map((s) => ({ ...s, km: km(lat, lon, s.lat, s.lon) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, n);
}

export function districtStations(district: string): Station[] {
    return STATIONS.filter((s) => s.district === district.replace(/-od$/, ""));
}

export type Monument = {
    id: string;
    number: string;
    description: string;
    location: string;
    address: string;
    district: string;
    districtName: string;
    lat: number | null;
    lon: number | null;
    commons: string;
    village?: { code: string; name: string; km: number };
};
export const MONUMENTS = (monumentsData as { monuments: Monument[] }).monuments;
export const MONUMENT_SOURCE = (monumentsData as { source: string }).source;
export const MONUMENT_SOURCE_URL = (monumentsData as { sourceUrl: string }).sourceUrl;

/** A short title for a monument from its ASI description. */
export function monumentTitle(m: Monument): string {
    const d = m.description.replace(/\s*\(N-OR-\d+\)/g, "");
    const short = d.split(/[.;:]| together with| with its| with all| including| locally| excluding/)[0].trim();
    const t = short.length > 70 ? short.slice(0, 67).replace(/\s+\S*$/, "") + "…" : short;
    const loc = m.location.split(",")[0].replace(/\s*\(.*\)/, "").trim();
    return loc && !t.toLowerCase().includes(loc.toLowerCase()) ? `${t}, ${loc}` : t;
}

export function monumentsNear(lat: number, lon: number, radiusKm: number) {
    return MONUMENTS.filter((m) => m.lat != null && m.lon != null)
        .map((m) => ({ ...m, km: km(lat, lon, m.lat!, m.lon!) }))
        .filter((m) => m.km <= radiusKm)
        .sort((a, b) => a.km - b.km);
}
