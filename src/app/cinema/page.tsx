import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import CinemaBrowser from "@/components/cinema/CinemaBrowser";
import { FILMS, PEOPLE, YEARS, decade, CINEMA_SOURCE } from "@/lib/cinema";
import { CINEMA_TIMELINE } from "@/data/cinema-timeline";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Odia Cinema (Ollywood) – Every Odia Film Since 1936",
    description: "The complete database of Odia films: every Ollywood movie from Sita Bibaha (1936) to today, with cast, directors, music directors, release years and award winners.",
    path: "/cinema",
    keywords: ["odia cinema", "ollywood", "odia movies list", "odia films", "odia movie", "first odia film", "odia film actors", "odia movies by year", "ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର"],
});

export default function CinemaHub() {
    const perYear = new Map<number, number>();
    for (const f of FILMS) if (f.year) perYear.set(f.year, (perYear.get(f.year) ?? 0) + 1);
    const minY = YEARS[0], maxY = YEARS[YEARS.length - 1];
    const maxN = Math.max(...perYear.values());
    const decades = [...new Set(FILMS.map((f) => decade(f.year)))].filter((d) => d !== "Undated").sort();
    const span = maxY - minY + 1;
    const peak = [...perYear.entries()].sort((a, b) => b[1] - a[1])[0];
    const firstFilm = FILMS.find((f) => f.year === minY);

    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Odia cinema database", url: `${SITE.url}/cinema`, about: { "@type": "Thing", name: "Odia cinema (Ollywood)" } }} />
            <PageHero
                title="Odia cinema"
                odia="ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର"
                description={`Every Odia film we know of — ${FILMS.length.toLocaleString("en-IN")} films from ${minY} to ${maxY}, with ${PEOPLE.length.toLocaleString("en-IN")} actors, directors and music directors. Search, browse by decade, or start at the beginning.`}
                icon="star"
                eyebrow="Ollywood"
                variant="dark"
                crumbs={[{ name: "Odia cinema", href: "/cinema" }]}
            >
                <div className="flex flex-wrap gap-2">
                    {firstFilm && <Link href={`/cinema/film/${firstFilm.id}`} className="btn-primary"><Icon name="star" className="h-4 w-4" />The first Odia film</Link>}
                    <Link href="/culture/cinema/timeline" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Milestones timeline</Link>
                    <Link href="/cinema/people" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Actors &amp; directors</Link>
                </div>
            </PageHero>

            {/* Films per year */}
            <section className="container-page py-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow">At a glance</p>
                        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Odia films released each year</h2>
                    </div>
                    {peak && <p className="text-sm text-ink-600">Busiest year on record: <Link href={`/cinema/year/${peak[0]}`} className="font-semibold text-laterite-600 hover:underline">{peak[0]}</Link> ({peak[1]} films)</p>}
                </div>
                <div className="mt-6 rounded-2xl border border-sand-200 bg-white p-4 sm:p-6">
                    <div className="flex h-48 items-end gap-px" role="img" aria-label={`Bar chart of Odia films per year from ${minY} to ${maxY}`}>
                        {Array.from({ length: span }, (_, i) => minY + i).map((y) => {
                            const n = perYear.get(y) ?? 0;
                            return n ? (
                                <Link key={y} href={`/cinema/year/${y}`} title={`${y}: ${n} film${n === 1 ? "" : "s"}`} className="group relative flex-1" style={{ height: `${Math.max(3, (n / maxN) * 100)}%` }}>
                                    <span className="absolute inset-0 rounded-t-sm bg-laterite-400 transition-colors group-hover:bg-laterite-600" />
                                </Link>
                            ) : <span key={y} className="flex-1" />;
                        })}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-ink-500"><span>{minY}</span><span>{Math.round((minY + maxY) / 2)}</span><span>{maxY}</span></div>
                </div>
            </section>

            {/* Browser */}
            <section className="container-page pb-14">
                <h2 className="mb-5 font-display text-3xl font-semibold text-ink-900">Find a film</h2>
                <CinemaBrowser decades={decades} />
            </section>

            {/* Years index (crawlable) */}
            <section className="border-t border-sand-200 bg-sand-50">
                <div className="container-page py-12">
                    <h2 className="font-display text-3xl font-semibold text-ink-900">Odia films by year</h2>
                    <div className="mt-6 space-y-5">
                        {decades.map((d) => (
                            <div key={d}>
                                <p className="text-sm font-bold uppercase tracking-wider text-ink-500">{d}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {YEARS.filter((y) => decade(y) === d).map((y) => (
                                        <Link key={y} href={`/cinema/year/${y}`} className="rounded-lg border border-sand-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 hover:border-laterite-300 hover:text-laterite-600">
                                            {y} <span className="text-ink-400">· {perYear.get(y)}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Milestones */}
            <section className="container-page py-12">
                <h2 className="font-display text-3xl font-semibold text-ink-900">Milestones of Odia cinema</h2>
                <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {CINEMA_TIMELINE.map((m) => (
                        <li key={m.id} className="card p-5">
                            <p className="text-sm font-bold text-laterite-600">{m.year}</p>
                            <p className="mt-1 font-display text-xl font-semibold text-ink-900">{m.title}</p>
                            <p className="mt-2 line-clamp-3 text-sm text-ink-600">{m.description}</p>
                        </li>
                    ))}
                </ol>
                <p className="mt-8 text-xs leading-relaxed text-ink-500">
                    Film and credit data: {CINEMA_SOURCE}, compiled from public records; posters are not shown because they are copyrighted. Records for early and smaller films can be incomplete. Know a film that is missing or wrong? <a className="underline" href={`mailto:${SITE.email}?subject=Odia%20cinema%20correction`}>Tell us</a>.
                </p>
            </section>
        </div>
    );
}
