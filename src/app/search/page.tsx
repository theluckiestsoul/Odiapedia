import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { getSearchIndex } from "@/lib/mdx";
import { rankSearch } from "@/lib/search";
import { categoryInfo, CATEGORIES } from "@/lib/site";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    const query = (Array.isArray(q) ? q[0] : q || "").trim();
    return {
        title: query ? `Search: ${query}` : "Search Odiapedia",
        description: "Search Odiapedia's articles on Odisha and the Odia language.",
        robots: { index: false, follow: true },
        alternates: { canonical: "/search" },
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = (Array.isArray(q) ? q[0] : q || "").trim().slice(0, 100);
    const results = query ? rankSearch(getSearchIndex(), query) : [];

    return (
        <div className="container-page py-12 md:py-16">
            <h1 className="font-display text-4xl font-semibold md:text-5xl">Search Odiapedia</h1>
            <form action="/search" method="get" role="search" className="mt-6 flex max-w-2xl items-center gap-2 rounded-full border border-sand-300 bg-white p-2 pl-5 focus-within:border-laterite-400">
                <Icon name="search" className="h-5 w-5 text-laterite-500" />
                <label htmlFor="q" className="sr-only">Search</label>
                <input id="q" name="q" type="search" defaultValue={query} autoFocus placeholder="Festivals, places, food, people… (English or ଓଡ଼ିଆ)" className="min-w-0 flex-1 bg-transparent py-2 text-ink-900 outline-none" />
                <button className="btn-primary">Search</button>
            </form>

            {query ? (
                <p className="mt-8 text-ink-600">
                    {results.length} result{results.length === 1 ? "" : "s"} for <strong className="text-ink-900">“{query}”</strong>
                </p>
            ) : (
                <div className="mt-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500">Browse by topic</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.values(CATEGORIES).map((c) => (
                            <Link key={c.key} href={c.href} className="chip !px-4 !py-2 !text-sm hover:border-laterite-300"><Icon name={c.icon} className="h-4 w-4 text-laterite-600" />{c.label}</Link>
                        ))}
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <ul className="mt-6 max-w-3xl divide-y divide-sand-200">
                    {results.slice(0, 60).map((r) => {
                        const c = categoryInfo(r.category);
                        return (
                            <li key={r.href} className="py-5">
                                <Link href={r.href} className="group block">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-laterite-600">{c.label}</span>
                                    <span className="mt-1 block font-display text-2xl font-semibold text-ink-900 group-hover:text-laterite-700">
                                        {r.title}
                                        {r.odiaTitle && <span lang="or" className="ml-2 font-odia text-base font-normal text-ink-500">{r.odiaTitle}</span>}
                                    </span>
                                    <span className="mt-1 block text-ink-600">{r.description}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}

            {query && results.length === 0 && (
                <div className="mt-8 max-w-2xl rounded-2xl border border-sand-200 bg-white p-6">
                    <p className="font-semibold text-ink-900">Nothing matched yet.</p>
                    <p className="mt-1 text-ink-600">Try a shorter or different spelling (e.g. “Jagannath”, “Rasagola”, “Konark”). Think we should cover it? <a className="text-laterite-600 underline" href={`mailto:contact@odiapedia.com?subject=${encodeURIComponent("Topic suggestion: " + query)}`}>Suggest the topic</a>.</p>
                </div>
            )}
        </div>
    );
}
