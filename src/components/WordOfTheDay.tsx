"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

export interface OdiaWord {
    word: string;
    transliteration: string;
    meaning: string;
    meaningOdia?: string;
    example?: string;
    exampleTranslation?: string;
    category?: string;
}

/** Picks the word by the visitor's current IST day, so it changes daily without a rebuild. */
export default function WordOfTheDay({ words }: { words: OdiaWord[] }) {
    const [i, setI] = useState<number | null>(null);
    useEffect(() => {
        const now = new Date();
        const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
        const day = Math.floor(Date.UTC(ist.getFullYear(), ist.getMonth(), ist.getDate()) / 86400000);
        setI(day % words.length);
    }, [words.length]);
    const w = words[i ?? 0];
    return (
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white md:p-12">
            <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
            <div className="relative">
                <p className="eyebrow !text-saffron-300"><Icon name="sparkle" className="h-4 w-4" />Word of the day</p>
                <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
                    <div>
                        <p lang="or" className="font-odia-serif text-6xl md:text-7xl">{w.word}</p>
                        <p className="mt-3 text-xl text-saffron-200">{w.transliteration}</p>
                        <p className="mt-1 text-lg text-sand-100/90">{w.meaning}</p>
                    </div>
                    {w.example && (
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-200/70">Example</p>
                            <p lang="or" className="mt-2 font-odia text-2xl">{w.example}</p>
                            {w.exampleTranslation && <p className="mt-2 text-sand-100/80">{w.exampleTranslation}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
