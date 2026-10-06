import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { getArticleBySlug } from "@/lib/mdx";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Shop Authentic Odisha: Handloom, Crafts & Odia Books",
    description:
        "How to buy genuine Odisha handloom and handicrafts — Sambalpuri ikat, Bomkai, Kotpad, Pattachitra, Pipili applique, Cuttack silver filigree — from artisan co-operatives, plus an Odia reading list.",
    path: "/shop",
    keywords: ["buy sambalpuri saree online", "authentic odisha handicrafts", "pattachitra buy", "odisha handloom", "utkalika", "boyanika", "odia books"],
});

const HANDLOOM = ["sambalpuri-saree", "bomkai-saree", "kotpad-handloom", "khandua-silk"];
const CRAFTS = ["pattachitra", "pipili-applique", "tarakasi-silver-filigree", "dhokra-craft", "sabai-grass-craft", "palm-leaf-engraving"];

const BOOKS: { title: string; author: string; why: string; href?: string }[] = [
    { title: "Chha Mana Atha Guntha (Six Acres and a Third)", author: "Fakir Mohan Senapati", why: "The landmark 19th-century Odia novel of land, law and village life; available in English translation.", href: "/people/fakir-mohan-senapati" },
    { title: "Paraja", author: "Gopinath Mohanty", why: "A celebrated novel of a Koraput tribal family by the first Odia Jnanpith laureate; available in English translation.", href: "/people/gopinath-mohanty" },
    { title: "Gita Govinda", author: "Jayadeva", why: "The 12th-century Sanskrit lyric poem sung in the Jagannath Temple tradition and central to Odissi dance.", href: "/people/jayadeva" },
    { title: "Sarala Mahabharata", author: "Sarala Das", why: "The 15th-century Odia retelling of the Mahabharata, a foundation of Odia literature.", href: "/people/sarala-das" },
    { title: "Yajnaseni", author: "Pratibha Ray", why: "A Jnanpith-winning author's novel retelling Draupadi's story; widely translated." },
];

