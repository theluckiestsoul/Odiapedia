import Link from "next/link";
import DistrictList from "@/components/DistrictList";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { odishaDistricts, districtPageSlug } from "@/data/districts";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "30 Districts of Odisha – List, Map, Headquarters & Facts",
    description: "All 30 districts of Odisha grouped by region, with headquarters, population, area, places, history and food for each — in English and Odia.",
    path: "/districts",
    keywords: ["districts of odisha", "odisha district list", "30 districts of odisha", "odisha district map", "odisha district headquarters"],
});

export default function DistrictsPage() {
    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: "Districts of Odisha",
                    numberOfItems: odishaDistricts.length,
                    itemListElement: [...odishaDistricts].sort((a, b) => a.name_en.localeCompare(b.name_en)).map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.name_en} district`, url: `${SITE.url}/district/${districtPageSlug(d.id)}` })),
                }}
            />
            <PageHero
                title="The 30 districts of Odisha"
                odia="ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲା"
                description="From the Mayurbhanj forests to the Koraput highlands and the deltas of the coast — every district, its headquarters, its heritage and its food."
                icon="pin"
                eyebrow="Places"
                crumbs={[{ name: "Districts", href: "/districts" }]}
            >
                <Link href="/map" className="btn-dark"><Icon name="map" className="h-4 w-4" />Open the interactive map</Link>
            </PageHero>
            <div className="container-page py-14">
                <DistrictList />
            </div>
        </div>
    );
}
