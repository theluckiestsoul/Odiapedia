"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import type { AdminDistrict, AdminVillage } from "@/lib/admin";

type Mode = "blocks" | "subdistricts" | "towns";

interface Summary {
    district: string;
    districtName: string;
    blocks: { code: string; name: string; slug: string; gps: number; villages: number }[];
    subdistricts: { code: string; name: string; slug: string; villages: number }[];
    ulbs: { code: string; name: string; type: string }[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const villageHref = (d: string, v: AdminVillage) => `/district/${d}/village/${v.c}-${slugify(v.n)}`;

/**
 * Three-pane drill-down: pick a block / tahasil / town on the left, see its details in the middle
 * and its gram panchayats + villages on the right. The full village list is fetched only when needed.
 */
export default function AdminExplorer({ summary }: { summary: Summary }) {
    const [mode, setMode] = useState<Mode>("blocks");
    const [selected, setSelected] = useState<string>(summary.blocks[0]?.code ?? "");
    const [gp, setGp] = useState<string>("all");
    const [q, setQ] = useState("");
    const [data, setData] = useState<AdminDistrict | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let alive = true;
        fetch(`/data/admin/${summary.district}.json`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => alive && setData(d))
            .catch(() => alive && setError(true));
        return () => {
            alive = false;
        };
    }, [summary.district]);

    useEffect(() => {
        setGp("all");
        setQ("");
    }, [selected, mode]);

    const list =
        mode === "blocks"
            ? summary.blocks.map((b) => ({ code: b.code, name: b.name, meta: `${b.gps} GPs · ${b.villages} villages` }))
            : mode === "subdistricts"
                ? summary.subdistricts.map((s) => ({ code: s.code, name: s.name, meta: `${s.villages} villages` }))
                : summary.ulbs.map((u) => ({ code: u.code, name: u.name, meta: u.type || "Urban local body" }));

    const block = data?.blocks.find((b) => b.code === selected);
    const sd = data?.subdistricts.find((s) => s.code === selected);

    const villages = useMemo(() => {
        if (!data || mode === "towns") return [];
        const t = q.trim().toLowerCase();
        return data.villages.filter(
            (v) =>
                (mode === "blocks" ? v.b === selected : v.s === selected) &&
                (gp === "all" || v.g === gp) &&
                (!t || v.n.toLowerCase().includes(t) || (v.o || "").includes(q.trim()))
        );
    }, [data, mode, selected, gp, q]);

    const gps = mode === "blocks" ? block?.gps ?? [] : [];
    const sdBlocks = useMemo(() => {
        if (!data || mode !== "subdistricts") return [];
        const codes = new Set(data.villages.filter((v) => v.s === selected).map((v) => v.b));
        return data.blocks.filter((b) => codes.has(b.code) && b.code !== "0");
    }, [data, mode, selected]);

    const selName = list.find((l) => l.code === selected)?.name;
    const blockSummary = summary.blocks.find((b) => b.code === selected);
    const sdSummary = summary.subdistricts.find((s) => s.code === selected);

