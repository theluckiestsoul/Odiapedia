import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticles } from "@/lib/mdx";
import ArticleLayout from "@/components/ArticleLayout";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "../../../../mdx-components";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

type Props = {
    params: Promise<{ slug: string }>;
};

const CATEGORY = "history";

export async function generateStaticParams() {
    const articles = getAllArticles(CATEGORY);
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(CATEGORY, slug);

    if (!article) {
        return { title: "Article Not Found" };
    }

    const title = `${article.title} | Odiapedia History`;
    const description = article.description || `Read about ${article.title} in Odia history.`;
    const images = article.image ? [article.image] : [];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: article.date,
            authors: [article.author],
            images,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
        },
        alternates: {
            canonical: `/history/${slug}`,
        }
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = getArticleBySlug(CATEGORY, slug);

    if (!article) {
        notFound();
    }

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
