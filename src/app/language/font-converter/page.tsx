import Link from "next/link";
import PageHero from "@/components/PageHero";
import FontConverter from "@/components/FontConverter";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Akruti & Sreelipi to Unicode Odia Converter (Free)",
    description: "Convert Odia text typed in the old Akruti or Sreelipi (Shreelipi) fonts to Unicode — and back. Free, instant, works in your browser; nothing is uploaded.",
    path: "/language/font-converter",
    keywords: ["akruti to unicode", "sreelipi to unicode", "odia font converter", "shreelipi to unicode odia", "unicode to akruti odia", "odia unicode converter"],
});

export default function FontConverterPage() {
    return (
        <div>
            <PageHero title="Odia font converter" odia="ଓଡ଼ିଆ ଫଣ୍ଟ ରୂପାନ୍ତରକ" description="Turn Odia typed in the older Akruti and Sreelipi fonts into Unicode text that works everywhere — websites, phones, search, email — or convert Unicode back for old DTP files." icon="pen" eyebrow="Language tools" crumbs={[{ name: "Language", href: "/language" }, { name: "Font converter", href: "/language/font-converter" }]} />
            <div className="container-page py-12">
                <FontConverter />
                <div className="mt-14 grid gap-8 lg:grid-cols-2">
                    <section>
                        <h2 className="font-display text-2xl font-semibold">Why convert?</h2>
                        <p className="mt-3 text-ink-700">Akruti and Sreelipi are typing systems from before Odia had wide Unicode support. They store Odia shapes in the slots of Latin letters, so the text only looks right with that font installed — elsewhere ଓଡ଼ିଶା typed in Akruti shows as <code>IWÿògû</code>, and it cannot be searched or read by phones and screen readers. Unicode stores the real Odia letters.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-2xl font-semibold">Tips</h2>
                        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-700">
                            <li>Copy the text straight from the Word or PageMaker file; keep each font&apos;s text separate.</li>
                            <li>English words and numbers typed in an ordinary font inside the same paragraph will be converted as if they were Odia — convert them separately.</li>
                            <li>Check names and rare conjuncts by eye: about 1 line in 20 in our tests needed a small manual fix (for example ଐ).</li>
                            <li>To type new Odia text, use the <Link href="/language/odia-typing" className="text-laterite-600 underline">Odia typing tool</Link>.</li>
                        </ul>
                    </section>
                </div>
                <p className="mt-10 max-w-3xl text-xs text-ink-500">
                    Conversion tables and method: <a href="https://github.com/theprabir/odia-legacy-converter" className="underline" target="_blank" rel="noopener noreferrer">Lipika by Prabir Kumar Das</a> (MIT licence), ported to run in the browser and checked line-for-line against the original on 1,500 lines of Odia text.
                </p>
            </div>
        </div>
    );
}
