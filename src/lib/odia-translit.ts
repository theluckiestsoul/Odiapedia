/**
 * Phonetic Latin → Odia transliteration (deterministic, ITRANS-like).
 *
 * Rules in short: vowels a aa/A i ii/I/ee u uu/U/oo Ri e ai o au; consonants as pronounced, capitals for
 * retroflex (T Th D Dh N L Sh) and some alternates (Y = ଯ, y = ୟ). Consonant clusters are joined with the
 * virama automatically (kRShNa → କୃଷ୍ଣ). A consonant at the end of a word keeps its inherent "a", as in
 * written Odia; type "_" after it to force a visible virama (ମହତ୍). M = anusvara ଂ, H = visarga ଃ,
 * ~ = chandrabindu ଁ, | = daṇḍa ।, D. = ଡ଼, Dh. = ଢ଼.
 */

const VOWELS: [string, string, string][] = [
    // latin, independent, matra
    ["aa", "ଆ", "ା"], ["A", "ଆ", "ା"],
    ["ai", "ଐ", "ୈ"], ["au", "ଔ", "ୌ"], ["ou", "ଔ", "ୌ"],
    ["ii", "ଈ", "ୀ"], ["ee", "ଈ", "ୀ"], ["I", "ଈ", "ୀ"],
    ["uu", "ଊ", "ୂ"], ["oo", "ଊ", "ୂ"], ["U", "ଊ", "ୂ"],
    ["Ri", "ଋ", "ୃ"], ["RI", "ୠ", "ୄ"],
    ["a", "ଅ", ""], ["i", "ଇ", "ି"], ["u", "ଉ", "ୁ"], ["e", "ଏ", "େ"], ["E", "ଐ", "ୈ"], ["o", "ଓ", "ୋ"], ["O", "ଔ", "ୌ"],
];

const CONSONANTS: [string, string][] = [
    ["ksh", "କ୍ଷ"], ["kSh", "କ୍ଷ"], ["x", "କ୍ଷ"], ["jny", "ଜ୍ଞ"], ["gy", "ଜ୍ଞ"], ["shr", "ଶ୍ର"],
    ["chh", "ଛ"], ["Ch", "ଛ"], ["kh", "ଖ"], ["gh", "ଘ"], ["ng", "ଙ"], ["ch", "ଚ"], ["jh", "ଝ"], ["ny", "ଞ"],
    ["Th", "ଠ"], ["Dh.", "ଢ଼"], ["Dh", "ଢ"], ["D.", "ଡ଼"], ["th", "ଥ"], ["dh", "ଧ"], ["ph", "ଫ"], ["bh", "ଭ"],
    ["Sh", "ଷ"], ["sh", "ଶ"],
    ["k", "କ"], ["g", "ଗ"], ["c", "ଚ"], ["j", "ଜ"], ["T", "ଟ"], ["D", "ଡ"], ["N", "ଣ"], ["t", "ତ"], ["d", "ଦ"], ["n", "ନ"],
    ["p", "ପ"], ["f", "ଫ"], ["b", "ବ"], ["m", "ମ"], ["Y", "ଯ"], ["y", "ୟ"], ["r", "ର"], ["l", "ଲ"], ["L", "ଳ"],
    ["v", "ବ"], ["w", "ୱ"], ["s", "ସ"], ["S", "ଶ"], ["h", "ହ"], ["z", "ଜ"], ["q", "କ"],
];

const SIGNS: [string, string][] = [["M", "ଂ"], ["H", "ଃ"], ["~", "ଁ"], ["||", "॥"], ["|", "।"], ["OM", "ଓଁ"]];
const DIGITS = "୦୧୨୩୪୫୬୭୮୯";
const VIRAMA = "୍";

const byLength = <T extends [string, ...unknown[]]>(xs: T[]) => [...xs].sort((a, b) => b[0].length - a[0].length);
const V = byLength(VOWELS);
const C = byLength(CONSONANTS);
const S = byLength(SIGNS);

function match<T extends [string, ...unknown[]]>(list: T[], text: string, i: number): T | undefined {
    for (const item of list) if (text.startsWith(item[0], i)) return item;
    return undefined;
}

export function toOdia(input: string, opts: { digits?: boolean } = {}): string {
    let out = "";
    let afterConsonant = false; // the previous token was a consonant still carrying its inherent vowel
    let i = 0;
    while (i < input.length) {
        const ch = input[i];
        const sign = match(S, input, i);
        if (sign && !(sign[0] === "OM" && afterConsonant)) {
            out += sign[1]; afterConsonant = false; i += sign[0].length; continue;
        }
        const cons = match(C, input, i);
        if (cons) {
            if (afterConsonant) out += VIRAMA;
            out += cons[1]; afterConsonant = true; i += cons[0].length; continue;
        }
        const vow = match(V, input, i);
        if (vow) {
            out += afterConsonant ? vow[2] : vow[1];
            afterConsonant = false; i += vow[0].length; continue;
        }
        if (ch === "_") { if (afterConsonant) out += VIRAMA; afterConsonant = false; i++; continue; }
        if (opts.digits && ch >= "0" && ch <= "9") { out += DIGITS[+ch]; afterConsonant = false; i++; continue; }
        out += ch; afterConsonant = false; i++;
    }
    return out;
}

/** Reference table shown on the typing page. */
export const TRANSLIT_TABLE = {
    vowels: [
        ["a", "ଅ"], ["aa / A", "ଆ"], ["i", "ଇ"], ["ii / ee / I", "ଈ"], ["u", "ଉ"], ["uu / oo / U", "ଊ"], ["Ri", "ଋ"], ["e", "ଏ"], ["ai", "ଐ"], ["o", "ଓ"], ["au / ou", "ଔ"],
    ],
    consonants: [
        ["k", "କ"], ["kh", "ଖ"], ["g", "ଗ"], ["gh", "ଘ"], ["ng", "ଙ"],
        ["ch / c", "ଚ"], ["chh / Ch", "ଛ"], ["j", "ଜ"], ["jh", "ଝ"], ["ny", "ଞ"],
        ["T", "ଟ"], ["Th", "ଠ"], ["D", "ଡ"], ["Dh", "ଢ"], ["N", "ଣ"],
        ["t", "ତ"], ["th", "ଥ"], ["d", "ଦ"], ["dh", "ଧ"], ["n", "ନ"],
        ["p", "ପ"], ["ph / f", "ଫ"], ["b / v", "ବ"], ["bh", "ଭ"], ["m", "ମ"],
        ["Y", "ଯ"], ["y", "ୟ"], ["r", "ର"], ["l", "ଲ"], ["L", "ଳ"], ["w", "ୱ"],
        ["sh", "ଶ"], ["Sh", "ଷ"], ["s", "ସ"], ["h", "ହ"], ["D.", "ଡ଼"], ["Dh.", "ଢ଼"], ["ksh / x", "କ୍ଷ"], ["gy / jny", "ଜ୍ଞ"],
    ],
    signs: [["M", "ଂ (anusvara)"], ["H", "ଃ (visarga)"], ["~", "ଁ (chandrabindu)"], ["_", "୍ (visible virama)"], ["|", "। (full stop)"]],
    examples: [["oD.ishaa", "ଓଡ଼ିଶା"], ["jagannaatha", "ଜଗନ୍ନାଥ"], ["namaskaara", "ନମସ୍କାର"], ["pakhaaLa", "ପଖାଳ"], ["kRiShNa", "କୃଷ୍ଣ"], ["bhubaneshwara", "ଭୁବନେଶ୍ୱର"]],
} as const;
