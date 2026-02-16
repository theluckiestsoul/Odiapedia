import { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = {
    title: "Odia Language",
    description: "Explore the classical Odia language - one of the oldest classical languages of India with over 1000 years of literary tradition.",
};

export default function LanguagePage() {
    const articles = getAllArticles("language");

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">📚</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Odia Language
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8">
                        ଓଡ଼ିଆ ଭାଷା
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-3 h-3 rotate-45 bg-teal-400"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                    <p className="text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed text-shadow-sm">
                        One of the oldest classical languages of India, Odia has a rich literary tradition
                        spanning over a millennium.
                    </p>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="Language Articles" />
            )}

            {/* Content Section */}
            <section className="py-16 bg-slate-100 relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-slate prose-lg max-w-none">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display border-l-4 border-teal-500 pl-4">
                            A Classical Language
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            Odia (ଓଡ଼ିଆ) is an Indo-Aryan language spoken in the Indian state of Odisha.
                            It is the official language of Odisha and has been designated as a classical
                            language of India since 2014.
                        </p>

                        <div className="bg-white rounded-2xl p-8 my-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>

                            <h3 className="text-2xl font-semibold text-teal-700 mb-6 font-display relative z-10">
                                Key Facts
                            </h3>
                            <ul className="space-y-4 text-slate-700 relative z-10">
                                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-teal-500 text-xl">✦</span>
                                    <span>6th classical language of India (2014)</span>
                                </li>
                                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-teal-500 text-xl">✦</span>
                                    <span>Over 50 million native speakers worldwide</span>
                                </li>
                                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-teal-500 text-xl">✦</span>
                                    <span>Unique curvilinear script evolved for palm leaf writing</span>
                                </li>
                                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-teal-500 text-xl">✦</span>
                                    <span>Rich literary heritage dating back to the 10th century</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
