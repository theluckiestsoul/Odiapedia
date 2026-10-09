import Link from "next/link";
import CategoryHub from "@/components/CategoryHub";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odia Language: Script, History, Dialects & Classical Status",
    description:
        "Everything about the Odia language — a classical language of India: its script and alphabet, history, dialects such as Sambalpuri and Desia, literature milestones and how to learn it.",
    path: "/language",
    keywords: ["odia language", "oriya language", "odia script", "odia alphabet", "odia classical language", "odia dialects", "learn odia"],
});

export default function LanguagePage() {
    return (
        <CategoryHub
            category="language"
            title="The Odia Language"
            odia="ଓଡ଼ିଆ ଭାଷା"
            description="Odia (ଓଡ଼ିଆ) is the official language of Odisha and one of India's classical languages, written in its own rounded script with a literary tradition reaching back many centuries."
            groups={[
                { title: "Overview", slugs: ["odia-language", "odia-classical-language", "odia-dialects"] },
                { title: "Script & writing", slugs: ["odia-alphabet", "odia-script-history"] },
                { title: "Literature & usage", slugs: ["odia-literature-milestones", "common-greetings"] },
            ]}
            heroChildren={
                <div className="flex flex-wrap gap-3">
                    <Link href="/language/odia-typing" className="btn-primary"><Icon name="pen" className="h-4 w-4" />Odia typing tool</Link>
                    <Link href="/language/dictionary" className="btn-dark"><Icon name="book" className="h-4 w-4" />Odia dictionary</Link>
                    <Link href="/language/font-converter" className="btn-ghost">Akruti / Sreelipi converter</Link>
                    <Link href="/language/literary-awards" className="btn-ghost">Literary awards</Link>
                    <Link href="/learn" className="btn-ghost">Start learning Odia</Link>
                </div>
            }
        />
    );
}
