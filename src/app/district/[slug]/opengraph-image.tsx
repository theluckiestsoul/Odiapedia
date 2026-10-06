import { OG_SIZE, ogCard } from "@/lib/og";
import { getDistrictById } from "@/data/districts";
import { districtName } from "@/lib/districts";
import { ADMIN_SUMMARY } from "@/lib/admin";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Odisha district guide on Odiapedia";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const base = slug.replace(/-od$/, "");
    const d = getDistrictById(base);
    const name = districtName(base) || d?.name_en || "Odisha";
    const admin = ADMIN_SUMMARY[base];
    return ogCard({
        eyebrow: "District of Odisha",
        title: `${name} district`,
        subtitle: d ? `Headquarters ${d.headquarters}. History, places to visit, culture, food, blocks and villages.` : "History, places to visit, culture, food, blocks and villages.",
        accent: "#138a7e",
        stats: [
            ...(d ? [["Population", d.population.toLocaleString("en-IN")] as [string, string]] : []),
            ...(admin ? [["Blocks", String(admin.blocks)] as [string, string], ["Villages", admin.villages.toLocaleString("en-IN")] as [string, string]] : []),
        ],
    });
}
