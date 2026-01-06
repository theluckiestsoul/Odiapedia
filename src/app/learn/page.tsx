import { Metadata } from "next";
import Link from "next/link";
import words from "@/../data/words.json";

export const metadata: Metadata = {
    title: "Learn Odia",
    description: "Start learning the Odia language with our daily word feature, greetings, and basic lessons.",
};

// Get word of the day based on current date
function getWordOfTheDay() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Cycle through words based on day of year
    const wordIndex = dayOfYear % words.length;
    return words[wordIndex];
}

export default function LearnPage() {
    const wordOfTheDay = getWordOfTheDay();

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">📖</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Learn Odia
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଆ ଶିଖନ୍ତୁ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        Start your journey into the beautiful Odia language with our word of the day
                        and essential learning resources.
                    </p>
                </div>
            </section>

            {/* Word of the Day */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-amber-950/50 to-orange-950/50 rounded-3xl p-8 md:p-12 border border-amber-800/30">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🌟</span>
                            <h2 className="text-2xl font-bold text-amber-100 font-display">
                                Word of the Day
                            </h2>
                        </div>

                        <div className="text-center mb-8">
                            <p className="text-6xl md:text-8xl odia-text text-amber-300 mb-4 font-medium">
                                {wordOfTheDay.word}
                            </p>
                            <p className="text-2xl text-amber-500/80 mb-2">
                                {wordOfTheDay.transliteration}
                            </p>
                            <p className="text-xl text-amber-100/70">
                                {wordOfTheDay.meaning}
                            </p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-6 mb-6">
                            <p className="text-sm text-amber-500/60 uppercase tracking-wider mb-2">Example</p>
                            <p className="text-2xl odia-text text-amber-200 mb-2">
                                {wordOfTheDay.example}
                            </p>
                            <p className="text-amber-100/60">
                                {wordOfTheDay.exampleTranslation}
                            </p>
                        </div>

                        <p className="text-center text-amber-500/50 text-sm">
                            Come back tomorrow for a new word! 🗓️
                        </p>
                    </div>
                </div>
            </section>

            {/* Learning Resources */}
            <section className="py-16 bg-black">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-8 font-display flex items-center gap-3">
                        <span className="text-amber-500">📚</span>
                        Learning Resources
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href="/language/odia-alphabet"
                            className="group bg-gradient-to-br from-blue-950/40 to-indigo-950/40 rounded-2xl p-6 border border-blue-800/30 hover:border-amber-600/50 transition-all duration-300"
                        >
                            <span className="text-4xl mb-4 block">🔤</span>
                            <h3 className="text-xl font-semibold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                                Odia Alphabet & Script
                            </h3>
                            <p className="text-amber-100/60 text-sm">
                                Learn the beautiful curvilinear Odia script with vowels, consonants, and numbers.
                            </p>
                        </Link>

                        <Link
                            href="/language/common-greetings"
                            className="group bg-gradient-to-br from-green-950/40 to-emerald-950/40 rounded-2xl p-6 border border-green-800/30 hover:border-amber-600/50 transition-all duration-300"
                        >
                            <span className="text-4xl mb-4 block">👋</span>
                            <h3 className="text-xl font-semibold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                                Common Greetings
                            </h3>
                            <p className="text-amber-100/60 text-sm">
                                Essential Odia greetings and phrases for everyday conversations.
                            </p>
                        </Link>

                        <Link
                            href="/language"
                            className="group bg-gradient-to-br from-purple-950/40 to-fuchsia-950/40 rounded-2xl p-6 border border-purple-800/30 hover:border-amber-600/50 transition-all duration-300"
                        >
                            <span className="text-4xl mb-4 block">📚</span>
                            <h3 className="text-xl font-semibold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                                Language Overview
                            </h3>
                            <p className="text-amber-100/60 text-sm">
                                Explore the Odia language section with all language-related articles.
                            </p>
                        </Link>

                        <div className="bg-gradient-to-br from-slate-900/40 to-zinc-900/40 rounded-2xl p-6 border border-slate-700/30 opacity-60">
                            <span className="text-4xl mb-4 block">🎓</span>
                            <h3 className="text-xl font-semibold text-amber-100/70 mb-2">
                                Structured Lessons
                            </h3>
                            <p className="text-amber-100/40 text-sm">
                                Coming soon — step-by-step Odia lessons for beginners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Words */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-8 font-display flex items-center gap-3">
                        <span className="text-amber-500">✨</span>
                        Quick Words to Learn
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {words.slice(0, 8).map((word, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-amber-950/20 to-orange-950/20 rounded-xl p-4 border border-amber-900/20 text-center"
                            >
                                <p className="text-2xl odia-text text-amber-300 mb-1">{word.word}</p>
                                <p className="text-sm text-amber-500/70">{word.transliteration}</p>
                                <p className="text-xs text-amber-100/50 mt-1">{word.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
