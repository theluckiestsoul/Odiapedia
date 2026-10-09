"use client";

import { useEffect, useMemo, useState } from "react";

type W = { od: string; tr: string; en: string };
const N = 5;
const START = Date.UTC(2026, 9, 1); // puzzle #1 = 1 October 2026

function istDay(): string {
    return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
}
function rng(seed: number) {
    return () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    };
}
function shuffle<T>(a: T[], r: () => number): T[] {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
}
const store = {
    get(k: string) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } },
    set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

/** Five words a day, the same for everyone: pick the meaning (or the Odia word). */
export default function DailyGame({ words }: { words: W[] }) {
    const [day, setDay] = useState<string | null>(null);
    useEffect(() => setDay(istDay()), []);
    const num = day ? Math.floor((Date.parse(day) - START) / 86400_000) + 1 : 0;
    const qs = useMemo(() => {
        if (!day) return [];
        const r = rng(Number(day.replace(/-/g, "")));
        const pick = shuffle(words, r).slice(0, N);
        return pick.map((w, i) => {
            const reverse = i % 2 === 1;
            const others = shuffle(words.filter((x) => x.en !== w.en && x.od !== w.od), r).slice(0, 3);
            const options = shuffle([w, ...others], r);
            return { w, reverse, options };
        });
    }, [day, words]);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [stats, setStats] = useState<{ played: number; streak: number; best: number; last: string; total: number } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!day) return;
        const saved = store.get(`odiapedia-daily-${day}`);
        setAnswers(Array.isArray(saved) ? saved : Array(N).fill(null));
        setStats(store.get("odiapedia-daily-stats"));
    }, [day]);

    const step = answers.findIndex((a) => a === null);
    const done = answers.length === N && step === -1;
    const score = qs.reduce((s, q, i) => s + (answers[i] != null && q.options[answers[i]!] === q.w ? 1 : 0), 0);

    const choose = (i: number) => {
        if (step < 0) return;
        const next = [...answers];
        next[step] = i;
        setAnswers(next);
        store.set(`odiapedia-daily-${day}`, next);
        if (next.every((a) => a !== null)) {
            const prev = store.get("odiapedia-daily-stats") || { played: 0, streak: 0, best: 0, last: "", total: 0 };
            if (prev.last !== day) {
                const y = new Date(Date.parse(day!) - 86400_000).toISOString().slice(0, 10);
                const final = qs.reduce((s, q, k) => s + (q.options[next[k]!] === q.w ? 1 : 0), 0);
                const streak = prev.last === y ? prev.streak + 1 : 1;
                const s = { played: prev.played + 1, streak, best: Math.max(prev.best, streak), last: day, total: prev.total + final };
                store.set("odiapedia-daily-stats", s);
                setStats(s);
            }
        }
    };

    if (!day || !qs.length) return <div className="h-72 animate-pulse rounded-3xl bg-sand-100" />;

    const share = () => {
        const grid = qs.map((q, i) => (q.options[answers[i]!] === q.w ? "🟩" : "🟥")).join("");
        const text = `Odiapedia Daily Odia #${num} ${score}/${N}\n${grid}\nodiapedia.com/learn/daily`;
        navigator.clipboard?.writeText(text).then(() => setCopied(true), () => setCopied(false));
    };

    return (
        <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-between text-sm text-ink-500">
                <span>Puzzle #{num} · {new Date(day).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="flex gap-1">{qs.map((q, i) => <span key={i} className={`h-2.5 w-6 rounded-full ${answers[i] == null ? (i === step ? "bg-laterite-300" : "bg-sand-200") : q.options[answers[i]!] === q.w ? "bg-[#5f8f4e]" : "bg-[#cf6a43]"}`} />)}</span>
            </div>
            {!done && step >= 0 && (() => {
                const q = qs[step];
                return (
                    <div className="mt-5 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{q.reverse ? "Which Odia word means…" : "What does this mean?"}</p>
                        {q.reverse ? (
                            <p className="mt-3 font-display text-3xl font-semibold text-ink-900">{q.w.en}</p>
                        ) : (
                            <>
                                <p lang="or" className="mt-3 font-odia text-5xl text-laterite-700">{q.w.od}</p>
                                <p className="mt-1 text-ink-500">{q.w.tr}</p>
                            </>
                        )}
                        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                            {q.options.map((o, i) => (
                                <button key={i} type="button" onClick={() => choose(i)} className="rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 text-left font-semibold text-ink-900 transition hover:border-laterite-300 hover:bg-laterite-50">
                                    {q.reverse ? <><span lang="or" className="font-odia text-xl">{o.od}</span> <span className="block text-xs font-normal text-ink-500">{o.tr}</span></> : o.en}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })()}
            {done && (
                <div className="mt-5 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm">
                    <p className="font-display text-3xl font-semibold">{score}/{N} today{score === N ? " — perfect!" : ""}</p>
                    {stats && <p className="mt-1 text-sm text-ink-600">Played {stats.played} · streak {stats.streak} · best streak {stats.best}</p>}
                    <ul className="mt-5 divide-y divide-sand-100 text-sm">
                        {qs.map((q, i) => {
                            const ok = q.options[answers[i]!] === q.w;
                            return (
                                <li key={i} className="flex items-center gap-3 py-2">
                                    <span className={`h-3 w-3 rounded-full ${ok ? "bg-[#5f8f4e]" : "bg-[#cf6a43]"}`} />
                                    <span lang="or" className="font-odia text-lg">{q.w.od}</span>
                                    <span className="text-ink-500">{q.w.tr}</span>
                                    <span className="ml-auto font-semibold">{q.w.en}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button type="button" onClick={share} className="btn-primary">{copied ? "Copied!" : "Share result"}</button>
                        <a href="/learn/course" className="btn-ghost">Learn these in the course</a>
                    </div>
                    <p className="mt-3 text-xs text-ink-500">A new set of words comes at midnight India time. Your results stay in this browser only.</p>
                </div>
            )}
        </div>
    );
}
