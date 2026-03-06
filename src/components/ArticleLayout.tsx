import Link from "next/link";
import { ArticleMeta, getAllArticles } from "@/lib/mdx";
import ShareButtons from "./ShareButtons";
import JsonLd from "./JsonLd";

interface ArticleLayoutProps {
    meta: ArticleMeta;
    children: React.ReactNode;
}

const categoryLabels: Record<string, { label: string; odia: string; icon: string }> = {
    language: { label: "Language", odia: "ଭାଷା", icon: "📚" },
    culture: { label: "Culture", odia: "ସଂସ୍କୃତି", icon: "🎭" },
    history: { label: "History", odia: "ଇତିହାସ", icon: "🏛️" },
    food: { label: "Food", odia: "ଖାଦ୍ୟ", icon: "🍛" },
    people: { label: "People", odia: "ଲୋକ", icon: "👥" },
    about: { label: "About", odia: "ବିଷୟରେ", icon: "ℹ️" },
};

function getRelatedArticles(currentMeta: ArticleMeta, limit: number = 3): ArticleMeta[] {
    // Get articles from the same category
    const categoryArticles = getAllArticles(currentMeta.category);

    // Filter out the current article
    const related = categoryArticles.filter((article) => article.slug !== currentMeta.slug);

    // If not enough from same category, we could add from other categories
    // For now, just return what we have (up to limit)
    return related.slice(0, limit);
}

export default function ArticleLayout({ meta, children }: ArticleLayoutProps) {
    const category = categoryLabels[meta.category] || { label: meta.category, odia: "", icon: "📄" };
    const relatedArticles = getRelatedArticles(meta);

    const formattedDate = new Date(meta.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta.title,
        "description": meta.description,
        "author": {
            "@type": "Person",
            "name": meta.author,
        },
        "datePublished": meta.date,
        "image": meta.image ? `https://odiapedia.com${meta.image}` : undefined,
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <JsonLd data={jsonLd} />
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link href="/" className="text-teal-100/70 hover:text-white transition-colors">
                            Home
                        </Link>
                        <span className="text-teal-300">/</span>
                        <Link
                            href={`/${meta.category}`}
                            className="text-teal-100/70 hover:text-white transition-colors"
                        >
                            {category.label}
                        </Link>
                        <span className="text-teal-300">/</span>
                        <span className="text-teal-200">{meta.title}</span>
                    </nav>

                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="bg-white/10 text-teal-100 px-3 py-1 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm">
                            {category.label}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display leading-tight">
                        {meta.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-teal-100 mb-6 leading-relaxed max-w-2xl">
                        {meta.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-teal-200 font-medium">
                        <span>{formattedDate}</span>
                        <span className="text-teal-400">•</span>
                        <span>{meta.author}</span>
                    </div>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mt-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>
                    </div>

                    {/* Share Buttons */}
                    <div className="mt-6">
                        <ShareButtons title={`${meta.title} - Odiapedia`} />
                    </div>
                </div>
            </section>

            {/* Content */}
            <article className="py-12 bg-slate-50 relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-teal-600 hover:prose-a:text-teal-500 prose-strong:text-slate-800 prose-code:text-teal-600 prose-code:bg-teal-50 prose-code:px-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']">
                            {children}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-12 bg-slate-100 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display flex items-center gap-3 border-l-4 border-teal-500 pl-4">
                            <span className="text-teal-600">📖</span>
                            Related Articles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/${article.category}/${article.slug}`}
                                    className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    <span className="text-3xl mb-4 block transform group-hover:scale-110 transition-transform duration-300 origin-left">
                                        {categoryLabels[article.category]?.icon || "📄"}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors line-clamp-2 mb-2 font-display">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed flex-grow">
                                        {article.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back to category */}
            <section className="py-8 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/${meta.category}`}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors group font-medium"
                    >
                        <svg
                            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform text-teal-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to {category.label}
                    </Link>
                </div>
            </section>
        </div>
    );
}
