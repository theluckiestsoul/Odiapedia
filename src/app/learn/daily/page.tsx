import PageHero from "@/components/PageHero";
import DailyGame from "@/components/learn/DailyGame";
import { hubMetadata } from "@/lib/seo";
import { ITEMS } from "@/lib/learn/content";

export const metadata = hubMetadata({
    title: "Daily Odia: A 5-Word Odia Quiz Every Day",
    description: "Five Odia words a day, the same for everyone: pick the meaning or the right Odia word, keep your streak and share your score. Free, no sign-up.",
    path: "/learn/daily",
    keywords: ["odia word game", "daily odia quiz", "odia wordle", "learn odia words", "odia vocabulary quiz"],
});

export default function DailyPage() {
    const seen = new Set<string>();
    const words = [...ITEMS.values()]
        .map((x) => x.item)
        .filter((i) => i.kind === "word" && i.en.length <= 32 && !seen.has(i.en.toLowerCase()) && seen.add(i.en.toLowerCase()))
        .map((i) => ({ od: i.od, tr: i.tr, en: i.en }));
    return (
        <div>
            <PageHero title="Daily Odia" odia="ଦୈନିକ ଓଡ଼ିଆ" description={`Five words a day from the Odiapedia course (${words.length} words in the pool). Everyone gets the same five — compare scores with friends.`} icon="pen" eyebrow="Learn Odia" crumbs={[{ name: "Learn Odia", href: "/learn" }, { name: "Daily Odia", href: "/learn/daily" }]} />
            <div className="container-page py-12">
                <DailyGame words={words} />
            </div>
        </div>
    );
}
