import Icon from "./Icon";
import PrintButton from "./PrintButton";
import type { ArticleRecipe } from "@/lib/mdx";

const mins = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);

/** Printable recipe card rendered from an article's `recipe:` front matter (also emitted as schema.org Recipe). */
export default function RecipeCard({ recipe, title, odia }: { recipe: ArticleRecipe; title: string; odia?: string }) {
    const name = title.replace(/\s+[-—–:|]\s+.*$/, "");
    return (
        <section id="recipe" aria-labelledby="recipe-heading" className="recipe-card mt-14 max-w-[46rem] scroll-mt-28 overflow-hidden rounded-3xl border border-sand-200 bg-white print:mt-0 print:border-0">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand-200 bg-sand-100 px-6 py-5 sm:px-8">
                <div>
                    <p className="eyebrow"><Icon name="bowl" className="h-4 w-4" />Recipe</p>
                    <h2 id="recipe-heading" className="mt-2 font-display text-3xl font-semibold text-ink-900">{name}</h2>
                    {odia && <p lang="or" className="font-odia text-lg text-laterite-600">{odia}</p>}
                </div>
                <PrintButton label="Print recipe" />
            </div>
            <dl className="grid grid-cols-2 gap-px bg-sand-200 text-sm sm:grid-cols-4">
                {[
                    ["Serves", recipe.yield],
                    ["Prep", mins(recipe.prep)],
                    ["Cook", mins(recipe.cook)],
                    recipe.rest ? [recipe.rest_label || "Resting", mins(recipe.rest)] : ["Total", mins(recipe.prep + recipe.cook)],
                ].map(([k, v]) => (
                    <div key={k} className="bg-white px-5 py-3">
                        <dt className="text-xs uppercase tracking-wide text-ink-500">{k}</dt>
                        <dd className="mt-0.5 font-semibold text-ink-900">{v}</dd>
                    </div>
                ))}
            </dl>
            <div className="grid gap-8 px-6 py-7 sm:px-8 md:grid-cols-[1fr_1.4fr]">
                <div>
                    <h3 className="font-display text-xl font-semibold text-ink-900">Ingredients</h3>
                    <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-ink-800">
                        {recipe.ingredients.map((x) => (
                            <li key={x} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-laterite-400" />{x}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-display text-xl font-semibold text-ink-900">Method</h3>
                    <ol className="mt-3 space-y-4 text-[0.95rem] leading-relaxed text-ink-800">
                        {recipe.steps.map((x, i) => (
                            <li key={i} className="flex gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-laterite-500 text-xs font-bold text-white">{i + 1}</span>
                                <span>{x}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            {recipe.tips && recipe.tips.length > 0 && (
                <div className="border-t border-sand-200 bg-saffron-50 px-6 py-5 sm:px-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ink-600">Tips &amp; variations</h3>
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-700">
                        {recipe.tips.map((t) => <li key={t}>• {t}</li>)}
                    </ul>
                </div>
            )}
            <p className="border-t border-sand-200 px-6 py-3 text-xs text-ink-500 sm:px-8">
                {recipe.diet?.includes("Vegetarian") ? "Vegetarian · " : ""}{recipe.course ? `${recipe.course} · ` : ""}Odia cuisine. A home recipe written by Odiapedia from the sources listed below; quantities and times have not yet been kitchen-tested by a named cook, so adjust to taste and use clean, food-safe practice.
            </p>
        </section>
    );
}
