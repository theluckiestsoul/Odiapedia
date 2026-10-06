import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { PEOPLE, ROLES, filmography, getPerson, primaryRole, roleNoun, CINEMA_SOURCE } from "@/lib/cinema";
import { SITE } from "@/lib/site";

/* eslint-disable @next/next/no-img-element -- Wikimedia Commons photos are hot-linked with attribution */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return PEOPLE.map((p) => ({ slug: p.id }));
}

const fmtDate = (d?: string) => (d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const p = getPerson(slug);
    if (!p) return { title: "Not found", robots: { index: false } };
    const fs = filmography(p);
    const n = new Set(fs.flatMap((x) => x.films.map((f) => f.id))).size;
    const role = roleNoun(primaryRole(p), p.g);
    return {
        title: PEOPLE.some((x) => x.id !== p.id && x.name === p.name) ? `${p.name} (${role}${p.birth ? `, b. ${p.birth.slice(0, 4)}` : ""}) – Odia Filmography` : `${p.name} – Odia Films & Filmography`,
        description: `${p.name}${p.desc ? `, ${p.desc}` : ""}: ${n} Odia film${n === 1 ? "" : "s"} as ${role}${fs.length > 1 ? " and more" : ""}. Complete filmography by year with co-stars and directors.`,
        alternates: { canonical: `/cinema/people/${p.id}` },
        // People with a single credit are kept out of search until they have more content
        robots: n < 2 && !p.wp ? { index: false, follow: true } : undefined,
    };
}

export default async function PersonPage({ params }: Props) {
    const { slug } = await params;
    const p = getPerson(slug);
    if (!p) notFound();
    const fs = filmography(p);
    const all = [...new Map(fs.flatMap((x) => x.films).map((f) => [f.id, f])).values()];
    const years = all.map((f) => f.year).filter((y): y is number => !!y);
    const role = roleNoun(primaryRole(p), p.g);

    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: p.name, alternateName: p.odia, description: p.desc, birthDate: p.birth, deathDate: p.death, image: p.img?.src, url: `${SITE.url}/cinema/people/${p.id}`, sameAs: [`https://www.wikidata.org/wiki/${p.q}`, ...(p.wp ? [`https://en.wikipedia.org/wiki/${p.wp}`] : [])] }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden />
                <div className="container-page relative grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-14">
                    <div>
                        <Breadcrumbs items={[{ name: "Odia cinema", href: "/cinema" }, { name: "People", href: "/cinema/people" }, { name: p.name, href: `/cinema/people/${p.id}` }]} />
                        <p className="eyebrow mt-6"><Icon name="people" className="h-4 w-4" />Odia cinema · {role}</p>
                        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{p.name}</h1>
                        {p.odia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{p.odia}</p>}
                        {p.desc && <p className="mt-3 text-lg text-ink-600">{p.desc.charAt(0).toUpperCase() + p.desc.slice(1)}</p>}
                        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                            <div><dt className="text-ink-500">Odia films</dt><dd className="text-xl font-semibold text-ink-900">{all.length}</dd></div>
                            {years.length > 0 && <div><dt className="text-ink-500">Active</dt><dd className="text-xl font-semibold text-ink-900">{Math.min(...years)}{Math.max(...years) !== Math.min(...years) ? `–${Math.max(...years)}` : ""}</dd></div>}
                            {p.birth && <div><dt className="text-ink-500">Born</dt><dd className="text-xl font-semibold text-ink-900">{fmtDate(p.birth)}</dd></div>}
                            {p.death && <div><dt className="text-ink-500">Died</dt><dd className="text-xl font-semibold text-ink-900">{fmtDate(p.death)}</dd></div>}
                        </dl>
                    </div>
                    {p.img && (
                        <figure className="w-48 md:w-56">
                            <img src={p.img.src} alt={p.name} className="aspect-[3/4] w-full rounded-2xl border-4 border-white object-cover object-top shadow-xl" loading="lazy" />
                            <figcaption className="mt-2 text-[11px] leading-snug text-ink-500">
                                {p.img.page ? <a href={p.img.page} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.img.credit} · {p.img.licence}</a> : p.img.credit}
                            </figcaption>
                        </figure>
                    )}
                </div>
            </header>

            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-12">
                    {fs.map(({ role: r, films }) => (
                        <section key={r}>
                            <h2 className="font-display text-2xl font-semibold">{r === "cast" ? "As actor" : `As ${ROLES.find((x) => x.id === r)!.label.toLowerCase()}`} <span className="text-base font-normal text-ink-500">({films.length})</span></h2>
                            <ol className="mt-4 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                                {films.map((f) => (
                                    <li key={f.id} className="flex items-center gap-4 px-5 py-3">
                                        <span className="w-12 shrink-0 text-sm font-semibold text-ink-500">{f.year ?? "—"}</span>
                                        <Link href={`/cinema/film/${f.id}`} className="flex-1 font-medium text-ink-900 hover:text-laterite-600">{f.title}</Link>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    ))}
                </div>
                <aside className="space-y-4 text-sm">
                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <p className="font-semibold text-ink-900">Sources</p>
                        <ul className="mt-2 space-y-1">
                            <li><a className="text-laterite-600 hover:underline" href={`https://www.wikidata.org/wiki/${p.q}`} target="_blank" rel="noopener noreferrer">Wikidata {p.q}</a></li>
                            {p.wp && <li><a className="text-laterite-600 hover:underline" href={`https://en.wikipedia.org/wiki/${p.wp}`} target="_blank" rel="noopener noreferrer">Wikipedia: {decodeURIComponent(p.wp).replace(/_/g, " ")}</a></li>}
                        </ul>
                        <p className="mt-3 text-xs text-ink-500">Filmography from {CINEMA_SOURCE}; it may be incomplete.</p>
                    </div>
                    <Link href="/cinema/people" className="btn-ghost w-full">All Odia film people</Link>
                </aside>
            </div>
        </div>
    );
}
