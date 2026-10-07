import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import AboutBlock from "@/components/cinema/AboutBlock";
import Gallery from "@/components/cinema/Gallery";
import { FILMS, PEOPLE, ROLES, filmography, getPerson, primaryRole, roleNoun, aboutPerson, collaborators, personIndexable, credits, isWikidata, type Film } from "@/lib/cinema";
import { SITE } from "@/lib/site";

/* eslint-disable @next/next/no-img-element -- Wikimedia Commons photos are hot-linked with attribution */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return PEOPLE.map((p) => ({ slug: p.id }));
}

const fmtDate = (d?: string) => (d ? (d.length === 4 ? d : new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })) : "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const p = getPerson(slug);
    if (!p) return { title: "Not found", robots: { index: false } };
    const fs = filmography(p);
    const n = new Set(fs.flatMap((x) => x.films.map((f) => f.id))).size;
    const role = roleNoun(primaryRole(p), p.g);
    const about = aboutPerson(p);
    const lead = about?.lead ?? p.auto?.[0];
    return {
        title: PEOPLE.some((x) => x.id !== p.id && x.name === p.name)
            ? `${p.name} (${role}${p.birth ? `, b. ${p.birth.slice(0, 4)}` : ""}) – Odia Films`
            : [`${p.name} – Odia ${role[0].toUpperCase() + role.slice(1)}: Biography & Films`, `${p.name} – Odia ${role[0].toUpperCase() + role.slice(1)}, Films`, `${p.name} – Odia Films`].find((t) => t.length <= 58) ?? p.name,
        description: (lead ? `${lead} ` : `${p.name}: ${n} Odia film${n === 1 ? "" : "s"} as ${role}. `).slice(0, 240) + " Filmography, photos and frequent co-stars.",
        alternates: { canonical: `/cinema/people/${p.id}` },
        // Keep thin pages (one credit, nothing written) out of search until they have more content
        robots: personIndexable(p) ? undefined : { index: false, follow: true },
        openGraph: p.img ? { images: [{ url: p.img.src, alt: p.name }] } : undefined,
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
    const about = aboutPerson(p);
    const team = collaborators(p);
    const knownFor = (about?.knownFor ?? [])
        .map((t) => all.find((f) => f.title.toLowerCase() === t.toLowerCase()) ?? FILMS.find((f) => f.title.toLowerCase() === t.toLowerCase() && credits(f, "cast").some((c) => c.person?.q === p.q)))
        .filter((f): f is Film => !!f);
    const facts: [string, string][] = [
        ...(p.birth ? [["Born", [fmtDate(p.birth), p.birthplace].filter(Boolean).join(", ")] as [string, string]] : p.birthplace ? [["Born in", p.birthplace] as [string, string]] : []),
        ...(p.death ? [["Died", fmtDate(p.death)] as [string, string]] : []),
        ...(about?.facts ?? []),
    ];
    const photos = [p.img, ...(p.gallery ?? [])].filter((x): x is NonNullable<typeof x> => !!x);

    return (
        <div>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "Person", name: p.name, alternateName: p.odia, description: about?.lead ?? p.desc,
                birthDate: p.birth, deathDate: p.death, birthPlace: p.birthplace, award: p.awards, image: photos.map((x) => x.src),
                jobTitle: role, url: `${SITE.url}/cinema/people/${p.id}`,
                sameAs: [...(isWikidata(p.q) ? [`https://www.wikidata.org/wiki/${p.q}`] : []), ...(p.wp ? [`https://en.wikipedia.org/wiki/${p.wp}`] : []), ...(p.orwiki ? [`https://or.wikipedia.org/wiki/${encodeURIComponent(p.orwiki)}`] : [])],
            }} />
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
                        {knownFor.length > 0 && (
                            <p className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-semibold text-ink-700">Known for</span>
                                {knownFor.slice(0, 5).map((f) => <Link key={f.id} href={`/cinema/film/${f.id}`} className="chip hover:border-laterite-300">{f.title}{f.year ? ` (${f.year})` : ""}</Link>)}
                            </p>
                        )}
                    </div>
                    {p.img && (
                        <figure className="w-48 md:w-56">
                            <img src={p.img.src} alt={p.name} className="aspect-[3/4] w-full rounded-2xl border-4 border-white object-cover object-top shadow-xl" />
                            <figcaption className="mt-2 text-[11px] leading-snug text-ink-500">
                                {p.img.page ? <a href={p.img.page} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.img.credit} · {p.img.licence}</a> : p.img.credit}
                            </figcaption>
                        </figure>
                    )}
                </div>
            </header>

            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0 space-y-12">
                    <AboutBlock about={about} auto={p.auto} title={about ? `About ${p.name}` : "At a glance"} />

                    {photos.length > 1 && <Gallery photos={photos.slice(1, 10)} title="Photos" alt={p.name} />}

                    {fs.map(({ role: r, films }) => (
                        <section key={r}>
                            <h2 className="font-display text-2xl font-semibold">{r === "cast" ? "Films as actor" : `Films as ${ROLES.find((x) => x.id === r)!.label.toLowerCase()}`} <span className="text-base font-normal text-ink-500">({films.length})</span></h2>
                            <ol className="mt-4 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                                {films.map((f) => {
                                    const dir = credits(f, "director").map((c) => c.name);
                                    const co = credits(f, "cast").filter((c) => c.person?.q !== p.q).slice(0, 3).map((c) => c.name);
                                    return (
                                        <li key={f.id} className="flex gap-4 px-5 py-3">
                                            <span className="w-12 shrink-0 pt-0.5 text-sm font-semibold text-ink-500">{f.year ?? "—"}</span>
                                            <div className="min-w-0 flex-1">
                                                <Link href={`/cinema/film/${f.id}`} className="font-medium text-ink-900 hover:text-laterite-600">{f.title}</Link>
                                                {(dir.length > 0 || co.length > 0) && (
                                                    <p className="mt-0.5 truncate text-xs text-ink-500">
                                                        {r !== "director" && dir.length > 0 && <>Dir. {dir.join(", ")}</>}
                                                        {r !== "director" && dir.length > 0 && co.length > 0 && " · "}
                                                        {co.length > 0 && <>with {co.join(", ")}</>}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </section>
                    ))}
                </div>

                <aside className="space-y-5 text-sm">
                    {facts.length > 0 && (
                        <dl className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
                            {facts.map(([k, v]) => (
                                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-sand-100 px-5 py-3 last:border-0">
                                    <dt className="text-ink-500">{k}</dt><dd className="text-ink-900">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {p.awards?.length ? (
                        <div className="rounded-2xl border border-sand-200 bg-white p-5">
                            <p className="font-semibold text-ink-900">Honours</p>
                            <ul className="mt-2 list-disc space-y-1 pl-4 text-ink-700">{p.awards.map((a) => <li key={a}>{a}</li>)}</ul>
                        </div>
                    ) : null}
                    {team.length > 0 && (
                        <div className="rounded-2xl border border-sand-200 bg-white p-5">
                            <p className="font-semibold text-ink-900">Worked most often with</p>
                            <ul className="mt-3 space-y-3">
                                {team.map(({ person: c, n, as }) => (
                                    <li key={c.q}>
                                        <Link href={`/cinema/people/${c.id}`} className="flex items-center gap-3 hover:text-laterite-600">
                                            {c.img ? <img src={c.img.src} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-200 font-display text-ink-600">{c.name[0]}</span>}
                                            <span><span className="font-medium text-ink-900">{c.name}</span><span className="block text-xs text-ink-500">{n} films · {roleNoun(as, c.g)}</span></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="rounded-2xl border border-sand-200 bg-white p-5">
                        <p className="font-semibold text-ink-900">Sources</p>
                        <ul className="mt-2 space-y-1">
                            {about?.src?.map((s) => <li key={s.url}><a className="text-laterite-600 hover:underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
                            {p.wp && !about?.src?.some((s) => s.url.includes("en.wikipedia")) && <li><a className="text-laterite-600 hover:underline" href={`https://en.wikipedia.org/wiki/${p.wp}`} target="_blank" rel="noopener noreferrer">Wikipedia (English)</a></li>}
                            {p.orwiki && !about?.src?.some((s) => s.url.includes("or.wikipedia")) && <li><a className="text-laterite-600 hover:underline" href={`https://or.wikipedia.org/wiki/${encodeURIComponent(p.orwiki)}`} target="_blank" rel="noopener noreferrer" lang="or">ଓଡ଼ିଆ ଉଇକିପିଡ଼ିଆ</a></li>}
                            {isWikidata(p.q) && <li><a className="text-laterite-600 hover:underline" href={`https://www.wikidata.org/wiki/${p.q}`} target="_blank" rel="noopener noreferrer">Wikidata {p.q}</a></li>}
                        </ul>
                        <p className="mt-3 text-xs text-ink-500">{about ? "The biography is written by Odiapedia from the sources above. " : ""}Filmography from Wikidata and Wikipedia&apos;s lists of Odia films; it may be incomplete.</p>
                        <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Correction: ${p.name}`)}`} className="mt-3 inline-flex text-xs font-semibold text-laterite-600 hover:underline">Suggest a correction</a>
                    </div>
                    <Link href="/cinema/people" className="btn-ghost w-full">All Odia film people</Link>
                </aside>
            </div>
        </div>
    );
}
