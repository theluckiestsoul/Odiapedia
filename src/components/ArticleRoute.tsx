import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getRoutableSlugs } from "@/lib/mdx";
import { buildArticleMetadata } from "@/lib/seo";
import ArticleLayout from "@/components/ArticleLayout";
import { useMDXComponents } from "../../mdx-components";

type Props = { params: Promise<{ slug: string }> };

/**
 * Shared implementation for every /<category>/[slug] route so all articles get the same
 * template, metadata, canonical/hreflang and structured data.
 */
export function createArticleRoute(category: string) {
    async function generateStaticParams() {
        return getRoutableSlugs(category).map((slug) => ({ slug }));
    }

    async function generateMetadata({ params }: Props): Promise<Metadata> {
        const { slug } = await params;
        return buildArticleMetadata(getArticleBySlug(category, slug));
    }

    async function ArticlePage({ params }: Props) {
        const { slug } = await params;
        const article = getArticleBySlug(category, slug);
        if (!article) notFound();
        if (article.mergedInto) permanentRedirect(article.mergedInto);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const components = useMDXComponents({});

        return (
            <ArticleLayout meta={article}>
                <MDXRemote
                    source={article.content}
                    components={components}
                    options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }}
                />
            </ArticleLayout>
        );
    }

    return { generateStaticParams, generateMetadata, ArticlePage };
}
