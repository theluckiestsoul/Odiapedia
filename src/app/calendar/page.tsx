import Link from "next/link";
import PageHero from "@/components/PageHero";
import CalendarToday from "@/components/CalendarToday";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { odiaMonths, nakshatras, varas } from "@/lib/panchanga";
import { festivalYears, upcomingFestivals } from "@/data/festival-dates";
import { hubMetadata } from "@/lib/seo";
import { formatDate, SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Odia Calendar 2026 – Today's Panjika, Tithi & Festival Dates",
    description:
        "Today's Odia panjika for Bhubaneswar and other Odisha cities — tithi, nakshatra, yoga, karana, Odia month and sunrise — plus upcoming Odisha festival dates and the 12 Odia months explained.",
    path: "/calendar",
    keywords: ["odia calendar", "odia calendar 2026", "odia panjika", "odia panji 2026", "today tithi odisha", "odia festival list 2026", "odisha festival dates 2027", "panjika today"],
});

// Festival data for each month
const monthFestivals = [
    // Baisakha
    [
        { name: "ପଣା ସଂକ୍ରାନ୍ତି", transliteration: "Pana Sankranti", description: "Odia New Year (Maha Vishuva Sankranti); Hanuman worship, Danda Nacha concludes" },
        { name: "ଅକ୍ଷୟ ତୃତୀୟା", transliteration: "Akshaya Tritiya", description: "Chandan Yatra begins" },
    ],
    // Jyestha
    [
        { name: "ସାବିତ୍ରୀ ଅମାବାସ୍ୟା", transliteration: "Savitri Amavasya", description: "Married women's fast" },
        { name: "ସୀତଳ ଷଷ୍ଠୀ", transliteration: "Sitala Sasthi", description: "Lord Shiva-Maa Parvati marriage" },
    ],
    // Asadha
    [
        { name: "ରଥଯାତ୍ରା", transliteration: "Rath Yatra", description: "Lord Jagannath's chariot festival" },
        { name: "ବାହୁଡ଼ା ଯାତ୍ରା", transliteration: "Bahuda Yatra", description: "Return journey" },
        { name: "ସୁନାବେଶ", transliteration: "Suna Besha", description: "Golden attire of deities" },
    ],
    // Shravana
    [
        { name: "ଗମ୍ଭା ପୂର୍ଣ୍ଣିମା", transliteration: "Gamha Purnima", description: "Rakhi Purnima" },
            ],
    // Bhadrava
    [
        { name: "ଜନ୍ମାଷ୍ଟମୀ", transliteration: "Janmashtami", description: "Birth of Lord Krishna" },
        { name: "ଗଣେଶ ଚତୁର୍ଥୀ", transliteration: "Ganesh Chaturthi", description: "Worship of Lord Ganesha" },
        { name: "ନୁଆଖାଇ", transliteration: "Nuakhai", description: "Harvest festival of Western Odisha" },
    ],
    // Ashwina
    [
        { name: "ଦୁର୍ଗା ପୂଜା", transliteration: "Durga Puja", description: "Worship of Goddess Durga" },
        { name: "କୁମାର ପୂର୍ଣ୍ଣିମା", transliteration: "Kumar Purnima", description: "Festival for unmarried girls" },
    ],
    // Kartika
    [
        { name: "ଦୀପାବଳୀ", transliteration: "Deepavali", description: "Festival of lights" },
        { name: "ବୋଇତା ବନ୍ଦାଣ", transliteration: "Boita Bandana", description: "Maritime heritage celebration" },
        { name: "କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା", transliteration: "Kartik Purnima", description: "Bali Yatra begins" },
    ],
    // Margashira
    [
        { name: "ମାଣବସା ଗୁରୁବାର", transliteration: "Manabasa Gurubara", description: "Lakshmi Puja on Thursdays" },
        { name: "ପ୍ରଥମଷ୍ଟମୀ", transliteration: "Prathamastami", description: "For firstborn children" },
    ],
    // Pausha
    [
        { name: "ଧନୁ ସଂକ୍ରାନ୍ତି", transliteration: "Dhanu Sankranti", description: "Sun enters Dhanu; the month of Pausha begins" },
        { name: "ପୌଷ ପୂର୍ଣ୍ଣିମା", transliteration: "Pausha Purnima", description: "Holy full moon" },
    ],
    // Magha
    [
        { name: "ମକର ସଂକ୍ରାନ୍ତି", transliteration: "Makar Sankranti", description: "Sun enters Makara; the month of Magha begins" },
        { name: "ବସନ୍ତ ପଞ୍ଚମୀ", transliteration: "Basanta Panchami", description: "Saraswati Puja" },
        { name: "ମାଘ ପୂର୍ଣ୍ଣିମା", transliteration: "Magha Purnima", description: "Holy bath at confluence" },
    ],
    // Phalguna
    [
        { name: "ମହାଶିବରାତ୍ରି", transliteration: "Maha Shivaratri", description: "Night of Lord Shiva" },
        { name: "ଦୋଳ ପୂର୍ଣ୍ଣିମା", transliteration: "Dola Purnima", description: "Dola Yatra of Radha-Krishna; Holi is celebrated the next day" },
    ],
    // Chaitra
    [
        { name: "ରାମ ନବମୀ", transliteration: "Rama Navami", description: "Birth of Lord Rama" },
        { name: "ଦଣ୍ଡ ନାଚ", transliteration: "Danda Nacha", description: "Penitential dance-ritual, mainly in Ganjam, through the month" },
    ],
];


