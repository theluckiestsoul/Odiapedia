import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import HistoryTimeline from "@/components/history/HistoryTimeline";
import { CINEMA_COLOURS, CINEMA_ERAS, CINEMA_TIMELINE } from "@/data/cinema-timeline";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Timeline of Odia Cinema (Ollywood) – 1936 to Today",
    description: "An interactive timeline of Odia cinema: from Sita Bibaha (1936) and Sri Lokanath's National Award to Maya Miriga at Cannes, Sala Budha and Daman.",
    path: "/culture/cinema/timeline",
    keywords: ["odia cinema history", "ollywood timeline", "first odia film", "sita bibaha", "odia film history", "ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର"],
});

export default function CinemaTimelinePage() {
    return (
        <div>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "ItemList", name: "Timeline of Odia cinema", url: `${SITE.url}/culture/cinema/timeline`,
                itemListElement: CINEMA_TIMELINE.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/culture/cinema/timeline#${e.id}`, name: `${e.year}: ${e.title}`, description: e.description })),
            }} />
            <PageHero
                title="Timeline of Odia cinema"
                odia="ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ରର ଯାତ୍ରା"
                description="From the first Odia film, Sita Bibaha, in 1936 to the pan-Indian success of Daman — the milestones of Ollywood, era by era."
                icon="star"
                eyebrow="Culture · Cinema"
                variant="dark"
                crumbs={[{ name: "Culture", href: "/culture" }, { name: "Cinema timeline", href: "/culture/cinema/timeline" }]}
            >
                <div className="flex flex-wrap gap-2">
                    <Link href="/culture/cinema/reviews" className="btn-primary">Film reviews</Link>
                    <Link href="/history/timeline" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">History timeline</Link>
                </div>
            </PageHero>
            <HistoryTimeline events={CINEMA_TIMELINE} eras={CINEMA_ERAS} colours={CINEMA_COLOURS} noun="milestones" />
        </div>
    );
}
