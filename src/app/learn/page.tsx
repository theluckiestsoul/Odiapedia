import Link from "next/link";
import words from "@/../data/words.json";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import WordOfTheDay, { type OdiaWord } from "@/components/WordOfTheDay";
import { hubMetadata } from "@/lib/seo";
import type { IconName } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Learn Odia Online Free: Alphabet, Numbers, Greetings & Phrases",
    description: "Free beginner lessons to learn the Odia language: the Odia alphabet (vowels and consonants), numbers, greetings and everyday phrases, with transliteration and an Odia word of the day.",
    path: "/learn",
    keywords: ["learn odia", "learn odia online", "odia alphabet", "odia letters", "odia numbers", "odia greetings", "odia phrases", "how to speak odia"],
});

const lessons: { slug: string; number: number; title: string; odia: string; description: string; icon: IconName }[] = [
    { slug: "alphabet", number: 1, title: "The Odia alphabet", odia: "ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳା", description: "Vowels and consonants, with pronunciation.", icon: "pen" },
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
                description="Free lessons for beginners and for children of Odia families everywhere — start with the alphabet, then numbers, greetings and everyday phrases."
                icon="pen"
                eyebrow="Free lessons"
                crumbs={[{ name: "Learn Odia", href: "/learn" }]}
            >
                <Link href="/learn/alphabet" className="btn-primary">Start lesson 1 <Icon name="arrow" className="h-4 w-4" /></Link>
            </PageHero>

            <section className="container-page py-14">
                <h2 className="font-display text-3xl font-semibold">Lessons</h2>
                <ol className="mt-8 grid gap-5 md:grid-cols-2">
                    {lessons.map((l) => (
                        <li key={l.slug}>
                            <Link href={`/learn/${l.slug}`} className="group card-link flex items-start gap-5 p-6">
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-laterite-500 font-display text-2xl font-semibold text-white">{l.number}</span>
                                <span>
                                    <span className="block font-display text-2xl font-semibold group-hover:text-laterite-700">{l.title}</span>
                                    <span lang="or" className="block font-odia text-laterite-600">{l.odia}</span>
                                    <span className="mt-2 block text-sm text-ink-600">{l.description}</span>
                                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-laterite-600">Start <Icon name="arrow" className="h-4 w-4" /></span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ol>
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
