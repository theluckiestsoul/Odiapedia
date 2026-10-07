"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import { rankSearch, type SearchableEntry } from "@/lib/search";
import { categoryInfo } from "@/lib/site";
import { useLazyJson } from "@/lib/site-data";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Optional: entries to search; when omitted the site index is fetched on first open. */
    articles?: SearchableEntry[];
}

const QUICK = [
    { href: "/culture/rath-yatra", label: "Rath Yatra" },
    { href: "/travel/puri", label: "Puri travel guide" },
    { href: "/calendar", label: "Today's Odia panjika" },
    { href: "/learn/alphabet", label: "Odia alphabet" },
    { href: "/food/mahaprasad", label: "Mahaprasad" },
    { href: "/history/odisha-at-a-glance", label: "Odisha at a glance" },
];

export default function SearchModal({ isOpen, onClose, articles: given }: SearchModalProps) {
    const fetched = useLazyJson<SearchableEntry[]>("/search-index.json", isOpen && !given);
    const articles = useMemo(() => given ?? fetched ?? [], [given, fetched]);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const results = useMemo(() => (query.trim().length < 2 ? [] : rankSearch(articles, query).slice(0, 8)), [articles, query]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
        } else {
            setQuery("");
        }
    }, [isOpen]);

    useEffect(() => setActive(0), [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const go = (href: string) => {
        onClose();
        router.push(href);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search Odiapedia">
            <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-2xl">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (results[active]) go(results[active].href);
                        else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
                    }}
                    className="flex items-center gap-3 border-b border-sand-200 px-5 py-4"
                >
                    <Icon name="search" className="h-5 w-5 text-laterite-500" />
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                        }}
                        placeholder="Search Odisha — festivals, places, food, people… (English or ଓଡ଼ିଆ)"
                        className="flex-1 bg-transparent text-lg text-ink-900 outline-none placeholder:text-ink-400"
                        aria-label="Search query"
                    />
                    <button type="button" onClick={onClose} className="rounded-md border border-sand-200 px-2 py-1 text-xs text-ink-500 hover:bg-sand-100">
                        Esc
                    </button>
                </form>

                <div className="max-h-[60vh] overflow-y-auto p-3">
                    {query.trim().length < 2 ? (
                        <div className="p-3">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Popular</p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK.map((q) => (
                                    <Link key={q.href} href={q.href} onClick={onClose} className="chip hover:border-laterite-300 hover:text-laterite-700">
                                        {q.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="space-y-1">
                            {results.map((r, i) => {
                                const cat = categoryInfo(r.category);
                                return (
                                    <li key={r.href}>
                                        <Link
                                            href={r.href}
                                            onClick={onClose}
                                            onMouseEnter={() => setActive(i)}
                                            className={`flex items-start gap-3 rounded-2xl p-3 transition-colors ${i === active ? "bg-sand-100" : ""}`}
                                        >
                                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-laterite-50 text-laterite-600">
                                                <Icon name={cat.icon} className="h-4 w-4" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block font-semibold text-ink-900">
                                                    {r.title}
                                                    {r.odiaTitle && <span lang="or" className="ml-2 font-odia text-sm font-normal text-ink-500">{r.odiaTitle}</span>}
                                                </span>
                                                <span className="line-clamp-1 text-sm text-ink-500">{r.description}</span>
                                                <span className="text-xs font-medium uppercase tracking-wider text-laterite-600">{cat.label}</span>
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <Link href={`/search?q=${encodeURIComponent(query.trim())}`} onClick={onClose} className="flex items-center justify-center gap-2 rounded-2xl p-3 text-sm font-semibold text-laterite-600 hover:bg-sand-100">
                                    See all results for “{query.trim()}” <Icon name="arrow" className="h-4 w-4" />
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="font-medium text-ink-800">No articles match “{query}” yet.</p>
                            <p className="mt-1 text-sm text-ink-500">Try a shorter word, or the Odia spelling. Missing a topic? <a className="text-laterite-600 underline" href={`mailto:contact@odiapedia.com?subject=${encodeURIComponent("Topic suggestion: " + query)}`}>Suggest it</a>.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
