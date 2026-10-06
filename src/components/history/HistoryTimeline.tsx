"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { ERAS, ERA_COLOURS, THEMES, type EraInfo, type HistoryEvent, type TimelineImage, type TimelineTheme } from "@/data/odisha-timeline";

/* eslint-disable @next/next/no-img-element -- Wikimedia Commons images are hot-linked with attribution */

function Credit({ img, className = "" }: { img: TimelineImage; className?: string }) {
    return (
        <a href={img.page} target="_blank" rel="noopener noreferrer" className={`hover:underline ${className}`}>
            {img.credit} · {img.licence} · Wikimedia Commons
        </a>
    );
}

function Photo({ img, className = "", onOpen }: { img: TimelineImage; className?: string; onOpen?: () => void }) {
    const contain = img.fit === "contain";
    return (
        <button type="button" onClick={onOpen} className={`group/photo relative block w-full overflow-hidden ${contain ? "bg-ink-950" : "bg-sand-200"} ${className}`} aria-label={`Enlarge image: ${img.alt}`}>
            <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                width={img.w}
                height={img.h}
                className={`h-full w-full transition-transform duration-700 ease-out group-hover/photo:scale-[1.04] ${contain ? "object-contain p-2" : "object-cover"} ${img.pos === "top" ? "object-top" : ""}`}
            />
            <span className="pointer-events-none absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink-950/60 text-white opacity-0 backdrop-blur transition-opacity group-hover/photo:opacity-100">
                <Icon name="search" className="h-4 w-4" />
            </span>
        </button>
    );
}

