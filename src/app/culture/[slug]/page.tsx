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

const CATEGORY = "culture";

export async function generateStaticParams() {
    const articles = getAllArticles(CATEGORY);
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug("culture", slug);

    if (!article) {
        return {
            title: "Article Not Found",
        };
    }

    const title = `${article.title} | Odiapedia Culture`;
    const description = article.description || `Read about ${article.title} in Odia culture.`;
    const images = article.image ? [article.image] : [];

    // Build alternate languages for metadata
    const alternateLanguages: Record<string, string> = {};
    if (article.alternates) {
        for (const [lang, path] of Object.entries(article.alternates)) {
            // Map our language codes to standard hreflang codes
            const hreflang = lang === 'od' ? 'or' : lang;
            alternateLanguages[hreflang] = `https://odiapedia.com${path}`;
        }
    }
    // Add current language as canonical
    if (article.lang) {
        const currentHreflang = article.lang === 'od' ? 'or' : article.lang;
        alternateLanguages[currentHreflang] = `https://odiapedia.com/culture/${slug}`;
    }

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
            locale: article.lang === 'od' ? 'or_IN' : article.lang === 'hi' ? 'hi_IN' : 'en_US',
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
        },
        alternates: Object.keys(alternateLanguages).length > 0 ? {
            languages: alternateLanguages,
        } : undefined,
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
