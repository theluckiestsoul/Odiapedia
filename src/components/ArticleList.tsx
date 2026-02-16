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
        <section className="py-16 bg-slate-50 relative">
            <div className="absolute inset-0 bg-water opacity-10"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display flex items-center gap-3 border-l-4 border-teal-500 pl-4">
                    <span className="text-teal-600">📖</span>
                    {title}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/${article.category}/${article.slug}`}
                            className="block bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-700 transition-colors mb-2 font-display">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                            {new Date(article.date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-slate-300 group-hover:text-teal-500 transition-colors transform group-hover:translate-x-1 duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
