import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { ContinueCard, LessonBadge } from "@/components/learn/Widgets";
import { COURSE_LEVEL, COURSE_STATS, LESSONS, UNITS } from "@/lib/learn/content";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Free Odia Course for Beginners – Learn to Speak Odia",
    description: `Learn to speak everyday Odia for free: ${COURSE_STATS.lessons} short interactive lessons from greetings to shopping, with transliteration, examples, dialogues, quizzes and spaced review. No sign-up needed.`,
    path: "/learn/course",
    keywords: ["learn odia", "odia course", "learn odia online free", "spoken odia", "odia for beginners", "how to speak odia", "odia lessons"],
});

export default function CoursePage() {
    return (
        <div>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "Course", name: "Odia for Beginners — First Steps", description: metadata.description,
                provider: { "@type": "Organization", name: SITE.name, url: SITE.url }, inLanguage: "en", teaches: "Spoken Odia (ଓଡ଼ିଆ)",
                isAccessibleForFree: true, educationalLevel: "Beginner", url: `${SITE.url}/learn/course`,
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT3H" },
                hasPart: LESSONS.map((l) => ({ "@type": "LearningResource", name: l.lesson.title, url: `${SITE.url}/learn/course/${l.slug}` })),
            }} />
            <PageHero
                title="Odia for beginners"
                odia="ଆରମ୍ଭକାରୀଙ୍କ ପାଇଁ ଓଡ଼ିଆ"
                description={`${COURSE_STATS.lessons} short lessons that get you speaking everyday Odia — greetings, family, numbers, food, getting around and shopping. Learn, practise, and review at the right time. Free, no sign-up.`}
                icon="pen"
                eyebrow={`Level 1 · ${COURSE_LEVEL.title} · Beta`}
                crumbs={[{ name: "Learn Odia", href: "/learn" }, { name: "Course", href: "/learn/course" }]}
            />
            <div className="container-page space-y-12 py-12">
                <ContinueCard />
                <p className="rounded-2xl border border-saffron-200 bg-saffron-50 p-4 text-sm text-ink-700">
                    <strong>Beta:</strong> the lessons are new and are being checked by native Odia speakers. If something looks wrong, use “Report a problem” in any exercise — every report is read.
                </p>
                <ol className="space-y-10">
                    {UNITS.map((u, ui) => (
                        <li key={u.id}>
                            <div className="flex flex-wrap items-end justify-between gap-2">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Unit {ui + 1}</p>
                                    <h2 className="font-display text-3xl font-semibold text-ink-900">{u.title} <span lang="or" className="font-odia text-xl text-laterite-600">{u.odia}</span></h2>
                                    <p className="mt-1 text-ink-600">{u.summary}</p>
                                </div>
                            </div>
                            <ol className="mt-5 grid gap-4 md:grid-cols-3">
                                {LESSONS.filter((l) => l.unit.id === u.id).map((l) => (
                                    <li key={l.lesson.id}>
                                        <Link href={`/learn/course/${l.slug}`} className="card-link flex h-full flex-col p-5">
                                            <span className="flex items-center justify-between gap-2">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-laterite-500 font-display text-lg font-semibold text-white">{l.number}</span>
                                                <LessonBadge lessonId={l.lesson.id} />
                                            </span>
                                            <span className="mt-3 font-display text-xl font-semibold text-ink-900">{l.lesson.title}</span>
                                            <span lang="or" className="font-odia text-sm text-laterite-600">{l.lesson.odia}</span>
                                            <span className="mt-2 flex-1 text-sm text-ink-600">{l.lesson.goal}</span>
                                            <span className="mt-3 text-xs text-ink-400">{l.lesson.items.length} words & phrases · {l.lesson.examples.length} examples</span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </li>
                    ))}
                </ol>
                <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/learn/review" className="card-link p-6"><p className="font-display text-xl font-semibold">Review & mistakes</p><p className="mt-1 text-sm text-ink-600">Words come back just before you’d forget them. Practise the ones you got wrong.</p></Link>
                    <Link href="/learn/phrasebook" className="card-link p-6"><p className="font-display text-xl font-semibold">Phrasebook</p><p className="mt-1 text-sm text-ink-600">{COURSE_STATS.phrases} ready-to-use phrases for autos, temples, markets, doctors and more.</p></Link>
                </div>
            </div>
        </div>
    );
}
