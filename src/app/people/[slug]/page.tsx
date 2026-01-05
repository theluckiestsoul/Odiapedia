import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import ArticleLayout from "@/components/ArticleLayout";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const CATEGORY = "people";

export async function generateStaticParams() {
    const slugs = getArticleSlugs(CATEGORY);
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(CATEGORY, slug);

    if (!article) {
        return { title: "Article Not Found" };
    }

    return {
        title: article.title,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            type: "article",
            publishedTime: article.date,
            authors: [article.author],
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = getArticleBySlug(CATEGORY, slug);

    if (!article) {
        notFound();
    }

    const components = useMDXComponents({});

    return (
        <ArticleLayout meta={article}>
            <MDXRemote source={article.content} components={components} />
        </ArticleLayout>
    );
}
