import { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = {
    title: "Notable People",
    description: "Meet the remarkable individuals who have shaped Odisha's identity - from ancient poets to modern leaders.",
};

export default function PeoplePage() {
    const articles = getAllArticles("people");

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">👥</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Notable People
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8">
                        ମହାନ ବ୍ୟକ୍ତିତ୍ୱ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-3 h-3 rotate-45 bg-teal-400"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                    <p className="text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed text-shadow-sm">
                        Discover the inspiring stories of individuals who have contributed to Odisha&apos;s
                        rich cultural, literary, and social heritage.
                    </p>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="People Articles" />
            )}

            {/* People Grid */}
            <section className="py-16 bg-slate-100 relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display border-l-4 border-teal-500 pl-4">Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-display group-hover:text-indigo-600 transition-colors">✍️ Writers & Poets</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                Literary giants who shaped Odia language and literature, from Sarala Das to Fakir Mohan Senapati.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-display group-hover:text-orange-600 transition-colors">🇮🇳 Freedom Fighters</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                Heroes who fought for India&apos;s independence, including Jayee Rajguru and Veer Surendra Sai.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-display group-hover:text-pink-600 transition-colors">🎨 Artists & Performers</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                Masters of Odissi dance, Pattachitra art, and classical music who preserve cultural traditions.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-display group-hover:text-blue-600 transition-colors">🌟 Modern Leaders</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                Contemporary figures in politics, sports, science, and industry who carry Odisha&apos;s legacy forward.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
