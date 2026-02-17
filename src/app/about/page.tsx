
import { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About Odiapedia",
    description: "Learn about Odiapedia - our mission to preserve and share the rich heritage of Odisha with the world.",
};

export default function AboutPage() {
    const articles = getAllArticles("about");

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">ℹ️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display leading-tight">
                        About Odiapedia
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8 font-medium">
                        ଓଡ଼ିଆପିଡ଼ିଆ ବିଷୟରେ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-3 h-3 rotate-45 bg-teal-300"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                    <p className="text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed font-light">
                        Preserving and sharing the rich cultural heritage of Odisha with the world.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display flex items-center gap-3">
                                <span className="text-teal-600">🎯</span>
                                Our Mission
                            </h2>
                            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                                Odiapedia is a comprehensive digital encyclopedia dedicated to documenting,
                                preserving, and sharing the rich cultural heritage of Odisha with people
                                around the world.
                            </p>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                From ancient history to modern cinema, from classical language to savory cuisine,
                                we aim to be the definitive source for all things Odisha.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-lg shadow-teal-900/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

                            <blockquote className="relative z-10">
                                <p className="text-2xl odia-text text-slate-800 font-medium mb-4 leading-relaxed">
                                    &quot;ଆସନ୍ତୁ, ଆମର ଐତିହ୍ୟକୁ ଏକତ୍ର ସଂରକ୍ଷଣ କରିବା&quot;
                                </p>
                                <footer className="text-teal-600 font-medium">
                                    — Let&apos;s preserve our heritage together
                                </footer>
                            </blockquote>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-3xl p-10 border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-10 text-center font-display">
                            What We Cover
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: "📚", title: "Language", desc: "The classical Odia language & literature" },
                                { icon: "🎭", title: "Culture", desc: "Traditions, festivals, arts, & dance" },
                                { icon: "🏛️", title: "History", desc: "Ancient kingdoms, temples, & events" },
                                { icon: "🍛", title: "Food", desc: "Traditional cuisine & culinary heritage" },
                                { icon: "👥", title: "People", desc: "Notable personalities who shaped Odisha" },
                                { icon: "🎥", title: "Cinema", desc: "The evolution of Ollywood & entertainment" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all group">
                                    <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">{item.title}</h4>
                                    <p className="text-slate-600 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section (if any) */}
            {articles.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-200">
                    <ArticleList articles={articles} title="About Articles" />
                </div>
            )}

            {/* Contribute Section */}
            <section className="py-20 bg-teal-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-water opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6 font-display">
                        Join Our Journey
                    </h2>
                    <p className="text-teal-100 mb-10 text-lg max-w-2xl mx-auto">
                        Odiapedia is an open project. We welcome contributions, corrections,
                        and suggestions from the community to make this the best resource for Odisha.
                    </p>
                    <a
                        href="https://github.com/theluckiestsoul/Odiapedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-teal-900 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors shadow-lg shadow-teal-900/50"
                    >
                        <span>⭐ Star on GitHub</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
