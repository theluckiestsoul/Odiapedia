/**
 * Odia legacy-font converter: Akruti and Sreelipi (Shreelipi) ⇄ Unicode.
 * A TypeScript port of "Lipika" by Prabir Kumar Das (MIT licence,
 * https://github.com/theprabir/odia-legacy-converter) — same mapping tables, same pipeline.
 */
import A2U from "@/data/fonts/akruti_to_unicode.json";
import U2A from "@/data/fonts/unicode_to_akruti.json";
import S2U from "@/data/fonts/sreelipi_to_unicode.json";
import U2S from "@/data/fonts/unicode_to_sreelipi.json";

type Map_ = Record<string, string>;

/** Longest-match substitution (keys of any length). */
function makeSubst(table: Map_) {
    const keys = Object.keys(table).sort((a, b) => b.length - a.length);
    const max = keys.length ? keys[0].length : 1;
    return (text: string): string[] => {
        const out: string[] = [];
        let i = 0;
        while (i < text.length) {
            let hit = false;
            for (let L = Math.min(max, text.length - i); L >= 1; L--) {
                const k = text.substr(i, L);
                const v = table[k];
                if (v !== undefined) {
                    out.push(v);
                    i += L;
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                out.push(text[i]);
                i++;
            }
        }
        return out;
    };
}

/* ---------------------------------------------------------------- Akruti → Unicode */
const a2uSub = makeSubst(A2U as Map_);
const A2U_MAX = Math.max(...Object.keys(A2U as Map_).map((k) => k.length));
const CONSONANT_BYTES = new Set("KLMNOQRSTUVWXYZ[\\]^_`abcdefghijk");
const MULTI_CONSONANT: Record<string, string> = { P: "\xff", W: "\xff", X: "\xff", I: "\xdf" };
const HALANT_CONSONANT_BYTES = new Set("\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xa3\xe2\xe4\xe6\xe7\xe8");
const HALANT_SPECIAL_BYTES = new Set("\xe1\xee\xef");
const CONSONANT_CLASS_U = "କଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଶଷସହ" + "ଡ଼ଢ଼";
const DEDICATED = new Set(
    Object.entries(A2U as Map_)
        .filter(([k, v]) => k.length === 1 && v && CONSONANT_CLASS_U.includes(v[0]) && !CONSONANT_BYTES.has(k) && !(k in MULTI_CONSONANT) && !HALANT_CONSONANT_BYTES.has(k) && !HALANT_SPECIAL_BYTES.has(k))
        .map(([k]) => k),
);

function consumeCluster(t: string, start: number): number {
    const n = t.length;
    let i = start;
    if (i >= n) return i;
    const ch = t[i];
    if (DEDICATED.has(ch)) return i + 1;
    if (ch in MULTI_CONSONANT && i + 1 < n && t[i + 1] === MULTI_CONSONANT[ch]) i += 2;
    else if (CONSONANT_BYTES.has(ch)) i += 1;
    else return start;
    while (i < n) {
        const c = t[i];
        if (HALANT_CONSONANT_BYTES.has(c) || HALANT_SPECIAL_BYTES.has(c)) {
            i++;
            continue;
        }
        if (c === "\xfe") {
            const j = i + 1;
            if (j < n) {
                const c2 = t[j];
                if (c2 in MULTI_CONSONANT && j + 1 < n && t[j + 1] === MULTI_CONSONANT[c2]) {
                    i = j + 2;
                    continue;
                }
                if (CONSONANT_BYTES.has(c2)) {
                    i = j + 1;
                    continue;
                }
            }
            break;
        }
        break;
    }
    return i;
}

const POSTBASE: Record<string, string> = { "\xf7": "ୈ", "û": "ୋ", "\xf8": "ୌ" };

export function akrutiToUnicode(text: string): string {
    if (!text) return "";
    const result: string[] = [];
    let i = 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch === "ù") {
            let k = i + 1;
            const cs = k;
            k = consumeCluster(text, k);
            const cluster = text.slice(cs, k);
            let matra = "େ";
            if (k < text.length && POSTBASE[text[k]]) {
                matra = POSTBASE[text[k]];
                k++;
            }
            result.push(a2uSub(cluster).join("") + matra);
            i = k;
            continue;
        }
        if (ch === "ð") {
            if (result.length) {
                let j = result.length - 1;
                while (j > 0) {
                    if (result[j - 1].endsWith("୍")) j--;
                    else if (result[j].startsWith("୍")) j--;
                    else break;
                }
                result[j] = "ର୍" + result[j];
            }
            i++;
            continue;
        }
        let used = 0;
        for (let L = Math.min(A2U_MAX, text.length - i); L >= 1; L--) {
            const v = (A2U as Map_)[text.substr(i, L)];
            if (v !== undefined) {
                result.push(v);
                used = L;
                break;
            }
        }
        if (!used) {
            result.push(ch);
            used = 1;
        }
        i += used;
    }
    return result.join("").normalize("NFC");
}

