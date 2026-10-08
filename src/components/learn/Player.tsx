"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { getLessonById, nextLesson, REPORT_EMAIL, type Item } from "@/lib/learn/content";
import { itemOf, lessonSession, reviewSession, shortEn, shuffle, rng, type Exercise } from "@/lib/learn/engine";
import { gradeEnglish, gradeOdia, normOdia, type Verdict } from "@/lib/learn/grade";
import { progress, dueItems, useProgress } from "@/lib/learn/store";
import { speak, useOdiaVoice } from "@/lib/learn/speech";

type Mode = { kind: "lesson"; lessonId: string } | { kind: "review"; itemIds?: string[] };

interface Feedback { verdict: Verdict; correct: string; correctTr?: string; note?: string }

/** Full-screen lesson / review session. Opens over the page; Esc or × closes it. */
export default function Player({ mode, onClose }: { mode: Mode; onClose: () => void }) {
    const p = useProgress();
    const attempt = mode.kind === "lesson" ? p.lessons[mode.lessonId]?.attempts ?? 0 : 0;
    const initial = useMemo<Exercise[]>(() => {
        if (mode.kind === "lesson") return lessonSession(getLessonById(mode.lessonId)!.lesson, attempt);
        const ids = mode.itemIds ?? dueItems(progress.get());
        return reviewSession(ids, `review-${new Date().toDateString()}-${ids.length}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [queue, setQueue] = useState<Exercise[]>(initial);
    const [pos, setPos] = useState(0);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [stats, setStats] = useState({ right: 0, wrong: 0 });
    const [requeued, setRequeued] = useState<Set<number>>(new Set());
    const [done, setDone] = useState(false);
    const showTr = p.settings.showTr;
    const voice = useOdiaVoice();

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", esc);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", esc); };
    }, [onClose]);

    const ex = queue[pos];
    const graded = queue.filter((e) => e.kind !== "learn").length;
    const pct = Math.round((pos / queue.length) * 100);

    function submit(f: Feedback) {
        const ok = f.verdict !== "wrong";
        progress.recordAnswer(itemOf(ex), ok);
        setStats((s) => ({ right: s.right + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1) }));
        if (!ok && !requeued.has(pos)) {
            setQueue((q) => [...q, ex]); // try it again at the end
            setRequeued((r) => new Set(r).add(queue.length));
        }
        setFeedback(f);
        if (voice && p.settings.sound && "item" in ex && ok) speak(ex.item.od);
    }

    function next() {
        setFeedback(null);
        if (pos + 1 >= queue.length) {
            const score = Math.round((stats.right / Math.max(1, stats.right + stats.wrong)) * 100);
            if (mode.kind === "lesson") progress.finishLesson(mode.lessonId, score); else progress.finishReview();
            setDone(true);
        } else setPos(pos + 1);
    }

    const lessonRef = mode.kind === "lesson" ? getLessonById(mode.lessonId) : undefined;
    const report = (what: string) => `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent("Odia lesson: possible mistake")}&body=${encodeURIComponent(`Lesson: ${lessonRef?.lesson.title ?? "review"}\nItem: ${what}\n\nWhat looks wrong?\n`)}`;

    return (
        <div className="fixed inset-0 z-[80] flex flex-col bg-sand-50" role="dialog" aria-modal="true" aria-label={lessonRef ? `Lesson: ${lessonRef.lesson.title}` : "Review"}>
            <div className="border-b border-sand-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
                    <button type="button" onClick={onClose} className="rounded-full p-2 text-ink-500 hover:bg-sand-100 hover:text-ink-900" aria-label="Close"><Icon name="close" className="h-5 w-5" /></button>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-sand-200" role="progressbar" aria-valuenow={done ? 100 : pct} aria-valuemin={0} aria-valuemax={100}>
                        <div className="h-full rounded-full bg-laterite-500 transition-all duration-500" style={{ width: `${done ? 100 : pct}%` }} />
                    </div>
                    <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-ink-600">
                        <input type="checkbox" checked={showTr} onChange={(e) => progress.setSettings({ showTr: e.target.checked })} className="h-4 w-4 accent-laterite-500" />
                        <span>abc</span>
                        <span className="sr-only">Show transliteration</span>
                    </label>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
                    {done ? (
                        <Finish stats={stats} graded={graded} mode={mode} onClose={onClose} />
                    ) : (
                        <ExerciseView key={pos} ex={ex} seed={`${pos}`} showTr={showTr} voice={voice} locked={!!feedback} onSubmit={submit} onLearned={next} />
                    )}
                </div>
            </div>

            {feedback && !done && (
                <div className={`border-t-2 ${feedback.verdict === "wrong" ? "border-rose-300 bg-rose-50" : "border-emerald-300 bg-emerald-50"}`} role="status">
                    <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className={`font-display text-xl font-semibold ${feedback.verdict === "wrong" ? "text-rose-700" : "text-emerald-700"}`}>
                                {feedback.verdict === "correct" ? "Correct!" : feedback.verdict === "typo" ? (feedback.correct ? "Almost — watch the spelling" : "Done!") : "Not quite"}
                            </p>
                            {feedback.verdict !== "correct" && feedback.correct && (
                                <p className="mt-1 text-sm text-ink-800">Answer: <span lang={/[଀-୿]/.test(feedback.correct) ? "or" : "en"} className="font-semibold">{feedback.correct}</span>{feedback.correctTr && <span className="text-ink-500"> · {feedback.correctTr}</span>}</p>
                            )}
                            {feedback.note && <p className="mt-1 text-xs text-ink-600">{feedback.note}</p>}
                            <a href={report(feedback.correct)} className="mt-1 inline-block text-xs text-ink-500 underline hover:text-laterite-600">Report a problem with this item</a>
                        </div>
                        <button type="button" autoFocus onClick={next} className={`btn ${feedback.verdict === "wrong" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"} min-w-36 text-white`}>Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ------------------------------------------------------------------------------------------------

function OdiaText({ item, showTr, voice, big }: { item: { od: string; tr: string }; showTr: boolean; voice: boolean; big?: boolean }) {
    return (
        <span className="inline-flex flex-col items-start">
            <span className="inline-flex items-center gap-3">
                <span lang="or" className={`font-odia ${big ? "text-4xl md:text-5xl" : "text-2xl"} leading-snug text-ink-900`}>{item.od}</span>
                {voice && <button type="button" onClick={() => speak(item.od)} className="rounded-full bg-laterite-50 p-2 text-laterite-600 hover:bg-laterite-100" aria-label="Play pronunciation"><Icon name="wave" className="h-5 w-5" /></button>}
            </span>
            {showTr && <span className={`${big ? "text-lg" : "text-sm"} text-ink-500`}>{item.tr}</span>}
            {big && !voice && <span className="mt-1 text-xs text-ink-400">No Odia voice on this device, so there is no audio yet. Recorded native-speaker audio is planned.</span>}
        </span>
    );
}

const Prompt = ({ children }: { children: React.ReactNode }) => <p className="text-sm font-semibold uppercase tracking-wider text-laterite-600">{children}</p>;

function ExerciseView({ ex, seed, showTr, voice, locked, onSubmit, onLearned }: {
    ex: Exercise; seed: string; showTr: boolean; voice: boolean; locked: boolean;
    onSubmit: (f: Feedback) => void; onLearned: () => void;
}) {
    switch (ex.kind) {
        case "learn": return <LearnCard item={ex.item} showTr={showTr} voice={voice} onNext={onLearned} />;
        case "choose-meaning": return (
            <Choice prompt="What does this mean?" head={<OdiaText item={ex.item} showTr={showTr} voice={voice} big />} options={ex.options.map((o) => ({ key: o, label: o }))} answer={ex.answer} locked={locked}
                onPick={(k) => onSubmit({ verdict: k === ex.answer ? "correct" : "wrong", correct: ex.answer, note: ex.item.note })} />
        );
        case "choose-odia": return (
            <Choice prompt="Choose the Odia" head={<p className="font-display text-3xl font-semibold text-ink-900">“{shortEn(ex.item.en)}”</p>} odia
                options={ex.options.map((o) => ({ key: o.id, label: o.od, sub: showTr ? o.tr : undefined }))} answer={ex.item.id} locked={locked}
                onPick={(k) => onSubmit({ verdict: k === ex.item.id ? "correct" : "wrong", correct: ex.item.od, correctTr: ex.item.tr })} />
        );
        case "match": return <Match items={ex.items} seed={seed} showTr={showTr} onDone={(mistakes) => onSubmit({ verdict: mistakes > 1 ? "typo" : "correct", correct: "", note: mistakes ? `${mistakes} wrong ${mistakes === 1 ? "try" : "tries"} along the way.` : undefined })} />;
        case "arrange": return <Arrange ex={ex} showTr={showTr} locked={locked} onSubmit={onSubmit} />;
        case "fill": return <Fill ex={ex} showTr={showTr} locked={locked} onSubmit={onSubmit} />;
        case "type-meaning": return <TypeAnswer key={ex.item.id + "m"} prompt="Type the meaning in English" head={<OdiaText item={ex.item} showTr={showTr} voice={voice} big />} placeholder="In English…" locked={locked}
            onCheck={(v) => onSubmit({ verdict: gradeEnglish(v, ex.item.en, ex.item.accept_en), correct: shortEn(ex.item.en) })} />;
        case "type-odia": return <TypeAnswer key={ex.item.id + "o"} prompt="Say it in Odia — type in Odia script or English letters" head={<p className="font-display text-3xl font-semibold text-ink-900">“{shortEn(ex.item.en)}”</p>} placeholder="e.g. namaskara or ନମସ୍କାର" locked={locked} odiaHint={ex.item.tr}
            onCheck={(v) => onSubmit({ verdict: gradeOdia(v, ex.item.od, ex.item.tr), correct: ex.item.od, correctTr: ex.item.tr })} />;
    }
}

function LearnCard({ item, voice, onNext }: { item: Item; showTr: boolean; voice: boolean; onNext: () => void }) {
    useEffect(() => { if (voice) speak(item.od); }, [item.od, voice]);
    return (
        <div className="animate-fade-up">
            <Prompt>New {item.kind}</Prompt>
            <div className="card mt-4 p-6 md:p-8">
                {item.emoji && <span className="text-5xl" aria-hidden>{item.emoji}</span>}
                <div className="mt-3"><OdiaText item={item} showTr voice={voice} big /></div>
                <p className="mt-4 font-display text-2xl text-ink-900">{item.en}</p>
                {item.lit && <p className="mt-1 text-sm text-ink-500">Literally: {item.lit}</p>}
                {item.register && item.register !== "neutral" && <span className="chip mt-3 inline-block capitalize">{item.register}</span>}
                {item.note && <p className="mt-4 rounded-xl bg-sand-100 p-3 text-sm text-ink-700">{item.note}</p>}
            </div>
            <button type="button" autoFocus onClick={onNext} className="btn-primary mt-6 w-full sm:w-auto">Got it <Icon name="arrow" className="h-4 w-4" /></button>
        </div>
    );
}

function Choice({ prompt, head, options, answer, locked, onPick, odia }: {
    prompt: string; head: React.ReactNode; options: { key: string; label: string; sub?: string }[]; answer: string; locked: boolean; onPick: (k: string) => void; odia?: boolean;
}) {
    const [picked, setPicked] = useState<string | null>(null);
    return (
        <div>
            <Prompt>{prompt}</Prompt>
            <div className="mt-4">{head}</div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {options.map((o, i) => {
                    const state = !locked || !picked ? "border-sand-200 bg-white hover:border-laterite-300" : o.key === answer ? "border-emerald-500 bg-emerald-50" : o.key === picked ? "border-rose-400 bg-rose-50" : "border-sand-200 bg-white opacity-50";
                    return (
                        <button key={o.key} type="button" disabled={locked} onClick={() => { setPicked(o.key); onPick(o.key); }}
                            className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${state}`}>
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-sand-300 text-xs font-semibold text-ink-500">{i + 1}</span>
                            <span>
                                <span lang={odia ? "or" : "en"} className={odia ? "font-odia text-2xl text-ink-900" : "font-medium text-ink-900"}>{o.label}</span>
                                {o.sub && <span className="block text-xs text-ink-500">{o.sub}</span>}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function Match({ items, seed, showTr, onDone }: { items: Item[]; seed: string; showTr: boolean; onDone: (mistakes: number) => void }) {
    const right = useMemo(() => shuffle(items, rng(`m${seed}`)), [items, seed]);
    const [sel, setSel] = useState<string | null>(null);
    const [matched, setMatched] = useState<Set<string>>(new Set());
    const [bad, setBad] = useState<string | null>(null);
    const mistakes = useRef(0);
    function pickRight(id: string) {
        if (!sel || matched.has(id)) return;
        if (sel === id) {
            const m = new Set(matched).add(id);
            setMatched(m); setSel(null);
            if (m.size === items.length) setTimeout(() => onDone(mistakes.current), 250);
        } else { mistakes.current += 1; setBad(id); setTimeout(() => setBad(null), 500); }
    }
    return (
        <div>
            <Prompt>Match the pairs</Prompt>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="space-y-3">
                    {items.map((it) => (
                        <button key={it.id} type="button" disabled={matched.has(it.id)} onClick={() => setSel(it.id)}
                            className={`block w-full rounded-2xl border-2 bg-white p-3 text-left transition ${matched.has(it.id) ? "border-emerald-300 opacity-40" : sel === it.id ? "border-laterite-500 bg-laterite-50" : "border-sand-200 hover:border-laterite-300"}`}>
                            <span lang="or" className="font-odia text-xl text-ink-900">{it.od}</span>
                            {showTr && <span className="block text-xs text-ink-500">{it.tr}</span>}
                        </button>
                    ))}
                </div>
                <div className="space-y-3">
                    {right.map((it) => (
                        <button key={it.id} type="button" disabled={matched.has(it.id)} onClick={() => pickRight(it.id)}
                            className={`block w-full rounded-2xl border-2 bg-white p-3 text-left text-sm font-medium text-ink-900 transition ${matched.has(it.id) ? "border-emerald-300 opacity-40" : bad === it.id ? "border-rose-400 bg-rose-50" : "border-sand-200 hover:border-laterite-300"}`}>
                            {shortEn(it.en)}
                        </button>
                    ))}
                </div>
            </div>
            <p className="mt-4 text-xs text-ink-500">Tap an Odia word, then its meaning.</p>
        </div>
    );
}

function Arrange({ ex, showTr, locked, onSubmit }: { ex: Extract<Exercise, { kind: "arrange" }>; showTr: boolean; locked: boolean; onSubmit: (f: Feedback) => void }) {
    const [chosen, setChosen] = useState<number[]>([]);
    const answer = ex.example.od;
    return (
        <div>
            <Prompt>Build the sentence in Odia</Prompt>
            <p className="mt-4 font-display text-3xl font-semibold text-ink-900">“{ex.example.en}”</p>
            <div className="mt-6 flex min-h-16 flex-wrap gap-2 rounded-2xl border-2 border-dashed border-sand-300 bg-white p-3" aria-label="Your sentence">
                {chosen.map((i, k) => (
                    <button key={k} type="button" disabled={locked} onClick={() => setChosen(chosen.filter((_, j) => j !== k))} className="rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 font-odia text-xl text-ink-900" lang="or">{ex.tiles[i]}</button>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {ex.tiles.map((t, i) => (
                    <button key={i} type="button" disabled={locked || chosen.includes(i)} onClick={() => setChosen([...chosen, i])}
                        className={`rounded-xl border-2 px-3 py-2 font-odia text-xl transition ${chosen.includes(i) ? "border-sand-200 bg-sand-100 text-transparent" : "border-sand-300 bg-white text-ink-900 hover:border-laterite-300"}`} lang="or">{t}</button>
                ))}
            </div>
            <button type="button" disabled={locked || !chosen.length} onClick={() => {
                const given = chosen.map((i) => ex.tiles[i]).join(" ");
                onSubmit({ verdict: normOdia(given) === normOdia(answer) ? "correct" : "wrong", correct: answer, correctTr: showTr ? ex.example.tr : undefined, note: ex.example.en });
            }} className="btn-primary mt-8 w-full disabled:opacity-40 sm:w-auto">Check</button>
        </div>
    );
}

function Fill({ ex, showTr, locked, onSubmit }: { ex: Extract<Exercise, { kind: "fill" }>; showTr: boolean; locked: boolean; onSubmit: (f: Feedback) => void }) {
    const words = ex.example.od.split(/\s+/);
    const answer = words[ex.blank].replace(/[?!।,]$/, "");
    const tail = words[ex.blank].slice(answer.length);
    const [picked, setPicked] = useState<string | null>(null);
    return (
        <div>
            <Prompt>Fill in the missing word</Prompt>
            <p className="mt-4 text-lg text-ink-600">“{ex.example.en}”</p>
            <p className="mt-4 font-odia text-3xl leading-relaxed text-ink-900" lang="or">
                {words.map((w, i) => (i === ex.blank ? <span key={i} className="mx-1 inline-block min-w-20 border-b-4 border-laterite-400 text-center text-laterite-700">{picked ?? " "}{tail}</span> : <span key={i}>{w} </span>))}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
                {ex.options.map((o) => (
                    <button key={o} type="button" disabled={locked} onClick={() => { setPicked(o); onSubmit({ verdict: o === answer ? "correct" : "wrong", correct: ex.example.od, correctTr: showTr ? ex.example.tr : undefined }); }}
                        className={`rounded-2xl border-2 px-4 py-2 font-odia text-2xl transition ${locked && o === answer ? "border-emerald-500 bg-emerald-50" : locked && o === picked ? "border-rose-400 bg-rose-50" : "border-sand-200 bg-white hover:border-laterite-300"}`} lang="or">{o}</button>
                ))}
            </div>
        </div>
    );
}

function TypeAnswer({ prompt, head, placeholder, locked, onCheck, odiaHint }: { prompt: string; head: React.ReactNode; placeholder: string; locked: boolean; onCheck: (v: string) => void; odiaHint?: string }) {
    const [v, setV] = useState("");
    const [hint, setHint] = useState(false);
    return (
        <form onSubmit={(e) => { e.preventDefault(); if (v.trim() && !locked) onCheck(v); }}>
            <Prompt>{prompt}</Prompt>
            <div className="mt-4">{head}</div>
            <input value={v} onChange={(e) => setV(e.target.value)} disabled={locked} autoFocus autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder={placeholder}
                className="mt-8 w-full rounded-2xl border-2 border-sand-300 bg-white px-4 py-3 text-xl outline-none focus:border-laterite-400 focus:ring-4 focus:ring-laterite-100" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={locked || !v.trim()} className="btn-primary disabled:opacity-40">Check</button>
                {odiaHint && !locked && <button type="button" onClick={() => setHint(true)} className="text-sm text-ink-500 underline hover:text-laterite-600">{hint ? `Starts with “${odiaHint.split(" ")[0].slice(0, 3)}…”` : "Hint"}</button>}
            </div>
        </form>
    );
}

function Finish({ stats, graded, mode, onClose }: { stats: { right: number; wrong: number }; graded: number; mode: Mode; onClose: () => void }) {
    const total = stats.right + stats.wrong;
    const score = Math.round((stats.right / Math.max(1, total)) * 100);
    const ref = mode.kind === "lesson" ? getLessonById(mode.lessonId) : undefined;
    const nxt = ref ? nextLesson(ref) : undefined;
    return (
        <div className="text-center">
            <p className="text-6xl" aria-hidden>{score >= 80 ? "🎉" : "💪"}</p>
            <h2 className="mt-4 font-display text-4xl font-semibold">{mode.kind === "lesson" ? "Lesson complete!" : "Review complete!"}</h2>
            <p lang="or" className="mt-1 font-odia text-xl text-laterite-600">{score >= 80 ? "ବହୁତ ଭଲ!" : "ଭଲ ଚେଷ୍ଟା!"}</p>
            <dl className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
                <div className="card p-4"><dt className="text-xs text-ink-500">Accuracy</dt><dd className="font-display text-3xl font-semibold">{score}%</dd></div>
                <div className="card p-4"><dt className="text-xs text-ink-500">Exercises</dt><dd className="font-display text-3xl font-semibold">{graded}</dd></div>
                <div className="card p-4"><dt className="text-xs text-ink-500">XP</dt><dd className="font-display text-3xl font-semibold">+{mode.kind === "lesson" ? 10 + stats.right : 5 + stats.right}</dd></div>
            </dl>
            {stats.wrong > 0 && <p className="mx-auto mt-6 max-w-md text-sm text-ink-600">Words you missed are in your review list — they’ll come back at the right time so they stick.</p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                {nxt && <Link href={`/learn/course/${nxt.slug}`} onClick={onClose} className="btn-primary">Next: {nxt.lesson.title} <Icon name="arrow" className="h-4 w-4" /></Link>}
                <button type="button" onClick={onClose} className="btn-ghost">Back to the lesson page</button>
                <Link href="/learn/review" onClick={onClose} className="btn-ghost">Review</Link>
            </div>
        </div>
    );
}
