import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { getDistrictById } from "@/data/districts";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";
import { getAdminDistrict, ADMIN_SOURCE, subdistrictSlug } from "@/lib/admin";
import { useMDXComponents } from "../../../../mdx-components";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import ArticleCard from "@/components/ArticleCard";
import DistrictTabs, { type DistrictTab } from "@/components/DistrictTabs";
import AdminExplorer from "@/components/AdminExplorer";
import { ChariotWheel } from "@/components/Motifs";
import { getAllArticlesMetadata } from "@/lib/mdx";
import { SITE, formatDate } from "@/lib/site";
import type { IconName } from "@/lib/site";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllDistrictSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const district = getDistrictBySlug(slug);

    if (!district) {
        return { title: "District not found", robots: { index: false } };
    }

    const isOdia = slug.endsWith("-od");
    const base = slug.replace(/-od$/, "");
    const nameEn = getDistrictBySlug(base)?.title || getDistrictById(base)?.name_en || district.title;
    const title = isOdia ? `${district.title} ଜିଲ୍ଲା – ${nameEn} District, Odisha (ଓଡ଼ିଆ)` : `${district.title} District, Odisha: Places, History & Facts`;
    const description =
        district.description ||
        `${nameEn} district of Odisha: headquarters, population, places to visit, history, food and administrative blocks.`;
    const hasOdia = getAllDistrictSlugs().includes(`${base}-od`);

    return {
        title,
        description,
        keywords: district.keywords.length ? district.keywords : undefined,
        alternates: {
            canonical: `/district/${slug}`,
            ...(hasOdia
                ? { languages: { en: `${SITE.url}/district/${base}`, or: `${SITE.url}/district/${base}-od`, "x-default": `${SITE.url}/district/${base}` } }
                : {}),
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: `${SITE.url}/district/${slug}`,
            locale: isOdia ? "or_IN" : "en_IN",
        },
    };
}

/** H2 headings used by the English district pages, grouped into tabs. */
const TAB_GROUPS: { id: string; label: string; icon: IconName; headings: string[] }[] = [
    { id: "overview", label: "Overview", icon: "info", headings: ["overview"] },
    { id: "history", label: "History", icon: "scroll", headings: ["history"] },
    { id: "places", label: "Places & travel", icon: "compass", headings: ["places to visit", "how to reach"] },
    { id: "culture", label: "Culture & food", icon: "mask", headings: ["culture and festivals", "food"] },
    { id: "land", label: "Land & economy", icon: "leaf", headings: ["geography and climate", "economy"] },
    { id: "people", label: "People", icon: "people", headings: ["notable people"] },
];

interface Section {
    heading: string;
    body: string;
}

