import Link from "next/link";
import Icon from "@/components/Icon";
import { ChariotWheel } from "@/components/Motifs";

export default function NotFound() {
    return (
        <section className="relative overflow-hidden bg-sand-100">
            <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
            <ChariotWheel className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-laterite-500/10" />
            <div className="container-page relative py-24 text-center">
                <p className="eyebrow justify-center">Error 404</p>
                <h1 className="mt-4 font-display text-5xl font-semibold">This page wandered off the map</h1>
                <p lang="or" className="mt-3 font-odia-serif text-2xl text-laterite-600">ପୃଷ୍ଠାଟି ମିଳିଲା ନାହିଁ</p>
                <p className="mx-auto mt-5 max-w-lg text-ink-600">The link may be old or mistyped. Try a search, or start from one of these.</p>
                <form action="/search" method="get" role="search" className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-full border border-sand-300 bg-white p-2 pl-5">
                    <Icon name="search" className="h-5 w-5 text-laterite-500" />
                    <input name="q" type="search" aria-label="Search" placeholder="Search Odiapedia" className="min-w-0 flex-1 bg-transparent py-2 outline-none" />
                    <button className="btn-primary">Search</button>
                </form>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {[["/", "Home"], ["/culture", "Culture"], ["/history", "History"], ["/travel", "Travel"], ["/calendar", "Calendar"], ["/districts", "Districts"]].map(([h, l]) => (
                        <Link key={h} href={h} className="chip !bg-white !px-4 !py-2 !text-sm hover:border-laterite-300">{l}</Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
