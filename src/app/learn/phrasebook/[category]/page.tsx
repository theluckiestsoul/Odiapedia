import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { PhraseRow } from "@/components/learn/Widgets";
import { PHRASEBOOK, getCategory, REPORT_EMAIL } from "@/lib/learn/content";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
    return PHRASEBOOK.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const c = getCategory((await params).category);
    if (!c) return { title: "Not found", robots: { index: false } };
    return {
        title: `${c.title} – Odia Phrases`,
        description: `${c.intro} ${c.phrases.length} Odia phrases with transliteration, e.g. “${c.phrases[0].en}” – ${c.phrases[0].tr}.`.slice(0, 300),
        alternates: { canonical: `/learn/phrasebook/${c.id}` },
    };
}

export default async function CategoryPage({ params }: Props) {
    const c = getCategory((await params).category);
    if (!c) notFound();
    const i = PHRASEBOOK.indexOf(c);
    const prev = PHRASEBOOK[i - 1], next = PHRASEBOOK[i + 1];
    return (
        <div>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "DefinedTermSet", name: `${c.title} — Odia phrases`, url: `${SITE.url}/learn/phrasebook/${c.id}`, inLanguage: ["en", "or"],
                hasDefinedTerm: c.phrases.map((p) => ({ "@type": "DefinedTerm", name: p.od, alternateName: p.tr, description: p.en })),
            }} />
            <PageHero title={c.title} odia={c.odia} description={c.intro} icon="language" eyebrow={`Odia phrasebook · ${c.phrases.length} phrases`}
                crumbs={[{ name: "Learn Odia", href: "/learn" }, { name: "Phrasebook", href: "/learn/phrasebook" }, { name: c.title, href: `/learn/phrasebook/${c.id}` }]} />
            <div className="container-page max-w-4xl py-12">
                <ul className="space-y-3">{c.phrases.map((p) => <PhraseRow key={p.id} phrase={p} />)}</ul>
                <p className="mt-6 text-xs text-ink-500">“…” marks a blank you fill in, e.g. a place name. Beta — <a className="underline hover:text-laterite-600" href={`mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Odia phrasebook (${c.title}): possible mistake`)}`}>report a mistake</a>.</p>
                <nav className="mt-10 flex flex-wrap justify-between gap-3 border-t border-sand-200 pt-6" aria-label="Phrasebook sections">
                    {prev ? <Link href={`/learn/phrasebook/${prev.id}`} className="btn-ghost">← {prev.title}</Link> : <span />}
                    {next ? <Link href={`/learn/phrasebook/${next.id}`} className="btn-ghost">{next.title} →</Link> : <Link href="/learn/phrasebook" className="btn-ghost">All situations</Link>}
                </nav>
            </div>
        </div>
    );
}
