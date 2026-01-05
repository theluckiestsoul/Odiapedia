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
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">👥</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Notable People
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ମହାନ ବ୍ୟକ୍ତିତ୍ୱ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
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
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-8 font-display">Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 rounded-2xl p-8 border border-indigo-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">✍️ Writers & Poets</h3>
                            <p className="text-amber-100/70">
                                Literary giants who shaped Odia language and literature, from Sarala Das to Fakir Mohan Senapati.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-950/50 to-red-950/50 rounded-2xl p-8 border border-orange-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">🇮🇳 Freedom Fighters</h3>
                            <p className="text-amber-100/70">
                                Heroes who fought for India&apos;s independence, including Jayee Rajguru and Veer Surendra Sai.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-950/50 to-rose-950/50 rounded-2xl p-8 border border-pink-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">🎨 Artists & Performers</h3>
                            <p className="text-amber-100/70">
                                Masters of Odissi dance, Pattachitra art, and classical music who preserve cultural traditions.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-950/50 to-cyan-950/50 rounded-2xl p-8 border border-blue-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">🌟 Modern Leaders</h3>
                            <p className="text-amber-100/70">
                                Contemporary figures in politics, sports, science, and industry who carry Odisha&apos;s legacy forward.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
