import remarkGfm from "remark-gfm";
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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link href="/" className="text-teal-100/70 hover:text-white transition-colors">
                            Home
                        </Link>
                        <span className="text-teal-300">/</span>
                        <Link href="/learn" className="text-teal-100/70 hover:text-white transition-colors">
                            Learn
                        </Link>
                        <span className="text-teal-300">/</span>
                        <span className="text-teal-200">Lesson {lesson.meta.lesson}</span>
                    </nav>

                    {/* Lesson Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">📖</span>
                        <span className="bg-white/10 text-teal-100 px-3 py-1 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm">
                            Lesson {lesson.meta.lesson}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display leading-tight">
                        {lesson.meta.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-teal-100 mb-6 leading-relaxed max-w-2xl">
                        {lesson.meta.description}
                    </p>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mt-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <article className="py-12 bg-slate-50 relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
                        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-teal-600 hover:prose-a:text-teal-500 prose-strong:text-slate-800 prose-code:text-teal-600 prose-code:bg-teal-50 prose-code:px-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']">
                            <MDXRemote
                                source={lesson.content}
                                components={components}
                                options={{
                                    mdxOptions: {
                                        remarkPlugins: [remarkGfm],
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </article>

            {/* Navigation */}
            <section className="py-8 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {lesson.meta.prevLesson ? (
                            <Link
                                href={`/learn/${lesson.meta.prevLesson}`}
                                className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors group font-medium"
                            >
                                <svg
                                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform text-teal-500"
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
                                className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors font-medium"
                            >
                                ← Back to Learn
                            </Link>
                        )}

                        {lesson.meta.nextLesson && (
                            <Link
                                href={`/learn/${lesson.meta.nextLesson}`}
                                className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors group font-medium"
                            >
                                Next Lesson
                                <svg
                                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-teal-500"
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
