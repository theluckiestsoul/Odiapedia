import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { StartLesson } from "@/components/learn/Widgets";
import { LESSONS, getLessonBySlug, nextLesson, prevLesson, REPORT_EMAIL } from "@/lib/learn/content";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ lesson: string }> };

export function generateStaticParams() {
    return LESSONS.map((l) => ({ lesson: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const ref = getLessonBySlug((await params).lesson);
    if (!ref) return { title: "Lesson not found", robots: { index: false } };
    const { lesson } = ref;
    const sample = lesson.items.slice(0, 3).map((i) => `${i.en.split(";")[0]} (${i.tr})`).join(", ");
    return {
        title: `${lesson.title} in Odia – Lesson ${ref.number}`,
        description: `${lesson.goal} Learn ${lesson.items.length} Odia words and phrases — ${sample} — with transliteration, examples, a dialogue and interactive practice.`.slice(0, 300),
        alternates: { canonical: `/learn/course/${ref.slug}` },
    };
}

export default async function LessonPage({ params }: Props) {
    const ref = getLessonBySlug((await params).lesson);
    if (!ref) notFound();
    const { lesson, unit } = ref;
    const prev = prevLesson(ref), next = nextLesson(ref);
    const url = `${SITE.url}/learn/course/${ref.slug}`;
    const report = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Odia lesson ${ref.number}: possible mistake`)}`;

    return (
        <div>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "LearningResource", name: `${lesson.title} — Odia lesson ${ref.number}`, description: lesson.goal, url,
                inLanguage: "en", teaches: lesson.items.map((i) => `${i.od} (${i.tr}) — ${i.en}`), educationalLevel: "Beginner", learningResourceType: "Lesson",
                isAccessibleForFree: true, isPartOf: { "@type": "Course", name: "Odia for Beginners — First Steps", url: `${SITE.url}/learn/course` },
                provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
            }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden />
                <div className="container-page relative py-10 md:py-14">
                    <Breadcrumbs items={[{ name: "Learn Odia", href: "/learn" }, { name: "Course", href: "/learn/course" }, { name: lesson.title, href: `/learn/course/${ref.slug}` }]} />
                    <p className="eyebrow mt-6"><Icon name="pen" className="h-4 w-4" />Unit {unit.id.slice(1)} · {unit.title} · Lesson {ref.number} of {LESSONS.length}</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{lesson.title}</h1>
                    <p lang="or" className="mt-1 font-odia-serif text-2xl text-laterite-600">{lesson.odia}</p>
                    <p className="mt-4 max-w-2xl text-lg text-ink-700"><strong>You’ll be able to:</strong> {lesson.goal}</p>
                    <p className="mt-2 max-w-2xl text-ink-600">{lesson.context}</p>
                    <div className="mt-6 flex flex-wrap items-center"><StartLesson lessonId={lesson.id} /></div>
                    <p className="mt-3 text-xs text-ink-500">About 5–10 minutes · progress saved in this browser · Beta</p>
                </div>
            </header>

            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0 space-y-12">
                    <section>
                        <h2 className="font-display text-2xl font-semibold">Words and phrases in this lesson</h2>
                        <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                            <table className="w-full min-w-[34rem] text-left text-sm">
                                <thead className="bg-sand-100 text-xs uppercase tracking-wide text-ink-600">
                                    <tr><th className="px-4 py-3">Odia</th><th className="px-4 py-3">Say it</th><th className="px-4 py-3">Meaning</th></tr>
                                </thead>
                                <tbody className="divide-y divide-sand-100">
                                    {lesson.items.map((i) => (
                                        <tr key={i.id} className="align-top">
                                            <td className="px-4 py-3"><span lang="or" className="font-odia text-xl text-ink-900">{i.od}</span></td>
                                            <td className="px-4 py-3 text-ink-700">{i.tr}</td>
                                            <td className="px-4 py-3 text-ink-800">
                                                {i.emoji && <span className="mr-1" aria-hidden>{i.emoji}</span>}{i.en}
                                                {i.register && i.register !== "neutral" && <span className="ml-2 rounded-full bg-sand-100 px-2 py-0.5 text-[11px] text-ink-500">{i.register}</span>}
                                                {i.note && <span className="mt-1 block text-xs text-ink-500">{i.note}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-semibold">Examples</h2>
                        <ul className="mt-4 space-y-3">
                            {lesson.examples.map((e, k) => (
                                <li key={k} className="rounded-2xl border border-sand-200 bg-white p-4">
                                    <p lang="or" className="font-odia text-2xl text-ink-900">{e.od}</p>
                                    <p className="text-sm text-ink-500">{e.tr}</p>
                                    <p className="mt-1 text-ink-800">{e.en}</p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {lesson.dialogue && (
                        <section>
                            <h2 className="font-display text-2xl font-semibold">Dialogue: {lesson.dialogue.scene}</h2>
                            <ol className="mt-4 space-y-3">
                                {lesson.dialogue.lines.map((d, k) => (
                                    <li key={k} className={`flex ${k % 2 ? "justify-end" : ""}`}>
                                        <div className={`max-w-[85%] rounded-2xl p-4 ${k % 2 ? "bg-laterite-50" : "border border-sand-200 bg-white"}`}>
                                            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">{d.who}</p>
                                            <p lang="or" className="font-odia text-xl text-ink-900">{d.od}</p>
                                            <p className="text-sm text-ink-500">{d.tr}</p>
                                            <p className="text-sm text-ink-800">{d.en}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {lesson.tip && (
                        <section className="rounded-3xl border border-saffron-200 bg-saffron-50 p-6">
                            <p className="eyebrow !text-saffron-700"><Icon name="info" className="h-4 w-4" />Tip</p>
                            <h2 className="mt-2 font-display text-xl font-semibold">{lesson.tip.title}</h2>
                            <p className="mt-2 text-ink-800">{lesson.tip.text}</p>
                        </section>
                    )}

                    <nav className="flex flex-wrap justify-between gap-3 border-t border-sand-200 pt-6" aria-label="Lessons">
                        {prev ? <Link href={`/learn/course/${prev.slug}`} className="btn-ghost">← {prev.lesson.title}</Link> : <span />}
                        {next && <Link href={`/learn/course/${next.slug}`} className="btn-primary">Next: {next.lesson.title} →</Link>}
                    </nav>
                </div>

                <aside className="space-y-4 text-sm">
                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <p className="font-semibold text-ink-900">{unit.title}</p>
                        <ol className="mt-3 space-y-2">
                            {LESSONS.filter((l) => l.unit.id === unit.id).map((l) => (
                                <li key={l.lesson.id}>
                                    {l.lesson.id === lesson.id
                                        ? <span className="font-semibold text-laterite-700">{l.index}. {l.lesson.title}</span>
                                        : <Link href={`/learn/course/${l.slug}`} className="text-ink-700 hover:text-laterite-600">{l.index}. {l.lesson.title}</Link>}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <p className="font-semibold text-ink-900">Practise more</p>
                        <ul className="mt-2 space-y-1">
                            <li><Link href="/learn/review" className="text-laterite-600 hover:underline">Review your words</Link></li>
                            <li><Link href="/learn/phrasebook" className="text-laterite-600 hover:underline">Phrasebook</Link></li>
                            <li><Link href="/language/odia-typing" className="text-laterite-600 hover:underline">Type in Odia</Link></li>
                            <li><Link href="/language/dictionary" className="text-laterite-600 hover:underline">Odia dictionary</Link></li>
                        </ul>
                    </div>
                    <p className="text-xs text-ink-500">Beta lesson, being reviewed by native speakers. <a href={report} className="underline hover:text-laterite-600">Report a mistake</a>.</p>
                </aside>
            </div>
        </div>
    );
}