    return (
        <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white">
            {/* Mode switch */}
            <div className="flex flex-wrap items-center gap-2 border-b border-sand-200 bg-sand-50 p-3" role="tablist" aria-label="Administrative units">
                {(
                    [
                        ["blocks", `Blocks (${summary.blocks.filter((b) => b.code !== "0").length})`],
                        ["subdistricts", `Sub-districts (${summary.subdistricts.length})`],
                        ["towns", `Towns (${summary.ulbs.length})`],
                    ] as [Mode, string][]
                ).map(([m, label]) => (
                    <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => {
                            setMode(m);
                            setSelected(m === "blocks" ? summary.blocks[0]?.code ?? "" : m === "subdistricts" ? summary.subdistricts[0]?.code ?? "" : summary.ulbs[0]?.code ?? "");
                        }}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === m ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-white"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1.2fr)]">
                {/* 1. List */}
                <nav aria-label="Select a unit" className="max-h-[34rem] overflow-y-auto border-b border-sand-200 p-2 lg:border-b-0 lg:border-r">
                    <ul className="space-y-1">
                        {list.map((l) => (
                            <li key={l.code}>
                                <button
                                    type="button"
                                    onClick={() => setSelected(l.code)}
                                    aria-current={selected === l.code}
                                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${selected === l.code ? "bg-laterite-500 text-white" : "hover:bg-sand-100"}`}
                                >
                                    <span className="block text-sm font-semibold">{l.name}</span>
                                    <span className={`block text-xs ${selected === l.code ? "text-laterite-100" : "text-ink-500"}`}>{l.meta}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* 2. Details */}
                <section aria-live="polite" className="border-b border-sand-200 p-6 lg:border-b-0 lg:border-r">
                    {mode === "towns" ? (
                        <TownDetails ulb={summary.ulbs.find((u) => u.code === selected)} district={summary.districtName} />
                    ) : (
                        <>
                            <p className="eyebrow">{mode === "blocks" ? "Community development block" : "Census sub-district (police-station area)"}</p>
                            <h3 className="mt-2 font-display text-3xl font-semibold">{selName}</h3>
                            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                {mode === "blocks" && blockSummary && (
                                    <>
                                        <Stat k="Gram panchayats" v={blockSummary.gps} />
                                        <Stat k="Villages" v={blockSummary.villages} />
                                        <Stat k="LGD block code" v={blockSummary.code} />
                                        <Stat k="District" v={summary.districtName} />
                                    </>
                                )}
                                {mode === "subdistricts" && sdSummary && (
                                    <>
                                        <Stat k="Villages" v={sdSummary.villages} />
                                        <Stat k="Blocks covered" v={data ? sdBlocks.length : "…"} />
                                        <Stat k="LGD code" v={sdSummary.code} />
                                        <Stat k="District" v={summary.districtName} />
                                    </>
                                )}
                            </dl>

                            {mode === "subdistricts" && sdBlocks.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Blocks in this sub-district</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {sdBlocks.map((b) => (
                                            <Link key={b.code} href={`/district/${summary.district}/block/${b.slug}`} className="chip hover:border-laterite-300">{b.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mode === "blocks" && gps.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Gram panchayats — tap to filter villages</p>
                                    <div className="mt-2 flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
                                        <button type="button" onClick={() => setGp("all")} className={`rounded-full border px-3 py-1 text-xs ${gp === "all" ? "border-laterite-500 bg-laterite-500 text-white" : "border-sand-300 bg-white text-ink-700"}`}>All</button>
                                        {gps.map((g) => (
                                            <button key={g.code} type="button" onClick={() => setGp(g.code)} className={`rounded-full border px-3 py-1 text-xs ${gp === g.code ? "border-laterite-500 bg-laterite-500 text-white" : "border-sand-300 bg-white text-ink-700 hover:border-laterite-300"}`}>
                                                {g.name} <span className="opacity-70">{g.villages}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Link
                                href={mode === "blocks" ? `/district/${summary.district}/block/${blockSummary?.slug}` : `/district/${summary.district}/tahasil/${sdSummary ? `${slugify(sdSummary.name)}-${sdSummary.code}` : ""}`}
                                className="btn-dark mt-6"
                            >
                                Open full {mode === "blocks" ? "block" : "sub-district"} page <Icon name="arrow" className="h-4 w-4" />
                            </Link>
                        </>
                    )}
                </section>

                {/* 3. Villages */}
                <section className="p-4">
                    {mode === "towns" ? (
                        <p className="p-2 text-sm text-ink-600">Towns are governed by urban local bodies (municipal corporations, municipalities and notified area councils) rather than gram panchayats, so they have no village list.</p>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-ink-900">
                                    Villages {gp !== "all" && <span className="font-normal text-ink-500">in {gps.find((g) => g.code === gp)?.name} GP</span>}
                                    <span className="ml-1 font-normal text-ink-500">({data ? villages.length : "…"})</span>
                                </p>
                                <label className="flex items-center gap-2 rounded-full border border-sand-300 px-3 py-1.5 text-sm focus-within:border-laterite-400">
                                    <Icon name="search" className="h-3.5 w-3.5 text-ink-400" />
                                    <span className="sr-only">Filter villages</span>
                                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a village" className="w-32 bg-transparent outline-none sm:w-40" />
                                </label>
                            </div>
                            {error && <p className="mt-4 text-sm text-ink-600">Village list could not be loaded. Open the full page instead.</p>}
                            {!data && !error && <div className="mt-4 h-64 animate-pulse rounded-xl bg-sand-100" />}
                            {data && (
                                <ul className="mt-3 grid max-h-[28rem] grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
                                    {villages.slice(0, 600).map((v) => (
                                        <li key={v.c}>
                                            <Link href={villageHref(summary.district, v)} prefetch={false} className="flex items-baseline justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm hover:bg-sand-100">
                                                <span className="truncate text-ink-800">{v.n}{v.u ? <span className="ml-1 text-xs text-ink-400">(uninhabited)</span> : null}</span>
                                                {v.o && <span lang="or" className="shrink-0 font-odia text-xs text-ink-400">{v.o}</span>}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {villages.length > 600 && <p className="mt-2 text-xs text-ink-500">Showing 600 of {villages.length}. Use the search or a gram panchayat filter.</p>}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

function Stat({ k, v }: { k: string; v: string | number }) {
    return (
        <div className="rounded-xl bg-sand-50 p-3">
            <dt className="text-xs text-ink-500">{k}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-ink-900">{typeof v === "number" ? v.toLocaleString("en-IN") : v}</dd>
        </div>
    );
}

function TownDetails({ ulb, district }: { ulb?: { code: string; name: string; type: string }; district: string }) {
    if (!ulb) return <p className="text-sm text-ink-600">No urban local bodies listed.</p>;
    return (
        <>
            <p className="eyebrow">{ulb.type || "Urban local body"}</p>
            <h3 className="mt-2 font-display text-3xl font-semibold">{ulb.name}</h3>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Stat k="Type" v={ulb.type || "Urban local body"} />
                <Stat k="District" v={district} />
                <Stat k="LGD code" v={ulb.code} />
            </dl>
        </>
    );
}
