import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

const lessonsDir = path.join(process.cwd(), "content/learn");

interface LessonFrontmatter {
    title: string;
    description: string;
    lesson: number;
    prevLesson?: string;
    nextLesson?: string;
}

function getLessonBySlug(slug: string) {
    const filePath = path.join(lessonsDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        meta: data as LessonFrontmatter,
        content,
        slug,
    };
}

function getAllLessonSlugs() {
    if (!fs.existsSync(lessonsDir)) {
        return [];
    }

    return fs
        .readdirSync(lessonsDir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""));
}

export async function generateStaticParams() {
    const slugs = getAllLessonSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const lesson = getLessonBySlug(slug);

    if (!lesson) {
        return { title: "Lesson Not Found" };
    }

    return {
        title: `${lesson.meta.title} – Learn Odia Lesson ${lesson.meta.lesson}`,
        description: lesson.meta.description,
        alternates: {
            canonical: `/learn/${slug}`,
        }
    };
}

export default async function LessonPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const lesson = getLessonBySlug(slug);

    if (!lesson) {
        notFound();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const components = useMDXComponents({});
    // The hero renders the title; drop a duplicate leading "# Title" from the lesson body.
    const content = lesson.content.replace(/^\s*#\s+[^\n]+\n+/, "");

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "LearningResource",
                    name: lesson.meta.title,
                    description: lesson.meta.description,
                    url: `${SITE.url}/learn/${slug}`,
                    inLanguage: "en",
                    teaches: "Odia language",
                    educationalLevel: "Beginner",
                    learningResourceType: "Lesson",
                    isAccessibleForFree: true,
                    isPartOf: { "@type": "Course", name: "Learn Odia", url: `${SITE.url}/learn`, provider: { "@id": `${SITE.url}/#organization` } },
                }}
            />
            <PageHero
                title={lesson.meta.title}
                description={lesson.meta.description}
                icon="pen"
                eyebrow={`Lesson ${lesson.meta.lesson}`}
                crumbs={[{ name: "Learn Odia", href: "/learn" }, { name: `Lesson ${lesson.meta.lesson}`, href: `/learn/${slug}` }]}
            />

            <article className="container-page py-12">
                <div className="article-body mx-auto max-w-[46rem]">
                    <MDXRemote
                        source={content}
                        components={components}
                        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                    />
                </div>
            </article>

            <nav aria-label="Lessons" className="border-t border-sand-200 bg-sand-50 py-8">
                <div className="mx-auto flex max-w-[46rem] items-center justify-between px-4">
                    {lesson.meta.prevLesson ? (
                        <Link href={`/learn/${lesson.meta.prevLesson}`} className="btn-ghost"><Icon name="arrowLeft" className="h-4 w-4" />Previous lesson</Link>
                    ) : (
                        <Link href="/learn" className="btn-ghost"><Icon name="arrowLeft" className="h-4 w-4" />All lessons</Link>
                    )}
                    {lesson.meta.nextLesson ? (
                        <Link href={`/learn/${lesson.meta.nextLesson}`} className="btn-primary">Next lesson<Icon name="arrow" className="h-4 w-4" /></Link>
                    ) : (
                        <Link href="/language/odia-language" className="btn-primary">About the Odia language<Icon name="arrow" className="h-4 w-4" /></Link>
                    )}
                </div>
            </nav>
        </div>
    );
}
