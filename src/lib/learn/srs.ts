/**
 * Spaced review (Leitner boxes). Each item sits in a box 0–7; a correct answer moves it up a box and
 * schedules the next review further out, a mistake drops it back so it returns soon.
 * Simple, predictable and explainable — the scheduler can be swapped for FSRS later without changing
 * the stored shape (box, due, counts).
 */
export const BOX_DAYS = [0, 1, 2, 4, 8, 16, 32, 64];
const DAY = 86_400_000;

export interface ItemState {
    box: number;
    /** next review time (ms since epoch) */
    due: number;
    seen: number;
    right: number;
    wrong: number;
    /** last answer time */
    last: number;
    /** in the mistake bank until answered correctly twice in a row */
    mistake?: number;
}

export function answer(prev: ItemState | undefined, correct: boolean, now = Date.now()): ItemState {
    const s: ItemState = prev ? { ...prev } : { box: 0, due: now, seen: 0, right: 0, wrong: 0, last: now };
    s.seen += 1;
    s.last = now;
    if (correct) {
        s.right += 1;
        s.box = Math.min(BOX_DAYS.length - 1, s.box + 1);
        s.due = now + BOX_DAYS[s.box] * DAY;
        if (s.mistake) s.mistake = s.mistake > 1 ? s.mistake - 1 : undefined;
    } else {
        s.wrong += 1;
        s.box = Math.max(0, Math.min(1, s.box - 2));
        s.due = now + 10 * 60_000; // back in ten minutes
        s.mistake = 2;
    }
    if (!s.mistake) delete s.mistake;
    return s;
}

/** 0–100: how well an item is known. */
export const strength = (s?: ItemState) => (s ? Math.round((s.box / (BOX_DAYS.length - 1)) * 100) : 0);

export const isDue = (s: ItemState, now = Date.now()) => s.due <= now;
