"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LANGS = [
    { code: "en" as const, name: "English", native: "English" },
    { code: "od" as const, name: "Odia", native: "ଓଡ଼ିଆ" },
];

/**
 * Language switcher. It only navigates to a translated page that really exists (from the server-built
 * `pairs` map); otherwise it switches the site's menus to the chosen language, stays on the page and
 * says plainly that this page has no translation yet — never a 404.
 */
export default function LanguageToggle({ pairs = {} }: { pairs?: Record<string, string> }) {
    const { language, setLanguage } = useLanguage();
    const router = useRouter();
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);
    const [notice, setNotice] = useState<null | "od" | "en">(null);
    const box = useRef<HTMLDivElement>(null);

    const isOdiaPage = /-od$/.test(pathname);
    const current = LANGS.find((l) => l.code === language) ?? LANGS[0];

    // Keep the switcher in step with the page being read (an Odia article shows "Odia").
    useEffect(() => {
        if (/-od$/.test(pathname) && language !== "od") setLanguage("od");
        setNotice(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [open]);

    const choose = (code: "en" | "od") => {
        setOpen(false);
        setLanguage(code);
        const alt = pairs[pathname];
        const wantOdia = code === "od";
        if (alt && wantOdia !== isOdiaPage) {
            router.push(alt);
            return;
        }
        if (wantOdia !== isOdiaPage) setNotice(code);
    };

    return (
        <div ref={box} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-sand-300 bg-white/70 px-3 py-1.5 text-sm font-medium text-ink-700 shadow-sm transition-colors hover:border-laterite-200 hover:bg-white"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Language: ${current.name}`}
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-laterite-500 text-[10px] font-bold text-white">{current.code.toUpperCase()}</span>
                <span className="hidden sm:inline" lang={current.code === "od" ? "or" : "en"}>{current.native}</span>
                <svg className={`h-4 w-4 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {open && (
                <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-sand-200 bg-white py-1 shadow-xl">
                    {LANGS.map((l) => {
                        const target = pairs[pathname];
                        const available = (l.code === "od") === isOdiaPage || !!target;
                        return (
                            <button key={l.code} type="button" role="menuitem" onClick={() => choose(l.code)}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-sand-50 ${language === l.code ? "font-semibold text-laterite-700" : "text-ink-700"}`}>
                                <span className={`h-2 w-2 rounded-full ${language === l.code ? "bg-laterite-500" : "bg-sand-300"}`} />
                                <span lang={l.code === "od" ? "or" : "en"}>{l.native}</span>
                                {!available && <span className="ml-auto text-[11px] font-normal text-ink-400">menus only</span>}
                            </button>
                        );
                    })}
                    <Link href="/odia" onClick={() => setOpen(false)} className="block border-t border-sand-100 px-4 py-2.5 text-xs text-laterite-600 hover:bg-sand-50" lang="or">
                        ଓଡ଼ିଆରେ ଉପଲବ୍ଧ ସମସ୍ତ ଲେଖା →
                    </Link>
                </div>
            )}

            {notice && (
                <div role="status" className="fixed inset-x-3 bottom-4 z-[70] mx-auto max-w-md rounded-2xl bg-ink-900 p-4 text-sm text-white shadow-2xl sm:inset-x-auto sm:right-6">
                    {notice === "od" ? (
                        <p lang="or" className="font-odia leading-relaxed">
                            ଏହି ପୃଷ୍ଠାର ଓଡ଼ିଆ ସଂସ୍କରଣ ଏବେ ପ୍ରସ୍ତୁତ ହେଉଛି। ମେନୁ ଓଡ଼ିଆରେ ଦେଖାଯିବ।{" "}
                            <Link href="/odia" className="font-semibold text-saffron-300 underline">ଓଡ଼ିଆରେ ଉପଲବ୍ଧ ଲେଖା ଦେଖନ୍ତୁ</Link>
                            <span className="mt-1 block font-sans text-xs text-ink-200">This page is not available in Odia yet — the menus are now in Odia.</span>
                        </p>
                    ) : (
                        <p>This page is only available in Odia for now. The menus are now in English. <Link href="/" className="font-semibold text-saffron-300 underline">Go to the English home page</Link></p>
                    )}
                    <button type="button" onClick={() => setNotice(null)} className="absolute right-2 top-2 rounded-full px-2 text-ink-300 hover:text-white" aria-label="Dismiss">×</button>
                </div>
            )}
        </div>
    );
}