const FAQ = [
    { q: "Is the Odia calendar solar or lunar?", a: "Both. Odia months are solar: each begins at a sankranti, when the Sun enters a new zodiac sign, so Baisakha begins with Pana Sankranti in mid-April. Tithis and many festivals follow the Moon, which is why festival dates move from year to year." },
    { q: "When is the Odia New Year?", a: "The Odia New Year is Pana Sankranti (Maha Vishuva Sankranti), the first day of Baisakha, which usually falls on 14 April." },
    { q: "Which panjika should I follow?", a: "Families and temples in Odisha traditionally follow either the Jagannath or the Biraja panjika. Odiapedia's values are astronomical calculations for reference; for rituals, follow the printed panjika your temple or family uses." },
    { q: "Why can tithi times differ between calendars?", a: "Calendars may use different astronomical models, ayanamsa values, locations or sunrise conventions. Differences are usually a few minutes, but they can change which tithi prevails at sunrise." },
];

export default function CalendarPage() {
    const year = upcomingFestivals(12);
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
            <PageHero
                title="Odia Calendar & Panjika"
                odia="ଓଡ଼ିଆ ପଞ୍ଜିକା"
                description="Today's tithi, nakshatra, yoga, karana and Odia month — calculated live for Odisha — with the festival dates of the year and a guide to the twelve Odia months."
                icon="calendar"
                eyebrow="Live panchanga"
                crumbs={[{ name: "Calendar", href: "/calendar" }]}
            />

            <section className="container-page -mt-2 py-12">
                <CalendarToday />
            </section>

            <section className="container-page py-10">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                    <div>
                        <p className="eyebrow">Festival dates</p>
                        <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Coming up: Odisha festival dates</h2>
                    </div>
                    <p className="max-w-md text-sm text-ink-600">Only dates confirmed by an official holiday list or a reliable panchang are listed. Source shown for each.</p>
                </div>
                <div className="table-wrap mt-6 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-sand-100 text-ink-900">
                            <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Festival</th><th className="px-4 py-3">Source</th></tr>
                        </thead>
                        <tbody>
                            {year.map((f) => (
                                <tr key={f.name + f.start} className="border-t border-sand-200 align-top">
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-900"><time dateTime={f.start}>{formatDate(f.start)}</time>{f.end ? <> – <time dateTime={f.end}>{formatDate(f.end)}</time></> : null}</td>
                                    <td className="px-4 py-3">
                                        {f.href ? <Link href={f.href} className="font-semibold text-laterite-600 hover:underline">{f.name}</Link> : <span className="font-semibold">{f.name}</span>}
                                        <span lang="or" className="ml-2 font-odia text-ink-500">{f.odia}</span>
                                        {f.note && <span className="block text-xs text-ink-500">{f.note}</span>}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-ink-500">{f.source}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 flex flex-wrap gap-3 text-sm">
                    {festivalYears().map((y) => <Link key={y} href={`/festivals/${y}`} className="chip !bg-white !px-3.5 !py-1.5 hover:border-laterite-300">All festivals {y}</Link>)}
                    <a href="/festivals.ics" className="chip !bg-white !px-3.5 !py-1.5 hover:border-laterite-300">Subscribe (iCal)</a>
                </p>
            </section>

            <section className="bg-sand-100 py-14">
                <div className="container-page">
                    <p className="eyebrow">ବାରମାସ · The twelve months</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">The Odia months and their festivals</h2>
                    <p className="mt-3 max-w-3xl text-ink-600">Odia months are solar: each begins at a sankranti, when the Sun enters a new rashi. Baisakha begins with Pana Sankranti (the Odia New Year) in mid-April. Festivals are fixed by tithi and named for their lunar month, so their Gregorian dates shift every year and can fall at the edge of the neighbouring solar month.</p>
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {odiaMonths.map((month, index) => (
                            <div key={month.english} className="card p-6">
                                <div className="flex items-start justify-between border-b border-sand-200 pb-4">
                                    <div>
                                        <span className="text-xs font-semibold text-laterite-500">Month {index + 1}</span>
                                        <h3 lang="or" className="mt-1 font-odia-serif text-2xl text-ink-900">{month.odia}</h3>
                                        <p className="text-sm font-medium text-ink-600">{month.english}</p>
                                    </div>
                                    <span className="chip">{month.gregorian}</span>
                                </div>
                                <ul className="mt-4 space-y-3">
                                    {monthFestivals[index].map((f) => (
                                        <li key={f.transliteration}>
                                            <p className="text-sm font-semibold text-ink-900">{f.transliteration} <span lang="or" className="font-odia font-normal text-ink-500">{f.name}</span></p>
                                            <p className="text-xs text-ink-500">{f.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container-page grid gap-10 py-14 lg:grid-cols-2">
                <div>
                    <h2 className="font-display text-3xl font-semibold">The 27 nakshatras <span lang="or" className="font-odia text-xl text-laterite-600">ନକ୍ଷତ୍ର</span></h2>
                    <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {nakshatras.map((n, i) => (
                            <li key={n.english} className="rounded-xl border border-sand-200 bg-white px-3 py-2">
                                <span className="text-xs text-ink-400">{i + 1}</span>
                                <p lang="or" className="font-odia text-ink-900">{n.odia}</p>
                                <p className="text-xs text-ink-500">{n.english}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h2 className="font-display text-3xl font-semibold">Days of the week <span lang="or" className="font-odia text-xl text-laterite-600">ବାର</span></h2>
                    <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {varas.map((v) => (
                            <li key={v.english} className="rounded-xl border border-sand-200 bg-white px-3 py-3 text-center">
                                <p lang="or" className="font-odia text-ink-900">{v.odia}</p>
                                <p className="text-xs text-ink-500">{v.english}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10 rounded-2xl border border-sand-200 bg-white p-6">
                        <h2 className="font-display text-2xl font-semibold">Traditional panjikas</h2>
                        <p className="mt-2 text-sm text-ink-600">Browse month-by-month overviews of the two panjika traditions used in Odisha.</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link href="/panjika/jagannath" className="btn-ghost">Jagannath Panjika</Link>
                            <Link href="/panjika/biraja" className="btn-ghost">Biraja Panjika</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container-page pb-16">
                <h2 className="font-display text-3xl font-semibold">Frequently asked questions</h2>
                <div className="mt-6 max-w-3xl divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                    {FAQ.map((f, i) => (
                        <details key={f.q} className="group p-5" open={i === 0}>
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-900">
                                {f.q}
                                <Icon name="chevron" className="h-5 w-5 shrink-0 text-laterite-500 transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="mt-3 text-ink-700">{f.a}</p>
                        </details>
                    ))}
                </div>
                <p className="mt-6 text-sm text-ink-500">Related: <Link href="/culture" className="text-laterite-600 underline">Odisha festivals</Link> · <Link href="/panjika" className="text-laterite-600 underline">About the Odia panjika</Link> · {SITE.name} calendar values are for reference.</p>
            </section>
        </div>
    );
}
