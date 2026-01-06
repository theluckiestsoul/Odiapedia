import Link from "next/link";
import { ArticleMeta, getAllArticles } from "@/lib/mdx";

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

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link href="/" className="text-amber-500/70 hover:text-amber-400 transition-colors">
                            Home
                        </Link>
                        <span className="text-amber-700">/</span>
                        <Link
                            href={`/${meta.category}`}
                            className="text-amber-500/70 hover:text-amber-400 transition-colors"
                        >
                            {category.label}
                        </Link>
                        <span className="text-amber-700">/</span>
                        <span className="text-amber-400">{meta.title}</span>
                    </nav>

                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full text-sm font-medium border border-amber-800/30">
                            {category.label}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4 font-display leading-tight">
                        {meta.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-amber-100/70 mb-6 leading-relaxed">
                        {meta.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-amber-500/60">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span>{meta.author}</span>
                    </div>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mt-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <article className="py-12 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-5"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-invert prose-amber max-w-none">
                        {children}
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-12 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-amber-100 mb-6 font-display flex items-center gap-3">
                            <span className="text-amber-500">📖</span>
                            Related Articles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedArticles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/${article.category}/${article.slug}`}
                                    className="group bg-gradient-to-br from-amber-950/30 to-orange-950/30 rounded-xl p-5 border border-amber-900/20 hover:border-amber-600/40 transition-all duration-300"
                                >
                                    <span className="text-2xl mb-3 block">
                                        {categoryLabels[article.category]?.icon || "📄"}
                                    </span>
                                    <h3 className="text-base font-semibold text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-amber-100/50 text-sm line-clamp-2">
                                        {article.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back to category */}
            <section className="py-8 bg-neutral-950 border-t border-amber-900/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/${meta.category}`}
                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
                    >
                        <svg
                            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
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
