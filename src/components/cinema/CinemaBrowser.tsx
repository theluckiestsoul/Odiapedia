"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";

type Row = [string, string, number, string[], string[], string[], string[], number];

export default function CinemaBrowser({ decades }: { decades: string[] }) {
    const [rows, setRows] = useState<Row[] | null>(null);
    const [q, setQ] = useState("");
    const [dec, setDec] = useState<string>("all");
    const [awarded, setAwarded] = useState(false);
    const [limit, setLimit] = useState(60);

    useEffect(() => {
        fetch("/data/cinema/index.json").then((r) => r.json()).then((d) => setRows(d.films)).catch(() => setRows([]));
    }, []);
    useEffect(() => setLimit(60), [q, dec, awarded]);

    const shown = useMemo(() => {
        if (!rows) return [];
        const s = q.trim().toLowerCase();
        return rows.filter((r) =>
            (dec === "all" || (dec === "Undated" ? !r[2] : r[2] && `${Math.floor(r[2] / 10) * 10}s` === dec)) &&
            (!awarded || r[7]) &&
            (!s || r[1].toLowerCase().includes(s) || r[3].some((x) => x.toLowerCase().includes(s)) || r[4].some((x) => x.toLowerCase().includes(s)) || r[5].some((x) => x.toLowerCase().includes(s)) || String(r[2]) === s)
        ).sort((a, b) => (b[2] || 0) - (a[2] || 0));
    }, [rows, q, dec, awarded]);

    return (
        <div>
            <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                <label className="relative flex-1">
                    <span className="sr-only">Search films</span>
                    <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a film, actor, director, music director or year…" className="w-full rounded-full border border-sand-300 bg-sand-50 py-2.5 pl-9 pr-4 outline-none focus:border-laterite-400 focus:ring-2 focus:ring-laterite-100" />
                </label>
                <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
                    {["all", ...decades].map((d) => (
                        <button key={d} type="button" onClick={() => setDec(d)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${dec === d ? "bg-ink-900 text-white" : "bg-sand-100 text-ink-700 hover:bg-sand-200"}`}>{d === "all" ? "All years" : d}</button>
                    ))}
                    <button type="button" onClick={() => setAwarded((x) => !x)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${awarded ? "bg-saffron-400 text-ink-950" : "bg-sand-100 text-ink-700 hover:bg-sand-200"}`}>Award winners</button>
                </div>
            </div>
            <p className="mt-3 text-sm text-ink-500">{rows ? `${shown.length.toLocaleString("en-IN")} films` : "Loading films…"}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shown.slice(0, limit).map((r) => (
                    <li key={r[0]}>
                        <Link href={`/cinema/film/${r[0]}`} className="card-link flex h-full flex-col p-4">
                            <span className="flex items-baseline justify-between gap-3">
                                <span className="font-display text-lg font-semibold leading-snug text-ink-900">{r[1]}</span>
                                <span className="shrink-0 text-sm font-semibold text-laterite-600">{r[2] || "—"}</span>
                            </span>
                            {r[3].length > 0 && <span className="mt-1 text-xs text-ink-500">Dir. {r[3].join(", ")}</span>}
                            {r[4].length > 0 && <span className="mt-1 line-clamp-1 text-sm text-ink-700">{r[4].join(", ")}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            {shown.length > limit && <div className="mt-6 text-center"><button type="button" onClick={() => setLimit((l) => l + 120)} className="btn-ghost">Show more</button></div>}
        </div>
    );
}
