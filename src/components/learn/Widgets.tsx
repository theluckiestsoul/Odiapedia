"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { LESSONS, PHRASES, ITEMS } from "@/lib/learn/content";
import { dueItems, mistakes, progress, streak, useProgress } from "@/lib/learn/store";
import { strength } from "@/lib/learn/srs";
import { speak, useOdiaVoice } from "@/lib/learn/speech";
import Player from "./Player";


/** "Start lesson" button that opens the interactive player over the page. */
export function StartLesson({ lessonId, className = "btn-primary" }: { lessonId: string; className?: string }) {
    const [open, setOpen] = useState(false);
    const p = useProgress();
    const st = p.lessons[lessonId];
    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={className}>
                <Icon name="sparkle" className="h-4 w-4" />{st?.done ? "Practise again" : "Start lesson"}
            </button>
            {st?.done && <span className="ml-3 text-sm font-medium text-emerald-700">✓ Completed · best {st.best}%</span>}
            {open && <Player mode={{ kind: "lesson", lessonId }} onClose={() => setOpen(false)} />}
        </>
    );
}

/** Progress badge for one lesson in a list. */
export function LessonBadge({ lessonId }: { lessonId: string }) {
    const p = useProgress();
    const st = p.lessons[lessonId];
    if (!st?.done) return null;
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"><Icon name="check" className="h-3 w-3" />{st.best}%</span>;
}

/** Continue card: next unfinished lesson, streak, review count. */
export function ContinueCard() {
    const p = useProgress();
    const next = LESSONS.find((l) => !p.lessons[l.lesson.id]?.done) ?? LESSONS[0];
    const doneCount = LESSONS.filter((l) => p.lessons[l.lesson.id]?.done).length;
    const due = dueItems(p).length;
    const days = streak(p);
    const started = doneCount > 0;
    return (
        <div className="card overflow-hidden">
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                    <p className="eyebrow">{started ? "Continue learning" : "Start here"}</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-ink-900">Lesson {next.number}: {next.lesson.title}</p>
                    <p lang="or" className="font-odia text-laterite-600">{next.lesson.odia}</p>
                    <p className="mt-2 text-sm text-ink-600">{next.lesson.goal}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand-200"><div className="h-full rounded-full bg-laterite-500" style={{ width: `${(doneCount / LESSONS.length) * 100}%` }} /></div>
                    <p className="mt-2 text-xs text-ink-500">{doneCount} of {LESSONS.length} lessons done{days ? ` · 🔥 ${days}-day streak` : ""}{p.xp ? ` · ${p.xp} XP` : ""}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <Link href={`/learn/course/${next.slug}`} className="btn-primary">{started ? "Continue" : "Start lesson 1"} <Icon name="arrow" className="h-4 w-4" /></Link>
                    {due > 0 && <Link href="/learn/review" className="btn-ghost">Review {due} word{due === 1 ? "" : "s"}</Link>}
                </div>
            </div>
        </div>
    );
}

