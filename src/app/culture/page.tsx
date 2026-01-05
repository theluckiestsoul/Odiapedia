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
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">🎭</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Odia Culture
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଶା ସଂସ୍କୃତି
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
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
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-8 font-display">Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Odissi Dance */}
                        <div className="bg-gradient-to-br from-purple-950/50 to-fuchsia-950/50 rounded-2xl p-8 border border-purple-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🩰 Odissi Dance</h3>
                            <p className="text-amber-100/70">
                                One of the eight classical dance forms of India, Odissi originated in the temples
                                of Odisha and is known for its sculptural poses and fluid movements.
                            </p>
                        </div>

                        {/* Pattachitra */}
                        <div className="bg-gradient-to-br from-orange-950/50 to-amber-950/50 rounded-2xl p-8 border border-orange-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🎨 Pattachitra Art</h3>
                            <p className="text-amber-100/70">
                                Traditional cloth-based scroll painting known for its intricate details,
                                mythological narratives, and vibrant natural colors.
                            </p>
                        </div>

                        {/* Festivals */}
                        <div className="bg-gradient-to-br from-red-950/50 to-rose-950/50 rounded-2xl p-8 border border-red-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🎉 Rath Yatra</h3>
                            <p className="text-amber-100/70">
                                The world-famous Chariot Festival of Lord Jagannath in Puri,
                                attracting millions of devotees from around the globe.
                            </p>
                        </div>

                        {/* Music */}
                        <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl p-8 border border-blue-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🎵 Classical Music</h3>
                            <p className="text-amber-100/70">
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
