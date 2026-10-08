"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import geo from "@/data/odisha-map.json";
import Icon from "@/components/Icon";
import { REGION_STYLE } from "@/data/map-regions";

export interface MapDistrict {
    /** District page slug (same id as in odisha-map.json) */
    id: string;
    name: string;
    odia: string;
    hq: string;
    region: "coastal" | "central" | "northern" | "southern" | "western";
    population: number;
    area: number;
    density: number;
    literacy: number;
    blocks?: number;
    gps?: number;
    villages?: number;
}

/* ------------------------------------------------------------------ data */

type Mode = "region" | "density" | "literacy" | "population";
type UnitKind = "block" | "sd";
type Box = [number, number, number, number]; // x, y, w, h

interface GeoDistrict { id: string; census: string; path: string; cx: number; cy: number }
const GEO = geo as unknown as { width: number; height: number; bounds: number[]; lat0: number; scale: number; pad: number; districts: GeoDistrict[] };

/** Everything is drawn in "map units": odisha-map.json coordinates x 100. */
const U = 100;
const FULL: Box = [0, 0, GEO.width * U, GEO.height * U];
const ASPECT = GEO.width / GEO.height;

interface Unit { c: string; n: string; s: string; k: number; p: string; x: number; y: number; r: number; g?: number; v?: number }
interface DistrictLayer { district: string; bbox: [number, number, number, number]; blocks: Unit[]; subdistricts: Unit[]; gps: Record<string, string>; unmapped?: { c: string; n: string; s: string }[] }
/** [code, name, odia, block, gp, subdistrict, colour, path, x, y, r] */
type VillageRow = [string, string, string, string, string, string, number, string, number, number, number];

interface View { d?: string; kind?: UnitKind; u?: string; v?: string }

const kx = Math.cos((GEO.lat0 * Math.PI) / 180);
const proj = (lng: number, lat: number) => [((lng - GEO.bounds[0]) * kx * GEO.scale + GEO.pad) * U, ((GEO.bounds[3] - lat) * GEO.scale + GEO.pad) * U] as const;

const MODES: { id: Mode; label: string; unit: string; ramp: string[] }[] = [
    { id: "region", label: "Regions", unit: "", ramp: [] },
    { id: "density", label: "Density", unit: "people / km²", ramp: ["#fbf1ec", "#f6ddd1", "#ecb9a2", "#df8f6d", "#cf6a43", "#9c4122"] },
    { id: "literacy", label: "Literacy", unit: "% literate", ramp: ["#eef2f9", "#d9e1f0", "#b3c2df", "#8199c6", "#5671a9", "#2f4574"] },
    { id: "population", label: "Population", unit: "people", ramp: ["#fef8ec", "#fdf0d5", "#fbdca1", "#f6c164", "#f0a63a", "#bf6c12"] },
];

/** Soft, distinct fills for neighbouring blocks / sub-districts (assigned so neighbours differ). */
const UNIT_FILLS = ["#f3c9b4", "#f8dca0", "#c9d6ee", "#bfe0da", "#e6d6bb", "#e9b8a6"];
/** Village fills, one per gram panchayat colour slot. */
const VILLAGE_FILLS = ["#f7e1d5", "#fbeac4", "#dfe6f4", "#d5ece8", "#efe5d3", "#f1d3c7"];

const LABEL_NUDGE: Record<string, [number, number]> = { jagatsinghpur: [22, 10], kendrapara: [6, -4], khordha: [-6, 6], cuttack: [0, -4], jharsuguda: [0, 2] };

const NEIGHBOURS: { label: string; lng: number; lat: number; sea?: boolean }[] = [
    { label: "CHHATTISGARH", lng: 82.15, lat: 21.75 },
    { label: "JHARKHAND", lng: 85.55, lat: 22.42 },
    { label: "WEST BENGAL", lng: 87.15, lat: 22.3 },
    { label: "ANDHRA PRADESH", lng: 83.45, lat: 18.15 },
    { label: "Bay of Bengal", lng: 86.75, lat: 19.05, sea: true },
];
const BHUBANESWAR = proj(85.8245, 20.2961);

const fmt = (n: number) => n.toLocaleString("en-IN");
const fmtShort = (n: number) => (n >= 1e7 ? `${(n / 1e7).toFixed(2)} crore` : n >= 1e5 ? `${(n / 1e5).toFixed(1)} lakh` : fmt(n));
const gpLabel = (n?: string) => (!n ? "" : /^not mapped/i.test(n) ? "Gram panchayat not mapped" : `${n} gram panchayat`);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const value = (d: MapDistrict, m: Mode) => (m === "density" ? d.density : m === "literacy" ? d.literacy : d.population);

function quantileBreaks(values: number[], steps: number) {
    const s = [...values].sort((a, b) => a - b);
    return Array.from({ length: steps - 1 }, (_, i) => s[Math.floor(((i + 1) * s.length) / steps)]);
}

/** Bounding box of an absolute path ("M x yL x y …", odisha-map.json) — returned in map units. */
function absPathBox(d: string): Box {
    const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
    return [x0 * U, y0 * U, (x1 - x0) * U, (y1 - y0) * U];
}

