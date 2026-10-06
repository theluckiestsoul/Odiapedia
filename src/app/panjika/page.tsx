import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odia Panjika: Jagannath & Biraja Panjika Explained",
    description: "What an Odia panjika is, the difference between the Jagannath (Puri) and Biraja panjika traditions, and where to see today's tithi, nakshatra and festival dates.",
    path: "/panjika",
    keywords: ["odia panjika", "odia panji", "jagannath panjika", "biraja panjika", "odia calendar 2026", "odia panjika 2026"],
});

export default function PanjikaHub() {
    return (
        <div>
            <PageHero
                title="Odia Panjika"
                odia="ଓଡ଼ିଆ ପାଞ୍ଜି"
                description="The panjika (panji) is the traditional Odia almanac: it lists tithis, nakshatras, auspicious times and festivals for the year. Two traditions are widely used in Odisha."
                icon="calendar"
                eyebrow="Calendar & almanac"
                crumbs={[{ name: "Calendar", href: "/calendar" }, { name: "Panjika", href: "/panjika" }]}
            >
                <Link href="/calendar" className="btn-primary"><Icon name="sun" className="h-4 w-4" />Today&apos;s panjika</Link>
            </PageHero>
            <section className="container-page grid gap-6 py-14 md:grid-cols-2">
                {[
                    { href: "/panjika/jagannath", odia: "ଜଗନ୍ନାଥ ପଞ୍ଜିକା", t: "Jagannath Panjika", d: "The tradition associated with Puri and coastal Odisha. Browse a month-by-month overview of its major festivals.", article: "/culture/jagannath-panjika" },
                    { href: "/panjika/biraja", odia: "ବିରଜା ପଞ୍ଜିକା", t: "Biraja Panjika", d: "The tradition associated with Biraja Kshetra in Jajpur. Browse a month-by-month overview of its major festivals.", article: "/culture/biraja-panjika" },
                ].map((p) => (
                    <div key={p.href} className="card flex flex-col p-7">
                        <p lang="or" className="font-odia-serif text-3xl text-laterite-600">{p.odia}</p>
                        <h2 className="mt-1 font-display text-2xl font-semibold">{p.t}</h2>
                        <p className="mt-3 flex-1 text-ink-600">{p.d}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href={p.href} className="btn-dark">Open the book view</Link>
                            <Link href={p.article} className="btn-ghost">Read about it</Link>
                        </div>
                    </div>
                ))}
            </section>
            <p className="container-page pb-16 text-sm text-ink-500">
                Odiapedia is not a publisher of either panjika. For religious observances, follow the printed panjika your family or temple uses.
            </p>
        </div>
    );
}