function Card({ category, slug }: { category: string; slug: string }) {
    const a = getArticleBySlug(category, slug);
    if (!a) return null;
    const gi = a.facts.find((f) => /gi/i.test(f.label));
    return (
        <Link href={`/${category}/${slug}`} className="group card-link flex flex-col overflow-hidden">
            {a.image && (
                <div className="relative aspect-[4/3] bg-sand-100">
                    <Image src={a.image} alt={`${a.title} (illustration)`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                </div>
            )}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-semibold group-hover:text-laterite-700">{a.title.replace(/\s+[-—–:].*$/, "")}</h3>
                {a.odiaTitle && <p lang="or" className="font-odia text-sm text-ink-500">{a.odiaTitle}</p>}
                <p className="mt-2 line-clamp-3 text-sm text-ink-600">{a.description}</p>
                {gi && <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-chilika-500/10 px-2.5 py-1 text-xs font-medium text-chilika-700"><Icon name="shield" className="h-3.5 w-3.5" />{gi.label}: {gi.value}</p>}
                <span className="mt-auto pt-4 text-sm font-semibold text-laterite-600">How to buy genuine →</span>
            </div>
        </Link>
    );
}

export default function ShopPage() {
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Shop authentic Odisha", url: `${SITE.url}/shop`, description: "Guide to buying authentic Odisha handloom, handicrafts and books." }} />
            <PageHero
                title="Shop authentic Odisha"
                odia="ଖାଣ୍ଟି ଓଡ଼ିଶା କିଣନ୍ତୁ"
                description="Handloom and crafts made by Odisha's weavers and artisans — and how to make sure what you buy is the real thing. We'll only ever recommend sellers we have verified."
                icon="shop"
                eyebrow="Curated, not catalogued"
                image="/images/sambalpuri-saree.png"
                crumbs={[{ name: "Shop", href: "/shop" }]}
            />

            <section className="container-page py-14">
                <div className="grid gap-6 rounded-3xl border border-sand-200 bg-white p-6 md:grid-cols-3 md:p-8">
                    {[
                        { i: "shield" as const, t: "Look for the GI tag", d: "Odisha has more than two dozen Geographical Indication products. Ask for GI-authorised sellers and check the registered name." },
                        { i: "handshake" as const, t: "Buy from co-operatives", d: "State co-operatives such as Utkalika (handicrafts) and Boyanika (handloom) source directly from artisans and weavers." },
                        { i: "pin" as const, t: "Or go to the source", d: "Visit craft villages like Raghurajpur (Pattachitra) and Pipili (applique), or weaver clusters in western Odisha." },
                    ].map((x) => (
                        <div key={x.t} className="flex gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-laterite-50 text-laterite-600"><Icon name={x.i} className="h-5 w-5" /></span>
                            <div><p className="font-semibold text-ink-900">{x.t}</p><p className="mt-1 text-sm text-ink-600">{x.d}</p></div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container-page pb-14">
                <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                    <h2 className="font-display text-3xl font-semibold">Handloom</h2>
                    <span className="flex flex-wrap gap-4"><Link href="/culture/odisha-handloom-buying-guide" className="text-sm font-semibold text-laterite-600 hover:underline">How to spot genuine handloom →</Link><Link href="/culture/odisha-gi-tags" className="text-sm font-semibold text-laterite-600 hover:underline">Full list of Odisha GI tags →</Link></span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{HANDLOOM.map((s) => <Card key={s} category="culture" slug={s} />)}</div>
            </section>

            <section className="container-page pb-14">
                <h2 className="mb-6 font-display text-3xl font-semibold">Handicrafts</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{CRAFTS.map((s) => <Card key={s} category="culture" slug={s} />)}</div>
            </section>

            <section className="bg-sand-100 py-14">
                <div className="container-page">
                    <h2 className="font-display text-3xl font-semibold">Where to buy from official sources</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <a href="https://utkalikaodisha.com/" target="_blank" rel="noopener noreferrer" className="card-link flex items-start gap-4 p-6">
                            <Icon name="shop" className="mt-1 h-6 w-6 shrink-0 text-laterite-600" />
                            <span>
                                <span className="flex items-center gap-2 font-display text-xl font-semibold">Utkalika <Icon name="external" className="h-4 w-4 text-ink-400" /></span>
                                <span className="mt-1 block text-sm text-ink-600">The Odisha State Co-operative Handicrafts Corporation — Pattachitra, applique, filigree, stone and wood carving, Dhokra and more.</span>
                            </span>
                        </a>
                        <div className="card flex items-start gap-4 p-6">
                            <Icon name="shop" className="mt-1 h-6 w-6 shrink-0 text-laterite-600" />
                            <span>
                                <span className="font-display text-xl font-semibold">Boyanika</span>
                                <span className="mt-1 block text-sm text-ink-600">The Orissa State Handloom Weavers&apos; Co-operative Society, which sells Sambalpuri, Bomkai, Kotpad and other Odisha handlooms through its showrooms.</span>
                            </span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-ink-500">Odiapedia is not affiliated with these organisations and earns nothing from these links.</p>
                </div>
            </section>

            <section className="container-page py-14">
                <h2 className="font-display text-3xl font-semibold">An Odia reading list</h2>
                <p className="mt-2 max-w-2xl text-ink-600">Five books to begin with — classics of Odia literature, most available in English translation.</p>
                <ol className="mt-8 grid gap-4 md:grid-cols-2">
                    {BOOKS.map((b, i) => (
                        <li key={b.title} className="card flex gap-4 p-5">
                            <span className="font-display text-3xl font-semibold text-laterite-300">{i + 1}</span>
                            <div>
                                <p className="font-semibold text-ink-900">{b.title}</p>
                                <p className="text-sm text-ink-500">{b.href ? <Link href={b.href} className="underline decoration-sand-300 underline-offset-4 hover:text-laterite-600">{b.author}</Link> : b.author}</p>
                                <p className="mt-2 text-sm text-ink-700">{b.why}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="container-page pb-20">
                <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white md:p-12">
                    <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
                    <div className="relative md:flex md:items-center md:justify-between md:gap-10">
                        <div>
                            <p className="eyebrow !text-saffron-300">For artisans, weavers &amp; publishers</p>
                            <h2 className="mt-3 font-display text-3xl font-semibold !text-white">Get featured on Odiapedia</h2>
                            <p className="mt-2 max-w-xl text-sand-100/85">We&apos;re building a directory of verified Odisha artisans, co-operatives and publishers. Featured listings are always labelled.</p>
                        </div>
                        <Link href="/partners" className="btn-primary mt-6 shrink-0 md:mt-0">Apply to be listed <Icon name="arrow" className="h-4 w-4" /></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
