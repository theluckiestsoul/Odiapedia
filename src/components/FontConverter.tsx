"use client";

import { useMemo, useState } from "react";
import { akrutiToUnicode, sreelipiToUnicode, unicodeToAkruti, unicodeToSreelipi } from "@/lib/odia-legacy";

const MODES = [
    { id: "a2u", label: "Akruti → Unicode", from: "Akruti text", to: "Unicode Odia", fn: akrutiToUnicode, outOdia: true },
    { id: "s2u", label: "Sreelipi → Unicode", from: "Sreelipi text", to: "Unicode Odia", fn: sreelipiToUnicode, outOdia: true },
    { id: "u2a", label: "Unicode → Akruti", from: "Unicode Odia", to: "Akruti text", fn: unicodeToAkruti, outOdia: false },
    { id: "u2s", label: "Unicode → Sreelipi", from: "Unicode Odia", to: "Sreelipi text", fn: unicodeToSreelipi, outOdia: false },
] as const;

const SAMPLE: Record<string, string> = { u2a: "ଓଡ଼ିଶା ଭାରତର ଏକ ରାଜ୍ୟ।", u2s: "ଓଡ଼ିଶା ଭାରତର ଏକ ରାଜ୍ୟ।" };

export default function FontConverter() {
    const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("a2u");
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const m = MODES.find((x) => x.id === mode)!;
    const output = useMemo(() => {
        try {
            return m.fn(input);
        } catch {
            return "";
        }
    }, [m, input]);
    const copy = () => navigator.clipboard?.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => {});
    const download = () => {
        const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `odia-${mode}.txt`;
        a.click();
    };
    return (
        <div>
            <div role="tablist" className="flex flex-wrap gap-2">
                {MODES.map((x) => (
                    <button key={x.id} type="button" role="tab" aria-selected={mode === x.id} onClick={() => { setMode(x.id); if (!input && SAMPLE[x.id]) setInput(""); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === x.id ? "bg-laterite-500 text-white" : "border border-sand-200 bg-white text-ink-700 hover:border-laterite-300"}`}>
                        {x.label}
                    </button>
                ))}
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <label className="block">
                    <span className="text-sm font-semibold text-ink-700">{m.from}</span>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} spellCheck={false} lang={m.outOdia ? undefined : "or"}
                        placeholder={m.outOdia ? "Paste text typed in the old font here. It will look like random Latin letters — that is normal." : "ଏଠାରେ ୟୁନିକୋଡ୍ ଓଡ଼ିଆ ଲେଖା ଦିଅନ୍ତୁ"}
                        className={`mt-2 w-full rounded-2xl border border-sand-200 bg-white p-4 text-base focus:border-laterite-400 focus:outline-none ${m.outOdia ? "font-mono" : "font-odia text-lg"}`} />
                </label>
                <label className="block">
                    <span className="text-sm font-semibold text-ink-700">{m.to}</span>
                    <textarea value={output} readOnly rows={12} lang={m.outOdia ? "or" : undefined}
                        className={`mt-2 w-full rounded-2xl border border-sand-200 bg-sand-50 p-4 text-base ${m.outOdia ? "font-odia text-lg" : "font-mono"}`} />
                </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={copy} disabled={!output} className="btn-primary disabled:opacity-50">{copied ? "Copied!" : "Copy result"}</button>
                <button type="button" onClick={download} disabled={!output} className="btn-ghost disabled:opacity-50">Download .txt</button>
                <button type="button" onClick={() => setInput("")} className="btn-ghost">Clear</button>
                {!m.outOdia && <button type="button" onClick={() => setInput(SAMPLE[mode] || "")} className="btn-ghost">Try a sample</button>}
            </div>
            <p className="mt-3 text-xs text-ink-500">Everything runs in your browser; your text is not sent anywhere.</p>
        </div>
    );
}
