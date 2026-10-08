import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { festivalYears, festivalsInYear, longDate, monthName, STATUS_LABEL } from "@/data/festival-dates";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ year: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
    return festivalYears().map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { year } = await params;
    const list = festivalsInYear(+year);
    return {
        title: `Odisha Festival Calendar ${year}: Odia Festival Dates`,
        description: `Dates of ${list.length} Odia festivals in ${year} — ${list.slice(0, 4).map((f) => f.name.split(" ·")[0]).join(", ")} and more — with the source for every date.`,
        alternates: { canonical: `/festivals/${year}` },
    };
}

export default async function FestivalYearPage({ params }: Props) {
    const { year } = await params;
    const list = festivalsInYear(+year);
    if (!list.length) notFound();
    const years = festivalYears();
    const months = [...new Set(list.map((f) => +f.start.slice(5, 7)))];
    const sources = [...new Set(list.map((f) => f.source))];

    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    name: `Odisha festival calendar ${year}`,
                    itemListElement: list.map((f, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        item: {
                            "@type": "Event",
                            name: `${f.name.split(" ·")[0]} ${year}`,
                            alternateName: f.odia,
                            startDate: f.start,
                            ...(f.end ? { endDate: f.end } : {}),
                            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                            location: { "@type": "Place", name: "Odisha", address: { "@type": "PostalAddress", addressRegion: "Odisha", addressCountry: "IN" } },
                            ...(f.href ? { url: `${SITE.url}${f.href}` } : {}),
                        },
                    })),
                }}
            />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "Calendar", href: "/calendar" }, { name: `Festivals ${year}`, href: `/festivals/${year}` }]} />
                    <p className="eyebrow mt-6"><Icon name="calendar" className="h-4 w-4" />Odia festival calendar</p>
                    <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Odisha festivals {year}</h1>
                    <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">ଓଡ଼ିଶାର ପର୍ବପର୍ବାଣି {year}</p>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        Dates of {list.length} Odia festivals and holy days in {year}. Each date is marked confirmed (official holiday list or published panjika for Odisha), reported (news or a local notice) or usual schedule (not yet announced), and links to its source where one is online. Lunar dates can differ by a day between panjikas; check locally for temple timings.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(`webcal://${SITE.url.replace(/^https?:\/\//, "")}/festivals.ics`)}`} target="_blank" rel="noopener noreferrer" className="btn-primary"><Icon name="calendar" className="h-4 w-4" />Add to Google Calendar</a>
                        <a href={`webcal://${SITE.url.replace(/^https?:\/\//, "")}/festivals.ics`} className="btn-ghost"><Icon name="calendar" className="h-4 w-4" />Apple / Outlook calendar</a>
                        {years.filter((y) => y !== +year).map((y) => <Link key={y} href={`/festivals/${y}`} className="btn-ghost">Festivals {y}</Link>)}
                    </div>
                </div>
            </header>

            <div className="container-page py-10">
                {months.map((m) => (
                    <section key={m} className="mb-10" aria-labelledby={`m${m}`}>
                        <h2 id={`m${m}`} className="font-display text-2xl font-semibold">{monthName(m)} {year}</h2>
                        <ul className="mt-4 divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
                            {list.filter((f) => +f.start.slice(5, 7) === m).map((f) => (
                                <li key={f.name + f.start} className="grid gap-1 px-5 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                                    <p className="font-semibold text-ink-900">
                                        <time dateTime={f.start}>{longDate(f.start)}</time>
                                        {f.end && <span className="block text-sm font-normal text-ink-600">to {longDate(f.end)}</span>}
                                    </p>
                                    <div>
                                        <p className="font-display text-lg font-semibold">
                                            {f.href ? <Link href={f.href} className="text-laterite-700 hover:underline">{f.name}</Link> : f.name}
                                            <span lang="or" className="ml-2 font-odia text-base font-normal text-ink-600">{f.odia}</span>
                                        </p>
                                        {f.note && <p className="text-sm text-ink-600">{f.note}</p>}
                                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
                                            {f.status && <span className={`rounded-full px-2 py-0.5 font-semibold ${f.status === "confirmed" || f.status === "fixed" ? "bg-sand-100 text-chilika-700" : "bg-saffron-100 text-ink-700"}`}>{STATUS_LABEL[f.status]}</span>}
                                            <span>Source: {f.url ? <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-laterite-600">{f.source}</a> : f.source}</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
                <p className="max-w-3xl text-sm text-ink-600">
                    Sources: {sources.join("; ")}. Dates for the Bhubaneswar time zone and sunrise. Missing a festival (Nuakhai, Prathamastami and Manabasa Gurubara are fixed locally each year)? Its date is added once an official or temple announcement is published. See today&apos;s tithi on the <Link href="/calendar" className="text-laterite-600 hover:underline">Odia calendar</Link>.
                </p>
            </div>
        </div>
    );
}
