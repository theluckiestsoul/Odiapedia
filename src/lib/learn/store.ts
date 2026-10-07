"use client";
/**
 * Learner progress, saved in this browser (localStorage). No account needed.
 *
 * The shape mirrors the planned Supabase tables so cloud sync can be added without migrating data:
 *   lessons  → lesson_progress   items → mastery + review_queue   saved → saved_phrases   days → streaks
 * Every record carries a timestamp, so a later merge can keep the newest value per key.
 */
import { useSyncExternalStore } from "react";
import { answer as srsAnswer, isDue, type ItemState } from "./srs";

export interface LessonState { done: boolean; best: number; attempts: number; last: number }
export interface Settings { showTr: boolean; sound: boolean }

export interface Progress {
    v: 1;
    lessons: Record<string, LessonState>;
    items: Record<string, ItemState>;
    saved: Record<string, number>;
    /** YYYY-MM-DD days with at least one finished lesson or review */
    days: string[];
    xp: number;
    settings: Settings;
    updated: number;
}

const KEY = "odiapedia-learn-v1";
const EMPTY: Progress = { v: 1, lessons: {}, items: {}, saved: {}, days: [], xp: 0, settings: { showTr: true, sound: true }, updated: 0 };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
    if (cache) return cache;
    try {
        const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
        const parsed = raw ? (JSON.parse(raw) as Progress) : null;
        cache = parsed && parsed.v === 1 ? { ...EMPTY, ...parsed, settings: { ...EMPTY.settings, ...parsed.settings } } : EMPTY;
    } catch {
        cache = EMPTY;
    }
    return cache;
}

function write(next: Progress) {
    cache = { ...next, updated: Date.now() };
    try { window.localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage full or blocked: keep in memory */ }
    listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => { if (e.key === KEY) { cache = null; listeners.forEach((l) => l()); } });
}

const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

/** React hook: current progress (EMPTY during server render). */
export function useProgress(): Progress {
    return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const today = () => new Date().toISOString().slice(0, 10);

export const progress = {
    get: read,
    recordAnswer(itemIds: string[], correct: boolean) {
        const p = read();
        const items = { ...p.items };
        for (const id of itemIds) items[id] = srsAnswer(items[id], correct);
        write({ ...p, items, xp: p.xp + (correct ? 1 : 0) });
    },
    finishLesson(lessonId: string, score: number) {
        const p = read();
        const prev = p.lessons[lessonId];
        const d = today();
        write({
            ...p,
            lessons: { ...p.lessons, [lessonId]: { done: true, best: Math.max(prev?.best ?? 0, score), attempts: (prev?.attempts ?? 0) + 1, last: Date.now() } },
            days: p.days.includes(d) ? p.days : [...p.days, d].slice(-400),
            xp: p.xp + 10,
        });
    },
    finishReview() {
        const p = read();
        const d = today();
        write({ ...p, days: p.days.includes(d) ? p.days : [...p.days, d].slice(-400), xp: p.xp + 5 });
    },
    toggleSaved(phraseId: string) {
        const p = read();
        const saved = { ...p.saved };
        if (saved[phraseId]) delete saved[phraseId]; else saved[phraseId] = Date.now();
        write({ ...p, saved });
    },
    setSettings(s: Partial<Settings>) {
        const p = read();
        write({ ...p, settings: { ...p.settings, ...s } });
    },
    reset() { write(EMPTY); },
    export: () => JSON.stringify(read()),
};

/** Items due for review, weakest/oldest first; mistakes first of all. */
export function dueItems(p: Progress, now = Date.now()): string[] {
    return Object.entries(p.items)
        .filter(([, s]) => isDue(s, now) || s.mistake)
        .sort(([, a], [, b]) => (b.mistake ? 1 : 0) - (a.mistake ? 1 : 0) || a.box - b.box || a.due - b.due)
        .map(([id]) => id);
}

export const mistakes = (p: Progress) => Object.entries(p.items).filter(([, s]) => s.mistake).map(([id]) => id);

/** Consecutive days up to today (or yesterday) with activity. */
export function streak(p: Progress): number {
    const set = new Set(p.days);
    let n = 0;
    const d = new Date();
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
}
