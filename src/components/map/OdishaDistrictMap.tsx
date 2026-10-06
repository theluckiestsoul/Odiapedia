"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type MouseEvent } from "react";
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

type Mode = "region" | "density" | "literacy" | "population";

interface GeoDistrict { id: string; census: string; path: string; cx: number; cy: number }
const GEO = geo as unknown as { width: number; height: number; bounds: number[]; lat0: number; scale: number; pad: number; districts: GeoDistrict[] };

const kx = Math.cos((GEO.lat0 * Math.PI) / 180);
const proj = (lng: number, lat: number) => [(lng - GEO.bounds[0]) * kx * GEO.scale + GEO.pad, (GEO.bounds[3] - lat) * GEO.scale + GEO.pad] as const;


const MODES: { id: Mode; label: string; unit: string; ramp: string[] }[] = [
    { id: "region", label: "Regions", unit: "", ramp: [] },
    { id: "density", label: "Density", unit: "people / km²", ramp: ["#fbf1ec", "#f6ddd1", "#ecb9a2", "#df8f6d", "#cf6a43", "#9c4122"] },
    { id: "literacy", label: "Literacy", unit: "% literate", ramp: ["#eef2f9", "#d9e1f0", "#b3c2df", "#8199c6", "#5671a9", "#2f4574"] },
    { id: "population", label: "Population", unit: "people", ramp: ["#fef8ec", "#fdf0d5", "#fbdca1", "#f6c164", "#f0a63a", "#bf6c12"] },
];

const LABEL_NUDGE: Record<string, [number, number]> = {
    jagatsinghpur: [22, 10],
    kendrapara: [6, -4],
    khordha: [-6, 6],
    cuttack: [0, -4],
    jharsuguda: [0, 2],
};

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

function value(d: MapDistrict, m: Mode) {
    return m === "density" ? d.density : m === "literacy" ? d.literacy : d.population;
}

/** Equal-count (quantile) breaks so every colour step is used. */
function breaks(values: number[], steps: number) {
    const s = [...values].sort((a, b) => a - b);
    return Array.from({ length: steps - 1 }, (_, i) => s[Math.floor(((i + 1) * s.length) / steps)]);
}

