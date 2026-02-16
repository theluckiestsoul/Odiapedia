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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">🏛️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Odia History
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8">
                        ଓଡ଼ିଶା ଇତିହାସ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-3 h-3 rotate-45 bg-teal-400"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                    <p className="text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed mb-8 text-shadow-sm">
                        From the mighty Kalinga Empire to the architectural wonders of the Eastern Ganga dynasty,
                        explore the rich historical tapestry of Odisha.
                    </p>

                    {/* Timeline Button */}
                    <Link
                        href="/history/timeline"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-teal-900/20 group"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
                        <span>Explore Complete Timeline</span>
                        <span className="text-sm opacity-70 bg-teal-800/50 px-2 py-0.5 rounded-full">65+ events</span>
                    </Link>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="History Articles" />
            )}

            {/* Timeline Preview */}
            <section className="py-16 bg-slate-100 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">
                        Timeline Highlights
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <p className="text-slate-400 text-xs uppercase mb-1 tracking-wider">Prehistoric</p>
                            <p className="text-teal-700 font-bold group-hover:text-teal-600 transition-colors">~1M BCE</p>
                            <p className="text-slate-600 text-sm">Stone Age tools</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <p className="text-slate-400 text-xs uppercase mb-1 tracking-wider">Ancient</p>
                            <p className="text-teal-700 font-bold group-hover:text-teal-600 transition-colors">261 BCE</p>
                            <p className="text-slate-600 text-sm">Kalinga War</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <p className="text-slate-400 text-xs uppercase mb-1 tracking-wider">Medieval</p>
                            <p className="text-teal-700 font-bold group-hover:text-teal-600 transition-colors">1250 CE</p>
                            <p className="text-slate-600 text-sm">Konark Temple</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <p className="text-slate-400 text-xs uppercase mb-1 tracking-wider">Modern</p>
                            <p className="text-teal-700 font-bold group-hover:text-teal-600 transition-colors">1936 CE</p>
                            <p className="text-slate-600 text-sm">State Formed</p>
                        </div>
                    </div>
                    <Link
                        href="/history/timeline"
                        className="text-teal-600 hover:text-teal-700 font-medium transition-colors inline-flex items-center gap-2 group"
                    >
                        View all 65+ events
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