/** Review hub: due items, mistake bank, word strength list. */
export function ReviewHub() {
    const p = useProgress();
    const [open, setOpen] = useState<null | "due" | "mistakes">(null);
    const due = dueItems(p);
    const miss = mistakes(p);
    const known = Object.entries(p.items).sort(([, a], [, b]) => a.box - b.box);
    if (!known.length) {
        return (
            <div className="card p-8 text-center">
                <p className="text-5xl" aria-hidden>📚</p>
                <p className="mt-4 font-display text-2xl font-semibold">Nothing to review yet</p>
                <p className="mt-2 text-ink-600">Finish a lesson and the words you learn will appear here, scheduled to come back just before you’d forget them.</p>
                <Link href={`/learn/course/${LESSONS[0].slug}`} className="btn-primary mt-6">Start lesson 1</Link>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="card p-6">
                    <p className="text-sm text-ink-500">Due for review</p>
                    <p className="font-display text-4xl font-semibold">{due.length}</p>
                    <button type="button" disabled={!due.length} onClick={() => setOpen("due")} className="btn-primary mt-4 disabled:opacity-40">{due.length ? "Start review" : "All caught up"}</button>
                </div>
                <div className="card p-6">
                    <p className="text-sm text-ink-500">Mistake bank</p>
                    <p className="font-display text-4xl font-semibold">{miss.length}</p>
                    <button type="button" disabled={!miss.length} onClick={() => setOpen("mistakes")} className="btn-ghost mt-4 disabled:opacity-40">Practise my mistakes</button>
                </div>
            </div>
            <section>
                <h2 className="font-display text-2xl font-semibold">Your words <span className="text-base font-normal text-ink-500">({known.length})</span></h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {known.map(([id, s]) => {
                        const it = ITEMS.get(id)?.item;
                        if (!it) return null;
                        return (
                            <li key={id} className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-4 py-2">
                                <span className="min-w-0 flex-1"><span lang="or" className="font-odia text-lg">{it.od}</span> <span className="text-sm text-ink-500">{it.tr} · {it.en.split(";")[0]}</span></span>
                                <span className="h-2 w-16 overflow-hidden rounded-full bg-sand-200" title={`Strength ${strength(s)}%`}><span className={`block h-full ${s.mistake ? "bg-rose-400" : "bg-emerald-500"}`} style={{ width: `${Math.max(8, strength(s))}%` }} /></span>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <div className="flex flex-wrap gap-3 text-xs text-ink-500">
                <span>Progress is saved in this browser only.</span>
                <button type="button" onClick={() => { const b = new Blob([progress.export()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "odiapedia-learn-progress.json"; a.click(); }} className="underline hover:text-laterite-600">Download a backup</button>
                <button type="button" onClick={() => { if (window.confirm("Reset all learning progress in this browser?")) progress.reset(); }} className="underline hover:text-rose-600">Reset progress</button>
            </div>
            {open && <Player mode={{ kind: "review", itemIds: open === "mistakes" ? miss : due }} onClose={() => setOpen(null)} />}
        </div>
    );
}

/** Phrasebook: search by what you want to say, save phrases, play audio where the device can. */
export function PhraseSearch() {
    const [q, setQ] = useState("");
    const [onlySaved, setOnlySaved] = useState(false);
    const p = useProgress();
    const voice = useOdiaVoice();
    const results = useMemo(() => {
        const t = q.trim().toLowerCase();
        const all = [...PHRASES.values()];
        if (onlySaved) return all.filter(({ phrase }) => p.saved[phrase.id]);
        if (!t) return [];
        const words = t.split(/\s+/);
        return all
            .map((x) => {
                const hay = [x.phrase.en, ...(x.phrase.intents ?? []), x.phrase.tr, x.category.title].join(" ").toLowerCase();
                const score = words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0) + (x.phrase.intents?.some((i) => i.includes(t)) ? 2 : 0);
                return { x, score };
            })
            .filter((r) => r.score >= Math.min(words.length, 1) && r.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20)
            .map((r) => r.x);
    }, [q, onlySaved, p.saved]);
    const savedCount = Object.keys(p.saved).length;
    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                    <span className="sr-only">What do you want to say?</span>
                    <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                    <input value={q} onChange={(e) => { setQ(e.target.value); setOnlySaved(false); }} placeholder="What do you want to say? e.g. “how much”, “I need a doctor”"
                        className="w-full rounded-full border-2 border-sand-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-laterite-400" />
                </label>
                <button type="button" onClick={() => setOnlySaved(!onlySaved)} className={onlySaved ? "btn-primary" : "btn-ghost"}>★ My phrases ({savedCount})</button>
            </div>
            {(q.trim() || onlySaved) && (
                <ul className="mt-4 space-y-2">
                    {results.length === 0 && <li className="rounded-xl bg-sand-100 p-4 text-sm text-ink-600">{onlySaved ? "Tap ☆ on any phrase to save it here." : "No phrase found — try a simpler word, like “water”, “train” or “help”."}</li>}
                    {results.map(({ phrase, category }) => <PhraseRow key={phrase.id} phrase={phrase} category={category.title} voice={voice} />)}
                </ul>
            )}
        </div>
    );
}

export function PhraseRow({ phrase, category, voice }: { phrase: { id: string; od: string; tr: string; en: string; note?: string }; category?: string; voice?: boolean }) {
    const p = useProgress();
    const saved = !!p.saved[phrase.id];
    const hasVoice = useOdiaVoice();
    const v = voice ?? hasVoice;
    return (
        <li className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white p-4">
            <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-900">{phrase.en}{category && <span className="ml-2 text-xs font-normal text-ink-400">{category}</span>}</p>
                <p lang="or" className="mt-1 font-odia text-2xl leading-snug text-laterite-700">{phrase.od}</p>
                <p className="text-sm text-ink-500">{phrase.tr}</p>
                {phrase.note && <p className="mt-1 text-xs text-ink-500">{phrase.note}</p>}
            </div>
            <div className="flex shrink-0 flex-col gap-1">
                {v && <button type="button" onClick={() => speak(phrase.od)} className="rounded-full p-2 text-laterite-600 hover:bg-laterite-50" aria-label="Play"><Icon name="wave" className="h-5 w-5" /></button>}
                <button type="button" onClick={() => progress.toggleSaved(phrase.id)} className={`rounded-full p-2 text-xl leading-none ${saved ? "text-saffron-500" : "text-ink-300 hover:text-saffron-500"}`} aria-pressed={saved} aria-label={saved ? "Remove from my phrases" : "Save to my phrases"}>{saved ? "★" : "☆"}</button>
            </div>
        </li>
    );
}