export default function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
    const [themes, setThemes] = useState<TimelineTheme[]>([]);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState<string>(events[0]?.id);
    const [js, setJs] = useState(false);
    const [seen, setSeen] = useState<Set<string>>(new Set());
    const [hoverEra, setHoverEra] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<{ img: TimelineImage; title: string } | null>(null);
    const [progress, setProgress] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const shown = useMemo(() => {
        const q = query.trim().toLowerCase();
        return events.filter((e) =>
            (themes.length === 0 || e.themes.some((t) => themes.includes(t))) &&
            (!q || `${e.title} ${e.titleOdia ?? ""} ${e.year} ${e.description}`.toLowerCase().includes(q)));
    }, [events, themes, query]);

    const byEra = useMemo(() => ERAS.map((era) => ({ era, items: shown.filter((e) => e.era === era.id) })), [shown]);
    const activeEvent = events.find((e) => e.id === active);
    const activeEra = activeEvent?.era ?? "prehistoric";

    /* scroll spy + reveal */
    useEffect(() => {
        setJs(true);
        const els = Array.from(document.querySelectorAll<HTMLElement>("[data-tl-event]"));
        const io = new IntersectionObserver((entries) => {
            const vis = entries.filter((en) => en.isIntersecting).map((en) => (en.target as HTMLElement).dataset.tlEvent!);
            if (vis.length) setSeen((s) => { const n = new Set(s); vis.forEach((v) => n.add(v)); return n; });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
        els.forEach((el) => io.observe(el));

        const onScroll = () => {
            const mid = window.innerHeight * 0.4;
            let best: string | null = null, bestD = Infinity;
            for (const el of els) {
                if (!el.offsetParent) continue;
                const r = el.getBoundingClientRect();
                const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
                if (d < bestD) { bestD = d; best = el.dataset.tlEvent!; }
            }
            if (best) setActive(best);
            const box = listRef.current?.getBoundingClientRect();
            if (box) setProgress(Math.min(1, Math.max(0, (mid - box.top) / box.height)));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
    }, [shown]);

    const jumpTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        history.replaceState(null, "", `#${id}`);
    }, []);

    const step = useCallback((dir: 1 | -1) => {
        const i = shown.findIndex((e) => e.id === active);
        const next = shown[Math.max(0, Math.min(shown.length - 1, (i < 0 ? 0 : i) + dir))];
        if (next) jumpTo(next.id);
    }, [shown, active, jumpTo]);

    /* keyboard: j/k or arrow keys move between events; Esc closes the lightbox */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;
            if (lightbox) { if (e.key === "Escape") setLightbox(null); return; }
            if (e.key === "j" || e.key === "ArrowDown" && e.altKey) { e.preventDefault(); step(1); }
            if (e.key === "k" || e.key === "ArrowUp" && e.altKey) { e.preventDefault(); step(-1); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [step, lightbox]);

    const toggleTheme = (t: TimelineTheme) => setThemes((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
    const eraCounts = Object.fromEntries(ERAS.map((e) => [e.id, shown.filter((x) => x.era === e.id).length]));
    const hovered = ERAS.find((e) => e.id === hoverEra);

    let globalIndex = 0;

    return (
        <div>
            {/* ---------- Sticky era ribbon ---------- */}
            <div className="sticky top-[4.5rem] z-30 border-b border-sand-200 bg-background/95 backdrop-blur">
                <div className="container-page py-2.5">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1" onMouseLeave={() => setHoverEra(null)}>
                            <div className="flex h-11 overflow-hidden rounded-xl ring-1 ring-sand-200">
                                {ERAS.map((era) => {
                                    const on = era.id === activeEra;
                                    return (
                                        <button
                                            key={era.id}
                                            type="button"
                                            onMouseEnter={() => setHoverEra(era.id)}
                                            onFocus={() => setHoverEra(era.id)}
                                            onBlur={() => setHoverEra(null)}
                                            onClick={() => { const first = shown.find((e) => e.era === era.id); if (first) jumpTo(`era-${era.id}`); }}
                                            className="relative flex min-w-0 flex-1 flex-col items-start justify-center px-2 text-left transition-all sm:px-3"
                                            style={{ background: on ? ERA_COLOURS[era.id] : `${ERA_COLOURS[era.id]}1f`, color: on ? "#fff" : "#1b2946", flexGrow: on ? 1.6 : 1 }}
                                            aria-label={`${era.name} era, ${era.span}`}
                                        >
                                            <span className="truncate text-[11px] font-bold uppercase tracking-wide sm:text-xs">{era.name}</span>
                                            <span className={`hidden truncate text-[11px] sm:block ${on ? "text-white/85" : "text-ink-500"}`}>{era.span}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* overall progress */}
                            <div className="absolute inset-x-0 -bottom-1.5 h-0.5 overflow-hidden rounded-full bg-sand-200">
                                <div className="h-full bg-laterite-500 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
                            </div>
                            {/* era popover */}
                            {hovered && (
                                <div className="absolute left-0 right-0 top-full z-40 mt-3 hidden md:block">
                                    <div className="mx-auto flex max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-sand-200 animate-fade-up">
                                        <img src={hovered.cover.src} alt="" className={`h-auto w-48 shrink-0 ${hovered.cover.fit === "contain" ? "object-contain bg-ink-950" : "object-cover"}`} />
                                        <div className="p-5">
                                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ERA_COLOURS[hovered.id] }}>{hovered.span}</p>
                                            <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{hovered.name} <span className="font-odia text-lg text-ink-500">{hovered.odia}</span></p>
                                            <p className="mt-2 text-sm leading-relaxed text-ink-700">{hovered.summary}</p>
                                            <p className="mt-3 text-xs font-semibold text-ink-500">{eraCounts[hovered.id]} events · click to jump</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="hidden shrink-0 items-center gap-1 sm:flex">
                            <button type="button" onClick={() => step(-1)} aria-label="Previous event" className="grid h-9 w-9 place-items-center rounded-full text-ink-700 ring-1 ring-sand-200 hover:bg-sand-100"><Icon name="chevron" className="h-4 w-4 rotate-180" /></button>
                            <button type="button" onClick={() => step(1)} aria-label="Next event" className="grid h-9 w-9 place-items-center rounded-full text-ink-700 ring-1 ring-sand-200 hover:bg-sand-100"><Icon name="chevron" className="h-4 w-4" /></button>
                        </div>
                    </div>
                    {activeEvent && js && (
                        <p className="mt-2.5 hidden truncate text-sm text-ink-600 md:block" aria-live="polite">
                            <span className="font-semibold" style={{ color: ERA_COLOURS[activeEvent.era] }}>{activeEvent.year}</span>
                            <span className="mx-2 text-ink-300">·</span>
                            <span className="font-medium text-ink-900">{activeEvent.title}</span>
                            <span className="ml-3 text-xs text-ink-400">Press J / K to step through events</span>
                        </p>
                    )}
                </div>
            </div>

            {/* ---------- Filters ---------- */}
            <div className="container-page pt-8">
                <div className="flex flex-col gap-4 rounded-2xl border border-sand-200 bg-white p-4 sm:p-5 lg:flex-row lg:items-center">
                    <div className="scrollbar-none -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0 [&>button]:shrink-0">
                        <button type="button" onClick={() => setThemes([])} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${themes.length === 0 ? "bg-ink-900 text-white" : "bg-sand-100 text-ink-700 hover:bg-sand-200"}`}>All</button>
                        {THEMES.map((t) => (
                            <button key={t.id} type="button" aria-pressed={themes.includes(t.id)} onClick={() => toggleTheme(t.id)}
                                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${themes.includes(t.id) ? "bg-laterite-500 text-white" : "bg-sand-100 text-ink-700 hover:bg-sand-200"}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <label className="relative block lg:w-72">
                        <span className="sr-only">Search the timeline</span>
                        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, people, places…"
                            className="w-full rounded-full border border-sand-300 bg-sand-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-laterite-400 focus:ring-2 focus:ring-laterite-100" />
                    </label>
                </div>
                <p className="mt-3 text-sm text-ink-500">{shown.length === events.length ? `${events.length} events across five eras` : `${shown.length} of ${events.length} events`}</p>
            </div>

            {/* ---------- The timeline ---------- */}
            <div ref={listRef} className="container-page relative pb-24 pt-6">
                {shown.length === 0 && (
                    <div className="py-24 text-center text-ink-500">
                        No events match. <button type="button" className="font-semibold text-laterite-600 hover:underline" onClick={() => { setThemes([]); setQuery(""); }}>Clear filters</button>
                    </div>
                )}

                {byEra.map(({ era, items }) => (items.length === 0 ? null : (
                    <section key={era.id} aria-labelledby={`era-${era.id}-title`} className="relative">
                        <EraBanner era={era} count={items.length} onOpen={() => setLightbox({ img: era.cover, title: `${era.name} era` })} />

                        <ol className="relative mt-10 space-y-10 lg:space-y-14">
                            {/* spine */}
                            <span aria-hidden className="absolute bottom-0 left-[15px] top-0 w-0.5 lg:left-1/2 lg:-translate-x-1/2" style={{ background: `linear-gradient(${ERA_COLOURS[era.id]}55, ${ERA_COLOURS[era.id]}22)` }} />
                            {items.map((e) => {
                                const left = globalIndex++ % 2 === 0;
                                const isActive = e.id === active && js;
                                const revealed = !js || seen.has(e.id);
                                const c = ERA_COLOURS[e.era];
                                return (
                                    <li key={e.id} id={e.id} data-tl-event={e.id} className="relative scroll-mt-40 pl-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
                                        {/* node */}
                                        <span aria-hidden className="absolute left-[16px] top-6 z-10 -translate-x-1/2 lg:left-1/2">
                                            <span className={`block h-4 w-4 rounded-full border-[3px] border-background transition-transform duration-300 ${isActive ? "scale-150" : ""}`} style={{ background: c, boxShadow: isActive ? `0 0 0 6px ${c}33` : undefined }} />
                                        </span>

                                        {/* big year on the empty side (desktop) */}
                                        <div className={`hidden lg:flex lg:items-start lg:pt-3 ${left ? "lg:order-2 lg:justify-start" : "lg:order-1 lg:justify-end"}`}>
                                            <button type="button" onClick={() => jumpTo(e.id)}
                                                className={`max-w-sm font-display text-4xl font-semibold leading-tight transition-colors duration-300 ${left ? "text-left" : "text-right"}`}
                                                style={{ color: isActive ? c : "#d9cbb3" }}>
                                                {e.year}
                                            </button>
                                        </div>

                                        {/* card */}
                                        <article
                                            className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(66,29,20,0.55)] ${left ? "lg:order-1" : "lg:order-2"} ${revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                                            style={{ borderColor: isActive ? `${c}88` : "#ede2cf" }}
                                        >
                                            <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-1" style={{ background: c }} />
                                            {e.image && (
                                                <Photo img={e.image} className={e.image.fit === "contain" ? "aspect-[16/9]" : "aspect-[16/9]"} onOpen={() => setLightbox({ img: e.image!, title: e.title })} />
                                            )}
                                            <div className="p-5 sm:p-6">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: `${c}1a`, color: c }}>{e.year}</span>
                                                    {e.themes.slice(0, 2).map((t) => (
                                                        <button key={t} type="button" onClick={() => toggleTheme(t)} className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-ink-600 hover:bg-sand-200">
                                                            {THEMES.find((x) => x.id === t)?.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-ink-900">
                                                    <a href={`#${e.id}`} onClick={(ev) => { ev.preventDefault(); jumpTo(e.id); }} className="hover:text-laterite-600">{e.title}</a>
                                                </h3>
                                                {e.titleOdia && <p className="font-odia text-lg text-laterite-600">{e.titleOdia}</p>}
                                                <p className="mt-3 leading-relaxed text-ink-700">{e.description}</p>
                                                {e.links && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {e.links.map((l) => (
                                                            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1 text-sm font-semibold text-laterite-600 transition-colors hover:border-laterite-300 hover:bg-laterite-50">
                                                                {l.label} <Icon name="arrow" className="h-3.5 w-3.5" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                                {e.image && <p className="mt-4 text-[11px] leading-snug text-ink-400">Image: {e.image.alt}. <Credit img={e.image} /></p>}
                                            </div>
                                        </article>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>
                )))}
            </div>

            {/* ---------- Lightbox ---------- */}
            {lightbox && (
                <div role="dialog" aria-modal="true" aria-label={lightbox.title} className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}>
                    <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                        <img src={lightbox.img.src} alt={lightbox.img.alt} className="mx-auto max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl" />
                        <figcaption className="mt-3 text-center text-sm text-ink-100">
                            <span className="font-semibold text-white">{lightbox.title}</span> — {lightbox.img.alt}
                            <br />
                            <Credit img={lightbox.img} className="text-xs text-ink-300" />
                        </figcaption>
                    </figure>
                    <button type="button" onClick={() => setLightbox(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
                        <Icon name="close" className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function EraBanner({ era, count, onOpen }: { era: EraInfo; count: number; onOpen: () => void }) {
    const c = ERA_COLOURS[era.id];
    return (
        <header id={`era-${era.id}`} className="relative mt-16 scroll-mt-40 overflow-hidden rounded-3xl bg-ink-950 text-white first:mt-4">
            <img src={era.cover.src} alt="" aria-hidden className={`absolute inset-0 h-full w-full ${era.cover.fit === "contain" ? "object-contain" : "object-cover"} opacity-45`} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, #0b1222 20%, #0b1222cc 50%, ${c}55)` }} />
            <div className="relative grid gap-6 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#f6c164" }}>{era.span}</p>
                    <h2 id={`era-${era.id}-title`} className="mt-2 font-display text-4xl font-semibold !text-white sm:text-5xl">
                        {era.name} <span className="font-odia text-2xl font-normal text-white/70 sm:text-3xl">{era.odia}</span>
                    </h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-white/85">{era.summary}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60">Highlights · {count} events</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        {era.highlights.map((h) => (
                            <li key={h} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c }} />{h}</li>
                        ))}
                    </ul>
                    <button type="button" onClick={onOpen} className="mt-4 text-left text-[11px] text-white/55 hover:text-white/80">
                        Background: {era.cover.alt} ({era.cover.credit}, {era.cover.licence})
                    </button>
                </div>
            </div>
        </header>
    );
}
