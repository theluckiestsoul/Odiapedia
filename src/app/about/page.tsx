import { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = {
    title: "About Odiapedia",
    description: "Learn about Odiapedia - our mission to preserve and share the rich heritage of Odisha with the world.",
};

export default function AboutPage() {
    const articles = getAllArticles("about");

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">ℹ️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        About Odiapedia
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଆପିଡ଼ିଆ ବିଷୟରେ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        Preserving and sharing the rich cultural heritage of Odisha with the world.
                    </p>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="About Articles" />
            )}

            {/* Mission Section */}
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-amber-100 mb-8 font-display">
                        Our Mission
                    </h2>
                    <p className="text-amber-100/70 mb-10 text-lg leading-relaxed">
                        Odiapedia is a comprehensive digital encyclopedia dedicated to documenting,
                        preserving, and sharing the rich cultural heritage of Odisha with people
                        around the world.
                    </p>

                    <div className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 rounded-2xl p-10 border border-amber-800/30">
                        <h3 className="text-2xl font-semibold text-amber-300 mb-8 font-display">
                            What We Cover
                        </h3>
                        <ul className="space-y-5 text-amber-100/80">
                            <li className="flex items-start gap-4">
                                <span className="text-2xl">📚</span>
                                <span><strong className="text-amber-300">Language:</strong> The classical Odia language and its rich literary tradition</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-2xl">🎭</span>
                                <span><strong className="text-amber-300">Culture:</strong> Traditions, festivals, arts, music, and dance</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-2xl">🏛️</span>
                                <span><strong className="text-amber-300">History:</strong> Ancient kingdoms, temples, and historical events</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-2xl">🍛</span>
                                <span><strong className="text-amber-300">Food:</strong> Traditional cuisine and culinary heritage</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-2xl">👥</span>
                                <span><strong className="text-amber-300">People:</strong> Notable personalities who shaped Odisha</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900/50 to-zinc-900/50 rounded-2xl p-10 text-center border border-slate-700/30 mt-10">
                        <p className="text-amber-100/80 text-lg mb-6">
                            Odiapedia is an open project. We welcome contributions, corrections,
                            and suggestions from the community.
                        </p>
                        <p className="text-3xl odia-text text-amber-500/80 font-medium">
                            ଆସନ୍ତୁ, ଆମର ଐତିହ୍ୟକୁ ଏକତ୍ର ସଂରକ୍ଷଣ କରିବା
                        </p>
                        <p className="text-amber-100/50 mt-3 text-sm">
                            Let&apos;s preserve our heritage together
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
