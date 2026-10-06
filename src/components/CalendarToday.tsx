"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getPanchanga, odiaMonths, type PanchangaData } from "@/lib/panchanga";

const CITIES = [
    { name: "Bhubaneswar", latitude: 20.2961, longitude: 85.8245 },
    { name: "Puri", latitude: 19.8135, longitude: 85.8312 },
    { name: "Cuttack", latitude: 20.4625, longitude: 85.883 },
    { name: "Sambalpur", latitude: 21.4669, longitude: 83.9812 },
    { name: "Berhampur", latitude: 19.3149, longitude: 84.7941 },
    { name: "Koraput", latitude: 18.8135, longitude: 82.7123 },
    { name: "Balasore", latitude: 21.4942, longitude: 86.9317 },
];

const toOdiaDigits = (n: number | string) => String(n).replace(/[0-9]/g, (d) => "୦୧୨୩୪୫୬୭୮୯"[Number(d)]);

function isoToday(): string {
    const now = new Date();
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, "0")}-${String(ist.getDate()).padStart(2, "0")}`;
}

/** Interactive panchanga: computed in the browser (never stale), for any date and several Odisha cities. */
export default function CalendarToday() {
    const [date, setDate] = useState<string>("");
    const [city, setCity] = useState(0);
    const [p, setP] = useState<PanchangaData | null>(null);

    useEffect(() => {
        setDate(isoToday());
    }, []);

    useEffect(() => {
        if (!date) return;
        const [y, m, d] = date.split("-").map(Number);
        // noon IST of the chosen day
        const when = new Date(Date.UTC(y, m - 1, d, 6, 30));
        setP(getPanchanga(when, { ...CITIES[city] }));
    }, [date, city]);

    const label = date
        ? new Date(date + "T12:00:00+05:30").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })
        : "";
    const isToday = date === (typeof window === "undefined" ? "" : isoToday());

    const cells: { k: string; od: string; v?: string; sub?: string }[] = p
        ? [
            { k: "Tithi", od: "ତିଥି", v: `${p.tithiEnglish}`, sub: `${p.paksha === "shukla" ? "Shukla (waxing)" : "Krishna (waning)"}${p.tithiEndsAt ? ` · till ${p.tithiEndsAt}` : ""}` },
            { k: "Nakshatra", od: "ନକ୍ଷତ୍ର", v: p.nakshatraEnglish, sub: p.nakshatraEndsAt ? `till ${p.nakshatraEndsAt}` : undefined },
            { k: "Yoga", od: "ଯୋଗ", v: p.yoga },
            { k: "Karana", od: "କରଣ", v: p.karana },
            { k: "Sunrise", od: "ସୂର୍ଯ୍ୟୋଦୟ", v: p.sunrise },
            { k: "Sunset", od: "ସୂର୍ଯ୍ୟାସ୍ତ", v: p.sunset },
        ]
        : [];

    return (
        <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-xl shadow-laterite-900/5">
            <div className="relative bg-ink-900 p-6 text-white md:p-8">
                <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="eyebrow !text-saffron-300"><Icon name="sun" className="h-4 w-4" />{isToday ? "Today's panjika" : "Panjika for"}</p>
                        <p className="mt-2 text-sand-200/80" suppressHydrationWarning>{label || " "}</p>
                        {p ? (
                            <>
                                <p lang="or" className="mt-2 font-odia-serif text-4xl md:text-5xl">{p.vara}</p>
                                <p lang="or" className="mt-2 font-odia text-xl text-saffron-200">
                                    {p.odiaMonth} {p.odiaDay ? toOdiaDigits(p.odiaDay) : ""} · ଶକାବ୍ଦ {toOdiaDigits(p.sakaYear)}
                                </p>
                                <p className="mt-1 text-sm text-sand-200/80">{odiaMonths[p.odiaMonthIndex].english}{p.odiaDay ? ` ${p.odiaDay}` : ""} · Saka {p.sakaYear} · {p.varaEnglish}</p>
                            </>
                        ) : (
                            <div className="mt-3 h-24 w-72 animate-pulse rounded-xl bg-white/10" />
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <label className="text-sm">
                            <span className="mb-1 block text-sand-200/70">Date</span>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white [color-scheme:dark]" />
                        </label>
                        <label className="text-sm">
                            <span className="mb-1 block text-sand-200/70">City</span>
                            <select value={city} onChange={(e) => setCity(Number(e.target.value))} className="rounded-xl border border-white/20 bg-ink-800 px-3 py-2 text-white">
                                {CITIES.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
                            </select>
                        </label>
                        {!isToday && date && (
                            <button type="button" onClick={() => setDate(isoToday())} className="self-end rounded-xl border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Today</button>
                        )}
                    </div>
                </div>
            </div>
            <dl className="grid grid-cols-2 divide-sand-200 md:grid-cols-3">
                {p
                    ? cells.map((c) => (
                        <div key={c.k} className="border-b border-r border-sand-200 p-5">
                            <dt className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                                {c.k} <span lang="or" className="font-odia normal-case tracking-normal text-laterite-500">{c.od}</span>
                            </dt>
                            <dd className="mt-1 font-display text-xl font-semibold text-ink-900">{c.v}</dd>
                            {c.sub && <dd className="text-xs text-ink-500">{c.sub}</dd>}
                        </div>
                    ))
                    : Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 animate-pulse border-b border-r border-sand-200 bg-sand-50" />)}
            </dl>
            <p className="px-5 py-3 text-xs text-ink-500">
                Values are calculated astronomically (Lahiri ayanamsa; tithi, nakshatra, yoga and karana at local sunrise; sunrise to the upper limb with refraction). Printed panjikas may differ by a few minutes — follow your temple&apos;s panjika for rituals.
            </p>
        </div>
    );
}
