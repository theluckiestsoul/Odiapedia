import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { LIBRARY, getLibraryItem } from "@/data/library";
import { SITE, formatDate } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return LIBRARY.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = getLibraryItem(slug);
    if (!item) return { title: "Not found", robots: { index: false } };
    const base = item.title.length > 40 ? item.title.replace(/\s*[(—–].*$/, "").trim() : item.title;
    const withAuthor = `${base} by ${item.author} – PDF`;
    const title = withAuthor.length <= 58 ? withAuthor : base.length <= 52 ? `${base} – PDF` : base.slice(0, 55).replace(/\s+\S*$/, "") + "…";
    const description = `${item.description} Free ${item.language} PDF, ${item.year}. ${item.rights}.`.slice(0, 300);
    return {
        title,
        description,
        alternates: { canonical: `/library/${slug}` },
        openGraph: { title, description, url: `${SITE.url}/library/${slug}`, type: "book" },
    };
}

/** archive.org items can be read inline through the official embed viewer. */
function archiveId(url: string): string | null {
    const m = url.match(/archive\.org\/details\/([^/?#]+)/);
    return m ? m[1] : null;
}

export default async function LibraryItemPage({ params }: Props) {
    const { slug } = await params;
    const item = getLibraryItem(slug);
    if (!item) notFound();

    const iaId = archiveId(item.url);
    const more = LIBRARY.filter((i) => i.slug !== item.slug && (i.category === item.category || i.author === item.author)).slice(0, 6);
    const inLanguage = item.language === "Odia" ? "or" : item.language === "Sanskrit" ? "sa" : item.language === "English" ? "en" : ["or", "en"];

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Book",
                    name: item.title,
                    alternateName: item.titleOdia,
                    author: { "@type": "Person", name: item.author, alternateName: item.authorOdia },
                    inLanguage,
                    datePublished: /^\d{4}$/.test(item.year) ? item.year : undefined,
                    description: item.description,
                    genre: item.category,
                    url: `${SITE.url}/library/${item.slug}`,
                    sameAs: item.url,
                    isAccessibleForFree: true,
                    numberOfPages: item.pages,
                    ...(item.pdfUrl ? { encoding: { "@type": "MediaObject", contentUrl: item.pdfUrl, encodingFormat: "application/pdf" } } : {}),
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative grid gap-10 py-10 md:grid-cols-[180px_1fr] md:py-14">
                    <div className="hidden md:block">
                        <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-laterite-600 to-laterite-800 p-4 text-white shadow-xl shadow-laterite-900/30">
                            <span className="absolute inset-y-0 left-0 w-3 bg-black/20" aria-hidden="true" />
                            <Icon name="book" className="ml-2 h-6 w-6 text-saffron-200" />
                            <div className="ml-2">
                                <p className="font-display text-base leading-tight">{item.title}</p>
                                {item.titleOdia && <p lang="or" className="mt-1 font-odia text-sm text-saffron-100">{item.titleOdia}</p>}
                                <p className="mt-2 text-[11px] text-laterite-100">{item.author}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Breadcrumbs items={[{ name: "Library", href: "/library" }, { name: item.title, href: `/library/${item.slug}` }]} />
                        <p className="eyebrow mt-6"><Icon name="book" className="h-4 w-4" />{item.category}</p>
                        <h1 className="mt-3 text-balance font-display text-4xl font-semibold md:text-5xl">{item.title}</h1>
                        {item.titleOdia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{item.titleOdia}</p>}
                        <p className="mt-3 text-lg text-ink-700">
                            {item.author}
                            {item.authorOdia && <span lang="or" className="ml-2 font-odia text-ink-500">{item.authorOdia}</span>}
                        </p>
                        <p className="mt-4 max-w-3xl leading-relaxed text-ink-600">{item.description}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {item.pdfUrl && (
                                <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><Icon name="arrow" className="h-4 w-4 rotate-90" />Download PDF</a>
                            )}
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">View at {item.source.split(" (")[0]} <Icon name="external" className="h-4 w-4" /></a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container-page grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0">
                    {iaId ? (
                        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
                            <iframe
                                src={`https://archive.org/embed/${iaId}`}
                                title={`Read ${item.title}`}
                                loading="lazy"
                                className="h-[70vh] min-h-[480px] w-full"
                                allowFullScreen
                            />
                            <p className="border-t border-sand-200 px-4 py-2 text-xs text-ink-500">Reader provided by the Internet Archive.</p>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-sand-200 bg-white p-6 text-ink-600">Open the work at its source using the buttons above.</p>
                    )}
                </div>
                <aside className="space-y-6">
                    <dl className="overflow-hidden rounded-2xl border border-sand-200 bg-white text-sm">
                        {[
                            ["Author", item.author],
                            ["Year", item.year],
                            ["Language", item.language],
                            ["Category", item.category],
                            ["Pages", item.pages ? String(item.pages) : ""],
                            ["Digital copy", item.source],
                            ["Rights", item.rights],
                            ["Link checked", formatDate(item.checked)],
                        ]
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-sand-100 px-5 py-3 last:border-0">
                                    <dt className="text-ink-500">{k}</dt>
                                    <dd className="text-ink-900">{v}</dd>
                                </div>
                            ))}
                    </dl>
                    {item.related && (
                        <Link href={item.related} className="card-link flex items-center gap-3 p-5">
                            <Icon name="info" className="h-5 w-5 text-laterite-600" />
                            <span className="text-sm font-semibold text-ink-900">Read the Odiapedia article</span>
                        </Link>
                    )}
                    <p className="text-xs leading-relaxed text-ink-500">
                        Rights status is given for India. If you hold rights to this work and believe it is listed in error, <a className="underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent("Library rights notice: " + item.title)}`}>contact us</a>.
                    </p>
                </aside>
            </div>

            {more.length > 0 && (
                <section className="border-t border-sand-200 bg-sand-100/60 py-12">
                    <div className="container-page">
                        <h2 className="font-display text-2xl font-semibold">More from the library</h2>
                        <ul className="mt-6 grid gap-4 md:grid-cols-3">
                            {more.map((m) => (
                                <li key={m.slug}>
                                    <Link href={`/library/${m.slug}`} className="card-link block p-5">
                                        <span className="block font-semibold text-ink-900">{m.title}</span>
                                        <span className="text-sm text-ink-500">{m.author} · {m.year}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link href="/library" className="mt-6 inline-flex items-center gap-2 font-semibold text-laterite-600"><Icon name="arrowLeft" className="h-4 w-4" />All works</Link>
                    </div>
                </section>
            )}
        </div>
    );
}
