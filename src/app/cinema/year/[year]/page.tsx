import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { YEARS, filmsOfYear, personByQ } from "@/lib/cinema";
import { CINEMA_TIMELINE } from "@/data/cinema-timeline";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ year: string }> };

export async function generateStaticParams() {
    return YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { year } = await params;
    const n = filmsOfYear(Number(year)).length;
    if (!n) return { title: "Not found", robots: { index: false } };
    return {
        title: `Odia Films of ${year} – Ollywood Movies Released in ${year}`,
        description: `All ${n} Odia film${n === 1 ? "" : "s"} released in ${year}, with directors, cast and music directors.`,
        alternates: { canonical: `/cinema/year/${year}` },
    };
}

export default async function YearPage({ params }: Props) {
    const { year } = await params;
    const y = Number(year);
    const films = filmsOfYear(y);
    if (!films.length) notFound();
    const i = YEARS.indexOf(y);
    const prev = YEARS[i - 1], next = YEARS[i + 1];
    const milestones = CINEMA_TIMELINE.filter((e) => e.year === year);
    const name = (q: string) => personByQ(q);

    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: `Odia films of ${y}`, numberOfItems: films.length, itemListElement: films.map((f, k) => ({ "@type": "ListItem", position: k + 1, url: `${SITE.url}/cinema/film/${f.id}`, name: f.title })) }} />
            <PageHero
                title={`Odia films of ${y}`}
                odia={`${String(y).replace(/[0-9]/g, (d) => "୦୧୨୩୪୫୬୭୮୯"[+d])} ମସିହାର ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର`}
                description={`${films.length} Odia film${films.length === 1 ? "" : "s"} recorded for ${y}.`}
                icon="star"
                eyebrow="Odia cinema"
                crumbs={[{ name: "Odia cinema", href: "/cinema" }, { name: String(y), href: `/cinema/year/${y}` }]}
            >
                <div className="flex flex-wrap gap-2">
                    {prev && <Link href={`/cinema/year/${prev}`} className="btn-ghost">← {prev}</Link>}
                    {next && <Link href={`/cinema/year/${next}`} className="btn-ghost">{next} →</Link>}
                </div>
            </PageHero>
            <div className="container-page py-12">
                {milestones.length > 0 && (
                    <div className="mb-8 space-y-3">
                        {milestones.map((m) => (
                            <div key={m.id} className="rounded-2xl border border-saffron-200 bg-saffron-50 p-5">
                                <p className="text-xs font-bold uppercase tracking-wider text-saffron-600">Milestone of {y}</p>
                                <p className="mt-1 font-display text-xl font-semibold text-ink-900">{m.title}</p>
                                <p className="mt-1 text-sm text-ink-700">{m.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                    <table className="w-full min-w-[40rem] text-left text-sm">
                        <thead className="bg-sand-100 text-xs uppercase tracking-wide text-ink-600">
                            <tr><th className="px-4 py-3">Film</th><th className="px-4 py-3">Director</th><th className="px-4 py-3">Cast</th><th className="px-4 py-3">Music</th></tr>
                        </thead>
                        <tbody className="divide-y divide-sand-100">
                            {films.map((f) => (
                                <tr key={f.id} className="align-top hover:bg-sand-50">
                                    <td className="px-4 py-3"><Link href={`/cinema/film/${f.id}`} className="font-semibold text-ink-900 hover:text-laterite-600">{f.title}</Link>{f.odia && <span lang="or" className="block font-odia text-ink-500">{f.odia}</span>}</td>
                                    {(["director", "cast", "music"] as const).map((r) => (
                                        <td key={r} className="px-4 py-3 text-ink-700">
                                            {(f[r] ?? []).slice(0, r === "cast" ? 3 : 2).map((q, k) => { const p = name(q); return p ? <span key={q}>{k > 0 && ", "}<Link href={`/cinema/people/${p.id}`} className="hover:text-laterite-600 hover:underline">{p.name}</Link></span> : null; })}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-xs text-ink-500">Source: Wikidata. Some films of {y} may be missing or lack full credits — corrections welcome.</p>
            </div>
        </div>
    );
}
