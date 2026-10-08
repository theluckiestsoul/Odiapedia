import Link from "next/link";
import PageHero from "@/components/PageHero";
import TripPlannerForm from "@/components/TripPlannerForm";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Plan a Trip to Odisha – Free Custom Itinerary Request",
    description: "Tell us your dates, budget and interests and get a custom Odisha itinerary from a vetted local travel partner. Free, no obligation, shared only with your consent.",
    path: "/travel/plan",
    keywords: ["odisha tour package", "odisha trip planner", "odisha travel agent", "puri tour package", "custom odisha itinerary"],
});

export default function PlanTripPage() {
    return (
        <div>
            <PageHero
                variant="dark"
                title="Plan your Odisha trip"
                odia="ଆପଣଙ୍କ ଓଡ଼ିଶା ଯାତ୍ରା ଯୋଜନା"
                description="Share a few details and receive a tailored itinerary and quote from a vetted Odisha travel partner. It's free and there's no obligation."
                icon="suitcase"
                eyebrow="Free itinerary request"
                crumbs={[{ name: "Travel", href: "/travel" }, { name: "Plan a trip", href: "/travel/plan" }]}
            />
            <div className="container-page grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
                <TripPlannerForm />
                <aside className="space-y-5">
                    <div className="card p-6">
                        <h2 className="font-display text-xl font-semibold">How it works</h2>
                        <ol className="mt-4 space-y-4 text-sm text-ink-700">
                            {[
                                "You tell us what you'd like — dates, pace, interests and budget.",
                                "With your consent, we pass the request to up to two Odisha operators that meet our published partner standards.",
                                "They send you an itinerary and a transparent quote. You decide — no pressure.",
                                "We aim to reply within two working days. Without your consent we reply ourselves and share nothing.",
                            ].map((t, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-laterite-500 text-xs font-bold text-white">{i + 1}</span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="card p-6">
                        <h2 className="font-display text-xl font-semibold">Before you plan</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {[
                                ["/travel/best-time-to-visit-odisha", "Best time to visit Odisha"],
                                ["/travel/how-to-reach-odisha", "How to reach Odisha"],
                                ["/travel/odisha-3-day-itinerary", "Sample 3-day itinerary"],
                                ["/calendar", "Festival dates"],
                            ].map(([h, l]) => (
                                <li key={h}><Link href={h} className="inline-flex items-center gap-2 text-laterite-600 hover:underline"><Icon name="arrow" className="h-3.5 w-3.5" />{l}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <p className="px-1 text-xs leading-relaxed text-ink-500">
                        Odiapedia may receive a referral fee from partners. This never affects our travel guides. Read our <Link href="/about/sponsorship-policy" className="underline">sponsorship policy</Link>.
                    </p>
                </aside>
            </div>
        </div>
    );
}
