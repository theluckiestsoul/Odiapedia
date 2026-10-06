import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import type { ArticleMeta } from "@/lib/mdx";
import { categoryInfo } from "@/lib/site";

export default function ArticleCard({ article, showCategory = true, compact = false }: { article: ArticleMeta; showCategory?: boolean; compact?: boolean }) {
    const cat = categoryInfo(article.category);
    return (
        <Link href={`/${article.category}/${article.slug}`} className="group card-link flex h-full flex-col overflow-hidden">
            {article.image && !compact && (
                <div className="relative aspect-[16/9] overflow-hidden bg-sand-100">
                    <Image src={article.image} alt={article.title} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
            )}
            <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
                {showCategory && (
                    <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-laterite-600">
                        <Icon name={cat.icon} className="h-3.5 w-3.5" />
                        {cat.label}
                    </span>
                )}
                <h3 className="font-display text-xl font-semibold leading-snug text-ink-900 transition-colors group-hover:text-laterite-700">
                    {article.title}
                </h3>
                {article.odiaTitle && <p lang="or" className="mt-1 font-odia text-sm text-ink-500">{article.odiaTitle}</p>}
                {article.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600">{article.description}</p>}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-laterite-600">
                    Read
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    );
}
