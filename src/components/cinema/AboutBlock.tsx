import type { About } from "@/lib/cinema";

/** Written description (About) or, when none exists yet, the data-derived paragraphs. */
export default function AboutBlock({ about, auto, title }: { about?: About; auto?: string[]; title: string }) {
    if (!about && !auto?.length) return null;
    return (
        <section aria-labelledby="about-h">
            <h2 id="about-h" className="font-display text-2xl font-semibold">{title}</h2>
            <div className="prose-odia mt-4 max-w-none space-y-4 text-[1.05rem] leading-relaxed text-ink-800">
                {about ? (
                    <>
                        <p className="text-lg text-ink-900">{about.lead}</p>
                        {about.sections?.map((s) => (
                            <div key={s.h}>
                                <h3 className="mt-6 font-display text-xl font-semibold text-ink-900">{s.h}</h3>
                                {s.p.map((x, i) => <p key={i} className="mt-2">{x}</p>)}
                            </div>
                        ))}
                    </>
                ) : (
                    auto!.map((x, i) => <p key={i}>{x}</p>)
                )}
            </div>
        </section>
    );
}
