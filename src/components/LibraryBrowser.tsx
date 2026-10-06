"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import type { LibraryItem } from "@/data/library";

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Client-side search and filters over the library catalogue (the full list is also server-rendered). */
export default function LibraryBrowser({ items, categories }: { items: LibraryItem[]; categories: string[] }) {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("All");
    const [lang, setLang] = useState("All");
    const languages = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.language))).sort()], [items]);

    const list = useMemo(() => {
        const t = norm(q.trim());
        return items.filter(
            (i) =>
                (cat === "All" || i.category === cat) &&
                (lang === "All" || i.language === lang) &&
                (!t || norm(`${i.title} ${i.titleOdia || ""} ${i.author} ${i.authorOdia || ""} ${i.description} ${i.year}`).includes(t))
        );
    }, [items, q, cat, lang]);

    const counts = useMemo(() => {
        const c: Record<string, number> = {};
        for (const i of items) c[i.category] = (c[i.category] || 0) + 1;
        return c;
    }, [items]);

    return (
        <div>
            <div className="sticky top-[4.5rem] z-20 -mx-4 border-b border-sand-200 bg-background/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <label className="flex flex-1 items-center gap-2 rounded-full border border-sand-300 bg-white px-4 py-2.5 focus-within:border-laterite-400">
                        <Icon name="search" className="h-4 w-4 text-laterite-500" />
                        <span className="sr-only">Search the library</span>
                        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search title, author or year — e.g. Fakir Mohan, gazetteer, 1908" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ink-600">
                        Language
                        <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-full border border-sand-300 bg-white px-3 py-2">
                            {languages.map((l) => <option key={l}>{l}</option>)}
                        </select>
                    </label>
                </div>
                <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
                    {["All", ...categories.filter((c) => counts[c])].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCat(c)}
                            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${cat === c ? "border-laterite-500 bg-laterite-500 text-white" : "border-sand-300 bg-white text-ink-700 hover:border-laterite-300"}`}
                        >
                            {c} <span className={cat === c ? "text-laterite-100" : "text-ink-400"}>{c === "All" ? items.length : counts[c]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <p className="mt-6 text-sm text-ink-500" aria-live="polite">{list.length} of {items.length} works</p>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.map((i) => (
                    <li key={i.slug}>
                        <Link href={`/library/${i.slug}`} className="group card-link flex h-full gap-4 p-5">
                            <span className="relative flex h-24 w-[4.5rem] shrink-0 flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br from-laterite-600 to-laterite-800 p-2 text-white shadow-md">
                                <span className="absolute inset-y-0 left-0 w-1.5 bg-black/20" aria-hidden="true" />
                                <Icon name="book" className="ml-1 h-4 w-4 text-saffron-200" />
                                <span className="ml-1 line-clamp-3 font-display text-[9px] leading-tight">{i.title}</span>
                            </span>
                            <span className="min-w-0">
                                <span className="text-xs font-semibold uppercase tracking-wider text-laterite-600">{i.category}</span>
                                <span className="mt-1 block font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-laterite-700">{i.title}</span>
                                {i.titleOdia && <span lang="or" className="block font-odia text-sm text-ink-500">{i.titleOdia}</span>}
                                <span className="mt-1 block text-sm text-ink-600">{i.author} · {i.year}</span>
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-sand-100 px-2 py-0.5 text-xs text-ink-600">{i.language}{i.pdfUrl ? " · PDF" : ""}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
            {list.length === 0 && <p className="mt-10 text-center text-ink-600">No works match. Try a different word or clear the filters.</p>}
        </div>
    );
}
