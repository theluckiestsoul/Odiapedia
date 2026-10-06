import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { FILMS, ROLES, getFilm, personByQ, formatFilmDate, CINEMA_SOURCE, type Film } from "@/lib/cinema";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return FILMS.map((f) => ({ slug: f.id }));
}

const names = (qs?: string[]) => (qs ?? []).map((q) => personByQ(q)).filter(Boolean);

function summary(f: Film) {
    const dir = names(f.director).map((p) => p!.name);
    const cast = names(f.cast).slice(0, 3).map((p) => p!.name);
    const bits = [`${f.title} is ${f.year ? `a ${f.year}` : "an"} Odia-language film`];
    if (dir.length) bits.push(`directed by ${dir.join(" and ")}`);
    let s = bits.join(" ");
    if (cast.length) s += `, starring ${cast.join(", ")}`;
    return s + ".";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const f = getFilm(slug);
    if (!f) return { title: "Film not found", robots: { index: false } };
    const dir = names(f.director).map((p) => p!.name);
    const base = `${f.title}${f.year ? ` (${f.year})` : ""}`;
    const twin = FILMS.some((x) => x.id !== f.id && x.title === f.title && x.year === f.year);
    // " | Odiapedia" is appended by the layout, so keep this part within ~58 characters.
    const twinTag = twin ? (dir.length ? ` by ${dir[0]}` : f.date ? `, released ${formatFilmDate(f)}` : "") : "";
    const options = twin
        ? [`${base}${twinTag}`, `${base} – Odia Film${twinTag}`]
        : [`${base} – Odia Film${dir.length ? ` by ${dir[0]}` : ""}`, `${base} – Odia Film`, base];
    const title = options.find((t) => t.length <= 58) ?? options[options.length - 1];
    return {
        title,
        description: `${summary(f)} Cast, crew, music, release date and related Odia films.`.slice(0, 300),
        alternates: { canonical: `/cinema/film/${f.id}` },
    };
}

