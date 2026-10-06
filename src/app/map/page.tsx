import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import OdishaDistrictMap, { type MapDistrict } from "@/components/map/OdishaDistrictMap";
import { REGION_STYLE } from "@/data/map-regions";
import { odishaDistricts, districtPageSlug } from "@/data/districts";
import { districtName } from "@/lib/districts";
import { ADMIN_SUMMARY } from "@/lib/admin";
import { breadcrumbJsonLd, hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Map of Odisha – Interactive District Map (30 Districts)",
    description: "Interactive map of Odisha: zoom from the state into all 30 districts, 314 blocks and 50,000+ villages. See headquarters, population, literacy, gram panchayats and village names.",
    path: "/map",
    keywords: ["odisha map", "map of odisha", "odisha district map", "odisha block map", "odisha village map", "odisha political map", "odisha districts map", "ଓଡ଼ିଶା ମାନଚିତ୍ର"],
});

const REGION_NOTES: Record<"coastal" | "central" | "northern" | "southern", string> = {
    coastal: "The Mahanadi–Brahmani–Baitarani deltas and the Bay of Bengal shore: Puri, Konark, Chilika, Bhitarkanika and the old cities of Cuttack and Bhubaneswar.",
    central: "The middle Mahanadi basin — Angul, Dhenkanal, Nayagarh, Boudh and the Sambalpuri-weaving belt around Balangir and Subarnapur.",
    northern: "The mineral-rich Chota Nagpur fringe and the upper Mahanadi: Sundargarh, Kendujhar, Mayurbhanj (Similipal), Sambalpur and Hirakud.",
    southern: "The Eastern Ghats and their foothills — Koraput, Rayagada, Malkangiri, Kandhamal and Kalahandi, home to many of Odisha's tribal communities.",
};

function buildDistricts(): MapDistrict[] {
    return odishaDistricts.map((d) => {
        const id = districtPageSlug(d.id);
        const admin = ADMIN_SUMMARY[id];
        return {
            id,
            name: districtName(id) ?? d.name_en,
            odia: d.name_od,
            hq: d.headquarters,
            region: d.region,
            population: d.population,
            area: d.area_sq_km,
            density: d.density,
            literacy: d.literacy,
            ...(admin ? { blocks: admin.blocks, gps: admin.gps, villages: admin.villages } : {}),
        };
    });
}

export default function MapPage() {
    const districts = buildDistricts();
    const sorted = [...districts].sort((a, b) => a.name.localeCompare(b.name));
    const crumbs = [{ name: "Districts", href: "/districts" }, { name: "Map", href: "/map" }];

    return (
        <div>
            <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, ...crumbs])} />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Map",
                    name: "District map of Odisha",
                    url: `${SITE.url}/map`,
                    mapType: "https://schema.org/VenueMap",
                    about: { "@type": "AdministrativeArea", name: "Odisha", containedInPlace: { "@type": "Country", name: "India" } },
                    hasPart: sorted.map((d) => ({ "@type": "AdministrativeArea", name: `${d.name} district`, url: `${SITE.url}/district/${d.id}` })),
                }}
            />
            <PageHero
                title="Map of Odisha"
                odia="ଓଡ଼ିଶା ମାନଚିତ୍ର"
                description="An interactive map of Odisha you can zoom from the whole state into any district, its blocks and sub-districts, and right down to individual villages — with links to every district, block and village page."
                icon="map"
                eyebrow="Districts"
                crumbs={crumbs}
            />

            <section className="container-page py-10 md:py-14">
                <OdishaDistrictMap districts={districts} />
                <p className="mt-4 text-xs leading-relaxed text-ink-500">
                    District boundaries: DataMeet, <em>Districts of India</em> (Census 2011), CC BY 2.5 India. Village boundaries: DataMeet,{" "}
                    <em>Indian Village Boundaries</em> (Census 2011), © DataMeet contributors, ODbL 1.0; block and sub-district shapes are derived from them, and the derived map data
                    is available under the same licence. Blocks, gram panchayats and village names: Local Government Directory, Government of India (December 2022).
                    Population, area, density and literacy: Census of India 2011. All boundaries are simplified and indicative, not an authoritative depiction of borders.
                </p>
            </section>

            <section className="border-t border-sand-200 bg-sand-50">
                <div className="container-page py-14">
                    <div className="eyebrow mb-3"><Icon name="compass" className="h-4 w-4" />Regions</div>
                    <h2 className="mb-8 font-display text-3xl font-semibold text-ink-900">Four broad regions</h2>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {(["coastal", "central", "northern", "southern"] as const).map((r) => {
                            const members = sorted.filter((d) => d.region === r);
                            return (
                                <div key={r} className="card relative overflow-hidden p-6 pt-7">
                                    <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: REGION_STYLE[r].fill }} />
                                    <h3 className="font-display text-xl font-semibold text-ink-900">{REGION_STYLE[r].label}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{REGION_NOTES[r]}</p>
                                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500">{members.length} districts</p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {members.map((d) => (
                                            <Link key={d.id} href={`/district/${d.id}`} className="chip hover:bg-sand-200">{d.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="mt-4 text-xs text-ink-500">Regional grouping is informal and used here only to colour the map.</p>
                </div>
            </section>

            <section className="container-page py-14">
                <div className="eyebrow mb-3"><Icon name="list" className="h-4 w-4" />At a glance</div>
                <h2 className="mb-6 font-display text-3xl font-semibold text-ink-900">Districts of Odisha — key figures</h2>
                <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                    <table className="w-full min-w-[44rem] text-left text-sm">
                        <thead className="bg-sand-100 text-xs uppercase tracking-wide text-ink-600">
                            <tr>
                                <th className="px-4 py-3">District</th>
                                <th className="px-4 py-3">Headquarters</th>
                                <th className="px-4 py-3 text-right">Population (2011)</th>
                                <th className="px-4 py-3 text-right">Area (km²)</th>
                                <th className="px-4 py-3 text-right">Literacy</th>
                                <th className="px-4 py-3 text-right">Blocks</th>
                                <th className="px-4 py-3 text-right">Villages</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sand-100">
                            {sorted.map((d) => (
                                <tr key={d.id} className="hover:bg-sand-50">
                                    <td className="px-4 py-2.5">
                                        <Link href={`/district/${d.id}`} className="font-semibold text-ink-900 hover:text-laterite-600">{d.name}</Link>
                                        <span className="ml-2 font-odia text-ink-500">{d.odia}</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-ink-700">{d.hq}</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{d.population.toLocaleString("en-IN")}</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{d.area.toLocaleString("en-IN")}</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{d.literacy}%</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{d.blocks ?? "—"}</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{d.villages?.toLocaleString("en-IN") ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/districts" className="btn-dark"><Icon name="pin" className="h-4 w-4" />All district guides</Link>
                    <Link href="/travel/plan" className="btn-ghost"><Icon name="suitcase" className="h-4 w-4" />Plan a trip</Link>
                    <Link href="/history/timeline" className="btn-ghost"><Icon name="hourglass" className="h-4 w-4" />History timeline</Link>
                </div>
            </section>
        </div>
    );
}
