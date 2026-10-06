import Link from "next/link";
import { getAllDistricts } from "@/lib/districts";
import { odishaDistricts, districtPageSlug } from "@/data/districts";
import Icon from "./Icon";

const REGION_ORDER = ["coastal", "northern", "central", "western", "southern"] as const;
const REGION_LABEL: Record<string, string> = {
    coastal: "Coastal Odisha",
    northern: "Northern Odisha",
    central: "Central Odisha",
    western: "Western Odisha",
    southern: "Southern Odisha",
};

/** All 30 districts grouped by region (English pages, with a link to the Odia version). */
export default function DistrictList() {
    const mdx = new Map(getAllDistricts().map((d) => [d.slug, d]));
    return (
        <div className="space-y-12">
            {REGION_ORDER.map((region) => {
                const list = odishaDistricts.filter((d) => d.region === region).sort((a, b) => a.name_en.localeCompare(b.name_en));
                if (!list.length) return null;
                return (
                    <section key={region}>
                        <h2 className="mb-5 font-display text-2xl font-semibold">{REGION_LABEL[region]} <span className="text-base font-normal text-ink-500">· {list.length} districts</span></h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {list.map((d) => {
                                const page = mdx.get(districtPageSlug(d.id));
                                return (
                                    <div key={d.id} className="card-link group relative p-5">
                                        <Link href={`/district/${districtPageSlug(d.id)}`} className="absolute inset-0" aria-label={`${d.name_en} district`} />
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-display text-xl font-semibold group-hover:text-laterite-700">{d.name_en}</h3>
                                                <p lang="or" className="font-odia text-sm text-laterite-600">{d.name_od}</p>
                                            </div>
                                            <Icon name="arrow" className="mt-1 h-4 w-4 text-laterite-500 transition-transform group-hover:translate-x-1" />
                                        </div>
                                        {page?.description && <p className="mt-3 line-clamp-2 text-sm text-ink-600">{page.description}</p>}
                                        <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-3 text-xs text-ink-500">
                                            <span>HQ: {d.headquarters}</span>
                                            {mdx.has(`${districtPageSlug(d.id)}-od`) && (
                                                <Link href={`/district/${districtPageSlug(d.id)}-od`} lang="or" className="relative z-10 font-odia text-laterite-600 hover:underline">ଓଡ଼ିଆ</Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