export default async function FilmPage({ params }: Props) {
    const { slug } = await params;
    const f = getFilm(slug);
    if (!f) notFound();
    const sameYear = f.year ? FILMS.filter((x) => x.year === f.year && x.id !== f.id).slice(0, 12) : [];
    const byDirector = f.director?.length ? FILMS.filter((x) => x.id !== f.id && x.director?.some((d) => f.director!.includes(d))).sort((a, b) => (b.year ?? 0) - (a.year ?? 0)).slice(0, 8) : [];
    const lead = names(f.cast).slice(0, 2).map((p) => p!.q);
    const withLeads = lead.length ? FILMS.filter((x) => x.id !== f.id && x.cast?.some((c) => lead.includes(c)) && !byDirector.includes(x)).sort((a, b) => (b.year ?? 0) - (a.year ?? 0)).slice(0, 8) : [];
    const url = `${SITE.url}/cinema/film/${f.id}`;

    return (
        <div>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "Movie", name: f.title, alternateName: f.odia, url, inLanguage: "or",
                datePublished: f.date ?? (f.year ? String(f.year) : undefined),
                director: names(f.director).map((p) => ({ "@type": "Person", name: p!.name, url: `${SITE.url}/cinema/people/${p!.id}` })),
                actor: names(f.cast).map((p) => ({ "@type": "Person", name: p!.name, url: `${SITE.url}/cinema/people/${p!.id}` })),
                musicBy: names(f.music).map((p) => ({ "@type": "Person", name: p!.name })),
                producer: names(f.producer).map((p) => ({ "@type": "Person", name: p!.name })),
                genre: f.genre, duration: f.min ? `PT${f.min}M` : undefined, countryOfOrigin: { "@type": "Country", name: "India" },
                sameAs: [`https://www.wikidata.org/wiki/${f.q}`, ...(f.wp ? [`https://en.wikipedia.org/wiki/${f.wp}`] : [])],
            }} />
            <header className="relative overflow-hidden bg-ink-950 text-white">
                <div className="absolute inset-0 bg-ikat-light opacity-50" aria-hidden />
                <div className="container-page relative grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_300px] lg:items-center">
                    <div>
                        <Breadcrumbs tone="light" items={[{ name: "Odia cinema", href: "/cinema" }, ...(f.year ? [{ name: String(f.year), href: `/cinema/year/${f.year}` }] : []), { name: f.title, href: `/cinema/film/${f.id}` }]} />
                        <p className="eyebrow mt-6 !text-saffron-300"><Icon name="star" className="h-4 w-4" />Odia film{f.year ? ` · ${f.year}` : ""}</p>
                        <h1 className="mt-3 font-display text-4xl font-semibold !text-white md:text-6xl">{f.title}</h1>
                        {f.odia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-saffron-200">{f.odia}</p>}
                        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand-100/85">{summary(f)}</p>
                        <div className="mt-6 flex flex-wrap gap-2 text-sm">
                            {f.genre?.map((g) => <span key={g} className="rounded-full bg-white/10 px-3 py-1 capitalize ring-1 ring-white/15">{g}</span>)}
                            {f.language?.map((l) => <span key={l} className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">Also in {l}</span>)}
                            {f.awards?.length ? <span className="rounded-full bg-saffron-400 px-3 py-1 font-semibold text-ink-950">Award winner</span> : null}
                        </div>
                    </div>
                    {/* Title card (no poster: posters are copyrighted) */}
                    <div className="relative hidden aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-br from-laterite-600 via-laterite-800 to-ink-950 p-6 shadow-2xl ring-1 ring-white/10 lg:flex lg:flex-col lg:justify-between" aria-hidden>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-saffron-200">Odiapedia · Cinema</span>
                        <div>
                            {f.odia && <p lang="or" className="font-odia-serif text-3xl leading-tight text-white">{f.odia}</p>}
                            <p className="mt-2 font-display text-3xl font-semibold leading-tight text-white">{f.title}</p>
                            <p className="mt-3 text-5xl font-bold text-white/20">{f.year ?? ""}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <h2 className="font-display text-2xl font-semibold">Cast &amp; crew</h2>
                    <dl className="mt-5 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                        {ROLES.map(({ id, plural }) => {
                            const ps = names(f[id]);
                            if (!ps.length) return null;
                            return (
                                <div key={id} className="grid gap-2 px-5 py-4 sm:grid-cols-[10rem_1fr]">
                                    <dt className="text-sm font-semibold text-ink-500">{plural}</dt>
                                    <dd className="flex flex-wrap gap-x-3 gap-y-1">
                                        {ps.map((p) => <Link key={p!.q} href={`/cinema/people/${p!.id}`} className="font-medium text-laterite-600 hover:underline">{p!.name}</Link>)}
                                    </dd>
                                </div>
                            );
                        })}
                        {!f.cast && !f.director && <p className="px-5 py-4 text-sm text-ink-500">Credits for this film have not been recorded yet.</p>}
                    </dl>

                    {f.basedOn?.length ? <p className="mt-6 text-ink-700"><strong>Based on:</strong> {f.basedOn.join(", ")}</p> : null}
                    {f.awards?.length ? (
                        <section className="mt-8">
                            <h2 className="font-display text-2xl font-semibold">Awards</h2>
                            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-700">{f.awards.map((a) => <li key={a}>{a}</li>)}</ul>
                        </section>
                    ) : null}

                    {byDirector.length > 0 && <FilmRow title={`More from ${names(f.director)[0]!.name}`} films={byDirector} />}
                    {withLeads.length > 0 && <FilmRow title={`More with ${names(f.cast)[0]!.name}`} films={withLeads} />}
                    {sameYear.length > 0 && <FilmRow title={`Other Odia films of ${f.year}`} films={sameYear} more={`/cinema/year/${f.year}`} />}

                    <section className="mt-12 rounded-3xl border border-sand-200 bg-sand-100 p-6">
                        <h2 className="font-display text-xl font-semibold">Know this film?</h2>
                        <p className="mt-2 text-sm text-ink-700">Help us add its story, songs and trivia. Send what you know with a source and we&apos;ll add it to {f.title}&apos;s page.</p>
                        <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Film information: ${f.title} (${f.year ?? ""})`)}`} className="btn-primary mt-4"><Icon name="mail" className="h-4 w-4" />Share information</a>
                    </section>
                </div>

                <aside className="space-y-5">
                    <dl className="overflow-hidden rounded-2xl border border-sand-200 bg-white text-sm">
                        {[
                            ["Released", formatFilmDate(f)],
                            ["Language", ["Odia", ...(f.language ?? [])].join(", ")],
                            ...(f.min ? [["Running time", `${f.min} minutes`]] : []),
                            ...(f.studio?.length ? [["Studio", f.studio.join(", ")]] : []),
                            ...(f.location?.length ? [["Filmed in", f.location.join(", ")]] : []),
                        ].map(([k, v]) => (
                            <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-sand-100 px-5 py-3 last:border-0">
                                <dt className="text-ink-500">{k}</dt><dd className="text-ink-900">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <div className="rounded-2xl border border-sand-200 bg-white p-5 text-sm">
                        <p className="font-semibold text-ink-900">Sources</p>
                        <ul className="mt-2 space-y-1 text-ink-600">
                            <li><a className="text-laterite-600 hover:underline" href={`https://www.wikidata.org/wiki/${f.q}`} target="_blank" rel="noopener noreferrer">Wikidata {f.q}</a></li>
                            {f.wp && <li><a className="text-laterite-600 hover:underline" href={`https://en.wikipedia.org/wiki/${f.wp}`} target="_blank" rel="noopener noreferrer">Wikipedia: {decodeURIComponent(f.wp).replace(/_/g, " ")}</a></li>}
                        </ul>
                        <p className="mt-3 text-xs text-ink-500">Data: {CINEMA_SOURCE}. Records can be incomplete — corrections welcome.</p>
                    </div>
                    <Link href="/cinema" className="btn-ghost w-full">Browse all Odia films</Link>
                </aside>
            </div>
        </div>
    );
}

function FilmRow({ title, films, more }: { title: string; films: Film[]; more?: string }) {
    return (
        <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl font-semibold">{title}</h2>
                {more && <Link href={more} className="text-sm font-semibold text-laterite-600 hover:underline">See all →</Link>}
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {films.map((x) => (
                    <li key={x.id}>
                        <Link href={`/cinema/film/${x.id}`} className="flex items-center justify-between rounded-xl border border-sand-200 bg-white px-4 py-3 hover:border-laterite-300">
                            <span className="font-medium text-ink-900">{x.title}</span>
                            <span className="text-sm text-ink-500">{x.year ?? ""}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
