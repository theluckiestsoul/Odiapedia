import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { ChariotWheel } from "@/components/Motifs";
import HistoryTimeline from "@/components/history/HistoryTimeline";
import { ERAS, ERA_COLOURS, TIMELINE } from "@/data/odisha-timeline";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

/* eslint-disable @next/next/no-img-element -- Wikimedia Commons images are hot-linked with attribution */

export const metadata = hubMetadata({
    title: "Timeline of Odisha History – From Kalinga to Today",
    description: "An illustrated, interactive timeline of Odisha's history: prehistoric rock art, the Kalinga War, Kharavela, the temple builders of Bhubaneswar, Puri and Konark, the Gajapatis, the Paika Rebellion, Utkal Divas 1936 and modern Odisha.",
    path: "/history/timeline",
    keywords: ["odisha history timeline", "history of odisha", "kalinga history", "odisha dynasties", "kalinga war", "eastern ganga dynasty", "gajapati", "paika rebellion", "utkal divas", "ଓଡ଼ିଶା ଇତିହାସ"],
});

const HERO = ["konark-sun-temple-built", "reign-of-kharavela", "hirakud-dam-inaugurated"]
    .map((id) => TIMELINE.find((e) => e.id === id)!)
    .filter((e) => e?.image);

export default function TimelinePage() {
    const photos = TIMELINE.filter((e) => e.image).length;
    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: "Timeline of Odisha history",
                    url: `${SITE.url}/history/timeline`,
                    numberOfItems: TIMELINE.length,
                    itemListElement: TIMELINE.map((e, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        url: `${SITE.url}/history/timeline#${e.id}`,
                        name: `${e.year}: ${e.title}`,
                        description: e.description,
                        ...(e.image ? { image: e.image.src } : {}),
                    })),
                }}
            />

            {/* Hero */}
            <section className="relative overflow-hidden bg-ink-950 text-white">
                <div className="absolute inset-0 bg-ikat-light opacity-60" aria-hidden />
                <ChariotWheel className="pointer-events-none absolute -left-24 -bottom-32 h-[26rem] w-[26rem] text-white/[0.05]" />
                <div className="container-page relative grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
                    <div className="animate-fade-up">
                        <div className="mb-6"><Breadcrumbs items={[{ name: "History", href: "/history" }, { name: "Timeline", href: "/history/timeline" }]} tone="light" /></div>
                        <div className="eyebrow mb-4 !text-saffron-300"><Icon name="hourglass" className="h-4 w-4" />Illustrated timeline</div>
                        <h1 className="text-balance font-display text-4xl font-semibold leading-[1.08] !text-white md:text-5xl lg:text-6xl">Timeline of Odisha</h1>
                        <p lang="or" className="mt-3 font-odia-serif text-2xl text-saffron-200 md:text-3xl">ଓଡ଼ିଶାର ଇତିହାସ</p>
                        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand-100/85">
                            From Stone Age tools and rock art to the Kalinga War, the temple builders of Bhubaneswar, Puri and Konark, the Paika Rebellion and the
                            birth of the modern state — scroll through thousands of years of history.
                        </p>
                        <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
                            {[[String(TIMELINE.length), "events"], [String(ERAS.length), "eras"], [String(photos), "photographs"]].map(([n, l]) => (
                                <div key={l} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                    <dt className="sr-only">{l}</dt>
                                    <dd className="font-display text-3xl font-semibold">{n}</dd>
                                    <dd className="text-xs uppercase tracking-wider text-sand-200/70">{l}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-8 flex flex-wrap gap-2">
                            {ERAS.map((era) => (
                                <a key={era.id} href={`#era-${era.id}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/20">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: ERA_COLOURS[era.id] }} />
                                    {era.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Photo collage */}
                    <div className="relative hidden h-[30rem] lg:block" aria-hidden>
                        {HERO.map((e, i) => (
                            <figure key={e.id}
                                className={`absolute overflow-hidden rounded-3xl border-4 border-white/90 shadow-2xl ${["left-0 top-12 z-10 h-56 w-72 -rotate-3", "right-0 top-0 h-52 w-64 rotate-3", "bottom-0 right-10 z-20 h-56 w-72 rotate-1"][i]}`}>
                                <img src={e.image!.src} alt="" className="h-full w-full object-cover" />
                                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent px-3 pb-2 pt-6 text-xs font-semibold text-white">
                                    {e.year} · {e.title}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
                <div className="border-temple" aria-hidden="true" />
            </section>

            <HistoryTimeline events={TIMELINE} />

            {/* Sources & further reading */}
            <section className="border-t border-sand-200 bg-sand-50">
                <div className="container-page grid gap-10 py-14 lg:grid-cols-2">
                    <div>
                        <h2 className="font-display text-3xl font-semibold text-ink-900">Read the full stories</h2>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {[["Brief history of Odisha", "/history/odisha-history-brief"], ["The Kalinga War", "/history/kalinga-war-en"], ["Kharavela", "/history/kharavela"], ["Konark Sun Temple", "/history/konark-sun-temple"], ["Jagannath Temple", "/history/jagannath-temple"], ["The Paika Rebellion", "/history/paika-rebellion"], ["Maritime history", "/history/odisha-maritime-history"], ["All history articles", "/history"]].map(([l, h]) => (
                                <Link key={h} href={h} className="btn-ghost">{l}</Link>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm leading-relaxed text-ink-600">
                        <h2 className="font-display text-xl font-semibold text-ink-900">About this timeline</h2>
                        <p className="mt-3">
                            Many early dates are approximate and some are debated by historians; where sources disagree the entry says so. Photographs come from
                            Wikimedia Commons and are credited to their authors under the licences shown on each card — click any photo to enlarge it and follow the credit
                            to its source page.
                        </p>
                        <p className="mt-3">Spotted an error? See our <Link href="/about/corrections-policy" className="font-semibold text-laterite-600 hover:underline">corrections policy</Link>.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
