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

const lessons = [
    {
        slug: "alphabet",
        number: 1,
        title: "The Odia Alphabet",
        description: "Learn vowels and consonants",
        icon: "🔤",
    },
    {
        slug: "numbers",
        number: 2,
        title: "Odia Numbers",
        description: "Count from 1 to 20",
        icon: "🔢",
    },
    {
        slug: "greetings",
        number: 3,
        title: "Essential Greetings",
        description: "Say hello and be polite",
        icon: "👋",
    },
    {
        slug: "phrases",
        number: 4,
        title: "Everyday Phrases",
        description: "Practical daily expressions",
        icon: "💬",
    },
];

export default function LearnPage() {
    const wordOfTheDay = getWordOfTheDay();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-slate-50"></div>
                <div className="absolute inset-0 bg-water opacity-30"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-bounce-slow">📖</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 font-display">
                        Learn Odia
                    </h1>
                    <p className="text-3xl text-teal-700 odia-text mb-8 font-medium">
                        ଓଡ଼ିଆ ଶିଖନ୍ତୁ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-rose-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-600"></div>
                    </div>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Start your journey into the beautiful Odia language with our structured lessons
                        and daily word feature.
                    </p>
                </div>
            </section>

            {/* Word of the Day */}
            <section className="py-16 bg-white relative">
                <div className="absolute inset-0 bg-water opacity-20"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-teal-900/10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <span className="text-3xl">🌟</span>
                            <h2 className="text-2xl font-bold text-teal-50 font-display">
                                Word of the Day
                            </h2>
                        </div>

                        <div className="text-center mb-8 relative z-10">
                            <p className="text-6xl md:text-8xl odia-text text-white mb-4 font-medium drop-shadow-md">
                                {wordOfTheDay.word}
                            </p>
                            <p className="text-2xl text-teal-200 mb-2 font-medium">
                                {wordOfTheDay.transliteration}
                            </p>
                            <p className="text-xl text-teal-100/90">
                                {wordOfTheDay.meaning}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20 relative z-10">
                            <p className="text-sm text-teal-200 uppercase tracking-wider mb-2 font-medium">Example</p>
                            <p className="text-2xl odia-text text-white mb-2">
                                {wordOfTheDay.example}
                            </p>
                            <p className="text-teal-100">
                                {wordOfTheDay.exampleTranslation}
                            </p>
                        </div>

                        <p className="text-center text-teal-200/60 text-sm relative z-10">
                            Come back tomorrow for a new word! 🗓️
                        </p>
                    </div>
                </div>
            </section>

            {/* Lessons Section */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 font-display flex items-center gap-3">
                        <span className="text-teal-600">🎓</span>
                        Learn Odia Basics
                    </h2>
                    <p className="text-slate-600 mb-8">Complete these 4 lessons to master the fundamentals</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {lessons.map((lesson) => (
                            <Link
                                key={lesson.slug}
                                href={`/learn/${lesson.slug}`}
                                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                        {lesson.number}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{lesson.icon}</span>
                                            <h3 className="text-xl font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                                                {lesson.title}
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            {lesson.description}
                                        </p>
                                        <span className="inline-block mt-3 text-teal-600 text-sm font-medium group-hover:underline decoration-rose-400">
                                            Start lesson →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* More Resources */}
            <section className="py-16 bg-white border-t border-slate-200 relative">
                <div className="absolute inset-0 bg-water opacity-10"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display flex items-center gap-3">
                        <span className="text-rose-500">📚</span>
                        More Reading
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/language/odia-alphabet"
                            className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-300"
                        >
                            <span className="text-3xl mb-3 block">🔤</span>
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-rose-700 transition-colors mb-2">
                                Full Alphabet Guide
                            </h3>
                            <p className="text-slate-600 text-sm">
                                Complete reference with all vowels and consonants.
                            </p>
                        </Link>

                        <Link
                            href="/language/common-greetings"
                            className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-300"
                        >
                            <span className="text-3xl mb-3 block">👋</span>
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-rose-700 transition-colors mb-2">
                                Greetings Article
                            </h3>
                            <p className="text-slate-600 text-sm">
                                In-depth guide to Odia greetings.
                            </p>
                        </Link>

                        <Link
                            href="/language"
                            className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-300"
                        >
                            <span className="text-3xl mb-3 block">📚</span>
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-rose-700 transition-colors mb-2">
                                All Language Articles
                            </h3>
                            <p className="text-slate-600 text-sm">
                                Explore the full language section.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Words */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display flex items-center gap-3">
                        <span className="text-teal-500">✨</span>
                        Quick Words to Learn
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {words.slice(0, 8).map((word, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-4 border border-slate-200 text-center hover:shadow-md transition-shadow"
                            >
                                <p className="text-2xl odia-text text-teal-700 mb-1">{word.word}</p>
                                <p className="text-sm text-slate-600 font-medium">{word.transliteration}</p>
                                <p className="text-xs text-slate-400 mt-1">{word.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
