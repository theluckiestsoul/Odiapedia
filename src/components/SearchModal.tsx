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
            <div className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-900 to-black rounded-2xl border border-amber-900/30 shadow-2xl shadow-amber-900/20 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-amber-900/30">
                    <svg
                        className="w-5 h-5 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-amber-100 placeholder-amber-500/50 outline-none text-lg"
                    />
                    <button
                        onClick={onClose}
                        className="text-amber-500/50 hover:text-amber-400 text-sm"
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.length < 2 ? (
                        <div className="p-8 text-center text-amber-500/50">
                            Type at least 2 characters to search...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-amber-500/50">
                            No articles found for &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.map((result) => (
                                <Link
                                    key={`${result.category}/${result.slug}`}
                                    href={`/${result.category}/${result.slug}`}
                                    onClick={onClose}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-amber-900/20 transition-colors group"
                                >
                                    <span className="text-2xl">
                                        {categoryIcons[result.category] || "📄"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-amber-500/60 uppercase tracking-wider">
                                                {result.category}
                                            </span>
                                        </div>
                                        <h3 className="text-amber-100 font-medium group-hover:text-amber-300 transition-colors truncate">
                                            {result.title}
                                        </h3>
                                        <p className="text-amber-100/50 text-sm truncate">
                                            {result.description}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-amber-500/30 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-500/40">
                    <span>{articles.length} articles available</span>
                    <span>↵ to select • ESC to close</span>
                </div>
            </div>
        </div>
    );
}
