"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { toOdia } from "@/lib/odia-translit";

const KEY_ROWS: string[][] = [
    ["ଅ", "ଆ", "ଇ", "ଈ", "ଉ", "ଊ", "ଋ", "ଏ", "ଐ", "ଓ", "ଔ"],
    ["ା", "ି", "ୀ", "ୁ", "ୂ", "ୃ", "େ", "ୈ", "ୋ", "ୌ", "୍", "ଂ", "ଃ", "ଁ"],
    ["କ", "ଖ", "ଗ", "ଘ", "ଙ", "ଚ", "ଛ", "ଜ", "ଝ", "ଞ"],
    ["ଟ", "ଠ", "ଡ", "ଢ", "ଣ", "ତ", "ଥ", "ଦ", "ଧ", "ନ"],
    ["ପ", "ଫ", "ବ", "ଭ", "ମ", "ଯ", "ୟ", "ର", "ଲ", "ଳ", "ୱ"],
    ["ଶ", "ଷ", "ସ", "ହ", "କ୍ଷ", "ଜ୍ଞ", "ଡ଼", "ଢ଼", "।", "୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"],
];

export default function OdiaTyping() {
    const [latin, setLatin] = useState("");
    const [odia, setOdia] = useState("");
    const [digits, setDigits] = useState(true);
    const [copied, setCopied] = useState(false);
    const outRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        try { const s = localStorage.getItem("odia-typing"); if (s) setLatin(s); } catch { /* storage unavailable */ }
    }, []);
    useEffect(() => {
        try { localStorage.setItem("odia-typing", latin); } catch { /* storage unavailable */ }
    }, [latin]);

    // Typing on the left re-generates the Odia text; the keyboard and direct edits change the Odia text itself.
    useEffect(() => { setOdia(toOdia(latin, { digits })); }, [latin, digits]);
    const add = (k: string) => setOdia((x) => x + k);
    const words = odia.trim() ? odia.trim().split(/\s+/).length : 0;

    const copy = async () => {
        try { await navigator.clipboard.writeText(odia); setCopied(true); setTimeout(() => setCopied(false), 1500); }
        catch { outRef.current?.select(); }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-5 sm:p-6">
                <label htmlFor="latin" className="flex items-center justify-between text-sm font-semibold text-ink-900">
                    Type in English letters
                    <span className="text-xs font-normal text-ink-500">e.g. <code>namaskaara</code>, <code>oD.ishaa</code></span>
                </label>
                <textarea
                    id="latin"
                    value={latin}
                    onChange={(e) => setLatin(e.target.value)}
                    rows={8}
                    autoFocus
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    placeholder="aamaa oD.ishaa — jaya jagannaatha"
                    className="mt-3 w-full resize-y rounded-xl border border-sand-300 bg-sand-50 p-4 font-mono text-base leading-relaxed outline-none focus:border-laterite-400 focus:ring-2 focus:ring-laterite-100"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <label className="inline-flex items-center gap-2 text-ink-700">
                        <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} className="h-4 w-4 accent-laterite-500" />
                        Odia numerals (୧୨୩)
                    </label>
                    <button type="button" onClick={() => { setLatin(""); setOdia(""); }} className="ml-auto text-ink-500 hover:text-laterite-600">Clear</button>
                </div>
            </div>

            <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <label htmlFor="odia-out" className="text-sm font-semibold text-ink-900">Odia (ଓଡ଼ିଆ)</label>
                    <span className="text-xs text-ink-500">{words} {words === 1 ? "word" : "words"} · {odia.length} characters</span>
                </div>
                <textarea
                    id="odia-out"
                    ref={outRef}
                    value={odia}
                    onChange={(e) => setOdia(e.target.value)}
                    rows={8}
                    lang="or"
                    className="mt-3 w-full resize-y rounded-xl border border-sand-300 bg-white p-4 font-odia text-xl leading-relaxed text-ink-900 outline-none"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={copy} className="btn-primary">
                        <Icon name={copied ? "check" : "pen"} className="h-4 w-4" /> {copied ? "Copied" : "Copy Odia text"}
                    </button>
                    <a href={`https://wa.me/?text=${encodeURIComponent(odia)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost">Share on WhatsApp</a>
                </div>
            </div>

            <div className="card p-5 sm:p-6 lg:col-span-2">
                <p className="text-sm font-semibold text-ink-900">On-screen Odia keyboard <span className="font-normal text-ink-500">— tap to add a letter to the end of the Odia text. You can also edit the Odia box directly; typing again on the left starts it afresh.</span></p>
                <div className="mt-4 space-y-2">
                    {KEY_ROWS.map((row, i) => (
                        <div key={i} className="flex flex-wrap gap-1.5">
                            {row.map((k) => (
                                <button key={k} type="button" onClick={() => add(k)} lang="or"
                                    className="min-w-10 rounded-lg border border-sand-200 bg-sand-50 px-2.5 py-2 font-odia text-lg text-ink-900 transition-colors hover:border-laterite-300 hover:bg-laterite-50 active:scale-95">
                                    {/[଼-ୗଁ-ଃ]/.test(k) && k.length === 1 ? `◌${k}` : k}
                                </button>
                            ))}
                        </div>
                    ))}
                    <div className="flex gap-1.5">
                        <button type="button" onClick={() => add(" ")} className="flex-1 rounded-lg border border-sand-200 bg-sand-50 py-2 text-sm text-ink-600 hover:bg-sand-100">space</button>
                        <button type="button" onClick={() => setOdia((x) => [...x].slice(0, -1).join(""))} className="rounded-lg border border-sand-200 bg-sand-50 px-4 py-2 text-sm text-ink-600 hover:bg-sand-100">⌫</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
