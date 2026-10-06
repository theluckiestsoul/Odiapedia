import Link from "next/link";
import CategoryHub from "@/components/CategoryHub";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odisha Travel Guide: Places to Visit, Itineraries & Tips",
    description:
        "Plan a trip to Odisha: destination guides for Puri, Konark, Bhubaneswar, Chilika, Similipal and Koraput, 3/5/7-day itineraries, the best time to visit, how to reach, temple rules and park seasons.",
    path: "/travel",
    keywords: ["odisha tourism", "odisha travel guide", "places to visit in odisha", "odisha itinerary", "odisha tour plan", "best time to visit odisha", "puri konark bhubaneswar trip", "odisha tourist places"],
});

export default function TravelHub() {
    return (
        <CategoryHub
            category="travel"
            title="Travel in Odisha"
            odia="ଓଡ଼ିଶା ଭ୍ରମଣ"
            description="Practical, sourced guides to Odisha's temples, beaches, lagoon, forests and tribal highlands — with the seasons, closures and rules that matter."
            image="/images/golden-triangle.png"
            heroChildren={
                <div className="flex flex-wrap gap-3">
                    <Link href="/travel/plan" className="btn-primary"><Icon name="suitcase" className="h-4 w-4" />Get a free custom itinerary</Link>
                    <Link href="/travel/best-time-to-visit-odisha" className="btn-ghost">Best time to visit</Link>
                </div>
            }
            groups={[
                { title: "Ready-made itineraries", description: "Day-by-day plans you can adapt.", slugs: ["odisha-3-day-itinerary", "odisha-5-day-itinerary", "odisha-7-day-itinerary", "odisha-buddhist-trail-itinerary", "koraput-tribal-heritage-itinerary"] },
                { title: "Plan your trip", slugs: ["best-time-to-visit-odisha", "how-to-reach-odisha"] },
                { title: "Temples, beaches & coast", slugs: ["puri", "konark", "gopalpur-on-sea", "chandipur"] },
                { title: "Cities", slugs: ["bhubaneswar", "cuttack"] },
                { title: "Lakes, forests & wildlife", slugs: ["chilika-lake-travel-guide", "simlipal-national-park", "bhitarkanika-national-park", "satkosia", "hirakud-dam", "daringbadi"] },
                { title: "Heritage, crafts & highlands", slugs: ["raghurajpur", "diamond-triangle-ratnagiri-udayagiri-lalitgiri", "koraput"] },
            ]}
            after={
                <section className="container-page pb-20">
                    <div className="grid gap-6 rounded-3xl border border-sand-200 bg-white p-8 md:grid-cols-3 md:p-10">
                        {[
                            { i: "shield" as const, t: "Vetted partners only", d: "We pass requests only to registered operators with transparent pricing and refund policies." },
                            { i: "check" as const, t: "Your consent first", d: "Your details are shared only if you tick the consent box — and only what's needed." },
                            { i: "handshake" as const, t: "Independent guides", d: "Partners never pay to change what our destination guides say." },
                        ].map((x) => (
                            <div key={x.t}>
                                <Icon name={x.i} className="h-7 w-7 text-laterite-600" />
                                <p className="mt-3 font-display text-xl font-semibold">{x.t}</p>
                                <p className="mt-1 text-sm text-ink-600">{x.d}</p>
                            </div>
                        ))}
                    </div>
                </section>
            }
        />
    );
}
