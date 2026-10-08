import fs from "fs";
import path from "path";
import geo from "@/data/odisha-map.json";

/** [code, name, odia, block, gp, subdistrict, colour, path, x, y, r] — see scripts/build-map-drilldown.py */
export type VillageRow = [string, string, string, string, string, string, number, string, number, number, number];

const cache = new Map<string, VillageRow[] | null>();

export function districtVillages(district: string): VillageRow[] | null {
    if (cache.has(district)) return cache.get(district)!;
    let rows: VillageRow[] | null = null;
    try {
        const file = path.join(process.cwd(), "public", "data", "map", `${district}-villages.json`);
        rows = JSON.parse(fs.readFileSync(file, "utf8")).villages as VillageRow[];
    } catch { rows = null; }
    cache.set(district, rows);
    return rows;
}

/** Parse a compact relative path ("M x y l dx dy … z") into absolute rings. */
export function rings(d: string): [number, number][][] {
    const out: [number, number][][] = [];
    for (const part of d.split("M").filter(Boolean)) {
        const n = part.replace(/[lz]/g, " ").trim().split(/\s+|(?=-)/).filter(Boolean).map(Number);
        let x = n[0], y = n[1];
        const r: [number, number][] = [[x, y]];
        for (let i = 2; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; r.push([x, y]); }
        out.push(r);
    }
    return out;
}

/** Map units → metres. One unit is 1/(scale*100) degree of latitude (see odisha-map.json). */
const M_PER_UNIT = 111_320 / ((geo as { scale: number }).scale * 100);

export function areaKm2(d: string): number {
    let a = 0;
    for (const r of rings(d)) {
        let s = 0;
        for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; s += x1 * y2 - x2 * y1; }
        a += Math.abs(s) / 2;
    }
    return (a * M_PER_UNIT * M_PER_UNIT) / 1e6;
}

export function bbox(d: string): [number, number, number, number] {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const r of rings(d)) for (const [x, y] of r) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    return [x0, y0, x1, y1];
}

const G = geo as { bounds: number[]; lat0: number; scale: number; pad: number };
/** Map units → [lat, lng] (inverse of proj() in scripts/build-map-drilldown.py). */
export function toLatLng(x: number, y: number): [number, number] {
    const [minx, , , maxy] = G.bounds;
    const kx = Math.cos((G.lat0 * Math.PI) / 180);
    return [maxy - (y / 100 - G.pad) / G.scale, (x / 100 - G.pad) / (kx * G.scale) + minx];
}

export function villageGeo(district: string, code: string) {
    const rows = districtVillages(district);
    const row = rows?.find((r) => r[0] === code);
    if (!rows || !row) return null;
    const [x0, y0, x1, y1] = bbox(row[7]);
    const w = x1 - x0, h = y1 - y0;
    const pad = Math.max(w, h) * 1.2 + 250;
    let vw = w + pad * 2, vh = h + pad * 2;
    if (vw / vh < 1.6) vw = vh * 1.6; else vh = vw / 1.6;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const view: [number, number, number, number] = [cx - vw / 2, cy - vh / 2, vw, vh];
    // Villages whose label point falls inside the view
    const around = rows.filter((r) => r !== row && r[8] > view[0] - 400 && r[8] < view[0] + view[2] + 400 && r[9] > view[1] - 400 && r[9] < view[1] + view[3] + 400);
    const dist = (r: VillageRow) => Math.hypot(r[8] - row[8], r[9] - row[9]);
    const nearest = [...around].sort((a, b) => dist(a) - dist(b)).slice(0, 8);
    const [lat, lng] = toLatLng(row[8], row[9]);
    return { row, view, around, nearest, area: areaKm2(row[7]), kmPerUnit: M_PER_UNIT / 1000, lat, lng };
}
