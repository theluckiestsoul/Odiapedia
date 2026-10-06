import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { getLatestUpdates } from "@/lib/updates";
import { hubMetadata } from "@/lib/seo";
import { formatDate, categoryInfo } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Latest Updates",
    description: "Newly published and recently fact-checked Odiapedia articles on Odisha's language, history, culture, food, people and travel.",
    path: "/latest",
});

export default function LatestPage() {
    const updates = getLatestUpdates().slice(0, 120);
    const groups = new Map<string, typeof updates>();
    for (const u of updates) {
        const key = formatDate(u.date).split(" ").slice(1).join(" "); // "October 2026"
        groups.set(key, [...(groups.get(key) || []), u]);
    }
    return (
        <div>
            <PageHero
                title="What's new on Odiapedia"
                odia="ନୂଆ କ'ଣ"
                description="New articles and pages that have been reviewed against sources, newest first."
                icon="sparkle"
                eyebrow="Latest updates"
                crumbs={[{ name: "Latest", href: "/latest" }]}
            />
            <div className="container-page max-w-4xl py-14">
                {[...groups.entries()].map(([month, items]) => (
                    <section key={month} className="mb-12">
                        <h2 className="mb-4 font-display text-2xl font-semibold">{month}</h2>
                        <ul className="divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                            {items.map((u) => {
                                const cat = categoryInfo(u.link.split("/")[1]);
                                return (
                                    <li key={u.id}>
                                        <Link href={u.link} className="group flex items-start gap-4 p-5 transition-colors hover:bg-sand-50">
                                            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-laterite-50 text-laterite-600"><Icon name={cat.icon} className="h-4 w-4" /></span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-2 text-xs">
                                                    <span className={`rounded-full px-2 py-0.5 font-semibold ${u.tag === "New" ? "bg-chilika-500/10 text-chilika-700" : "bg-saffron-100 text-saffron-600"}`}>{u.tag}</span>
                                                    <span className="text-ink-500">{cat.label}</span>
                                                    <time dateTime={u.date} className="text-ink-400">{formatDate(u.date)}</time>
                                                </span>
                                                <span className="mt-1 block font-semibold text-ink-900 group-hover:text-laterite-700">{u.title}</span>
                                                <span className="line-clamp-1 text-sm text-ink-600">{u.description}</span>
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
