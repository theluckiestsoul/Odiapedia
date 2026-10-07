import Link from "next/link";
import PageHero from "@/components/PageHero";
import { PhraseSearch } from "@/components/learn/Widgets";
import { COURSE_STATS, PHRASEBOOK } from "@/lib/learn/content";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odia Phrasebook – Useful Phrases for Travel & Daily Life",
    description: `${COURSE_STATS.phrases} useful Odia phrases with transliteration: auto and taxi, train and bus, directions, food, shopping, hotels, temples, doctors, emergencies, family and work. Search by what you want to say.`,
    path: "/learn/phrasebook",
    keywords: ["odia phrases", "odia phrasebook", "common odia phrases", "odia sentences for travel", "how to say in odia", "odia words for tourists"],
});

export default function PhrasebookPage() {
    return (
        <div>
            <PageHero title="Odia phrasebook" odia="ଓଡ଼ିଆ ବାକ୍ୟ ସଂଗ୍ରହ" description={`${COURSE_STATS.phrases} ready-to-use phrases for real situations in Odisha — each in Odia script with an easy English-letter version. Search by what you want to say and save your favourites.`}
                icon="language" eyebrow="Learn Odia · Beta" crumbs={[{ name: "Learn Odia", href: "/learn" }, { name: "Phrasebook", href: "/learn/phrasebook" }]} />
            <div className="container-page space-y-12 py-12">
                <PhraseSearch />
                <section>
                    <h2 className="font-display text-3xl font-semibold">Situations</h2>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {PHRASEBOOK.map((c) => (
                            <li key={c.id}>
                                <Link href={`/learn/phrasebook/${c.id}`} className="card-link flex h-full gap-4 p-5">
                                    <span className="text-3xl" aria-hidden>{c.icon}</span>
                                    <span>
                                        <span className="block font-display text-xl font-semibold text-ink-900">{c.title}</span>
                                        <span lang="or" className="block font-odia text-sm text-laterite-600">{c.odia}</span>
                                        <span className="mt-1 block text-sm text-ink-600">{c.intro}</span>
                                        <span className="mt-2 block text-xs text-ink-400">{c.phrases.length} phrases</span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
                <p className="text-sm text-ink-500">Want to learn properly rather than look things up? <Link href="/learn/course" className="font-semibold text-laterite-600 underline">Take the free beginner course</Link>.</p>
            </div>
        </div>
    );
}
