import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getAllArticles } from "@/lib/mdx";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Odia Recipes – Traditional Odisha Recipes Step by Step",
    description: "Traditional Odia recipes with ingredients and step-by-step methods: dalma, pakhala, santula, machha besara, dahi baigana, ghanta, kanika, khechudi, chhena poda, rasabali, chhena jhili, manda and arisa pitha.",
    path: "/food/recipes",
    keywords: ["odia recipes", "odisha recipes", "odia food recipes", "traditional odia recipes", "odia sweets recipe", "odia pitha recipe", "jagannath mahaprasad recipes"],
});

const mins = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);
const GROUPS: [string, string[]][] = [
    ["Everyday meals", ["Main course", "Side dish"]],
    ["Sweets & pithas", ["Dessert"]],
];

export default function RecipesPage() {
    const recipes = getAllArticles("food").filter((a) => a.recipe && !a.mergedInto && (a.lang || "en") === "en");
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Odia recipes", url: `${SITE.url}/food/recipes`,
                itemListElement: recipes.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/food/${r.slug}` })) }} />
            <PageHero
                title="Odia recipes"
                odia="ଓଡ଼ିଆ ରୋଷେଇ"
                description="Home-style recipes for the dishes of Odisha — temple food, everyday dals and curries, festival pithas and the chhena sweets — each with ingredients, a step-by-step method and its story."
                icon="bowl"
                eyebrow="Food"
                crumbs={[{ name: "Food", href: "/food" }, { name: "Recipes", href: "/food/recipes" }]}
            />
            <div className="container-page space-y-14 py-12 md:py-16">
                {GROUPS.map(([title, courses]) => {
                    const items = recipes.filter((r) => courses.includes(r.recipe!.course || "Main course"));
                    if (!items.length) return null;
                    return (
                        <section key={title}>
                            <h2 className="font-display text-3xl font-semibold text-ink-900">{title}</h2>
                            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((r) => (
                                    <Link key={r.slug} href={`/food/${r.slug}#recipe`} className="card-link group flex flex-col p-6">
                                        <p className="text-xs font-bold uppercase tracking-wider text-laterite-600">{r.recipe!.course}</p>
                                        <h3 className="mt-2 font-display text-2xl font-semibold text-ink-900 group-hover:text-laterite-600">{r.title.replace(/\s+[-—–:|]\s+.*$/, "")}</h3>
                                        {r.odiaTitle && <p lang="or" className="font-odia text-lg text-ink-500">{r.odiaTitle}</p>}
                                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600">{r.description}</p>
                                        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-xs font-medium text-ink-500">
                                            <span className="inline-flex items-center gap-1"><Icon name="clock" className="h-3.5 w-3.5" />{mins(r.recipe!.prep + r.recipe!.cook)}</span>
                                            <span>{r.recipe!.yield}</span>
                                            {r.recipe!.diet?.includes("Vegetarian") && <span className="text-chilika-600">Vegetarian</span>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
