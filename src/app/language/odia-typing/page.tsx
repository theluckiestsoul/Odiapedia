import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import OdiaTyping from "@/components/tools/OdiaTyping";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { TRANSLIT_TABLE } from "@/lib/odia-translit";

export const metadata = hubMetadata({
    title: "Odia Typing – Type in Odia Online (English to Odia Keyboard)",
    description: "Free Odia typing tool: type Odia words in English letters and get Odia script instantly, or use the on-screen Odia keyboard. Copy and paste into WhatsApp, Facebook, email or documents.",
    path: "/language/odia-typing",
    keywords: ["odia typing", "english to odia typing", "odia keyboard", "type in odia", "oriya typing", "odia font online", "ଓଡ଼ିଆ ଟାଇପିଂ", "odia typing online"],
});

const FAQ = [
    { q: "How do I type in Odia using an English keyboard?", a: "Type the word as it sounds in English letters, for example namaskaara for ନମସ୍କାର. Use doubled or capital vowels for long vowels (aa or A for ା) and capital letters for the retroflex sounds (T, D, N, L, Sh). The Odia text appears instantly and can be copied." },
    { q: "Do I need to install an Odia font?", a: "No. The tool produces standard Unicode Odia text, which is supported by all modern phones and computers and can be pasted into WhatsApp, Facebook, Gmail, Word or Google Docs." },
    { q: "How do I write ଡ଼ as in ଓଡ଼ିଶା?", a: "Type D. (capital D followed by a full stop) for ଡ଼ and Dh. for ଢ଼ — for example oD.ishaa gives ଓଡ଼ିଶା." },
    { q: "How do I join consonants such as କ୍ଷ or ଷ୍ଣ?", a: "Simply type the consonants one after another: the tool adds the virama automatically, so kRiShNa gives କୃଷ୍ଣ. Use ksh or x for କ୍ଷ and gy for ଜ୍ଞ." },
];

export default function OdiaTypingPage() {
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Odia typing tool", url: `${SITE.url}/language/odia-typing`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", inLanguage: ["or", "en"], offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } }} />
            <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
            <PageHero
                title="Odia typing"
                odia="ଓଡ଼ିଆ ଟାଇପିଂ"
                description="Type Odia in English letters and get Odia script instantly — or tap letters on the Odia keyboard. Free, no install, works on phones."
                icon="pen"
                eyebrow="Language tools"
                crumbs={[{ name: "Language", href: "/language" }, { name: "Odia typing", href: "/language/odia-typing" }]}
            />
            <div className="container-page py-10 md:py-14">
                <OdiaTyping />

                <section className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                        <h2 className="font-display text-3xl font-semibold text-ink-900">How to type each letter</h2>
                        <p className="mt-2 text-ink-600">Lowercase for the plain sound, capitals for long vowels and retroflex consonants. Consonants typed together are joined automatically.</p>
                        {(["vowels", "consonants", "signs"] as const).map((g) => (
                            <div key={g} className="mt-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">{g}</h3>
                                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                                    {TRANSLIT_TABLE[g].map(([l, o]) => (
                                        <div key={l} className="rounded-lg border border-sand-200 bg-white px-3 py-2">
                                            <span lang="or" className="block font-odia text-xl text-ink-900">{o}</span>
                                            <code className="text-xs text-laterite-600">{l}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-ink-900">Examples</h2>
                        <ul className="mt-4 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                            {TRANSLIT_TABLE.examples.map(([l, o]) => (
                                <li key={l} className="flex items-center justify-between px-4 py-3"><code className="text-sm text-ink-600">{l}</code><span lang="or" className="font-odia text-xl text-ink-900">{o}</span></li>
                            ))}
                        </ul>
                        <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">Questions</h2>
                        <dl className="mt-4 space-y-4">
                            {FAQ.map((f) => (
                                <div key={f.q}><dt className="font-semibold text-ink-900">{f.q}</dt><dd className="mt-1 text-sm leading-relaxed text-ink-600">{f.a}</dd></div>
                            ))}
                        </dl>
                        <div className="mt-8 flex flex-wrap gap-2">
                            <Link href="/language/dictionary" className="btn-dark">Odia dictionary</Link>
                            <Link href="/language/odia-alphabet" className="btn-ghost">Learn the Odia alphabet</Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
