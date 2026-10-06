import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/mdx";
import { categoryInfo } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const ACCENT: Record<string, string> = {
    travel: "#138a7e", culture: "#b8522b", history: "#9c4122", food: "#e08a1e", people: "#3d578e",
    language: "#7d331d", learn: "#2f4574", about: "#5671a9", district: "#138a7e",
};

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);

/** Branded 1200×630 share card. Only Latin text is drawn (the default OG font has no Odia glyphs). */
export function ogCard({ eyebrow, title, subtitle, accent = "#b8522b", stats = [] }: { eyebrow: string; title: string; subtitle?: string; accent?: string; stats?: [string, string][] }) {
    return new ImageResponse(
        (
            <div style={{ display: "flex", width: "100%", height: "100%", background: "#f7f1e7", position: "relative" }}>
                <div style={{ display: "flex", position: "absolute", left: 0, top: 0, bottom: 0, width: 24, background: accent }} />
                <div style={{ display: "flex", position: "absolute", right: -120, top: -120, width: 420, height: 420, borderRadius: 420, border: `36px solid ${accent}`, opacity: 0.12 }} />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 80px 56px 88px", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: accent }}>{eyebrow}</div>
                        <div style={{ display: "flex", marginTop: 22, fontSize: title.length > 60 ? 60 : 72, fontWeight: 800, lineHeight: 1.08, color: "#121c33" }}>{clip(title, 90)}</div>
                        {subtitle ? <div style={{ display: "flex", marginTop: 26, fontSize: 30, lineHeight: 1.35, color: "#3d578e" }}>{clip(subtitle, 150)}</div> : null}
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: 40 }}>
                            {stats.map(([k, v]) => (
                                <div key={k} style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", fontSize: 20, color: "#8199c6", textTransform: "uppercase", letterSpacing: 2 }}>{k}</div>
                                    <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#121c33" }}>{v}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ display: "flex", width: 44, height: 44, borderRadius: 44, background: accent }} />
                            <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "#121c33" }}>Odiapedia</div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...OG_SIZE }
    );
}

/** Factory for /<category>/[slug]/opengraph-image routes. */
export function articleOgImage(category: string) {
    return async function Image({ params }: { params: Promise<{ slug: string }> }) {
        const { slug } = await params;
        const a = getArticleBySlug(category, slug);
        const label = categoryInfo(category).label;
        if (!a) return ogCard({ eyebrow: label, title: "Odiapedia", subtitle: "The encyclopedia of Odisha", accent: ACCENT[category] });
        const latin = (s: string) => s.replace(/[଀-୿]+/g, "").replace(/\s{2,}/g, " ").trim();
        const title = latin(a.title) || label;
        return ogCard({
            eyebrow: a.recipe ? `${label} · Recipe` : label,
            title,
            subtitle: latin(a.description),
            accent: ACCENT[category],
            stats: a.recipe ? [["Serves", a.recipe.yield], ["Time", `${a.recipe.prep + a.recipe.cook} min`]] : [],
        });
    };
}
