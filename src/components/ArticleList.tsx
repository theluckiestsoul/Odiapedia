import Link from "next/link";
import { ArticleMeta } from "@/lib/mdx";

interface ArticleListProps {
    articles: ArticleMeta[];
    title?: string;
}

export default function ArticleList({ articles, title = "Articles" }: ArticleListProps) {
    if (articles.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-black relative">
            <div className="absolute inset-0 pattern-overlay opacity-5"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-amber-100 mb-8 font-display flex items-center gap-3">
                    <span className="text-amber-500">📖</span>
                    {title}
                </h2>

                <div className="space-y-4">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/${article.category}/${article.slug}`}
                            className="block bg-gradient-to-r from-amber-950/20 to-transparent rounded-xl p-6 border border-amber-900/20 hover:border-amber-600/40 hover:from-amber-950/30 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-amber-100/60 text-sm line-clamp-2">
                                        {article.description}
                                    </p>
                                    <p className="text-amber-500/50 text-xs mt-3">
                                        {new Date(article.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="text-amber-500/50 group-hover:text-amber-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
