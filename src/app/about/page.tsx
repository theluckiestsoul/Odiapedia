import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { CATEGORIES, SITE } from "@/lib/site";
import type { IconName } from "@/lib/site";

export const metadata = hubMetadata({
    title: "About Odiapedia",
    description: "Odiapedia is an independent, free, bilingual encyclopedia of Odisha and the Odia language. Read our mission, editorial standards, policies and how to contribute.",
    path: "/about",
});

const POLICIES: { href: string; title: string; desc: string; icon: IconName }[] = [
    { href: "/about/editorial-policy", title: "Editorial policy", desc: "How we research, source, review and update articles.", icon: "shield" },
    { href: "/about/corrections-policy", title: "Corrections policy", desc: "How to report an error and how we fix it.", icon: "flag" },
    { href: "/about/sponsorship-policy", title: "Sponsorship & affiliate policy", desc: "How we make money without selling facts.", icon: "handshake" },
    { href: "/about/cite-odiapedia", title: "Cite Odiapedia", desc: "Citation formats for students, researchers and journalists.", icon: "quote" },
    { href: "/about/privacy-policy", title: "Privacy policy", desc: "What we collect, why, and your choices.", icon: "info" },
    { href: "/about/terms", title: "Terms of use", desc: "Using and re-using Odiapedia content.", icon: "book" },
];

export default function AboutPage() {
    const cover = ["language", "history", "culture", "food", "people", "districts", "travel", "calendar"] as const;
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "About Odiapedia", url: `${SITE.url}/about`, about: { "@id": `${SITE.url}/#organization` } }} />
            <PageHero
                title="About Odiapedia"
                odia="ଓଡ଼ିଆପିଡ଼ିଆ ବିଷୟରେ"
                description="An independent, free, bilingual encyclopedia of Odisha and the Odia language — for students, travellers, researchers and the Odia diaspora."
                icon="info"
                eyebrow="Our mission"
                crumbs={[{ name: "About", href: "/about" }]}
            />

            <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
                <div className="article-body">
                    <h2 id="mission">Why Odiapedia exists</h2>
                    <p>
                        Reliable information about Odisha is scattered across government PDFs, academic journals, old books, news archives and community knowledge — and much of what ranks online is thin or copied. Odiapedia brings it together in one place, in clear English and Odia, with the sources shown on every page.
                    </p>
                    <p>
                        The encyclopedia is and will stay <strong>free</strong>. We keep it sustainable through clearly labelled travel planning, curated crafts and books, and sponsorships that never touch editorial content.
                    </p>
                    <h2 id="principles">Our principles</h2>
                    <ul>
                        <li><strong>Accuracy before reach.</strong> We would rather publish fewer pages than confident errors.</li>
                        <li><strong>Show the evidence.</strong> Consequential facts are linked to official records, scholarship or reputable reporting.</li>
                        <li><strong>Label tradition as tradition.</strong> Legends and oral histories are valued — and named as such.</li>
                        <li><strong>Correct in the open.</strong> Every page has a report-an-error link and a last-reviewed date.</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    {POLICIES.map((p) => (
                        <Link key={p.href} href={p.href} className="card-link flex items-start gap-4 p-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-laterite-50 text-laterite-600"><Icon name={p.icon} className="h-5 w-5" /></span>
                            <span>
                                <span className="block font-semibold text-ink-900">{p.title}</span>
                                <span className="text-sm text-ink-600">{p.desc}</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-sand-100 py-16">
                <div className="container-page">
                    <h2 className="font-display text-3xl font-semibold">What we cover</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {cover.map((k) => {
                            const c = CATEGORIES[k];
                            return (
                                <Link key={k} href={c.href} className="card-link p-5">
                                    <Icon name={c.icon} className="h-6 w-6 text-laterite-600" />
                                    <p className="mt-3 font-semibold text-ink-900">{c.label}</p>
                                    <p className="mt-1 text-sm text-ink-600">{c.blurb}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="container-page py-16">
                <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white md:p-12">
                    <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
                    <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
                        <div>
                            <h2 className="font-display text-3xl font-semibold !text-white">Help build Odiapedia</h2>
                            <p className="mt-3 text-sand-100/85">
                                Scholars, teachers, translators, photographers and people who know their village&apos;s history — we would love your help reviewing pages, adding sources and sharing rights-cleared photographs.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 md:justify-end">
                            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("I'd like to contribute to Odiapedia")}`} className="btn-primary"><Icon name="mail" className="h-4 w-4" />Write to us</a>
                            <a href="https://github.com/theluckiestsoul/Odiapedia" target="_blank" rel="noopener noreferrer" className="btn-ghost !border-white/20 !bg-white/5 !text-white">GitHub</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
