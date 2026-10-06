import Link from "next/link";
import Image from "next/image";
import { type Article, type ArticleMeta, extractToc, getRelatedArticles } from "@/lib/mdx";
import { articleJsonLd } from "@/lib/seo";
import { SITE, categoryInfo, formatDate } from "@/lib/site";
import ShareButtons from "./ShareButtons";
import JsonLd from "./JsonLd";
import RecipeCard from "./RecipeCard";
import Breadcrumbs from "./Breadcrumbs";
import Icon from "./Icon";
import ArticleCard from "./ArticleCard";
import { ChariotWheel } from "./Motifs";

interface ArticleLayoutProps {
    meta: Article | ArticleMeta;
    children: React.ReactNode;
}

function hostOf(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

export default function ArticleLayout({ meta, children }: ArticleLayoutProps) {
    const category = categoryInfo(meta.category);
    const article = meta as Article;
    const toc = article.content ? extractToc(article.content).filter((t) => t.level === 2) : [];
    const related = getRelatedArticles(meta, 3);
    const isTravel = meta.category === "travel";
    const isAbout = meta.category === "about";
    const url = `${SITE.url}/${meta.category}/${meta.slug}`;
    const reportHref = `mailto:${SITE.correctionsEmail}?subject=${encodeURIComponent(`Correction: ${meta.title}`)}&body=${encodeURIComponent(`Page: ${url}\n\nWhat is incorrect or missing?\n\nSource (link or book):\n`)}`;

    return (
        <div className="bg-background">
            {"content" in meta && <JsonLd data={articleJsonLd(article)} />}

            {/* Header */}
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <ChariotWheel className="pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] text-laterite-500/[0.07]" />
                <div className="container-page relative grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
                    <div className="max-w-3xl">
                        <Breadcrumbs items={[{ name: category.label, href: category.href }, { name: meta.title, href: `/${meta.category}/${meta.slug}` }]} />
                        <Link href={category.href} className="eyebrow mt-6 hover:text-laterite-700">
                            <Icon name={category.icon} className="h-4 w-4" />
                            {category.label}
                        </Link>
                        <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-[1.1] md:text-5xl">{meta.title}</h1>
                        {meta.odiaTitle && (
                            <p lang="or" className="mt-3 font-odia-serif text-2xl text-laterite-600">{meta.odiaTitle}</p>
                        )}
                        {meta.description && <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-600 md:text-xl">{meta.description}</p>}
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
                            <span className="inline-flex items-center gap-1.5">
                                <Icon name="clock" className="h-4 w-4" />
                                {meta.readingMinutes} min read
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Icon name="check" className="h-4 w-4 text-chilika-600" />
                                Updated <time dateTime={meta.updated}>{formatDate(meta.updated)}</time>
                            </span>
                            {meta.sources.length > 0 && (
                                <a href="#sources" className="inline-flex items-center gap-1.5 hover:text-laterite-600">
                                    <Icon name="shield" className="h-4 w-4 text-chilika-600" />
                                    {meta.sources.length} cited sources
                                </a>
                            )}
                            <span>By {meta.author}</span>
                            {meta.recipe && (
                                <a href="#recipe" className="inline-flex items-center gap-1.5 rounded-full bg-laterite-500 px-3 py-1 font-semibold text-white hover:bg-laterite-600">
                                    <Icon name="bowl" className="h-4 w-4" />Jump to recipe
                                </a>
                            )}
                        </div>
                        <div className="mt-6">
                            <ShareButtons title={`${meta.title} – ${SITE.name}`} />
                        </div>
                    </div>
                    {meta.image && (
                        <figure className="relative hidden lg:block">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-laterite-900/20">
                                <Image src={meta.image} alt={meta.title} fill priority sizes="380px" className="object-cover" />
                            </div>
                            <figcaption className="mt-2 text-right text-xs text-ink-500">{meta.imageCredit || "Illustration, not a photograph"}</figcaption>
                        </figure>
                    )}
                </div>
            </header>

            {/* Body */}
            <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-16">
                <article className="min-w-0">
                    {meta.image && (
                        <figure className="mb-10 lg:hidden">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                                <Image src={meta.image} alt={meta.title} fill sizes="100vw" className="object-cover" />
                            </div>
                            <figcaption className="mt-2 text-xs text-ink-500">{meta.imageCredit || "Illustration, not a photograph"}</figcaption>
                        </figure>
                    )}

                    {/* Facts box (mobile: above the text) */}
                    {meta.facts.length > 0 && (
                        <div className="mb-10 lg:hidden">
                            <FactBox meta={meta} />
                        </div>
                    )}

                    <div className="article-body max-w-[46rem]">{children}</div>

                    {meta.recipe && <RecipeCard recipe={meta.recipe} title={meta.title} odia={meta.odiaTitle} />}

                    {meta.faq.length > 0 && (
                        <section aria-labelledby="faq-heading" className="mt-16 max-w-[46rem]">
                            <h2 id="faq-heading" className="font-display text-[1.75rem] font-semibold">Frequently asked questions</h2>
                            <div className="mt-6 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                                {meta.faq.map((f, i) => (
                                    <details key={i} className="group p-5 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
                                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink-900">
                                            <h3 className="font-sans text-base font-semibold">{f.q}</h3>
                                            <Icon name="chevron" className="mt-0.5 h-5 w-5 shrink-0 text-laterite-500 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <p className="mt-3 leading-relaxed text-ink-700">{f.a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {isTravel && (
                        <aside className="relative mt-16 max-w-[46rem] overflow-hidden rounded-3xl bg-ink-900 p-8 text-white md:p-10">
                            <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
                            <ChariotWheel className="absolute -bottom-16 -right-16 h-56 w-56 text-white/10" />
                            <div className="relative">
                                <p className="eyebrow !text-saffron-300"><Icon name="suitcase" className="h-4 w-4" />Plan with Odiapedia</p>
                                <h2 className="mt-3 font-display text-3xl font-semibold !text-white">Want a trip like this, planned for you?</h2>
                                <p className="mt-3 max-w-xl text-sand-100/85">Tell us your dates, budget and interests. We share your request only with vetted Odisha travel partners, and only with your consent.</p>
                                <Link href="/travel/plan" className="btn-primary mt-6">Request a free itinerary <Icon name="arrow" className="h-4 w-4" /></Link>
                            </div>
                        </aside>
                    )}

                    {/* Sources */}
                    {!isAbout && (
                        <section id="sources" aria-labelledby="sources-heading" className="mt-16 max-w-[46rem] scroll-mt-28">
                            <h2 id="sources-heading" className="font-display text-[1.75rem] font-semibold">Sources &amp; references</h2>
                            {meta.sources.length > 0 ? (
                                <ol className="mt-5 space-y-3">
                                    {meta.sources.map((s, i) => (
                                        <li key={s.url} className="flex gap-3 text-sm leading-relaxed">
                                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand-100 text-xs font-semibold text-ink-600">{i + 1}</span>
                                            <span>
                                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-900 underline decoration-sand-300 underline-offset-4 hover:text-laterite-600">
                                                    {s.title}
                                                </a>
                                                <span className="text-ink-500"> — {s.publisher || hostOf(s.url)}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="mt-4 rounded-xl border border-saffron-200 bg-saffron-100/50 p-4 text-sm text-ink-700">
                                    This article has not yet been through our source review. Know a reliable source? <a className="font-semibold text-laterite-600 underline" href={reportHref}>Send it to us</a>.
                                </p>
                            )}
                        </section>
                    )}

                    {meta.changelog.length > 0 && (
                        <section aria-labelledby="changes-heading" className="mt-10 max-w-[46rem]">
                            <h2 id="changes-heading" className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Corrections &amp; updates</h2>
                            <ul className="mt-3 space-y-2 text-sm text-ink-700">
                                {meta.changelog.map((c, i) => (
                                    <li key={i}><time dateTime={c.date} className="font-medium">{formatDate(c.date)}</time> — {c.note}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Review & corrections */}
                    <div className="mt-10 flex max-w-[46rem] flex-col gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-5 text-sm text-ink-600 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            First published <time dateTime={meta.date}>{formatDate(meta.date)}</time> · Last reviewed <time dateTime={meta.updated}>{formatDate(meta.updated)}</time>.{" "}
                            <Link href="/about/editorial-policy" className="underline underline-offset-4 hover:text-laterite-600">How we write and check articles</Link>
                        </p>
                        <a href={reportHref} className="btn-ghost shrink-0 !py-2">
                            <Icon name="flag" className="h-4 w-4" />Report an error
                        </a>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-28 space-y-6">
                        {meta.facts.length > 0 && <FactBox meta={meta} />}
                        {toc.length > 2 && (
                            <nav aria-label="On this page" className="rounded-2xl border border-sand-200 bg-white p-5">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">On this page</p>
                                <ol className="space-y-1.5 text-sm">
                                    {toc.map((t) => (
                                        <li key={t.id}>
                                            <a href={`#${t.id}`} className="block rounded-md px-2 py-1 text-ink-700 transition-colors hover:bg-sand-100 hover:text-laterite-700">{t.text}</a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}
                        {isTravel && (
                            <Link href="/travel/plan" className="group block rounded-2xl bg-laterite-500 p-5 text-white transition-colors hover:bg-laterite-600">
                                <p className="font-display text-lg font-semibold">Plan a custom Odisha trip</p>
                                <p className="mt-1 text-sm text-laterite-50/90">Free itinerary request · consent-based</p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">Start <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                            </Link>
                        )}
                    </div>
                </aside>
            </div>

            {related.length > 0 && (
                <section className="border-t border-sand-200 bg-sand-100/60 py-14">
                    <div className="container-page">
                        <h2 className="font-display text-3xl font-semibold">Continue exploring</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {related.map((a) => (
                                <ArticleCard key={`${a.category}/${a.slug}`} article={a} compact />
                            ))}
                        </div>
                        <Link href={category.href} className="mt-8 inline-flex items-center gap-2 font-semibold text-laterite-600 hover:text-laterite-700">
                            <Icon name="arrowLeft" className="h-4 w-4" /> All {category.label.toLowerCase()} articles
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

function FactBox({ meta }: { meta: ArticleMeta }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
            <div className="flex items-center gap-2 border-b border-sand-200 bg-sand-100 px-5 py-3">
                <Icon name="info" className="h-4 w-4 text-laterite-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">Quick facts</p>
            </div>
            <dl className="divide-y divide-sand-100">
                {meta.facts.map((f) => (
                    <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-3 px-5 py-3 text-sm">
                        <dt className="font-medium text-ink-500">{f.label}</dt>
                        <dd className="text-ink-900">{f.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
