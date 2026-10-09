import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { districtName } from "@/lib/districts";
import { MONUMENTS, MONUMENT_SOURCE, MONUMENT_SOURCE_URL, monumentTitle } from "@/lib/geo-data";

export const metadata = hubMetadata({
    title: "Protected Monuments of Odisha (ASI) by District",
    description: `All ${MONUMENTS.length} Monuments of National Importance in Odisha protected by the Archaeological Survey of India — temples, Buddhist sites, forts and rock edicts — by district, with locations and maps.`,
    path: "/monuments",
    keywords: ["monuments of odisha", "asi monuments odisha", "protected monuments odisha", "monuments of national importance odisha", "heritage sites odisha"],
});

export default function MonumentsPage() {
    const byDistrict = new Map<string, typeof MONUMENTS>();
    MONUMENTS.forEach((m) => byDistrict.set(m.district, [...(byDistrict.get(m.district) || []), m]));
    const groups = [...byDistrict.entries()].map(([d, ms]) => ({ d, name: districtName(d) || ms[0].districtName, ms })).sort((a, b) => b.ms.length - a.ms.length || a.name.localeCompare(b.name));
    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: "Monuments of National Importance in Odisha",
                    numberOfItems: MONUMENTS.length,
                    itemListElement: MONUMENTS.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: monumentTitle(m), url: `${SITE.url}/monuments/${m.id}` })),
                }}
            />
            <PageHero
                title="Protected monuments of Odisha"
                odia="ଓଡ଼ିଶାର ସଂରକ୍ଷିତ ସ୍ମାରକୀ"
                description={`The ${MONUMENTS.length} sites in Odisha that the Archaeological Survey of India protects as Monuments of National Importance — from the Bhubaneswar temples to the Ashokan edicts at Dhauli and Jaugada and the Buddhist hills of Jajpur.`}
                icon="temple"
                eyebrow="Heritage"
                crumbs={[{ name: "Monuments", href: "/monuments" }]}
            />
            <div className="container-page py-12">
                <div className="grid gap-10 lg:grid-cols-2">
                    {groups.map((g) => (
                        <section key={g.d}>
                            <h2 className="font-display text-2xl font-semibold">
                                <Link href={`/district/${g.d}`} className="hover:text-laterite-700 hover:underline">{g.name}</Link> <span className="text-base font-normal text-ink-500">· {g.ms.length}</span>
                            </h2>
                            <ul className="mt-3 divide-y divide-sand-100 rounded-2xl border border-sand-200 bg-white">
                                {g.ms.map((m) => (
                                    <li key={m.id}>
                                        <Link href={`/monuments/${m.id}`} className="flex items-baseline gap-3 px-4 py-2.5 hover:bg-sand-50">
                                            <span className="w-16 shrink-0 text-xs text-ink-400">{m.number}</span>
                                            <span className="font-semibold text-laterite-700">{monumentTitle(m)}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
                <p className="mt-10 max-w-3xl text-xs text-ink-500">
                    Source: {MONUMENT_SOURCE} — <a href={MONUMENT_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">list and coordinates</a>. Numbers (N-OR-…) follow the ASI list. Monuments protected by the Government of Odisha&apos;s own archaeology department are not included here.
                </p>
            </div>
        </div>
    );
}
