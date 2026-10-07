/**
 * Answer checking for Odia, transliterated Odia and English.
 *
 * Learners type the same Odia many ways: in Odia script (with precomposed or decomposed nukta
 * letters), or in Latin letters ("kemiti achhanti", "kemiti achanti", "kemiti acchanti"). We compare
 * normalised forms so spelling conventions never mark a right answer wrong, and use edit distance to
 * accept small typos as "almost" (counted correct, with the right spelling shown).
 */

export type Verdict = "correct" | "typo" | "wrong";

/** Canonical Odia: NFC, decomposed nukta letters, standard ya-phala, no ZWJ/ZWNJ, no punctuation. */
export function normOdia(s: string): string {
    return s
        .normalize("NFC")
        .replace(/ଡ଼/g, "ଡ଼") // ଡ଼
        .replace(/ଢ଼/g, "ଢ଼") // ଢ଼
        .replace(/୍ୟ/g, "୍ଯ") // ya-phala
        .replace(/[‌‍]/g, "")
        .replace(/[।॥?!.,'"’‘“”:;()\-–—…]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Loose Latin key for transliterated Odia: ignores long vowels, aspiration spellings, doubled letters and final -a. */
export function normLatin(s: string): string {
    let t = s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
    t = t.replace(/[^a-z\s]/g, " ");
    const rules: [RegExp, string][] = [
        [/aa/g, "a"], [/ee/g, "i"], [/ii/g, "i"], [/oo/g, "u"], [/uu/g, "u"],
        [/chh/g, "c"], [/ch/g, "c"], [/sh/g, "s"], [/kh/g, "k"], [/gh/g, "g"], [/jh/g, "j"],
        [/th/g, "t"], [/dh/g, "d"], [/ph/g, "f"], [/bh/g, "b"], [/rh/g, "r"],
        [/w/g, "b"], [/v/g, "b"], [/z/g, "j"], [/y/g, "j"], [/x/g, "ks"], [/q/g, "k"],
        [/([a-z])\1+/g, "$1"],
    ];
    for (const [re, to] of rules) t = t.replace(re, to);
    return t
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => (w.length > 3 && w.endsWith("a") ? w.slice(0, -1) : w)) // inherent final vowel is optional
        .join(" ");
}

/** Latin text as typed, ignoring case, accents and punctuation only. */
export const strictLatin = (s: string) => s.toLowerCase().replace(/['’]/g, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();

const STOP = new Set(["a", "an", "the", "please", "to"]);

/** English: lowercase, no punctuation, contractions expanded, articles and "please" ignored. */
export function normEnglish(s: string): string {
    const full = englishWords(s);
    const kept = full.filter((w) => !STOP.has(w));
    return (kept.length ? kept : full).join(" ");
}

function englishWords(s: string): string[] {
    return s
        .toLowerCase()
        .replace(/[’']/g, "'")
        .replace(/\bi'm\b/g, "i am").replace(/\bit's\b/g, "it is").replace(/\bwhat's\b/g, "what is").replace(/\bdon't\b/g, "do not")
        .replace(/\bi'll\b/g, "i will").replace(/\bthat's\b/g, "that is").replace(/n't\b/g, " not")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

/** Levenshtein distance (small strings only). */
export function distance(a: string, b: string): number {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
    }
    return prev[n];
}

const isOdia = (s: string) => /[଀-୿]/.test(s);
const typoAllowance = (len: number) => (len <= 3 ? 0 : len <= 8 ? 1 : 2);

function compare(given: string, expected: string): Verdict {
    if (!given) return "wrong";
    if (given === expected) return "correct";
    return distance(given, expected) <= typoAllowance(expected.length) ? "typo" : "wrong";
}

const best = (vs: Verdict[]): Verdict => (vs.includes("correct") ? "correct" : vs.includes("typo") ? "typo" : "wrong");

/** Grade a typed Odia answer (Odia script or Latin transliteration). */
export function gradeOdia(answer: string, od: string, tr: string, alternatives: { od?: string; tr?: string }[] = []): Verdict {
    const all = [{ od, tr }, ...alternatives];
    if (isOdia(answer)) {
        const a = normOdia(answer);
        return best(all.filter((x) => x.od).map((x) => compare(a, normOdia(x.od!))));
    }
    const a = normLatin(answer);
    return best(all.filter((x) => x.tr).map((x) => {
        const key = normLatin(x.tr!);
        // very short words (ନା/ନଅ, ଚା/ଛଅ) are told apart only by vowel length or aspiration: match them exactly
        if (key.replace(/\s/g, "").length <= 3) return strictLatin(answer) === strictLatin(x.tr!) ? "correct" : "wrong";
        return compare(a, key);
    }));
}

/** Split an English gloss like "hello; goodbye (polite)" into answerable parts. */
export function englishAnswers(en: string, accept: string[] = []): string[] {
    const plain = en.replace(/\(.*?\)/g, "");
    const fromGloss = [...plain.split(";"), ...plain.split(/[;/,]| or /)].map((s) => s.trim()).filter(Boolean);
    return [...new Set([...fromGloss, ...accept].map(normEnglish).filter(Boolean))];
}

/** Grade a typed English meaning. */
export function gradeEnglish(answer: string, en: string, accept: string[] = []): Verdict {
    const a = normEnglish(answer);
    return best(englishAnswers(en, accept).map((x) => compare(a, x)));
}
