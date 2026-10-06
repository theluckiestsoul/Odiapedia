import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import OdiaDictionary from "@/components/tools/OdiaDictionary";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Odia Dictionary – English to Odia and Odia to English Meanings",
    description: "Search 80,000+ Odia words with their meanings in Odia and English, from the classic Purnachandra Ordia Bhashakosha. Find the Odia word for any English word, or the meaning of an Odia word.",
    path: "/language/dictionary",
    keywords: ["odia dictionary", "english to odia", "odia to english", "odia meaning", "oriya dictionary", "purnachandra bhashakosha", "odia word meaning", "ଓଡ଼ିଆ ଅଭିଧାନ"],
});

export default function DictionaryPage() {
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Odia–English dictionary", url: `${SITE.url}/language/dictionary`, applicationCategory: "ReferenceApplication", operatingSystem: "Any", inLanguage: ["or", "en"],
                potentialAction: { "@type": "SearchAction", target: `${SITE.url}/language/dictionary?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
            <PageHero
                title="Odia dictionary"
                odia="ଓଡ଼ିଆ ଅଭିଧାନ"
                description="More than 80,000 Odia words with meanings in Odia and English. Search in English to find Odia words, or type an Odia word — in Odia script or English letters — to see its meaning."
                icon="book"
                eyebrow="Language tools"
                crumbs={[{ name: "Language", href: "/language" }, { name: "Dictionary", href: "/language/dictionary" }]}
            />
            <div className="container-page py-10 md:py-14">
                <OdiaDictionary examples={["water", "mother", "rice", "temple", "ପାଣି", "ଘର", "maachha", "jagata"]} />

                <section className="mt-16 grid gap-8 border-t border-sand-200 pt-10 text-sm leading-relaxed text-ink-600 lg:grid-cols-3">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink-900">About the source</h2>
                        <p className="mt-2">
                            Entries come from the <em>Purnachandra Ordia Bhashakosha</em>, the seven-volume Odia–English–Bengali–Hindi dictionary compiled by
                            Gopal Chandra Praharaj and published between 1931 and 1940, around 9,500 pages covering some 185,000 words. The text was digitised by the Digital
                            Dictionaries of South Asia project (University of Chicago) and structured by OdiaNLP.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink-900">Things to know</h2>
                        <p className="mt-2">
                            The Bhashakosha records the language of the early 20th century, including many Sanskrit and literary words, so some meanings and spellings
                            are old-fashioned. The digitised text can contain recognition errors. English search uses the dictionary&apos;s own English glosses.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink-900">Related</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Link href="/language/odia-typing" className="btn-dark">Odia typing tool</Link>
                            <Link href="/language/odia-alphabet" className="btn-ghost">Odia alphabet</Link>
                            <Link href="/language/common-greetings" className="btn-ghost">Common greetings</Link>
                        </div>
                        <p className="mt-4 text-xs text-ink-500">
                            Sources: <a className="underline" href="https://dsal.uchicago.edu/dictionaries/praharaj/" target="_blank" rel="noopener noreferrer">DSAL – Praharaj, Purnachandra Ordia Bhashakosha</a> ·{" "}
                            <a className="underline" href="https://github.com/OdiaNLP/dictionary" target="_blank" rel="noopener noreferrer">OdiaNLP dictionary (MIT)</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
