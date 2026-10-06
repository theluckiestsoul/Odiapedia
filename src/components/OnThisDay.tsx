"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { ERA_COLOURS, ERAS, TIMELINE, type HistoryEvent } from "@/data/odisha-timeline";

/* eslint-disable @next/next/no-img-element -- Wikimedia Commons images are hot-linked with attribution */

const yearOf = (e: HistoryEvent) => Number(e.year.match(/\d{4}/)?.[0] ?? NaN);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function pick(now: Date) {
    const md = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const dated = TIMELINE.filter((e) => e.date);
    const today = dated.filter((e) => e.date === md);
    // Next dated anniversary after today (wrapping round the year)
    const upcoming = [...dated].sort((a, b) => a.date!.localeCompare(b.date!));
    const next = upcoming.find((e) => e.date! > md) ?? upcoming[0];
    // A featured moment that changes daily, preferring events with a photograph
    const withImg = TIMELINE.filter((e) => e.image);
    const dayIndex = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const featured = withImg[dayIndex % withImg.length];
    return { today, next, featured };
}

export default function OnThisDay() {
    const [state, setState] = useState<ReturnType<typeof pick> | null>(null);
    useEffect(() => { setState(pick(new Date())); }, []);
    if (!state) return <div className="h-72 animate-pulse rounded-3xl bg-sand-100" aria-hidden />;

    const { today, next, featured } = state;
    const main = today[0] ?? featured;
    const era = ERAS.find((e) => e.id === main.era);
    const now = new Date();
    const yearsAgo = today[0] ? now.getFullYear() - yearOf(today[0]) : null;
    const nextDate = next?.date ? `${Number(next.date.slice(3))} ${MONTHS[Number(next.date.slice(0, 2)) - 1]}` : "";

    return (
        <div className="grid overflow-hidden rounded-3xl border border-sand-200 bg-white md:grid-cols-[1.1fr_1fr]">
            {main.image && (
                <div className="relative min-h-56 bg-ink-950">
                    <img src={main.image.src} alt={main.image.alt} loading="lazy" className={`absolute inset-0 h-full w-full ${main.image.fit === "contain" ? "object-contain p-3" : "object-cover"} ${main.image.pos === "top" ? "object-top" : ""}`} />
                    <a href={main.image.page} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-3 text-[10px] text-white/80 drop-shadow hover:underline">
                        {main.image.credit} · {main.image.licence}
                    </a>
                </div>
            )}
            <div className="flex flex-col p-6 md:p-8">
                <p className="eyebrow" style={{ color: ERA_COLOURS[main.era] }}>
                    <Icon name="hourglass" className="h-4 w-4" />
                    {today[0] ? `On this day · ${yearsAgo} years ago` : "From the timeline"}
                </p>
                <p className="mt-3 text-sm font-semibold text-ink-500">{main.year}{era ? ` · ${era.name} era` : ""}</p>
                <h3 className="mt-1 font-display text-3xl font-semibold leading-tight text-ink-900">{main.title}</h3>
                {main.titleOdia && <p lang="or" className="font-odia text-lg text-laterite-600">{main.titleOdia}</p>}
                <p className="mt-3 line-clamp-4 leading-relaxed text-ink-700">{main.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                    <Link href={`/history/timeline#${main.id}`} className="btn-primary">See it on the timeline <Icon name="arrow" className="h-4 w-4" /></Link>
                    {main.links?.[0] && <Link href={main.links[0].href} className="btn-ghost">{main.links[0].label}</Link>}
                </div>
                {next && next.id !== main.id && (
                    <p className="mt-auto pt-6 text-sm text-ink-600">
                        <span className="font-semibold text-ink-900">Coming up, {nextDate}:</span>{" "}
                        <Link href={`/history/timeline#${next.id}`} className="text-laterite-600 hover:underline">{next.title}</Link> ({yearOf(next)})
                    </p>
                )}
            </div>
        </div>
    );
}