/** Split MDX into the intro and H2 sections (code fences respected). */
function splitSections(content: string): { intro: string; sections: Section[] } {
    const lines = content.replace(/^\s*#\s+[^\n]+\n+/, "").split("\n");
    let inCode = false;
    let intro: string[] = [];
    const sections: Section[] = [];
    for (const line of lines) {
        if (/^\s*```/.test(line)) inCode = !inCode;
        const m = !inCode && line.match(/^##\s+(.+?)\s*$/);
        if (m) {
            sections.push({ heading: m[1].trim(), body: "" });
            continue;
        }
        if (sections.length) sections[sections.length - 1].body += line + "\n";
        else intro.push(line);
    }
    return { intro: intro.join("\n").trim(), sections };
}

export default async function DistrictPage({ params }: PageProps) {
    const { slug } = await params;

    const districtContent = getDistrictBySlug(slug);
    const baseSlug = slug.replace(/-od$/, "");
    const isOdia = slug !== baseSlug;
    const districtData = getDistrictById(baseSlug);

    if (!districtContent) {
        notFound();
    }

    const admin = await getAdminDistrict(baseSlug);
    const mdxTehsils = getAllTehsilsForDistrict(baseSlug);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const components = useMDXComponents({});
    const { intro, sections } = splitSections(districtContent.content);

    // Build tabs from the content's H2 sections
    const used = new Set<number>();
    const tabs: DistrictTab[] = [];
    const panels: React.ReactNode[] = [];
    const renderMdx = (src: string) => (
        <MDXRemote source={src} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }} />
    );
    const nameEn = (isOdia ? getDistrictBySlug(baseSlug)?.title : districtContent.title) || districtData?.name_en || districtContent.title;

    for (const g of TAB_GROUPS) {
        const idx = sections.map((s, i) => (g.headings.includes(s.heading.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
        if (!idx.length && !(g.id === "overview" && intro)) continue;
        idx.forEach((i) => used.add(i));
        const src = [
            g.id === "overview" ? intro : "",
            ...idx.map((i) => (idx.length > 1 || g.id !== "overview" ? `## ${sections[i].heading}\n\n${sections[i].body}` : sections[i].body)),
        ]
            .filter(Boolean)
            .join("\n\n");
        tabs.push({ id: g.id, label: g.label, icon: g.icon });
        panels.push(
            <div className={g.id === "overview" ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]" : ""}>
                <div className="article-body min-w-0 max-w-[46rem]" lang={isOdia ? "or" : "en"}>
                    {renderMdx(src)}
                </div>
                {g.id === "overview" && districtContent.facts.length > 0 && (
                    <aside>
                        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white lg:sticky lg:top-40">
                            <div className="flex items-center gap-2 border-b border-sand-200 bg-sand-100 px-5 py-3">
                                <Icon name="info" className="h-4 w-4 text-laterite-600" />
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">Quick facts</p>
                            </div>
                            <dl className="divide-y divide-sand-100">
                                {districtContent.facts.map((f) => (
                                    <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3 text-sm">
                                        <dt className="font-medium text-ink-500">{f.label}</dt>
                                        <dd className="text-ink-900">{f.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </aside>
                )}
            </div>
        );
    }
    // Any section not in a known group (e.g. Odia-language pages) gets its own tab
    sections.forEach((s, i) => {
        if (used.has(i)) return;
        tabs.push({ id: `section-${i + 1}`, label: s.heading.replace(/[*_]/g, "").slice(0, 28), icon: "book" });
        panels.push(
            <div className="article-body max-w-[46rem]" lang={isOdia ? "or" : "en"}>
                {renderMdx(`## ${s.heading}\n\n${s.body}`)}
            </div>
        );
    });

    // Administration tab (Government data)
    if (admin) {
        const summary = {
            district: baseSlug,
            districtName: nameEn,
            blocks: admin.blocks.map((b) => ({ code: b.code, name: b.name, slug: b.slug, gps: b.gps.filter((g) => g.code !== "0").length, villages: b.villages })),
            subdistricts: admin.subdistricts.map((s) => ({ code: s.code, name: s.name, slug: subdistrictSlug(s), villages: s.villages })),
            ulbs: admin.ulbs.map((u) => ({ code: u.code, name: u.name, type: u.type })),
        };
        const realBlocks = admin.blocks.filter((b) => b.code !== "0");
        const gpCount = realBlocks.reduce((n, b) => n + b.gps.filter((g) => g.code !== "0").length, 0);
        tabs.push({ id: "administration", label: "Blocks & villages", icon: "list" });
        panels.push(
            <div>
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="font-display text-3xl font-semibold">Blocks, tahasils, panchayats &amp; villages</h2>
                        <p className="mt-2 max-w-2xl text-ink-600">
                            Choose a block, tahasil or town to see its details and its gram panchayats and villages. Open any village for its own page.
                        </p>
                    </div>
                    <dl className="grid grid-cols-4 gap-2 text-center">
                        {[
                            ["Blocks", realBlocks.length],
                            ["Sub-districts", admin.subdistricts.length],
                            ["GPs", gpCount],
                            ["Villages", admin.villages.length],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-xl border border-sand-200 bg-white px-3 py-2">
                                <dt className="text-[11px] uppercase tracking-wider text-ink-500">{k}</dt>
                                <dd className="font-display text-lg font-semibold">{Number(v).toLocaleString("en-IN")}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <AdminExplorer summary={summary} />

                {/* Crawlable index of blocks and tahasils */}
                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div>
                        <h3 className="font-display text-xl font-semibold">All blocks in {nameEn}</h3>
                        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                            {realBlocks.map((b) => (
                                <li key={b.code}><Link href={`/district/${baseSlug}/block/${b.slug}`} className="text-laterite-600 hover:underline">{b.name}</Link> <span className="text-ink-400">({b.villages})</span></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-semibold">All tahasils / sub-districts</h3>
                        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                            {admin.subdistricts.map((s) => (
                                <li key={s.code}><Link href={`/district/${baseSlug}/tahasil/${subdistrictSlug(s)}`} className="text-laterite-600 hover:underline">{s.name}</Link> <span className="text-ink-400">({s.villages})</span></li>
                            ))}
                        </ul>
                        {admin.ulbs.length > 0 && (
                            <>
                                <h3 className="mt-6 font-display text-xl font-semibold">Towns (urban local bodies)</h3>
                                <ul className="mt-3 space-y-1 text-sm text-ink-700">
                                    {admin.ulbs.map((u) => <li key={u.code}>{u.name} <span className="text-ink-400">· {u.type || "Urban local body"}</span></li>)}
                                </ul>
                            </>
                        )}
                        {mdxTehsils.length > 0 && (
                            <>
                                <h3 className="mt-6 font-display text-xl font-semibold">Tehsil guides</h3>
                                <ul className="mt-3 space-y-1 text-sm">
                                    {mdxTehsils.map((t) => <li key={t.slug}><Link href={`/district/${baseSlug}/${t.slug}`} className="text-laterite-600 hover:underline">{t.title}</Link></li>)}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
                <p className="mt-8 text-xs text-ink-500">
                    Source: {ADMIN_SOURCE}. Tahasil/sub-district units follow the Local Government Directory, which in some districts of Odisha lists more sub-districts than revenue tahasils. Boundaries and names change over time; check the district administration for current status.
                </p>
            </div>
        );
    }

    // Related articles that mention the district (internal linking)
    const escaped = nameEn.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
    const nameRe = new RegExp("\\b" + escaped + "\\b", "i");
    const related = isOdia
        ? []
        : getAllArticlesMetadata()
              .filter((a) => (!a.lang || a.lang === "en") && !a.noindex && a.category !== "about")
              .filter((a) => a.facts.some((f) => /district|location|region|where/i.test(f.label) && nameRe.test(f.value)) || nameRe.test(a.title))
              .slice(0, 6);

    const stats = [
        { k: "Headquarters", v: districtContent.headquarters || districtData?.headquarters },
        { k: "Population (2011)", v: districtContent.population || (districtData ? districtData.population.toLocaleString("en-IN") : undefined) },
        { k: "Area", v: districtContent.area || (districtData ? `${districtData.area_sq_km.toLocaleString("en-IN")} sq km` : undefined) },
        { k: "Villages", v: admin ? admin.villages.length.toLocaleString("en-IN") : undefined },
    ].filter((x) => x.v);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AdministrativeArea",
                name: `${nameEn} district`,
                alternateName: districtData?.name_od,
                description: districtContent.description,
                url: `${SITE.url}/district/${slug}`,
                containedInPlace: { "@type": "State", name: "Odisha", containedInPlace: { "@type": "Country", name: "India" } },
                ...(districtData ? { geo: { "@type": "GeoCoordinates", latitude: districtData.centroid[0], longitude: districtData.centroid[1] } } : {}),
                ...(admin ? { identifier: [{ "@type": "PropertyValue", propertyID: "LGD district code", value: admin.lgdCode }, { "@type": "PropertyValue", propertyID: "Census 2011 code", value: admin.census2011 }] } : {}),
            },
            ...(districtContent.faq.length
                ? [{ "@type": "FAQPage", mainEntity: districtContent.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
                : []),
        ],
    };
    const reportHref = `mailto:${SITE.correctionsEmail}?subject=${encodeURIComponent(`Correction: ${nameEn} district`)}&body=${encodeURIComponent(`Page: ${SITE.url}/district/${slug}\n\nWhat is incorrect or missing?\n\nSource:\n`)}`;

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <ChariotWheel className="pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] text-laterite-500/[0.07]" />
                <div className="container-page relative py-10 md:py-14">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: districtContent.title, href: `/district/${slug}` }]} />
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {districtData && (
                            <span className="eyebrow"><Icon name="pin" className="h-4 w-4" />{districtData.region} Odisha</span>
                        )}
                        <Link href={isOdia ? `/district/${baseSlug}` : `/district/${baseSlug}-od`} className="chip hover:border-laterite-300" lang={isOdia ? "en" : "or"}>
                            {isOdia ? "Read in English" : "ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ"}
                        </Link>
                    </div>
                    <h1 className="mt-3 font-display text-5xl font-semibold md:text-6xl" lang={isOdia ? "or" : "en"}>
                        {districtContent.title}{!isOdia && <span className="text-ink-400"> district</span>}
                    </h1>
                    {districtData && !isOdia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{districtData.name_od} ଜିଲ୍ଲା</p>}
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-600 md:text-xl" lang={isOdia ? "or" : "en"}>{districtContent.description}</p>
                    {stats.length > 0 && (
                        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
                            {stats.map((x) => (
                                <div key={x.k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                    <dt className="text-xs uppercase tracking-wider text-ink-500">{x.k}</dt>
                                    <dd className="mt-1 font-display text-lg font-semibold text-ink-900">{x.v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </header>

            <div className="container-page pb-12">
                <DistrictTabs tabs={tabs} panels={panels} />

                {districtContent.faq.length > 0 && (
                    <section className="mt-16 max-w-[46rem]">
                        <h2 className="font-display text-[1.75rem] font-semibold">Frequently asked questions</h2>
                        <div className="mt-6 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                            {districtContent.faq.map((f, i) => (
                                <details key={i} className="group p-5" open={i === 0}>
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

                {districtContent.sources.length > 0 && (
                    <section id="sources" className="mt-14 max-w-[46rem]">
                        <h2 className="font-display text-[1.75rem] font-semibold">Sources &amp; references</h2>
                        <ol className="mt-5 space-y-3 text-sm">
                            {districtContent.sources.map((s, i) => (
                                <li key={s.url} className="flex gap-3">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand-100 text-xs font-semibold text-ink-600">{i + 1}</span>
                                    <span>
                                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-900 underline decoration-sand-300 underline-offset-4 hover:text-laterite-600">{s.title}</a>
                                        {s.publisher && <span className="text-ink-500"> — {s.publisher}</span>}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                <div className="mt-10 flex max-w-[46rem] flex-col gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-5 text-sm text-ink-600 sm:flex-row sm:items-center sm:justify-between">
                    <p>{districtContent.updated ? <>Last reviewed <time dateTime={districtContent.updated}>{formatDate(districtContent.updated)}</time>. </> : null}<Link href="/about/editorial-policy" className="underline underline-offset-4 hover:text-laterite-600">How we check articles</Link></p>
                    <a href={reportHref} className="btn-ghost shrink-0 !py-2"><Icon name="flag" className="h-4 w-4" />Report an error</a>
                </div>
            </div>

            {related.length > 0 && (
                <section className="border-t border-sand-200 bg-sand-100/60 py-14">
                    <div className="container-page">
                        <h2 className="font-display text-3xl font-semibold">On Odiapedia: {nameEn}</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {related.map((a) => <ArticleCard key={`${a.category}/${a.slug}`} article={a} compact />)}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
