import { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = {
    title: "Odia Culture",
    description: "Explore the vibrant culture of Odisha - from classical Odissi dance to intricate Pattachitra art, colorful festivals, and ancient traditions.",
};

export default function CulturePage() {
    const articles = getAllArticles("culture");

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-slate-50"></div>
                <div className="absolute inset-0 bg-water opacity-30"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-bounce-slow">🎭</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 font-display">
                        Odia Culture
                    </h1>
                    <p className="text-3xl text-teal-700 odia-text mb-8 font-medium">
                        ଓଡ଼ିଶା ସଂସ୍କୃତି
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-rose-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-600"></div>
                    </div>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        A vibrant tapestry of classical dance, music, art, festivals, and traditions
                        that have flourished for millennia.
                    </p>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="Culture Articles" />
            )}

            {/* Content Section */}
            <section className="py-16 bg-white relative">
                <div className="absolute inset-0 bg-water opacity-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display border-l-4 border-rose-500 pl-4">Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Odissi Dance */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 ring-1 ring-slate-100 hover:ring-teal-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-teal-700 transition-colors">🩰 Odissi Dance</h3>
                            <p className="text-slate-600 leading-relaxed">
                                One of the eight classical dance forms of India, Odissi originated in the temples
                                of Odisha and is known for its sculptural poses and fluid movements.
                            </p>
                        </div>

                        {/* Pattachitra */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 ring-1 ring-slate-100 hover:ring-rose-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-rose-600 transition-colors">🎨 Pattachitra Art</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Traditional cloth-based scroll painting known for its intricate details,
                                mythological narratives, and vibrant natural colors.
                            </p>
                        </div>

                        {/* Festivals */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 ring-1 ring-slate-100 hover:ring-orange-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-orange-600 transition-colors">🎉 Rath Yatra</h3>
                            <p className="text-slate-600 leading-relaxed">
                                The world-famous Chariot Festival of Lord Jagannath in Puri,
                                attracting millions of devotees from around the globe.
                            </p>
                        </div>

                        {/* Music */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 ring-1 ring-slate-100 hover:ring-blue-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-blue-600 transition-colors">🎵 Classical Music</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Odissi music with its unique ragas and talas forms the melodic
                                foundation for the classical dance and temple traditions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
