/**
 * Deterministic exercise generation for lessons and reviews — no AI, no server.
 * Order inside a lesson: learn a word → quick check → next word …, then mixed practice
 * (match, arrange the words, fill the gap, type the meaning, type the Odia), recognition before recall.
 */
import { ITEMS, LESSONS, type Example, type Item, type Lesson } from "./content";
import { englishAnswers } from "./grade";

export type Exercise =
    | { kind: "learn"; item: Item }
    | { kind: "choose-meaning"; item: Item; options: string[]; answer: string }
    | { kind: "choose-odia"; item: Item; options: Item[] }
    | { kind: "match"; items: Item[] }
    | { kind: "arrange"; example: Example; tiles: string[] }
    | { kind: "fill"; example: Example; blank: number; options: string[] }
    | { kind: "type-meaning"; item: Item }
    | { kind: "type-odia"; item: Item };

/** Exercises that check an item (used to update its mastery). */
export const itemOf = (e: Exercise): string[] =>
    "item" in e ? [e.item.id] : e.kind === "match" ? e.items.map((i) => i.id) : (e.example.uses ?? []);

// ---------- seeded randomness (same lesson → same order on every device; new attempt → reshuffled) ----------
function hash(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
}
export function rng(seed: string) {
    let a = hash(seed);
    return () => {
        a |= 0; a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
export function shuffle<T>(xs: T[], r: () => number): T[] {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** Main English meaning to show on a choice button: first part of the gloss, without brackets. */
export const shortEn = (en: string) => en.replace(/\(.*?\)/g, "").split(/[;]/)[0].trim() || en.replace(/[()]/g, "").trim();

/** Items a learner could confuse with `item`: same lesson first, then same unit, then the rest of the course. */
function distractorPool(item: Item, lesson: Lesson): Item[] {
    const ref = LESSONS.find((l) => l.lesson.id === lesson.id);
    const unitItems = ref ? ref.unit.lessons.flatMap((l) => l.items) : [];
    const all = [...ITEMS.values()].map((x) => x.item);
    const seen = new Set([shortEn(item.en).toLowerCase(), item.od]);
    const mine = englishAnswers(item.en, item.accept_en);
    // a distractor must not share a meaning with the answer ("bye" vs "hello; goodbye")
    const overlaps = (it: Item) => englishAnswers(it.en, it.accept_en).some((a) => mine.some((b) => a.length > 2 && b.length > 2 && (a.includes(b) || b.includes(a))));
    const out: Item[] = [];
    for (const it of [...lesson.items, ...unitItems, ...all]) {
        const k = shortEn(it.en).toLowerCase();
        if (it.id === item.id || seen.has(k) || seen.has(it.od) || overlaps(it)) continue;
        seen.add(k); seen.add(it.od);
        out.push(it);
    }
    return out;
}

function chooseMeaning(item: Item, lesson: Lesson, r: () => number): Exercise {
    const pool = distractorPool(item, lesson);
    const near = shuffle(pool.slice(0, 8), r).slice(0, 3);
    const answer = shortEn(item.en);
    return { kind: "choose-meaning", item, answer, options: shuffle([answer, ...near.map((d) => shortEn(d.en))], r) };
}

function chooseOdia(item: Item, lesson: Lesson, r: () => number): Exercise {
    const pool = distractorPool(item, lesson);
    return { kind: "choose-odia", item, options: shuffle([item, ...shuffle(pool.slice(0, 8), r).slice(0, 3)], r) };
}

const words = (od: string) => od.split(/\s+/).filter(Boolean);
/** Word without trailing punctuation (tiles must not give the order away). */
export const bare = (w: string) => w.replace(/[?!।,.]+$/u, "");

function arrange(example: Example, lesson: Lesson, r: () => number): Exercise | null {
    const w = words(example.od).map(bare);
    if (w.length < 2 || w.length > 8) return null;
    // one or two plausible extra tiles from other examples in the lesson
    const extra = shuffle([...new Set(lesson.examples.flatMap((e) => words(e.od)).map(bare))].filter((x) => x && !w.includes(x)), r).slice(0, w.length > 4 ? 1 : 2);
    return { kind: "arrange", example, tiles: shuffle([...w, ...extra], r) };
}

function fill(example: Example, lesson: Lesson, r: () => number): Exercise | null {
    const w = words(example.od);
    if (w.length < 2) return null;
    // blank a word that belongs to one of this lesson's items if possible
    const lessonWords = new Set(lesson.items.flatMap((i) => words(i.od)));
    const candidates = w.map((x, i) => [x, i] as const).filter(([x]) => lessonWords.has(x.replace(/[?!।,]$/, "")));
    const [word, blank] = candidates.length ? candidates[Math.floor(r() * candidates.length)] : [w[0], 0];
    const strip = (s: string) => s.replace(/[?!।,]$/, "");
    const others = shuffle([...new Set(lesson.examples.flatMap((e) => words(e.od)).map(strip))].filter((x) => x !== strip(word) && !w.map(strip).includes(x)), r).slice(0, 3);
    if (others.length < 2) return null;
    return { kind: "fill", example, blank, options: shuffle([strip(word), ...others], r) };
}

/** A full lesson session. `attempt` reshuffles the order for a repeat. */
export function lessonSession(lesson: Lesson, attempt = 0): Exercise[] {
    const r = rng(`${lesson.id}#${attempt}`);
    const items = lesson.items;
    const out: Exercise[] = [];
    // 1. learn + quick recognition check, interleaved
    items.forEach((item, i) => {
        out.push({ kind: "learn", item });
        if (i > 0) out.push(i % 2 ? chooseMeaning(items[i - 1], lesson, r) : chooseOdia(items[i - 1], lesson, r));
    });
    out.push(chooseMeaning(items[items.length - 1], lesson, r));
    // 2. mixed practice
    out.push({ kind: "match", items: shuffle(items, r).slice(0, Math.min(5, items.length)) });
    const ex = shuffle(lesson.examples, r);
    ex.slice(0, 3).forEach((e) => { const a = arrange(e, lesson, r); if (a) out.push(a); });
    ex.slice(3, 5).forEach((e) => { const f = fill(e, lesson, r); if (f) out.push(f); });
    const recall = shuffle(items, r);
    recall.slice(0, 2).forEach((item) => out.push({ kind: "type-meaning", item }));
    recall.slice(2, 4).forEach((item) => out.push({ kind: "type-odia", item }));
    return out;
}

/** A review session from item ids (due items and mistakes first), mixing recognition and recall. */
export function reviewSession(itemIds: string[], seed: string, max = 15): Exercise[] {
    const r = rng(seed);
    const out: Exercise[] = [];
    for (const id of itemIds.slice(0, max)) {
        const ref = ITEMS.get(id);
        if (!ref) continue;
        const lesson = LESSONS.find((l) => l.lesson.id === ref.lessonId)!.lesson;
        const roll = r();
        if (roll < 0.3) out.push(chooseMeaning(ref.item, lesson, r));
        else if (roll < 0.55) out.push(chooseOdia(ref.item, lesson, r));
        else if (roll < 0.8) out.push({ kind: "type-meaning", item: ref.item });
        else out.push({ kind: "type-odia", item: ref.item });
    }
    // one sentence exercise that uses a reviewed item
    const ex = LESSONS.flatMap((l) => l.lesson.examples.map((e) => ({ e, lesson: l.lesson }))).find(({ e }) => e.uses?.some((u) => itemIds.includes(u)));
    if (ex) { const a = arrange(ex.e, ex.lesson, r); if (a) out.splice(Math.min(3, out.length), 0, a); }
    return out;
}
