"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchResult {
    title: string;
    description: string;
    category: string;
    slug: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    articles: SearchResult[];
}

const categoryIcons: Record<string, string> = {
    language: "📚",
    culture: "🎭",
    history: "🏛️",
    food: "🍛",
    people: "👥",
    about: "ℹ️",
};

export default function SearchModal({ isOpen, onClose, articles }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const searchLower = query.toLowerCase();
        const filtered = articles.filter(
            (article) =>
                article.title.toLowerCase().includes(searchLower) ||
                article.description.toLowerCase().includes(searchLower) ||
                article.category.toLowerCase().includes(searchLower)
        );
        setResults(filtered.slice(0, 8));
    }, [query, articles]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-900/10 overflow-hidden">
                <div className="flex flex-col h-full bg-slate-50">
                    {/* Search Input Header */}
                    <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
                        <div className="text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search Odiapedia..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-slate-900 placeholder-slate-400 font-medium"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            onClick={onClose}
                            className="p-1 px-2 text-xs font-medium text-slate-500 bg-slate-100 rounded border border-slate-200 hover:bg-slate-200 transition-colors"
                        >
                            ESC
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {results.length > 0 ? (
                            <div className="py-2">
                                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Suggestions
                                </h3>
                                <ul className="space-y-1">
                                    {results.map((result) => (
                                        <li key={result.slug}>
                                            <Link
                                                href={`/${result.category}/${result.slug}`}
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-teal-50 group transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-teal-100/50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors">
                                                    <span className="text-lg">
                                                        {categoryIcons[result.category as keyof typeof categoryIcons] || "📄"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-slate-700 font-medium group-hover:text-teal-900">
                                                        {result.title}
                                                    </div>
                                                    <div className="text-xs text-slate-400 group-hover:text-teal-600/70 capitalize">
                                                        {result.category}
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : query ? (
                            <div className="py-12 text-center text-slate-500">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-slate-400 text-sm">
                                    Type to search across articles, glossary, and more.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-400 flex justify-between px-4">
                        <span>Search powered by Odiapedia</span>
                        <span className="opacity-70">v0.1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
