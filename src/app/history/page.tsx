import Link from "next/link";
import CategoryHub from "@/components/CategoryHub";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "History of Odisha: Kalinga to Modern Odisha",
    description:
        "Odisha's history explained with sources — ancient Kalinga and the Kalinga War, Kharavela, the Eastern Gangas who built Konark, the Paika Rebellion, maritime trade and the making of modern Odisha.",
    path: "/history",
    keywords: ["history of odisha", "odisha history", "kalinga history", "kalinga war", "kharavela", "eastern ganga dynasty", "odisha facts"],
});

export default function HistoryPage() {
    return (
        <CategoryHub
            category="history"
            title="History of Odisha"
            odia="ଓଡ଼ିଶାର ଇତିହାସ"
            description="From the Kalinga that Ashoka fought, through Kharavela and the temple-building dynasties, to the Paika Rebellion and the creation of Odisha on 1 April 1936."
            heroChildren={
                <div className="flex flex-wrap gap-3">
                    <Link href="/history/timeline" className="btn-primary"><Icon name="hourglass" className="h-4 w-4" />Open the interactive timeline</Link>
                    <Link href="/history/odisha-at-a-glance" className="btn-ghost">Odisha at a glance</Link>
                </div>
            }
            groups={[
                { title: "Overview", slugs: ["odisha-at-a-glance", "odisha-history-brief"] },
                { title: "Ancient & medieval", slugs: ["kalinga-war-en", "kharavela", "udayagiri-khandagiri", "odisha-maritime-history", "eastern-ganga-dynasty"] },
                { title: "Temples & sacred heritage", slugs: ["jagannath-temple", "konark-sun-temple", "lingaraj-temple", "nabakalebara"] },
                { title: "Colonial & modern era", slugs: ["paika-rebellion", "sambalpur-history"] },
                { title: "Landscape", slugs: ["chilika-lake"] },
            ]}
        />
    );
}
