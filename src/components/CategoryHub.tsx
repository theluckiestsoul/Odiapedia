import Link from "next/link";
import { getPrimaryArticles, getAllArticles, type ArticleMeta } from "@/lib/mdx";
import { categoryInfo, SITE, absoluteUrl } from "@/lib/site";
import PageHero from "./PageHero";
import ArticleCard from "./ArticleCard";
import JsonLd from "./JsonLd";
import Icon from "./Icon";

export interface HubGroup {
    title: string;
    description?: string;
    /** Article slugs (in display order). Missing slugs are ignored. */
    slugs?: string[];
    /** Or pick by a predicate */
    match?: (a: ArticleMeta) => boolean;
}

interface CategoryHubProps {
    category: string;
    title: string;
    odia: string;
    description: string;
    groups?: HubGroup[];
    before?: React.ReactNode;
    after?: React.ReactNode;
    heroChildren?: React.ReactNode;
    image?: string;
}

/** Shared hub layout: hero, grouped article grids, Odia-language versions and CollectionPage schema. */
export default function CategoryHub({ category, title, odia, description, groups = [], before, after, heroChildren, image }: CategoryHubProps) {
    const info = categoryInfo(category);
    const articles = getPrimaryArticles(category).filter((a) => !a.noindex);
    const odiaVersions = getAllArticles(category).filter((a) => a.lang === "od");
    const used = new Set<string>();

    const resolved = groups
        .map((g) => {
            const list = g.slugs
                ? g.slugs.map((s) => articles.find((a) => a.slug === s)).filter((a): a is ArticleMeta => Boolean(a))
                : articles.filter((a) => g.match?.(a));
            const fresh = list.filter((a) => !used.has(a.slug));
            fresh.forEach((a) => used.add(a.slug));
            return { ...g, list: fresh };
        })
        .filter((g) => g.list.length > 0);
    const rest = articles.filter((a) => !used.has(a.slug)).sort((a, b) => a.title.localeCompare(b.title));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${title} – ${SITE.name}`,
        description,
        url: absoluteUrl(info.href),
        inLanguage: "en",
        isPartOf: { "@id": `${SITE.url}/#website` },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 50).map((a, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/${a.category}/${a.slug}`), name: a.title })),
        },
    };

    return (
        <div>
            <JsonLd data={jsonLd} />
            <PageHero title={title} odia={odia} description={description} eyebrow={`${articles.length} articles`} icon={info.icon} image={image ?? info.image} crumbs={[{ name: info.label, href: info.href }]}>
                {heroChildren}
            </PageHero>

            {before}

            <div className="container-page space-y-16 py-14 md:py-20">
                {resolved.map((g) => (
                    <section key={g.title} aria-labelledby={`g-${g.title}`}>
                        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <h2 id={`g-${g.title}`} className="font-display text-3xl font-semibold">{g.title}</h2>
                            {g.description && <p className="max-w-xl text-ink-600">{g.description}</p>}
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {g.list.map((a) => (
                                <ArticleCard key={a.slug} article={a} showCategory={false} compact />
                            ))}
                        </div>
                    </section>
                ))}
                {rest.length > 0 && (
                    <section>
                        <h2 className="mb-6 font-display text-3xl font-semibold">{resolved.length ? "More to explore" : `All ${info.label.toLowerCase()} articles`}</h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {rest.map((a) => (
                                <ArticleCard key={a.slug} article={a} showCategory={false} compact />
                            ))}
                        </div>
                    </section>
                )}

                {odiaVersions.length > 0 && (
                    <section className="rounded-3xl border border-sand-200 bg-sand-100/60 p-6 md:p-8">
                        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                            <Icon name="language" className="h-5 w-5 text-laterite-600" />
                            <span>Read in Odia</span>
                            <span lang="or" className="font-odia text-lg text-laterite-600">ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ</span>
                        </h2>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {odiaVersions.map((a) => (
                                <li key={a.slug}>
                                    <Link href={`/${a.category}/${a.slug}`} lang="or" className="chip !bg-white !px-4 !py-2 font-odia !text-sm hover:border-laterite-300">
                                        {a.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            {after}
        </div>
    );
}
