import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import ArticleLayout from "@/components/ArticleLayout";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import remarkGfm from "remark-gfm";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const CATEGORY = "culture";

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
        alternateLanguages[currentHreflang] = `https://odiapedia.com/${CATEGORY}/${slug}`;
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
            locale: article.lang === 'od' ? 'or_IN' : article.lang === 'hi' ? 'hi_IN' : 'en_US',
        },
        alternates: Object.keys(alternateLanguages).length > 0 ? {
            languages: alternateLanguages,
        } : undefined,
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
            <MDXRemote
                source={article.content}
                components={components}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
        </ArticleLayout>
    );
}
