/**
 * Odiapedia Learn — course content (English → Odia, Level 1).
 *
 * Content lives in src/data/learn/*.json (one file per unit + the phrasebook), so lessons are
 * versioned and reviewed in git and pages are generated statically. The Odia text is written once
 * ("canonical") and other source languages can later be added as extra fields on the same items.
 */
import u1 from "@/data/learn/u1.json";
import u2 from "@/data/learn/u2.json";
import u3 from "@/data/learn/u3.json";
import u4 from "@/data/learn/u4.json";
import u5 from "@/data/learn/u5.json";
import u6 from "@/data/learn/u6.json";
import u7 from "@/data/learn/u7.json";
import u8 from "@/data/learn/u8.json";
import phrasebookData from "@/data/learn/phrasebook.json";
import { SITE } from "@/lib/site";

export type Register = "formal" | "familiar" | "neutral";

export interface Item {
    id: string;
    kind: "word" | "phrase";
    od: string;
    tr: string;
    en: string;
    accept_en?: string[];
    lit?: string;
    register?: Register;
    note?: string;
    emoji?: string;
}

export interface Example {
    od: string;
    tr: string;
    en: string;
    uses?: string[];
}

export interface DialogueLine { who: string; od: string; tr: string; en: string }

export interface Lesson {
    id: string;
    title: string;
    odia: string;
    goal: string;
    context: string;
    items: Item[];
    examples: Example[];
    dialogue?: { scene: string; lines: DialogueLine[] };
    tip?: { title: string; text: string };
}

export interface Unit {
    id: string;
    title: string;
    odia: string;
    summary: string;
    lessons: Lesson[];
}

export interface Phrase {
    id: string;
    od: string;
    tr: string;
    en: string;
    intents?: string[];
    note?: string;
    register?: Register;
}

export interface PhraseCategory {
    id: string;
    title: string;
    odia: string;
    icon?: string;
    intro: string;
    phrases: Phrase[];
}

/** A lesson in course order, with its unit and neighbours. */
export interface LessonRef {
    lesson: Lesson;
    unit: Unit;
    slug: string;
    /** 1-based position in the whole course */
    number: number;
    /** 1-based position inside the unit */
    index: number;
}

export const UNITS = [u1, u2, u3, u4, u5, u6, u7, u8] as unknown as Unit[];
export const PHRASEBOOK = (phrasebookData as unknown as { categories: PhraseCategory[] }).categories;
export const COURSE_LEVEL = { id: "level-1", title: "First Steps", odia: "ପ୍ରଥମ ପାଦ" };

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const LESSONS: LessonRef[] = (() => {
    const out: LessonRef[] = [];
    const used = new Set<string>();
    for (const unit of UNITS) {
        unit.lessons.forEach((lesson, i) => {
            let slug = slugify(lesson.title);
            if (used.has(slug)) slug = `${slug}-${lesson.id}`;
            used.add(slug);
            out.push({ lesson, unit, slug, number: out.length + 1, index: i + 1 });
        });
    }
    return out;
})();

const bySlug = new Map(LESSONS.map((l) => [l.slug, l]));
const byId = new Map(LESSONS.map((l) => [l.lesson.id, l]));
export const getLessonBySlug = (slug: string) => bySlug.get(slug);
export const getLessonById = (id: string) => byId.get(id);
export const nextLesson = (ref: LessonRef) => LESSONS[ref.number] as LessonRef | undefined;
export const prevLesson = (ref: LessonRef) => LESSONS[ref.number - 2] as LessonRef | undefined;

/** Every course item with the lesson that introduces it. */
export const ITEMS: Map<string, { item: Item; lessonId: string }> = (() => {
    const m = new Map<string, { item: Item; lessonId: string }>();
    for (const { lesson } of LESSONS) for (const item of lesson.items) if (!m.has(item.id)) m.set(item.id, { item, lessonId: lesson.id });
    return m;
})();

export const getCategory = (id: string) => PHRASEBOOK.find((c) => c.id === id);
export const PHRASES: Map<string, { phrase: Phrase; category: PhraseCategory }> = new Map(
    PHRASEBOOK.flatMap((c) => c.phrases.map((p) => [p.id, { phrase: p, category: c }] as const)),
);

export const COURSE_STATS = {
    units: UNITS.length,
    lessons: LESSONS.length,
    items: ITEMS.size,
    examples: LESSONS.reduce((n, l) => n + l.lesson.examples.length, 0),
    phrases: PHRASES.size,
};

/** Where learners report a content problem (no backend needed yet). */
export const REPORT_EMAIL = SITE.email;