export default function OdishaDistrictMap({ districts }: { districts: MapDistrict[] }) {
    const [mode, setMode] = useState<Mode>("region");
    const [hover, setHover] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
    const [query, setQuery] = useState("");
    const box = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLElement>(null);
    const pickOnMap = (id: string | null) => {
        setSelected(id);
        if (id && window.innerWidth < 1024) requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };

    const byId = useMemo(() => Object.fromEntries(districts.map((d) => [d.id, d])), [districts]);
    const modeInfo = MODES.find((m) => m.id === mode)!;
    const scale = useMemo(() => {
        if (mode === "region") return null;
        const b = breaks(districts.map((d) => value(d, mode)), modeInfo.ramp.length);
        const vals = districts.map((d) => value(d, mode));
        return { b, min: Math.min(...vals), max: Math.max(...vals) };
    }, [districts, mode, modeInfo.ramp.length]);

    const fillFor = (id: string) => {
        const d = byId[id];
        if (!d) return "#ede2cf";
        if (mode === "region" || !scale) return REGION_STYLE[d.region].fill;
        const v = value(d, mode);
        let i = 0;
        while (i < scale.b.length && v >= scale.b[i]) i++;
        return modeInfo.ramp[i];
    };

    const active = hover ?? selected;
    const sel = selected ? byId[selected] : null;
    const hov = hover ? byId[hover] : null;

    const onMove = (e: MouseEvent) => {
        const r = box.current?.getBoundingClientRect();
        if (r) setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    const list = districts
        .filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase()) || d.odia.includes(query) || d.hq.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const totals = useMemo(() => ({
        population: districts.reduce((s, d) => s + d.population, 0),
        area: districts.reduce((s, d) => s + d.area, 0),
        blocks: districts.reduce((s, d) => s + (d.blocks ?? 0), 0),
        villages: districts.reduce((s, d) => s + (d.villages ?? 0), 0),
    }), [districts]);

    // Draw the active district last so its outline sits on top.
    const ordered = useMemo(() => {
        const rest = GEO.districts.filter((g) => g.id !== active);
        const top = GEO.districts.find((g) => g.id === active);
        return top ? [...rest, top] : rest;
    }, [active]);

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            {/* Map card */}
            <div className="card overflow-hidden p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 px-4 py-3 sm:px-5">
                    <p className="text-sm font-semibold text-ink-900">Colour districts by</p>
                    <div role="radiogroup" aria-label="Map colouring" className="flex flex-wrap gap-1 rounded-full bg-sand-100 p-1">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                role="radio"
                                aria-checked={mode === m.id}
                                onClick={() => setMode(m.id)}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${mode === m.id ? "bg-white text-laterite-600 shadow-sm" : "text-ink-600 hover:text-ink-900"}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div ref={box} className="relative bg-[#f3eee4]" onMouseMove={onMove} onMouseLeave={() => { setHover(null); setTip(null); }}>
                    <svg
                        viewBox={`0 0 ${GEO.width} ${GEO.height}`}
                        className="block h-auto w-full select-none"
                        role="img"
                        aria-labelledby="odisha-map-title"
                    >
                        <title id="odisha-map-title">Map of Odisha showing its 30 districts</title>
                        <defs>
                            <pattern id="sea-lines" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
                                <path d="M0 7 Q3.5 4 7 7 T14 7" fill="none" stroke="#9cc9c3" strokeWidth="1" />
                            </pattern>
                            <filter id="land-shadow" x="-5%" y="-5%" width="110%" height="110%">
                                <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#5f281a" floodOpacity="0.18" />
                            </filter>
                        </defs>

                        {/* Sea hint in the south-east */}
                        <path d={`M${GEO.width} ${GEO.height * 0.32} C ${GEO.width * 0.85} ${GEO.height * 0.55}, ${GEO.width * 0.7} ${GEO.height * 0.75}, ${GEO.width * 0.55} ${GEO.height} L ${GEO.width} ${GEO.height} Z`} fill="url(#sea-lines)" opacity="0.7" />

                        {NEIGHBOURS.map((n) => {
                            const [x, y] = proj(n.lng, n.lat);
                            return (
                                <text key={n.label} x={x} y={y} textAnchor="middle" className={n.sea ? "fill-chilika-600 font-display italic" : "hidden fill-sand-500 sm:inline"} style={{ fontSize: n.sea ? 24 : 14, letterSpacing: n.sea ? 1 : 3, fontWeight: 600 }}>
                                    {n.label}
                                </text>
                            );
                        })}

                        <g filter="url(#land-shadow)">
                            {ordered.map((g) => {
                                const d = byId[g.id];
                                const isActive = g.id === active;
                                const isSel = g.id === selected;
                                return (
                                    <a
                                        key={g.id}
                                        href={`/district/${g.id}`}
                                        aria-label={d ? `${d.name} district` : g.census}
                                        onClick={(e) => {
                                            // First click selects (shows details); the panel links to the full page.
                                            e.preventDefault();
                                            pickOnMap(isSel ? null : g.id);
                                        }}
                                        onMouseEnter={() => setHover(g.id)}
                                        onMouseLeave={() => setHover(null)}
                                        onFocus={() => setHover(g.id)}
                                        onBlur={() => setHover(null)}
                                        className="cursor-pointer outline-none"
                                    >
                                        <path
                                            d={g.path}
                                            fill={fillFor(g.id)}
                                            stroke={isActive ? "#121c33" : "#fcfaf6"}
                                            strokeWidth={isActive ? 2.5 : 1.2}
                                            strokeLinejoin="round"
                                            style={{ transition: "fill .25s ease, opacity .2s ease", opacity: active && !isActive ? 0.82 : 1 }}
                                        />
                                    </a>
                                );
                            })}
                        </g>

                        {/* Capital */}
                        <g pointerEvents="none">
                            <circle cx={BHUBANESWAR[0]} cy={BHUBANESWAR[1]} r="6" fill="#121c33" stroke="#fff" strokeWidth="2" />
                            <text x={BHUBANESWAR[0] + 10} y={BHUBANESWAR[1] + 5} textAnchor="start" className="hidden fill-ink-900 sm:inline" style={{ fontSize: 13, fontWeight: 700, paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>
                                Bhubaneswar
                            </text>
                        </g>

                        {/* District labels (hidden on small screens where they would be unreadable) */}
                        <g pointerEvents="none" className="hidden sm:inline">
                            {GEO.districts.map((g) => {
                                const d = byId[g.id];
                                const [dx, dy] = LABEL_NUDGE[g.id] ?? [0, 0];
                                return (
                                    <text
                                        key={g.id}
                                        x={g.cx + dx}
                                        y={g.cy + dy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-ink-900"
                                        style={{ fontSize: 13, fontWeight: g.id === active ? 800 : 600, paintOrder: "stroke", stroke: "rgba(255,255,255,.85)", strokeWidth: 3, strokeLinejoin: "round" }}
                                    >
                                        {d?.name ?? g.census}
                                    </text>
                                );
                            })}
                        </g>

                        {/* North arrow */}
                        <g transform="translate(46 60)" pointerEvents="none" className="fill-ink-700">
                            <path d="M0 -26 L9 4 L0 -2 L-9 4 Z" />
                            <text y="22" textAnchor="middle" style={{ fontSize: 14, fontWeight: 700 }}>N</text>
                        </g>
                    </svg>

                    {/* Hover tooltip (mouse only) */}
                    {hov && tip && (
                        <div
                            className="pointer-events-none absolute z-10 hidden min-w-44 -translate-x-1/2 rounded-xl bg-ink-900/95 px-3.5 py-2.5 text-white shadow-lg md:block"
                            style={{ left: tip.x, top: tip.y - 14, transform: "translate(-50%, -100%)" }}
                        >
                            <p className="font-display text-base font-semibold leading-tight">{hov.name}</p>
                            <p className="font-odia text-sm text-saffron-200">{hov.odia}</p>
                            <p className="mt-1 text-xs text-ink-100">
                                {mode === "literacy" ? `Literacy ${hov.literacy}%` : mode === "density" ? `${fmt(hov.density)} people / km²` : mode === "population" ? `Population ${fmtShort(hov.population)}` : `HQ ${hov.hq} · ${REGION_STYLE[hov.region].label}`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sand-200 px-4 py-3 text-xs text-ink-700 sm:px-5 sm:text-sm">
                    {mode === "region" ? (
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
                    ) : null}
                    <span className="ml-auto inline-flex items-center gap-2 text-ink-500">
                        <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-ink-900 ring-1 ring-ink-900" /> State capital
                    </span>
                </div>
            </div>

            {/* Side panel */}
            <aside ref={panel} className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-live="polite">
                {sel ? (
                    <div className="card overflow-hidden p-0">
                        <div className="relative px-5 pb-4 pt-5" style={{ background: `linear-gradient(135deg, ${REGION_STYLE[sel.region].fill}33, transparent)` }}>
                            <button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full p-1.5 text-ink-500 hover:bg-white hover:text-ink-900" aria-label="Close district details">
                                <Icon name="close" className="h-4 w-4" />
                            </button>
                            <span className="chip mb-3" style={{ background: `${REGION_STYLE[sel.region].fill}26` }}>
                                {REGION_STYLE[sel.region].label} Odisha
                            </span>
                            <h2 className="font-display text-3xl font-semibold text-ink-900">{sel.name}</h2>
                            <p className="font-odia text-lg text-laterite-600">{sel.odia}</p>
                            <p className="mt-1 text-sm text-ink-600">Headquarters: <span className="font-medium text-ink-900">{sel.hq}</span></p>
                        </div>
                        <dl className="grid grid-cols-2 gap-px bg-sand-200 text-sm">
                            {[
                                ["Population", fmt(sel.population)],
                                ["Area", `${fmt(sel.area)} km²`],
                                ["Density", `${fmt(sel.density)} / km²`],
                                ["Literacy", `${sel.literacy}%`],
                                ...(sel.blocks ? [["Blocks", String(sel.blocks)], ["Gram panchayats", fmt(sel.gps ?? 0)], ["Villages", fmt(sel.villages ?? 0)]] : []),
                            ].map(([k, v], i, all) => (
                                <div key={k} className={`bg-white px-5 py-3 ${all.length % 2 && i === all.length - 1 ? "col-span-2" : ""}`}>
                                    <dt className="text-xs uppercase tracking-wide text-ink-500">{k}</dt>
                                    <dd className="mt-0.5 font-semibold text-ink-900">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="flex flex-col gap-2 p-5">
                            <Link href={`/district/${sel.id}`} className="btn-primary justify-center">
                                Explore {sel.name} <Icon name="arrow" className="h-4 w-4" />
                            </Link>
                            <Link href={`/district/${sel.id}#places`} className="btn-ghost justify-center">
                                <Icon name="compass" className="h-4 w-4" /> Places to visit
                            </Link>
                            <Link href={`/district/${sel.id}#administration`} className="btn-ghost justify-center">
                                <Icon name="list" className="h-4 w-4" /> Blocks &amp; villages
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card p-0">
                        <div className="border-b border-sand-200 p-5">
                            <h2 className="font-display text-xl font-semibold text-ink-900">30 districts</h2>
                            <p className="mt-1 text-sm text-ink-600">Tap a district on the map or pick one below.</p>
                            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div><dt className="text-xs uppercase tracking-wide text-ink-500">Population</dt><dd className="font-semibold text-ink-900">{fmtShort(totals.population)}</dd></div>
                                <div><dt className="text-xs uppercase tracking-wide text-ink-500">Area</dt><dd className="font-semibold text-ink-900">{fmt(totals.area)} km²</dd></div>
                                {totals.blocks > 0 && <div><dt className="text-xs uppercase tracking-wide text-ink-500">Blocks</dt><dd className="font-semibold text-ink-900">{totals.blocks}</dd></div>}
                                {totals.villages > 0 && <div><dt className="text-xs uppercase tracking-wide text-ink-500">Villages</dt><dd className="font-semibold text-ink-900">{fmt(totals.villages)}</dd></div>}
                            </dl>
                            <label className="relative mt-4 block">
                                <span className="sr-only">Find a district</span>
                                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Find a district…"
                                    className="w-full rounded-full border border-sand-300 bg-sand-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-laterite-400 focus:ring-2 focus:ring-laterite-100"
                                />
                            </label>
                        </div>
                        <ul className="max-h-[26rem] overflow-y-auto p-2">
                            {list.map((d) => (
                                <li key={d.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelected(d.id)}
                                        onMouseEnter={() => setHover(d.id)}
                                        onMouseLeave={() => setHover(null)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-sand-100 ${hover === d.id ? "bg-sand-100" : ""}`}
                                    >
                                        <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: fillFor(d.id) }} />
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
            </aside>
        </div>
    );
}
