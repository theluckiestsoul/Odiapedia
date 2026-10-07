"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";

export interface DirGroup {
    code: string;
    name: string;
    odia?: string;
    villages: { c: string; n: string; o?: string; u?: number; href: string }[];
}

/**
 * Left: groups (gram panchayats or blocks). Right: villages of the selected group, searchable.
 * All villages are rendered on the server first, so the full list is crawlable without JavaScript.
 */
export default function VillageDirectory({ groups, groupLabel }: { groups: DirGroup[]; groupLabel: string }) {
    const [sel, setSel] = useState("all");
    const [q, setQ] = useState("");
    const total = groups.reduce((n, g) => n + g.villages.length, 0);
    const shown = useMemo(() => {
        const t = q.trim().toLowerCase();
        return groups
            .filter((g) => sel === "all" || g.code === sel)
            .map((g) => ({ ...g, villages: g.villages.filter((v) => !t || v.n.toLowerCase().includes(t) || (v.o || "").includes(q.trim())) }))
            .filter((g) => g.villages.length);
    }, [groups, sel, q]);
    const count = shown.reduce((n, g) => n + g.villages.length, 0);

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <nav aria-label={`${groupLabel}s`} className="lg:sticky lg:top-24 lg:h-fit">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{groupLabel}s ({groups.length})</p>
                <ul className="max-h-[70vh] space-y-1 overflow-y-auto rounded-2xl border border-sand-200 bg-white p-2">
                    <li>
                        <button type="button" onClick={() => setSel("all")} className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${sel === "all" ? "bg-laterite-500 text-white" : "hover:bg-sand-100"}`}>
                            All {groupLabel.toLowerCase()}s <span className="font-normal opacity-70">({total})</span>
                        </button>
                    </li>
                    {groups.map((g) => (
                        <li key={g.code}>
                            <button type="button" onClick={() => setSel(g.code)} aria-current={sel === g.code} className={`w-full rounded-xl px-3 py-2 text-left text-sm ${sel === g.code ? "bg-laterite-500 text-white" : "hover:bg-sand-100"}`}>
                                <span className="font-semibold">{g.name}</span> <span className="opacity-70">({g.villages.length})</span>
                                {g.odia && <span lang="or" className="block font-odia text-xs opacity-80">{g.odia}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-ink-600" aria-live="polite">{count.toLocaleString("en-IN")} villages</p>
                    <label className="flex items-center gap-2 rounded-full border border-sand-300 bg-white px-4 py-2 text-sm focus-within:border-laterite-400">
                        <Icon name="search" className="h-4 w-4 text-laterite-500" />
                        <span className="sr-only">Find a village</span>
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a village" className="w-48 bg-transparent outline-none" />
                    </label>
                </div>
                <div className="mt-4 space-y-6">
                    {shown.map((g) => (
                        <section key={g.code} className="rounded-2xl border border-sand-200 bg-white p-5">
                            <h3 className="font-display text-lg font-semibold">
                                {g.name} <span className="text-sm font-normal text-ink-500">{groupLabel} · {g.villages.length} villages</span>
                            </h3>
                            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 xl:grid-cols-4">
                                {g.villages.map((v) => (
                                    <li key={v.c}>
                                        <Link href={v.href} prefetch={false} className="block truncate rounded px-1 py-0.5 text-sm text-ink-800 hover:bg-sand-100 hover:text-laterite-700">
                                            {v.n}{v.u ? <span className="text-xs text-ink-400"> (uninhabited)</span> : null}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                    {shown.length === 0 && <p className="text-ink-600">No village matches.</p>}
                </div>
            </div>
        </div>
    );
}
