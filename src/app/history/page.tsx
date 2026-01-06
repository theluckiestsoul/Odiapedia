import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = {
    title: "Odia History",
    description: "Journey through the rich history of Odisha - from ancient Kalinga to medieval kingdoms and the colonial era.",
};

export default function HistoryPage() {
    const articles = getAllArticles("history");

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">🏛️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Odia History
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଶା ଇତିହାସ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed mb-8">
                        From the mighty Kalinga Empire to the architectural wonders of the Eastern Ganga dynasty,
                        explore the rich historical tapestry of Odisha.
                    </p>

                    {/* Timeline Button */}
                    <Link
                        href="/history/timeline"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-xl text-black font-semibold transition-all shadow-lg shadow-amber-900/30 hover:shadow-amber-800/50"
                    >
                        <span className="text-2xl">📜</span>
                        <span>Explore Complete Timeline</span>
                        <span className="text-sm opacity-70">65+ events</span>
                    </Link>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="History Articles" />
            )}

            {/* Timeline Preview */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 font-display">
                        Timeline Highlights
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-stone-900/50 rounded-xl p-4 border border-stone-700/30">
                            <p className="text-stone-400 text-xs uppercase mb-1">Prehistoric</p>
                            <p className="text-amber-100 font-semibold">~1M BCE</p>
                            <p className="text-amber-100/60 text-sm">Stone Age tools</p>
                        </div>
                        <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                            <p className="text-amber-400 text-xs uppercase mb-1">Ancient</p>
                            <p className="text-amber-100 font-semibold">261 BCE</p>
                            <p className="text-amber-100/60 text-sm">Kalinga War</p>
                        </div>
                        <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                            <p className="text-orange-400 text-xs uppercase mb-1">Medieval</p>
                            <p className="text-amber-100 font-semibold">1250 CE</p>
                            <p className="text-amber-100/60 text-sm">Konark Temple</p>
                        </div>
                        <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30">
                            <p className="text-emerald-400 text-xs uppercase mb-1">Modern</p>
                            <p className="text-amber-100 font-semibold">1936 CE</p>
                            <p className="text-amber-100/60 text-sm">State Formed</p>
                        </div>
                    </div>
                    <Link
                        href="/history/timeline"
                        className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-2"
                    >
                        View all 65+ events →
                    </Link>
                </div>
            </section>
        </div>
    );
}