/** Bounding box of the largest ring of a compact relative path ("M x y l dx dy … z"). Small exclaves are ignored. */
function relPathBox(d: string): Box {
    let best: Box = [0, 0, 0, 0];
    for (const ring of d.split("M").filter(Boolean)) {
        const n = ring.replace(/[lz]/g, " ").trim().split(/\s+|(?=-)/).filter(Boolean).map(Number);
        let x = n[0], y = n[1], x0 = x, y0 = y, x1 = x, y1 = y;
        for (let i = 2; i + 1 < n.length; i += 2) {
            x += n[i]; y += n[i + 1];
            if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
        if ((x1 - x0) * (y1 - y0) > best[2] * best[3]) best = [x0, y0, x1 - x0, y1 - y0];
    }
    return best;
}

/** Fit a box into the map's aspect ratio with some breathing room. */
function fit([x, y, w, h]: Box, pad = 0.08, minW = 900): Box {
    const cx = x + w / 2, cy = y + h / 2;
    let W = w * (1 + pad * 2), H = h * (1 + pad * 2);
    if (W / H > ASPECT) H = W / ASPECT; else W = H * ASPECT;
    if (W < minW) { W = minW; H = W / ASPECT; }
    return [cx - W / 2, cy - H / 2, W, H];
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function readHash(): View {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.hash.slice(1));
    const d = p.get("d") || undefined;
    const b = p.get("b"), s = p.get("s");
    return { d, kind: b ? "block" : s ? "sd" : undefined, u: b || s || undefined, v: p.get("v") || undefined };
}
function viewHash(v: View) {
    const p = new URLSearchParams();
    if (v.d) p.set("d", v.d);
    if (v.u) p.set(v.kind === "sd" ? "s" : "b", v.u);
    if (v.v) p.set("v", v.v);
    const s = p.toString();
    return s ? `#${s}` : " ";
}

/* ------------------------------------------------------------- component */

export default function OdishaDistrictMap({ districts }: { districts: MapDistrict[] }) {
    const [mode, setMode] = useState<Mode>("region");
    const [layer, setLayer] = useState<UnitKind>("block");
    const [view, setViewState] = useState<View>({});
    const [hover, setHover] = useState<string | null>(null);
    const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
    const [query, setQuery] = useState("");
    const [vb, setVb] = useState<Box>(FULL);
    const [width, setWidth] = useState(1000);
    const [dLayers, setDLayers] = useState<Record<string, DistrictLayer>>({});
    const [vLayers, setVLayers] = useState<Record<string, VillageRow[]>>({});
    const [loading, setLoading] = useState(false);

    const box = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const panel = useRef<HTMLElement>(null);
    const vbRef = useRef<Box>(FULL);
    const anim = useRef<number | null>(null);
    const drag = useRef<{ x: number; y: number; vb: Box; moved: boolean } | null>(null);
    const suppressClick = useRef(false);

    const byId = useMemo(() => Object.fromEntries(districts.map((d) => [d.id, d])), [districts]);
    const geoBox = useMemo(() => Object.fromEntries(GEO.districts.map((g) => [g.id, absPathBox(g.path)])), []);
    const modeInfo = MODES.find((m) => m.id === mode)!;
    const scale = useMemo(() => {
        if (mode === "region") return null;
        const vals = districts.map((d) => value(d, mode));
        return { b: quantileBreaks(vals, modeInfo.ramp.length), min: Math.min(...vals), max: Math.max(...vals) };
    }, [districts, mode, modeInfo.ramp.length]);

    const districtFill = (id: string) => {
        const d = byId[id];
        if (!d) return "#ede2cf";
        if (mode === "region" || !scale) return REGION_STYLE[d.region].fill;
        const v = value(d, mode);
        let i = 0;
        while (i < scale.b.length && v >= scale.b[i]) i++;
        return modeInfo.ramp[i];
    };

    /* ---------- data loading ---------- */
    const loadDistrict = useCallback(async (d: string) => {
        if (dLayers[d]) return dLayers[d];
        setLoading(true);
        try {
            const r = await fetch(`/data/map/${d}.json`);
            const j = (await r.json()) as DistrictLayer;
            setDLayers((s) => ({ ...s, [d]: j }));
            return j;
        } catch { return null; } finally { setLoading(false); }
    }, [dLayers]);

    const loadVillages = useCallback(async (d: string) => {
        if (vLayers[d]) return vLayers[d];
        try {
            const r = await fetch(`/data/map/${d}-villages.json`);
            const j = (await r.json()) as { villages: VillageRow[] };
            setVLayers((s) => ({ ...s, [d]: j.villages }));
            return j.villages;
        } catch { return null; }
    }, [vLayers]);

    /* ---------- camera ---------- */
    const animateTo = useCallback((target: Box, ms = 650) => {
        if (anim.current) cancelAnimationFrame(anim.current);
        const from = vbRef.current; const t0 = performance.now();
        const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const step = (t: number) => {
            const k = reduce ? 1 : ease(Math.min(1, (t - t0) / ms));
            const next = from.map((f, i) => f + (target[i] - f) * k) as Box;
            vbRef.current = next; setVb(next);
            if (k < 1) anim.current = requestAnimationFrame(step);
        };
        anim.current = requestAnimationFrame(step);
    }, []);

    const dl = view.d ? dLayers[view.d] : undefined;
    const villagesAll = view.d ? vLayers[view.d] : undefined;
    const units = dl ? (view.kind === "sd" || (!view.kind && layer === "sd") ? dl.subdistricts : dl.blocks) : [];
    const unitKind: UnitKind = view.kind ?? layer;
    const unit = view.u && dl ? (view.kind === "sd" ? dl.subdistricts : dl.blocks).find((u) => u.c === view.u) : undefined;
    const unitVillages = useMemo(() => {
        if (!villagesAll || !view.u) return [];
        const col = view.kind === "sd" ? 5 : 3;
        return villagesAll.filter((v) => v[col] === view.u);
    }, [villagesAll, view.u, view.kind]);
    const village = view.v ? unitVillages.find((v) => (v[0] || `x${v[8]}-${v[9]}`) === view.v) : undefined;

    const targetFor = useCallback((v: View, layers = dLayers, vills = vLayers): Box => {
        if (!v.d) return FULL;
        const L = layers[v.d];
        if (v.u && L) {
            const u = (v.kind === "sd" ? L.subdistricts : L.blocks).find((x) => x.c === v.u);
            if (v.v && vills[v.d]) {
                const row = vills[v.d].find((r) => (r[0] || `x${r[8]}-${r[9]}`) === v.v);
                if (row) { const [x, y, w, h] = relPathBox(row[7]); return fit([x - w, y - h, w * 3, h * 3], 0.05, 1500); }
            }
            if (u) return fit(relPathBox(u.p), 0.06);
        }
        if (L) { const [x0, y0, x1, y1] = L.bbox; return fit([x0, y0, x1 - x0, y1 - y0], 0.05); }
        return fit(geoBox[v.d] ?? FULL, 0.05);
    }, [dLayers, vLayers, geoBox]);

    /** Navigate to a view: load what it needs, move the camera, record it in the URL. */
    const go = useCallback(async (v: View, opts: { push?: boolean } = { push: true }) => {
        setHover(null); setTip(null);
        let layers = dLayers, vills = vLayers;
        if (v.d) {
            const L = await loadDistrict(v.d);
            if (L) layers = { ...layers, [v.d]: L };
            if (v.u) { const V = await loadVillages(v.d); if (V) vills = { ...vills, [v.d]: V }; }
            else loadVillages(v.d); // prefetch
        }
        if (v.kind) setLayer(v.kind);
        setViewState(v);
        animateTo(targetFor(v, layers, vills));
        if (opts.push && typeof window !== "undefined") {
            const h = viewHash(v);
            if (h.trim() !== window.location.hash) history.pushState(null, "", h.trim() || window.location.pathname + window.location.search);
        }
        if (v.d && typeof window !== "undefined" && window.innerWidth < 1024 && !v.u)
            requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }, [dLayers, vLayers, loadDistrict, loadVillages, animateTo, targetFor]);

    // Deep links (#d=…&b=…&v=…) and the browser back button.
    const goRef = useRef(go); goRef.current = go;
    useEffect(() => {
        const sync = () => goRef.current(readHash(), { push: false });
        if (window.location.hash.length > 1) sync();
        window.addEventListener("popstate", sync);
        return () => window.removeEventListener("popstate", sync);
    }, []);

    useEffect(() => {
        const el = box.current; if (!el) return;
        const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width || 1000));
        ro.observe(el); return () => ro.disconnect();
    }, []);

    const up = () => {
        if (view.v) go({ d: view.d, kind: view.kind, u: view.u });
        else if (view.u) go({ d: view.d });
        else go({});
    };

    const zoomBy = (f: number) => {
        const [x, y, w, h] = vbRef.current;
        const W = Math.min(FULL[2] * 1.3, Math.max(600, w * f)), H = W / ASPECT;
        animateTo([x + w / 2 - W / 2, y + h / 2 - H / 2, W, H], 300);
    };

    /* ---------- pan (drag) and pinch / ctrl-wheel zoom ---------- */
    const onPointerDown = (e: ReactPointerEvent) => {
        if (e.button !== 0 || e.pointerType !== "mouse") return; // touch keeps native page scrolling
        drag.current = { x: e.clientX, y: e.clientY, vb: vbRef.current, moved: false };
    };
    const onPointerMove = (e: ReactPointerEvent) => {
        const r = box.current?.getBoundingClientRect();
        if (r) setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
        const g = drag.current; if (!g) return;
        const dx = e.clientX - g.x, dy = e.clientY - g.y;
        if (!g.moved && Math.hypot(dx, dy) < 5) return;
        if (!g.moved) { g.moved = true; (e.currentTarget as Element).setPointerCapture?.(e.pointerId); }
        const k = g.vb[2] / (r?.width || width);
        const next: Box = [g.vb[0] - dx * k, g.vb[1] - dy * k, g.vb[2], g.vb[3]];
        if (anim.current) cancelAnimationFrame(anim.current);
        vbRef.current = next; setVb(next);
    };
    const onPointerUp = () => {
        if (drag.current?.moved) { suppressClick.current = true; setTimeout(() => (suppressClick.current = false), 0); }
        drag.current = null;
    };
    useEffect(() => {
        const svg = svgRef.current; if (!svg) return;
        const onWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return; // plain scrolling keeps scrolling the page
            e.preventDefault();
            const r = svg.getBoundingClientRect();
            const [x, y, w, h] = vbRef.current;
            const f = Math.exp(e.deltaY * 0.01);
            const W = Math.min(FULL[2] * 1.3, Math.max(600, w * f)), H = W / ASPECT;
            const px = x + ((e.clientX - r.left) / r.width) * w, py = y + ((e.clientY - r.top) / r.height) * h;
            const next: Box = [px - ((px - x) / w) * W, py - ((py - y) / h) * H, W, H];
            if (anim.current) cancelAnimationFrame(anim.current);
            vbRef.current = next; setVb(next);
        };
        svg.addEventListener("wheel", onWheel, { passive: false });
        return () => svg.removeEventListener("wheel", onWheel);
    }, []);

    const click = (fn: () => void) => (e: ReactMouseEvent) => {
        e.preventDefault();
        if (suppressClick.current) return;
        fn();
    };

    /* ---------- derived display values ---------- */
    const ppu = width / vb[2]; // screen pixels per map unit
    const px = (n: number) => n / ppu; // n screen pixels in map units
    const level: "state" | "district" | "unit" | "village" = view.v ? "village" : view.u ? "unit" : view.d ? "district" : "state";
    const cur = view.d ? byId[view.d] : undefined;

    const totals = useMemo(() => ({
        population: districts.reduce((s, d) => s + d.population, 0),
        area: districts.reduce((s, d) => s + d.area, 0),
        blocks: districts.reduce((s, d) => s + (d.blocks ?? 0), 0),
        villages: districts.reduce((s, d) => s + (d.villages ?? 0), 0),
    }), [districts]);

    const list = districts
        .filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase()) || d.odia.includes(query) || d.hq.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const hovDistrict = hover?.startsWith("d:") ? byId[hover.slice(2)] : undefined;
    const hovUnit = hover?.startsWith("u:") ? units.find((u) => u.c === hover.slice(2)) : undefined;
    const hovVillage = hover?.startsWith("v:") ? unitVillages.find((v) => (v[0] || `x${v[8]}-${v[9]}`) === hover.slice(2)) : undefined;

    const unitLabel = unitKind === "sd" ? "Sub-district" : "Block";
    const vKey = (v: VillageRow) => v[0] || `x${v[8]}-${v[9]}`;

    const crumbs: { label: string; view: View }[] = [{ label: "Odisha", view: {} }];
    if (cur) crumbs.push({ label: cur.name, view: { d: view.d } });
    if (unit) crumbs.push({ label: `${unit.n}${view.kind === "sd" ? "" : " block"}`, view: { d: view.d, kind: view.kind, u: view.u } });
    if (village) crumbs.push({ label: village[1], view });

    /* ---------- render ---------- */
    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="card self-start overflow-hidden p-0">
                {/* Toolbar: breadcrumb trail when zoomed in, colour modes at state level */}
                <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-sand-200 px-4 py-2.5 sm:px-5">
                    <nav aria-label="Map level" className="flex min-w-0 flex-wrap items-center gap-1 text-sm">
                        {crumbs.map((c, i) => (
                            <span key={i} className="flex items-center gap-1">
                                {i > 0 && <Icon name="chevron" className="h-3.5 w-3.5 -rotate-90 text-ink-400" />}
                                {i < crumbs.length - 1 ? (
                                    <button type="button" onClick={() => go(c.view)} className="rounded-md px-1.5 py-0.5 font-medium text-laterite-600 hover:bg-laterite-50">{c.label}</button>
                                ) : (
                                    <span className="px-1.5 py-0.5 font-semibold text-ink-900">{c.label}</span>
                                )}
                            </span>
                        ))}
                        {loading && <span className="ml-2 text-xs text-ink-500">Loading…</span>}
                    </nav>
                    {level === "state" ? (
                        <div role="radiogroup" aria-label="Map colouring" className="flex flex-wrap gap-1 rounded-full bg-sand-100 p-1">
                            {MODES.map((m) => (
                                <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} onClick={() => setMode(m.id)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${mode === m.id ? "bg-white text-laterite-600 shadow-sm" : "text-ink-600 hover:text-ink-900"}`}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    ) : level === "district" ? (
                        <div role="radiogroup" aria-label="Show divisions" className="flex gap-1 rounded-full bg-sand-100 p-1">
                            {([["block", "Blocks"], ["sd", "Sub-districts"]] as const).map(([k, l]) => (
                                <button key={k} type="button" role="radio" aria-checked={layer === k} onClick={() => setLayer(k)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${layer === k ? "bg-white text-laterite-600 shadow-sm" : "text-ink-600 hover:text-ink-900"}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div
                    ref={box}
                    className="relative bg-[#f3eee4]"
                    style={{ aspectRatio: `${GEO.width} / ${GEO.height}` }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={() => { setHover(null); setTip(null); onPointerUp(); }}
                >
                    <svg ref={svgRef} viewBox={vb.join(" ")} className="absolute inset-0 block h-full w-full select-none" role="img" aria-labelledby="odisha-map-title" style={{ cursor: drag.current?.moved ? "grabbing" : undefined }}>
                        <title id="odisha-map-title">{village ? `Map of ${village[1]} village` : unit ? `Map of ${unit.n} ${unitLabel.toLowerCase()}` : cur ? `Map of ${cur.name} district` : "Map of Odisha showing its 30 districts"}</title>
                        <defs>
                            <pattern id="sea-lines" width={1400} height={1400} patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
                                <path d="M0 700 Q350 400 700 700 T1400 700" fill="none" stroke="#9cc9c3" strokeWidth={100} />
                            </pattern>
                        </defs>

                        <path d={`M${FULL[2]} ${FULL[3] * 0.32} C ${FULL[2] * 0.85} ${FULL[3] * 0.55}, ${FULL[2] * 0.7} ${FULL[3] * 0.75}, ${FULL[2] * 0.55} ${FULL[3]} L ${FULL[2] * 1.5} ${FULL[3] * 1.5} L ${FULL[2] * 1.5} ${FULL[3] * 0.2} Z`} fill="url(#sea-lines)" opacity="0.7" />

                        {level === "state" && NEIGHBOURS.map((n) => {
                            const [x, y] = proj(n.lng, n.lat);
                            return (
                                <text key={n.label} x={x} y={y} textAnchor="middle" className={n.sea ? "fill-chilika-600 font-display italic" : "hidden fill-sand-500 sm:inline"} style={{ fontSize: n.sea ? 2400 : 1400, letterSpacing: n.sea ? 100 : 300, fontWeight: 600 }}>
                                    {n.label}
                                </text>
                            );
                        })}

                        {/* State layer: all districts (the open district is replaced by its blocks) */}
                        <g transform={`scale(${U})`}>
                            {GEO.districts.map((g) => {
                                const open = g.id === view.d && !!dl;
                                if (open) return null;
                                const isHover = hover === `d:${g.id}`;
                                const dim = !!view.d;
                                return (
                                    <a key={g.id} href={`/district/${g.id}`} aria-label={`${byId[g.id]?.name ?? g.census} district`}
                                        onClick={click(() => go({ d: g.id }))}
                                        onMouseEnter={() => setHover(`d:${g.id}`)} onMouseLeave={() => setHover(null)}
                                        onFocus={() => setHover(`d:${g.id}`)} onBlur={() => setHover(null)}
                                        className="cursor-pointer outline-none">
                                        <path d={g.path} vectorEffect="non-scaling-stroke"
                                            fill={dim ? (isHover ? "#e6d9c3" : "#ede4d3") : districtFill(g.id)}
                                            stroke={isHover && !dim ? "#121c33" : "#fcfaf6"} strokeWidth={isHover && !dim ? 2.5 : 1.2} strokeLinejoin="round"
                                            style={{ transition: "fill .25s ease" }} />
                                    </a>
                                );
                            })}
                        </g>

                        {/* District layer: blocks or sub-districts */}
                        {dl && (
                            <g>
                                {units.map((u) => {
                                    const isOpen = u.c === view.u;
                                    if (isOpen && unitVillages.length) return null;
                                    const isHover = hover === `u:${u.c}`;
                                    const dim = !!view.u;
                                    return (
                                        <a key={u.c} href={unitKind === "sd" ? `/district/${view.d}/tahasil/${u.s}` : `/district/${view.d}/block/${u.s}`}
                                            aria-label={`${u.n} ${unitLabel.toLowerCase()}`}
                                            onClick={click(() => go({ d: view.d, kind: unitKind, u: u.c }))}
                                            onMouseEnter={() => setHover(`u:${u.c}`)} onMouseLeave={() => setHover(null)}
                                            onFocus={() => setHover(`u:${u.c}`)} onBlur={() => setHover(null)}
                                            className="cursor-pointer outline-none">
                                            <path d={u.p} vectorEffect="non-scaling-stroke"
                                                fill={dim ? (isHover ? "#e6d9c3" : "#efe7d8") : UNIT_FILLS[u.k % UNIT_FILLS.length]}
                                                stroke={isHover ? "#121c33" : dim ? "#fcfaf6" : "#7d331d"} strokeOpacity={dim && !isHover ? 1 : 0.85}
                                                strokeWidth={isHover ? 2.5 : dim ? 1 : 1.3} strokeLinejoin="round" style={{ transition: "fill .2s ease" }} />
                                        </a>
                                    );
                                })}
                            </g>
                        )}

                        {/* Village layer */}
                        {unit && unitVillages.length > 0 && (
                            <g>
                                <path d={unit.p} vectorEffect="non-scaling-stroke" fill="#efe3cf" stroke="none" />
                                {unitVillages.map((v) => {
                                    const k = vKey(v);
                                    const sel = village && vKey(village) === k;
                                    const isHover = hover === `v:${k}`;
                                    return (
                                        <a key={k} href={v[0] ? `/district/${view.d}/village/${v[0]}-${slugify(v[1])}` : "#"}
                                            aria-label={`${v[1]} village`}
                                            onClick={click(() => go({ d: view.d, kind: view.kind, u: view.u, v: k }))}
                                            onMouseEnter={() => setHover(`v:${k}`)} onMouseLeave={() => setHover(null)}
                                            onFocus={() => setHover(`v:${k}`)} onBlur={() => setHover(null)}
                                            className="cursor-pointer outline-none">
                                            <path d={v[7]} vectorEffect="non-scaling-stroke"
                                                fill={sel ? "#cf6a43" : isHover ? "#f6c164" : VILLAGE_FILLS[v[6] % VILLAGE_FILLS.length]}
                                                stroke={sel ? "#5f281a" : "#a98a5c"} strokeWidth={sel ? 2.5 : isHover ? 1.5 : 0.6} strokeLinejoin="round" />
                                        </a>
                                    );
                                })}
                                <path d={unit.p} vectorEffect="non-scaling-stroke" fill="none" stroke="#7d331d" strokeWidth={2} pointerEvents="none" />
                            </g>
                        )}

                        {/* Labels */}
                        <g pointerEvents="none" style={{ paintOrder: "stroke", strokeLinejoin: "round" }}>
                            {level === "state" && (
                                <>
                                    <circle cx={BHUBANESWAR[0]} cy={BHUBANESWAR[1]} r={px(6)} fill="#121c33" stroke="#fff" strokeWidth={px(2)} />
                                    <text x={BHUBANESWAR[0] + px(10)} y={BHUBANESWAR[1] + px(5)} className="hidden fill-ink-900 sm:inline" style={{ fontSize: px(13), fontWeight: 700, stroke: "#fff", strokeWidth: px(3) }}>Bhubaneswar</text>
                                    <g className="hidden sm:inline">
                                        {GEO.districts.map((g) => {
                                            const [dx, dy] = LABEL_NUDGE[g.id] ?? [0, 0];
                                            return (
                                                <text key={g.id} x={(g.cx + dx) * U} y={(g.cy + dy) * U} textAnchor="middle" dominantBaseline="middle" className="fill-ink-900"
                                                    style={{ fontSize: px(13), fontWeight: hover === `d:${g.id}` ? 800 : 600, stroke: "rgba(255,255,255,.85)", strokeWidth: px(3) }}>
                                                    {byId[g.id]?.name ?? g.census}
                                                </text>
                                            );
                                        })}
                                    </g>
                                </>
                            )}
                            {level === "district" && units.map((u) => (u.r * 2 * ppu > Math.min(70, u.n.length * 7.5) ? (
                                <text key={u.c} x={u.x} y={u.y} textAnchor="middle" dominantBaseline="middle" className="fill-ink-900"
                                    style={{ fontSize: px(12.5), fontWeight: hover === `u:${u.c}` ? 800 : 600, stroke: "rgba(255,255,255,.9)", strokeWidth: px(3) }}>
                                    {u.n}
                                </text>
                            ) : null))}
                            {level !== "state" && level !== "district" && units.filter((u) => u.c !== view.u).map((u) => (u.r * 2 * ppu > 90 ? (
                                <text key={u.c} x={u.x} y={u.y} textAnchor="middle" dominantBaseline="middle" className="fill-ink-500"
                                    style={{ fontSize: px(12), fontWeight: 600, stroke: "rgba(255,255,255,.8)", strokeWidth: px(3) }}>
                                    {u.n}
                                </text>
                            ) : null))}
                            {(level === "unit" || level === "village") && unitVillages.map((v) => {
                                const sel = village && vKey(village) === vKey(v);
                                if (!sel && v[10] * 2 * ppu < Math.min(64, v[1].length * 6.5)) return null;
                                return (
                                    <text key={vKey(v)} x={v[8]} y={v[9]} textAnchor="middle" dominantBaseline="middle" className={sel ? "fill-ink-950" : "fill-ink-800"}
                                        style={{ fontSize: px(sel ? 14 : 11), fontWeight: sel ? 800 : 500, stroke: "rgba(255,255,255,.9)", strokeWidth: px(3) }}>
                                        {v[1]}
                                    </text>
                                );
                            })}
                        </g>

                        {level === "state" && (
                            <g transform="translate(4600 6000)" pointerEvents="none" className="fill-ink-700">
                                <path d="M0 -2600 L900 400 L0 -200 L-900 400 Z" />
                                <text y="2200" textAnchor="middle" style={{ fontSize: 1400, fontWeight: 700 }}>N</text>
                            </g>
                        )}
                    </svg>

                    {/* Back + zoom controls */}
                    {level !== "state" && (
                        <button type="button" onClick={up} className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-sm font-semibold text-ink-900 shadow-md ring-1 ring-sand-200 hover:bg-white">
                            <Icon name="arrowLeft" className="h-4 w-4" />
                            {level === "district" ? "Odisha" : level === "unit" ? cur?.name : unit ? `${unit.n}${view.kind === "sd" ? "" : " block"}` : "Back"}
                        </button>
                    )}
                    <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-xl bg-white/95 shadow-md ring-1 ring-sand-200">
                        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(0.6)} className="grid h-9 w-9 place-items-center text-lg font-semibold text-ink-800 hover:bg-sand-100">+</button>
                        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1.6)} className="grid h-9 w-9 place-items-center border-t border-sand-200 text-lg font-semibold text-ink-800 hover:bg-sand-100">−</button>
                        <button type="button" aria-label="Fit to view" onClick={() => animateTo(targetFor(view))} className="grid h-9 w-9 place-items-center border-t border-sand-200 text-ink-800 hover:bg-sand-100">
                            <Icon name="compass" className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Hover tooltip (mouse only) */}
                    {tip && !drag.current?.moved && (hovDistrict || hovUnit || hovVillage) && (
                        <div className="pointer-events-none absolute z-10 hidden min-w-44 rounded-xl bg-ink-900/95 px-3.5 py-2.5 text-white shadow-lg md:block"
                            style={{ left: tip.x, top: tip.y - 14, transform: "translate(-50%, -100%)" }}>
                            {hovDistrict && (
                                <>
                                    <p className="font-display text-base font-semibold leading-tight">{hovDistrict.name}</p>
                                    <p className="font-odia text-sm text-saffron-200">{hovDistrict.odia}</p>
                                    <p className="mt-1 text-xs text-ink-100">
                                        {mode === "literacy" && level === "state" ? `Literacy ${hovDistrict.literacy}%` : mode === "density" && level === "state" ? `${fmt(hovDistrict.density)} people / km²` : mode === "population" && level === "state" ? `Population ${fmtShort(hovDistrict.population)}` : `HQ ${hovDistrict.hq} · click to explore`}
                                    </p>
                                </>
                            )}
                            {hovUnit && (
                                <>
                                    <p className="font-display text-base font-semibold leading-tight">{hovUnit.n}</p>
                                    <p className="text-xs text-saffron-200">{unitLabel}{hovUnit.g ? ` · ${hovUnit.g} gram panchayats` : ""}{hovUnit.v ? ` · ${fmt(hovUnit.v)} villages` : ""}</p>
                                </>
                            )}
                            {hovVillage && (
                                <>
                                    <p className="font-display text-base font-semibold leading-tight">{hovVillage[1]}</p>
                                    {hovVillage[2] && <p className="font-odia text-sm text-saffron-200">{hovVillage[2]}</p>}
                                    <p className="mt-0.5 text-xs text-ink-100">{gpLabel(dl?.gps[hovVillage[4]]) || "Village"}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Legend / hint */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sand-200 px-4 py-3 text-xs text-ink-700 sm:px-5 sm:text-sm">
                    {level === "state" ? (
                        mode === "region" ? (
                            (["coastal", "central", "northern", "southern"] as const).map((r) => (
                                <span key={r} className="inline-flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-sm" style={{ background: REGION_STYLE[r].fill }} />
                                    {REGION_STYLE[r].label}
                                </span>
                            ))
                        ) : scale ? (
                            <div className="flex w-full flex-wrap items-center gap-3">
                                <span className="font-medium text-ink-900">{modeInfo.label}</span>
                                <span>{mode === "population" ? fmtShort(scale.min) : fmt(scale.min)}</span>
                                <span className="flex h-3 min-w-40 flex-1 overflow-hidden rounded-full sm:max-w-xs">
                                    {modeInfo.ramp.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
                                </span>
                                <span>{mode === "population" ? fmtShort(scale.max) : fmt(scale.max)}</span>
                                <span className="text-ink-500">{modeInfo.unit} · Census 2011</span>
                            </div>
                        ) : null
                    ) : (
                        <span className="text-ink-600">
                            {level === "district" ? `Click a ${unitLabel.toLowerCase()} to see its villages.` : level === "unit" ? "Click a village for details. Villages sharing a colour belong to the same gram panchayat area." : "Click another village, or go back up a level."}
                            <span className="hidden md:inline"> Drag to pan · Ctrl/⌘ + scroll to zoom.</span>
                        </span>
                    )}
                    {level === "state" && (
                        <span className="ml-auto inline-flex items-center gap-2 text-ink-500">
                            <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-ink-900 ring-1 ring-ink-900" /> State capital
                        </span>
                    )}
                </div>
            </div>

            {/* Side panel */}
            <aside ref={panel} className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-live="polite">
                {level === "state" && (
                    <div className="card p-0">
                        <div className="border-b border-sand-200 p-5">
                            <h2 className="font-display text-xl font-semibold text-ink-900">30 districts</h2>
                            <p className="mt-1 text-sm text-ink-600">Click a district to zoom in to its blocks and villages.</p>
                            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div><dt className="text-xs uppercase tracking-wide text-ink-500">Population</dt><dd className="font-semibold text-ink-900">{fmtShort(totals.population)}</dd></div>
                                <div><dt className="text-xs uppercase tracking-wide text-ink-500">Area (sum of districts)</dt><dd className="font-semibold text-ink-900" title="Sum of the published district areas. The state's official area is 155,707 km².">{fmt(totals.area)} km²</dd></div>
                                {totals.blocks > 0 && <div><dt className="text-xs uppercase tracking-wide text-ink-500">Blocks</dt><dd className="font-semibold text-ink-900">{totals.blocks}</dd></div>}
                                {totals.villages > 0 && <div><dt className="text-xs uppercase tracking-wide text-ink-500">Villages</dt><dd className="font-semibold text-ink-900">{fmt(totals.villages)}</dd></div>}
                            </dl>
                            <p className="mt-2 text-xs text-ink-500">Area adds up the published district figures; Odisha&apos;s official area is 155,707 km². Villages are LGD villages (December 2022).</p>
                            <SearchBox value={query} onChange={setQuery} placeholder="Find a district…" />
                        </div>
                        <ul className="max-h-[26rem] overflow-y-auto p-2">
                            {list.map((d) => (
                                <li key={d.id}>
                                    <button type="button" onClick={() => go({ d: d.id })} onMouseEnter={() => setHover(`d:${d.id}`)} onMouseLeave={() => setHover(null)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-sand-100 ${hover === `d:${d.id}` ? "bg-sand-100" : ""}`}>
                                        <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: districtFill(d.id) }} />
                                        <span className="flex-1">
                                            <span className="block text-sm font-semibold text-ink-900">{d.name}</span>
                                            <span className="block text-xs text-ink-500">{d.hq}</span>
                                        </span>
                                        <span className="font-odia text-sm text-ink-500">{d.odia}</span>
                                    </button>
                                </li>
                            ))}
                            {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-500">No district matches “{query}”.</li>}
                        </ul>
                    </div>
                )}

                {level === "district" && cur && (
                    <div className="card overflow-hidden p-0">
                        <PanelHead eyebrow={`${REGION_STYLE[cur.region].label} Odisha`} title={cur.name} odia={cur.odia} sub={<>Headquarters: <span className="font-medium text-ink-900">{cur.hq}</span></>} tint={REGION_STYLE[cur.region].fill} onClose={() => go({})} />
                        <Stats items={[["Population", fmt(cur.population)], ["Area", `${fmt(cur.area)} km²`], ["Literacy", `${cur.literacy}%`], ["Villages", cur.villages ? fmt(cur.villages) : "—"]]} />
                        <div className="border-t border-sand-200 px-5 pb-2 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{units.length} {unitKind === "sd" ? "census sub-districts" : "blocks"}</p>
                        </div>
                        <ul className="max-h-72 overflow-y-auto px-2 pb-2">
                            {[...units].sort((a, b) => a.n.localeCompare(b.n)).map((u) => (
                                <li key={u.c}>
                                    <button type="button" onClick={() => go({ d: view.d, kind: unitKind, u: u.c })} onMouseEnter={() => setHover(`u:${u.c}`)} onMouseLeave={() => setHover(null)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sand-100 ${hover === `u:${u.c}` ? "bg-sand-100" : ""}`}>
                                        <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: UNIT_FILLS[u.k % UNIT_FILLS.length] }} />
                                        <span className="flex-1 font-semibold text-ink-900">{u.n}</span>
                                        {u.v ? <span className="text-xs text-ink-500">{fmt(u.v)} villages</span> : null}
                                    </button>
                                </li>
                            ))}
                            {!dl && <li className="px-3 py-4 text-sm text-ink-500">Loading blocks…</li>}
                        </ul>
                        {unitKind === "block" && dl?.unmapped?.length ? (
                            <p className="px-5 pb-3 text-xs leading-relaxed text-ink-500">
                                Not drawn (no village boundaries available):{" "}
                                {dl.unmapped.map((b, i) => (
                                    <span key={b.c}>{i > 0 && ", "}<Link href={`/district/${view.d}/block/${b.s}`} className="font-medium text-laterite-600 hover:underline">{b.n}</Link></span>
                                ))}
                                . Its area appears as part of the neighbouring blocks.
                            </p>
                        ) : null}
                        {unitKind === "sd" && <p className="px-5 pb-3 text-xs leading-relaxed text-ink-500">Census sub-districts in Odisha follow police-station areas; they are not the same as revenue tahasils.</p>}
                        <div className="flex flex-col gap-2 border-t border-sand-200 p-5">
                            <Link href={`/district/${cur.id}`} className="btn-primary justify-center">Explore {cur.name} <Icon name="arrow" className="h-4 w-4" /></Link>
                            <Link href={`/district/${cur.id}#places`} className="btn-ghost justify-center"><Icon name="compass" className="h-4 w-4" /> Places to visit</Link>
                        </div>
                    </div>
                )}

                {level === "unit" && unit && (
                    <UnitPanel
                        unit={unit} kind={view.kind ?? "block"} districtName={cur?.name ?? ""} district={view.d!} villages={unitVillages} gps={dl?.gps ?? {}}
                        hover={hover} setHover={setHover} onPick={(k) => go({ d: view.d, kind: view.kind, u: view.u, v: k })} onClose={() => go({ d: view.d })} vKey={vKey}
                    />
                )}

                {level === "village" && village && (
                    <div className="card overflow-hidden p-0">
                        <PanelHead eyebrow="Village" title={village[1]} odia={village[2]} sub={<>{unit?.n}{view.kind === "sd" ? " sub-district" : " block"}, {cur?.name} district</>} tint="#cf6a43" onClose={() => go({ d: view.d, kind: view.kind, u: view.u })} />
                        <Stats items={[
                            ["Gram panchayat", dl?.gps[village[4]] ?? "—"],
                            ["Block", dl?.blocks.find((b) => b.c === village[3])?.n ?? "—"],
                            ["Sub-district", dl?.subdistricts.find((s) => s.c === village[5])?.n ?? "—"],
                            ["LGD code", village[0] || "—"],
                        ]} />
                        <div className="flex flex-col gap-2 p-5">
                            {village[0] && <Link href={`/district/${view.d}/village/${village[0]}-${slugify(village[1])}`} prefetch={false} className="btn-primary justify-center">Village details <Icon name="arrow" className="h-4 w-4" /></Link>}
                            {dl?.blocks.find((b) => b.c === village[3]) && (
                                <Link href={`/district/${view.d}/block/${dl.blocks.find((b) => b.c === village[3])!.s}`} className="btn-ghost justify-center"><Icon name="list" className="h-4 w-4" /> All villages in the block</Link>
                            )}
                            {!village[0] && <p className="text-xs text-ink-500">This Census 2011 village could not be matched to a current Local Government Directory entry; its block is inferred from the map.</p>}
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}

/* ----------------------------------------------------------- sub-parts */

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <label className="relative mt-4 block">
            <span className="sr-only">{placeholder}</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                className="w-full rounded-full border border-sand-300 bg-sand-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-laterite-400 focus:ring-2 focus:ring-laterite-100" />
        </label>
    );
}

function PanelHead({ eyebrow, title, odia, sub, tint, onClose }: { eyebrow: string; title: string; odia?: string; sub?: React.ReactNode; tint: string; onClose: () => void }) {
    return (
        <div className="relative px-5 pb-4 pt-5" style={{ background: `linear-gradient(135deg, ${tint}33, transparent)` }}>
            <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-ink-500 hover:bg-white hover:text-ink-900" aria-label="Go back one level">
                <Icon name="close" className="h-4 w-4" />
            </button>
            <span className="chip mb-3" style={{ background: `${tint}26` }}>{eyebrow}</span>
            <h2 className="font-display text-3xl font-semibold text-ink-900">{title}</h2>
            {odia && <p className="font-odia text-lg text-laterite-600">{odia}</p>}
            {sub && <p className="mt-1 text-sm text-ink-600">{sub}</p>}
        </div>
    );
}

function Stats({ items }: { items: [string, string][] }) {
    return (
        <dl className="grid grid-cols-2 gap-px bg-sand-200 text-sm">
            {items.map(([k, v], i) => (
                <div key={k} className={`bg-white px-5 py-3 ${items.length % 2 && i === items.length - 1 ? "col-span-2" : ""}`}>
                    <dt className="text-xs uppercase tracking-wide text-ink-500">{k}</dt>
                    <dd className="mt-0.5 font-semibold text-ink-900">{v}</dd>
                </div>
            ))}
        </dl>
    );
}

function UnitPanel({ unit, kind, district, districtName, villages, gps, hover, setHover, onPick, onClose, vKey }: {
    unit: Unit; kind: UnitKind; district: string; districtName: string; villages: VillageRow[]; gps: Record<string, string>;
    hover: string | null; setHover: (h: string | null) => void; onPick: (k: string) => void; onClose: () => void; vKey: (v: VillageRow) => string;
}) {
    const [q, setQ] = useState("");
    const gpCount = new Set(villages.map((v) => v[4]).filter(Boolean)).size;
    const shown = villages.filter((v) => !q || v[1].toLowerCase().includes(q.toLowerCase()) || (gps[v[4]] ?? "").toLowerCase().includes(q.toLowerCase()) || v[2].includes(q))
        .sort((a, b) => a[1].localeCompare(b[1]));
    return (
        <div className="card overflow-hidden p-0">
            <PanelHead eyebrow={kind === "sd" ? "Census sub-district" : "Community development block"} title={unit.n} sub={<>{districtName} district</>} tint="#e08a1e" onClose={onClose} />
            <Stats items={[["Villages on map", fmt(villages.length)], ["Gram panchayats", fmt(kind === "block" && unit.g ? unit.g : gpCount)]]} />
            <div className="border-t border-sand-200 px-5 pb-2 pt-3">
                <SearchBox value={q} onChange={setQ} placeholder="Find a village or panchayat…" />
            </div>
            <ul className="max-h-72 overflow-y-auto px-2 pb-2">
                {shown.slice(0, 400).map((v) => (
                    <li key={vKey(v)}>
                        <button type="button" onClick={() => onPick(vKey(v))} onMouseEnter={() => setHover(`v:${vKey(v)}`)} onMouseLeave={() => setHover(null)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm transition-colors hover:bg-sand-100 ${hover === `v:${vKey(v)}` ? "bg-sand-100" : ""}`}>
                            <span className="h-3 w-3 shrink-0 rounded-sm ring-1 ring-sand-300" style={{ background: VILLAGE_FILLS[v[6] % VILLAGE_FILLS.length] }} />
                            <span className="flex-1">
                                <span className="block font-medium text-ink-900">{v[1]}</span>
                                {gps[v[4]] && <span className="block text-xs text-ink-500">{gpLabel(gps[v[4]])}</span>}
                            </span>
                            {v[2] && <span className="font-odia text-xs text-ink-500">{v[2]}</span>}
                        </button>
                    </li>
                ))}
                {shown.length === 0 && <li className="px-3 py-4 text-sm text-ink-500">No village matches.</li>}
                {shown.length > 400 && <li className="px-3 py-2 text-xs text-ink-500">Showing 400 of {shown.length} — search to narrow down.</li>}
            </ul>
            <div className="border-t border-sand-200 p-5">
                <Link href={kind === "sd" ? `/district/${district}/tahasil/${unit.s}` : `/district/${district}/block/${unit.s}`} className="btn-primary w-full justify-center">
                    Open {kind === "sd" ? "sub-district" : "block"} page <Icon name="arrow" className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
