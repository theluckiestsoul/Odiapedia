import Link from "next/link";
import words from "@/../data/words.json";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import WordOfTheDay, { type OdiaWord } from "@/components/WordOfTheDay";
import { hubMetadata } from "@/lib/seo";
import type { IconName } from "@/lib/site";
import { ContinueCard } from "@/components/learn/Widgets";
import { COURSE_STATS, UNITS, PHRASEBOOK } from "@/lib/learn/content";

export const metadata = hubMetadata({
    title: "Learn Odia Online Free: Course, Phrasebook & Alphabet",
    description: "Learn to speak Odia for free: an interactive beginner course with quizzes and spaced review, a phrasebook for travel and daily life, and reference lessons on the Odia alphabet, numbers and greetings.",
    path: "/learn",
    keywords: ["learn odia", "learn odia online", "odia alphabet", "odia letters", "odia numbers", "odia greetings", "odia phrases", "how to speak odia"],
});

const lessons: { slug: string; number: number; title: string; odia: string; description: string; icon: IconName }[] = [
    { slug: "alphabet", number: 1, title: "The Odia alphabet", odia: "ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳା", description: "Vowels, consonants and the vowel signs (matras).", icon: "pen" },
    { slug: "numbers", number: 2, title: "Odia numbers", odia: "ଓଡ଼ିଆ ସଂଖ୍ୟା", description: "Odia digits, counting to a hundred, and lakh and crore.", icon: "list" },
    { slug: "greetings", number: 3, title: "Essential greetings", odia: "ଅଭିବାଦନ", description: "Say hello, thank you and goodbye politely.", icon: "people" },
    { slug: "phrases", number: 4, title: "Everyday phrases", odia: "ଦୈନନ୍ଦିନ ବାକ୍ୟ", description: "Practical expressions for travel and daily life.", icon: "language" },
];

export default function LearnPage() {
    return (
        <div>
            <PageHero
                title="Learn Odia"
                odia="ଓଡ଼ିଆ ଶିଖନ୍ତୁ"
                description="Speak everyday Odia with short interactive lessons — learn, practise, and review at the right time. Free, no sign-up, for travellers, newcomers and Odia families everywhere."
                icon="pen"
                eyebrow="Free lessons"
                crumbs={[{ name: "Learn Odia", href: "/learn" }]}
            >
                <Link href="/learn/course" className="btn-primary">Start the free course <Icon name="arrow" className="h-4 w-4" /></Link>
                <Link href="/learn/daily" className="btn-ghost">Daily Odia quiz</Link>
                <Link href="/learn/phrasebook" className="btn-ghost">Phrasebook</Link>
            </PageHero>

            <section className="container-page pt-14">
                <ContinueCard />
                <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
                    <h2 className="font-display text-3xl font-semibold">The course <span className="text-base font-normal text-ink-500">· {COURSE_STATS.lessons} lessons · {COURSE_STATS.items} words & phrases · Beta</span></h2>
                    <Link href="/learn/course" className="text-sm font-semibold text-laterite-600 hover:underline">See all lessons →</Link>
                </div>
                <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {UNITS.map((u, i) => (
                        <li key={u.id}>
                            <Link href="/learn/course" className="card-link block h-full p-5">
                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Unit {i + 1}</span>
                                <span className="mt-1 block font-display text-xl font-semibold text-ink-900">{u.title}</span>
                                <span lang="or" className="block font-odia text-sm text-laterite-600">{u.odia}</span>
                                <span className="mt-2 block text-sm text-ink-600">{u.summary}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="container-page pt-14">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <h2 className="font-display text-3xl font-semibold">Phrasebook <span className="text-base font-normal text-ink-500">· {COURSE_STATS.phrases} phrases</span></h2>
                    <Link href="/learn/phrasebook" className="text-sm font-semibold text-laterite-600 hover:underline">Search phrases →</Link>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                    {PHRASEBOOK.map((c) => <li key={c.id}><Link href={`/learn/phrasebook/${c.id}`} className="chip !px-4 !py-2 !text-sm hover:border-laterite-300"><span aria-hidden>{c.icon}</span> {c.title}</Link></li>)}
                </ul>
            </section>

            <section className="container-page py-14">
                <h2 className="font-display text-3xl font-semibold">Quick reference</h2>
                <p className="mt-2 max-w-2xl text-ink-600">Look-up pages, separate from the course: no exercises or progress tracking.</p>
                <ul className="mt-8 grid gap-5 md:grid-cols-2">
                    {lessons.map((l) => (
                        <li key={l.slug}>
                            <Link href={`/learn/${l.slug}`} className="group card-link flex items-start gap-5 p-6">
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-laterite-50 text-laterite-600"><Icon name={l.icon} className="h-6 w-6" /></span>
                                <span>
                                    <span className="block font-display text-2xl font-semibold group-hover:text-laterite-700">{l.title}</span>
                                    <span lang="or" className="block font-odia text-laterite-600">{l.odia}</span>
                                    <span className="mt-2 block text-sm text-ink-600">{l.description}</span>
                                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-laterite-600">Open <Icon name="arrow" className="h-4 w-4" /></span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="container-page pb-14">
                <WordOfTheDay words={words as OdiaWord[]} />
            </section>

            <section className="container-page pb-20">
                <h2 className="font-display text-3xl font-semibold">Go deeper</h2>
                <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {[
                        { href: "/language/odia-language", t: "About the Odia language", d: "History, speakers, official status and classical recognition." },
                        { href: "/language/odia-alphabet", t: "Full alphabet reference", d: "All vowels, consonants and their forms." },
                        { href: "/language/odia-script-history", t: "History of the Odia script", d: "How the rounded letters developed." },
                    ].map((x) => (
                        <Link key={x.href} href={x.href} className="card-link p-6">
                            <p className="font-display text-xl font-semibold">{x.t}</p>
                            <p className="mt-2 text-sm text-ink-600">{x.d}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
