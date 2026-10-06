"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { getPanchanga, odiaMonths, type PanchangaData } from "@/lib/panchanga";
import { upcomingFestivals, daysUntil, type FestivalDate } from "@/data/festival-dates";
import { formatDate } from "@/lib/site";

const toOdiaDigits = (n: number | string) => String(n).replace(/[0-9]/g, (d) => "୦୧୨୩୪୫୬୭୮୯"[Number(d)]);

/**
 * Live "Today in Odisha" panel. Computed in the visitor's browser so it is never stale
 * (the server render only shows a neutral placeholder).
 */
export default function TodayInOdisha({ variant = "card" }: { variant?: "card" | "compact" }) {
    const [p, setP] = useState<PanchangaData | null>(null);
    const [fest, setFest] = useState<FestivalDate[]>([]);
    const [dateLabel, setDateLabel] = useState("");

    useEffect(() => {
        const now = new Date();
        setP(getPanchanga(now));
        setFest(upcomingFestivals(variant === "compact" ? 3 : 4, now));
        setDateLabel(now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }));
    }, [variant]);

    return (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-7 text-white md:p-8">
                <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
                <div className="relative">
                    <p className="eyebrow !text-saffron-300"><Icon name="sun" className="h-4 w-4" />Today&apos;s panjika · Bhubaneswar</p>
                    <p className="mt-3 text-sm text-sand-200/80" suppressHydrationWarning>{dateLabel || " "}</p>
                    {p ? (
                        <>
                            <p lang="or" className="mt-2 font-odia-serif text-3xl text-white md:text-4xl">
                                {p.vara}, {p.odiaMonth} {p.odiaDay ? toOdiaDigits(p.odiaDay) : ""}
                            </p>
                            <p className="mt-1 text-saffron-200">
                                {p.varaEnglish} · {odiaMonths[p.odiaMonthIndex].english}{p.odiaDay ? ` ${p.odiaDay}` : ""} · Saka {p.sakaYear}
                            </p>
                            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl bg-white/[0.07] p-3.5">
                                    <dt className="text-sand-200/70">Tithi</dt>
                                    <dd className="mt-0.5 font-semibold">{p.tithiEnglish} <span className="font-normal text-sand-200/70">({p.paksha === "shukla" ? "Shukla" : "Krishna"})</span></dd>
                                    {p.tithiEndsAt && <dd className="text-xs text-sand-200/60">till {p.tithiEndsAt}</dd>}
                                </div>
                                <div className="rounded-2xl bg-white/[0.07] p-3.5">
                                    <dt className="text-sand-200/70">Nakshatra</dt>
                                    <dd className="mt-0.5 font-semibold">{p.nakshatraEnglish}</dd>
                                    {p.nakshatraEndsAt && <dd className="text-xs text-sand-200/60">till {p.nakshatraEndsAt}</dd>}
                                </div>
                                <div className="rounded-2xl bg-white/[0.07] p-3.5">
                                    <dt className="text-sand-200/70">Sunrise</dt>
                                    <dd className="mt-0.5 font-semibold">{p.sunrise}</dd>
                                </div>
                                <div className="rounded-2xl bg-white/[0.07] p-3.5">
                                    <dt className="text-sand-200/70">Sunset</dt>
                                    <dd className="mt-0.5 font-semibold">{p.sunset}</dd>
                                </div>
                            </dl>
                        </>
                    ) : (
                        <div className="mt-4 h-48 animate-pulse rounded-2xl bg-white/5" aria-label="Loading today's panjika" />
                    )}
                    <Link href="/calendar" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-saffron-300 hover:text-saffron-200">
                        Full Odia calendar <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="card p-7 md:p-8">
                <p className="eyebrow"><Icon name="calendar" className="h-4 w-4" />Coming up in Odisha</p>
                <ul className="mt-5 divide-y divide-sand-200">
                    {fest.length === 0 && p && (
                        <li className="py-4 text-sm text-ink-600">See the <Link href="/calendar" className="text-laterite-600 underline">festival calendar</Link> for the year ahead.</li>
                    )}
                    {!p && Array.from({ length: 3 }).map((_, i) => <li key={i} className="py-4"><div className="h-10 animate-pulse rounded-lg bg-sand-100" /></li>)}
                    {fest.map((f) => {
                        const d = daysUntil(f.start);
                        const label = d <= 0 ? "Today / ongoing" : d === 1 ? "Tomorrow" : `In ${d} days`;
                        const inner = (
                            <div className="flex items-center gap-4 py-4">
                                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-laterite-50 text-laterite-700">
                                    <span className="text-[10px] font-semibold uppercase">{formatDate(f.start).split(" ")[1]?.slice(0, 3)}</span>
                                    <span className="font-display text-xl font-semibold leading-none">{Number(f.start.slice(8, 10))}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-ink-900">{f.name}</p>
                                    <p lang="or" className="font-odia text-sm text-ink-500">{f.odia}</p>
                                    {f.note && <p className="text-xs text-ink-400">{f.note}</p>}
                                </div>
                                <span className="shrink-0 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-medium text-ink-600">{label}</span>
                            </div>
                        );
                        return <li key={f.name + f.start}>{f.href ? <Link href={f.href} className="block transition-colors hover:text-laterite-700">{inner}</Link> : inner}</li>;
                    })}
                </ul>
            </div>
        </div>
    );
}
