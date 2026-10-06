import Link from "next/link";
import PageHero from "@/components/PageHero";
import LibraryBrowser from "@/components/LibraryBrowser";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { LIBRARY, LIBRARY_CATEGORIES } from "@/data/library";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Odia Books & Odisha PDFs Library – Free, Public-Domain Texts",
    description:
        "Browse free, legally available PDFs on Odisha and Odia literature: Fakir Mohan, Radhanath Ray, Gangadhar Meher, Sarala Mahabharata, Odia dictionaries and grammars, district gazetteers and classic histories of Orissa.",
    path: "/library",
    keywords: ["odia books pdf", "odia literature pdf", "odia book free download", "odisha history pdf", "orissa district gazetteer pdf", "fakir mohan senapati books pdf", "purnachandra odia bhashakosha pdf", "odia public domain books"],
});

export default function LibraryPage() {
    const items = [...LIBRARY].sort((a, b) => a.title.localeCompare(b.title));
    return (
        <div>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    name: "Odiapedia Library",
                    url: `${SITE.url}/library`,
                    description: "A curated catalogue of freely and legally available PDFs about Odisha and Odia literature.",
                    mainEntity: {
                        "@type": "ItemList",
                        numberOfItems: items.length,
                        itemListElement: items.map((i, n) => ({ "@type": "ListItem", position: n + 1, url: `${SITE.url}/library/${i.slug}`, name: i.title })),
                    },
                }}
            />
            <PageHero
                title="Odiapedia Library"
                odia="ଓଡ଼ିଆପିଡ଼ିଆ ଗ୍ରନ୍ଥାଗାର"
                description="Free, legal PDFs of Odia literature and books about Odisha — classics, poetry, dictionaries, grammars, gazetteers and histories, curated from public-domain and official collections."
                icon="book"
                eyebrow={`${items.length} works · free to read`}
                crumbs={[{ name: "Library", href: "/library" }]}
            >
                <p className="flex max-w-xl items-start gap-2 text-sm text-ink-600">
                    <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-chilika-600" />
                    Every work is public domain in India, an open government publication or openly licensed. We link to the original digital copy and never host pirated books.
                </p>
            </PageHero>

            <section className="container-page py-10">
                <LibraryBrowser items={items} categories={LIBRARY_CATEGORIES} />
            </section>

            <section className="container-page pb-20">
                <div className="grid gap-6 rounded-3xl border border-sand-200 bg-white p-8 md:grid-cols-2 md:p-10">
                    <div>
                        <h2 className="font-display text-2xl font-semibold">Suggest a book</h2>
                        <p className="mt-2 text-ink-600">
                            Know a public-domain Odia book or an official Odisha publication we should add? Send us the link. We only list works that are legally free to share — for example, authors who died more than 60 years ago, or government publications.
                        </p>
                        <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Library suggestion")}&body=${encodeURIComponent("Title:\nAuthor:\nLink to the PDF:\nWhy it is free to share (public domain / government / licence):\n")}`} className="btn-primary mt-5"><Icon name="mail" className="h-4 w-4" />Suggest a book</a>
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-semibold">About copyright</h2>
                        <p className="mt-2 text-ink-600">
                            In India, literary works generally enter the public domain 60 years after the year the author died. Rights may differ in other countries. If you hold rights to a work listed here and believe it is listed in error, <a className="text-laterite-600 underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent("Library rights notice")}`}>tell us</a> and we will review it promptly.
                        </p>
                        <p className="mt-3 text-sm">
                            <Link href="/language/odia-literature-milestones" className="font-semibold text-laterite-600 underline underline-offset-4">Read: milestones of Odia literature</Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