/* ---------------------------------------------------------------- Sreelipi → Unicode */
const MULTI_CHAR_INPUT: [string, string][] = [
    ["úÿ—", "୍ÿ—"],
    ["úÿ", "୍‌"],
    ["H´", "ୱ"],
    ["oe", "ନ"],
    ["þ#", "ତ୍ମ"],
];
const S_CONS = "କଖଗଘଙଚଛଜଝଞଟଠଡଡ଼ଢଢ଼ଣତଥଦଧନପଫବଭମଯରଲଳବଶଷସହୱ" + "ୟ";
const S_MATRA = "ାିୀୁୂୃେୈୋୌଂଁ";
const S_CLUSTER = `[${S_CONS}](?:୍[${S_CONS}])*`;
const CP1252: Record<number, string> = { 0x80: "€", 0x82: "‚", 0x83: "ƒ", 0x84: "„", 0x85: "…", 0x86: "†", 0x87: "‡", 0x88: "ˆ", 0x89: "‰", 0x8a: "Š", 0x8b: "‹", 0x8c: "Œ", 0x8e: "Ž", 0x91: "‘", 0x92: "’", 0x93: "“", 0x94: "”", 0x95: "•", 0x96: "–", 0x97: "—", 0x98: "˜", 0x99: "™", 0x9a: "š", 0x9b: "›", 0x9c: "œ", 0x9e: "ž", 0x9f: "Ÿ" };

export function sreelipiToUnicode(text: string): string {
    if (!text) return "";
    let t = [...text].map((c) => CP1252[c.charCodeAt(0)] ?? c).join("");
    for (const [k, v] of MULTI_CHAR_INPUT) t = t.split(k).join(v);
    const table = S2U as Map_;
    let out = "";
    for (let i = 0; i < t.length; i++) {
        if (t[i] === "ÿ" && t[i + 1] === "—") {
            out += "—";
            i++;
            continue;
        }
        out += table[t[i]] ?? t[i];
    }
    t = out;
    // prebase matras
    const all = new RegExp(`(\\{)(${S_CLUSTER})`, "g");
    if (all.test(t)) t = t.replace(new RegExp(`(\\{)(${S_CLUSTER})`, "g"), "$2$1");
    else {
        const one = new RegExp(`(\\{)([${S_CONS}])`, "g");
        if (one.test(t)) t = t.replace(new RegExp(`(\\{)([${S_CONS}])`, "g"), "$2$1");
        else {
            const two = new RegExp(`(\\{)(୍)([${S_CONS}])`, "g");
            t = t.replace(two, "$2$3$1").replace(two, "$2$3$1");
        }
    }
    t = t.replace(/\{ð/g, "ୈ").replace(/\{ା/g, "ୋ").replace(/\{ò/g, "ୌ").replace(/\{/g, "େ");
    t = t.replace(/([ଂଁ])([ାିୀୁୂୃେୈୋୌ])/g, "$2$1");
    // reph
    t = t.replace(new RegExp(`(${S_CLUSTER})([${S_MATRA}]*)ö`, "g"), "ö$1$2").replace(/ö/g, "ର୍");
    t = t.replace(new RegExp(`(${S_CLUSTER})([${S_MATRA}]*)\\}`, "g"), "}$1$2ି").replace(/\}/g, "ର୍");
    t = t.replace(/ଅା/g, "ଆ");
    return t.normalize("NFC");
}

/* ---------------------------------------------------------------- Unicode → Akruti / Sreelipi */
const BASE = "[କ-ହଡ଼ଢ଼ୟରଲଳଵୱଡ଼ଢ଼]";
const CLUSTER = `${BASE}(?:୍${BASE})*`;
const norm = (s: string) => s.normalize("NFC").replace(/ଡ଼/g, "ଡ଼").replace(/ଢ଼/g, "ଢ଼");
const u2aSub = makeSubst(U2A as Map_);
const u2sSub = makeSubst(U2S as Map_);

export function unicodeToAkruti(text: string): string {
    if (!text) return "";
    let t = norm(text);
    t = t.replace(new RegExp(`(?<!୍)ର୍(${CLUSTER})([ାିୀୁୂୃ]*)(େ|ୈ|ୋ|ୌ)?`, "g"), (_m, c: string, post: string, pre?: string) => {
        if (pre === "େ") return `ù${c}${post}ð`;
        if (pre === "ୈ") return `ù${c}${post}÷ð`;
        if (pre === "ୋ") return `ù${c}${post}ûð`;
        if (pre === "ୌ") return `ù${c}${post}øð`;
        return `${c}ð${post}`;
    });
    t = t.replace(new RegExp(`(${CLUSTER})େ`, "g"), "ù$1").replace(new RegExp(`(${CLUSTER})ୈ`, "g"), "ù$1÷").replace(new RegExp(`(${CLUSTER})ୋ`, "g"), "ù$1û").replace(new RegExp(`(${CLUSTER})ୌ`, "g"), "ù$1ø");
    return u2aSub(t).join("");
}

export function unicodeToSreelipi(text: string): string {
    if (!text) return "";
    let t = norm(text);
    t = t.replace(new RegExp(`(?<!୍)ର୍(${CLUSTER})([ାିୀୁୂୃେୈୋୌଂଁ]*)`, "g"), "$1$2ö");
    t = t.replace(new RegExp(`(${CLUSTER})ୈ`, "g"), "{$1ð").replace(new RegExp(`(${CLUSTER})ୋ`, "g"), "{$1æ").replace(new RegExp(`(${CLUSTER})ୌ`, "g"), "{$1ò").replace(new RegExp(`(${CLUSTER})େ`, "g"), "{$1");
    return u2sSub(t).join("");
}
