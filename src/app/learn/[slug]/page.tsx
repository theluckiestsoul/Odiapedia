import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";

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
        title: lesson.meta.title,
        description: lesson.meta.description,
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

    const components = useMDXComponents({});

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link href="/" className="text-amber-500/70 hover:text-amber-400 transition-colors">
                            Home
                        </Link>
                        <span className="text-amber-700">/</span>
                        <Link href="/learn" className="text-amber-500/70 hover:text-amber-400 transition-colors">
                            Learn
                        </Link>
                        <span className="text-amber-700">/</span>
                        <span className="text-amber-400">Lesson {lesson.meta.lesson}</span>
                    </nav>

                    {/* Lesson Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">📖</span>
                        <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-800/30">
                            Lesson {lesson.meta.lesson}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4 font-display leading-tight">
                        {lesson.meta.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-amber-100/70 mb-6 leading-relaxed">
                        {lesson.meta.description}
                    </p>

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
                        <MDXRemote source={lesson.content} components={components} />
                    </div>
                </div>
            </article>

            {/* Navigation */}
            <section className="py-8 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {lesson.meta.prevLesson ? (
                            <Link
                                href={`/learn/${lesson.meta.prevLesson}`}
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
                                Previous Lesson
                            </Link>
                        ) : (
                            <Link
                                href="/learn"
                                className="inline-flex items-center gap-2 text-amber-500/60 hover:text-amber-400 transition-colors"
                            >
                                ← Back to Learn
                            </Link>
                        )}

                        {lesson.meta.nextLesson && (
                            <Link
                                href={`/learn/${lesson.meta.nextLesson}`}
                                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
                            >
                                Next Lesson
                                <svg
                                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
