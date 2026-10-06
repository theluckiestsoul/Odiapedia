/** Client-safe search ranking shared by the search modal and the /search page. */
export interface SearchableEntry {
    title: string;
    description: string;
    category: string;
    href: string;
    odiaTitle?: string;
    keywords?: string[];
}

const norm = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ")
        .trim();

/** Common romanisation variants so "orissa", "jagannatha", "rathyatra" still match. */
const VARIANTS: [RegExp, string][] = [
    [/orissa/g, "odisha"],
    [/oriya/g, "odia"],
    [/rathyatra|ratha yatra|rath jatra|ratha jatra/g, "rath yatra"],
    [/jagannatha/g, "jagannath"],
    [/rasgulla|rosogolla|rasagolla/g, "rasagola"],
    [/bhubaneshwar/g, "bhubaneswar"],
    [/konarak/g, "konark"],
    [/similipal/g, "simlipal"],
    [/panji|panchang|panchanga/g, "panjika"],
];

function expand(q: string): string {
    let out = norm(q);
    for (const [re, rep] of VARIANTS) out = out.replace(re, rep);
    return out;
}

export function rankSearch<T extends SearchableEntry>(entries: T[], query: string): T[] {
    const q = expand(query);
    if (q.length < 2) return [];
    const terms = q.split(" ").filter((t) => t.length > 1);
    const scored: { e: T; s: number }[] = [];
    for (const e of entries) {
        const title = expand(e.title);
        const odia = e.odiaTitle || "";
        const kw = expand((e.keywords || []).join(" "));
        const desc = expand(e.description || "");
        let s = 0;
        if (title === q) s += 100;
        if (title.startsWith(q)) s += 40;
        if (title.includes(q)) s += 25;
        if (odia && odia.includes(query.trim())) s += 40;
        if (kw.includes(q)) s += 15;
        for (const t of terms) {
            if (title.includes(t)) s += 8;
            if (kw.includes(t)) s += 4;
            if (desc.includes(t)) s += 2;
            if (e.category.includes(t)) s += 1;
        }
        // Require every term to appear somewhere for multi-word queries
        const hay = `${title} ${kw} ${desc} ${e.category} ${odia}`;
        if (terms.length > 1 && !terms.every((t) => hay.includes(t))) s = Math.min(s, 3);
        if (s > 0) scored.push({ e, s });
    }
    return scored.sort((a, b) => b.s - a.s || a.e.title.localeCompare(b.e.title)).map((x) => x.e);
}
