import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { ReviewHub } from "@/components/learn/Widgets";

export const metadata: Metadata = {
    title: "Review Your Odia Words",
    description: "Spaced review of the Odia words and phrases you have learned, plus a mistake bank to practise the ones you got wrong.",
    alternates: { canonical: "/learn/review" },
    robots: { index: false, follow: true }, // personal page: content depends on the learner's own progress
};

export default function ReviewPage() {
    return (
        <div>
            <PageHero title="Review" odia="ପୁନରାବୃତ୍ତି" description="Words come back just before you’d forget them. Wrong answers go to your mistake bank until you get them right twice." icon="hourglass" eyebrow="Learn Odia"
                crumbs={[{ name: "Learn Odia", href: "/learn" }, { name: "Review", href: "/learn/review" }]} />
            <div className="container-page py-12"><ReviewHub /></div>
        </div>
    );
}
