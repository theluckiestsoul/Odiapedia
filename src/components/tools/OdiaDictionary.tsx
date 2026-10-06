"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { toOdia } from "@/lib/odia-translit";

interface Entry { w: string; p: string; g: string; s: [string, string][] }
interface Index { entries: number; shards: Record<string, number> }

const BASE = "/data/dict";
const cache = new Map<string, Promise<unknown>>();
function load<T>(file: string): Promise<T> {
    if (!cache.has(file)) cache.set(file, fetch(`${BASE}/${file}`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
    return cache.get(file) as Promise<T>;
}

const ODIA_RE = /[଀-୿]/;

async function shardFor(word: string): Promise<number | undefined> {
    const idx = await load<Index>("index.json");
    if (!idx) return undefined;
    return idx.shards[word.slice(0, 2)] ?? idx.shards[word[0]];
}

/** Odia headword search: exact and prefix matches within the right shard. */
async function searchOdia(q: string): Promise<Entry[]> {
    const sid = await shardFor(q);
    if (sid === undefined) return [];
    const es = (await load<Entry[]>(`o-${sid}.json`)) ?? [];
    const exact = es.filter((e) => e.w === q);
    const prefix = es.filter((e) => e.w !== q && e.w.startsWith(q)).sort((a, b) => a.w.length - b.w.length);
    return [...exact, ...prefix].slice(0, 30);
}

/** English search via the reverse index built from the dictionary's own English glosses. */
async function searchEnglish(q: string): Promise<Entry[]> {
    const term = q.toLowerCase().trim().replace(/^(to|a|an|the)\s+/, "");
    if (!term) return [];
    const m = (await load<Record<string, [number, number][]>>(`e-${term[0]}.json`)) ?? {};
    const refs = m[term] ?? [];
    const shards = await Promise.all([...new Set(refs.map((r) => r[0]))].map(async (s) => [s, await load<Entry[]>(`o-${s}.json`)] as const));
    const byShard = new Map(shards);
    return refs.map(([s, i]) => byShard.get(s)?.[i]).filter(Boolean) as Entry[];
}

function EntryCard({ e, highlight, onPick }: { e: Entry; highlight?: string; onPick: (w: string) => void }) {
    return (
        <article className="card p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 lang="or" className="font-odia text-2xl font-semibold text-ink-900">
                    <button type="button" onClick={() => onPick(e.w)} className="hover:text-laterite-600">{e.w}</button>
                </h3>
                {e.p && <span className="text-sm italic text-ink-500">{e.p}</span>}
                {e.g && <span lang="or" className="rounded-full bg-sand-100 px-2 py-0.5 font-odia text-xs text-ink-600">{e.g}</span>}
            </div>
            <ol className="mt-3 space-y-1.5 text-sm leading-relaxed">
                {e.s.map(([od, en], i) => (
                    <li key={i} className="flex gap-2">
                        {e.s.length > 1 && <span className="w-4 shrink-0 text-ink-400">{i + 1}.</span>}
                        <span>
                            {od && <span lang="or" className="font-odia text-base text-ink-800">{od}</span>}
                            {od && en && <span className="text-ink-300"> — </span>}
                            {en && <span className={highlight && en.toLowerCase().includes(highlight) ? "font-medium text-laterite-700" : "text-ink-600"}>{en}</span>}
                        </span>
                    </li>
                ))}
            </ol>
        </article>
    );
}

export default function OdiaDictionary({ examples }: { examples: string[] }) {
    const [q, setQ] = useState("");
    const [results, setResults] = useState<{ odia: Entry[]; english: Entry[]; translit?: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const reqId = useRef(0);

    const run = useCallback(async (raw: string) => {
        const query = raw.trim();
        const id = ++reqId.current;
        if (!query) { setResults(null); return; }
        setBusy(true);
        try {
            if (ODIA_RE.test(query)) {
                const odia = await searchOdia(query);
                if (id === reqId.current) setResults({ odia, english: [] });
            } else {
                // Latin input: search English meanings, and also treat it as romanised Odia.
                const translit = toOdia(query.replace(/\s+/g, " "));
                const [english, odia] = await Promise.all([searchEnglish(query), searchOdia(translit)]);
                if (id === reqId.current) setResults({ english, odia: odia.slice(0, 8), translit });
            }
        } finally { if (id === reqId.current) setBusy(false); }
    }, []);

    useEffect(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("q");
        if (fromUrl) { setQ(fromUrl); run(fromUrl); }
    }, [run]);

    useEffect(() => {
        const t = setTimeout(() => {
            run(q);
            const url = new URL(window.location.href);
            if (q.trim()) url.searchParams.set("q", q.trim()); else url.searchParams.delete("q");
            history.replaceState(null, "", url);
        }, 250);
        return () => clearTimeout(t);
    }, [q, run]);

    const pick = (w: string) => { setQ(w); window.scrollTo({ top: 0, behavior: "smooth" }); };
    const hl = results && !ODIA_RE.test(q) ? q.toLowerCase().trim() : undefined;

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); run(q); }} className="card flex items-center gap-3 p-2 pl-4">
                <Icon name="search" className="h-5 w-5 shrink-0 text-ink-400" />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Type an English word (water) or an Odia word (ପାଣି / paaNi)"
                    aria-label="Search the Odia dictionary"
                    autoFocus
                    className="min-w-0 flex-1 bg-transparent py-3 text-lg outline-none placeholder:text-ink-400"
                />
                {busy && <span className="text-xs text-ink-400">Searching…</span>}
                <button type="submit" className="btn-primary">Search</button>
            </form>

            {!results && (
                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-ink-500">Try:</span>
                    {examples.map((x) => (
                        <button key={x} type="button" onClick={() => setQ(x)} className="chip hover:bg-sand-200" lang={ODIA_RE.test(x) ? "or" : undefined}>{x}</button>
                    ))}
                </div>
            )}

            {results && (
                <div className="mt-8 space-y-10">
                    {results.english.length > 0 && (
                        <section>
                            <h2 className="font-display text-2xl font-semibold text-ink-900">Odia words for “{q.trim()}”</h2>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {results.english.map((e, i) => <EntryCard key={e.w + i} e={e} highlight={hl} onPick={pick} />)}
                            </div>
                        </section>
                    )}
                    {results.odia.length > 0 && (
                        <section>
                            <h2 className="font-display text-2xl font-semibold text-ink-900">
                                {results.translit ? <>Odia headwords starting with <span lang="or" className="font-odia">{results.translit}</span></> : <>Meaning of <span lang="or" className="font-odia">{q.trim()}</span></>}
                            </h2>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {results.odia.map((e, i) => <EntryCard key={e.w + i} e={e} onPick={pick} />)}
                            </div>
                        </section>
                    )}
                    {results.english.length === 0 && results.odia.length === 0 && !busy && (
                        <p className="card p-6 text-ink-600">
                            No entry found. Try a simpler form of the word (for example the dictionary form of a verb ends in <span lang="or" className="font-odia">-ବା</span>, as in <span lang="or" className="font-odia">କରିବା</span>), or search in English.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
