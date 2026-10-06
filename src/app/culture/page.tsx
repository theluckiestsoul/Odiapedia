import Link from "next/link";
import CategoryHub from "@/components/CategoryHub";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odia Culture, Festivals, Dance & Crafts",
    description:
        "Odisha's culture explained: festivals such as Rath Yatra, Raja, Nuakhai and Bali Jatra; Odissi, Gotipua and Chhau dance; Pattachitra, Sambalpuri ikat and other GI-tagged crafts.",
    path: "/culture",
    keywords: ["odia culture", "odisha festivals", "odisha festivals list", "odissi dance", "odisha handicrafts", "odisha gi tags", "sambalpuri saree", "pattachitra"],
});

export default function CulturePage() {
    return (
        <CategoryHub
            category="culture"
            title="Culture & Festivals of Odisha"
            odia="ଓଡ଼ିଶାର ସଂସ୍କୃତି ଓ ପର୍ବପର୍ବାଣି"
            description="Thirteen festivals in twelve months, as the Odia saying goes — plus classical and folk dance, temple traditions and some of India's finest handlooms and crafts."
            groups={[
                {
                    title: "Festivals",
                    description: "The festival year, from Pana Sankranti in spring to Makar Sankranti in winter.",
                    slugs: ["rath-yatra", "raja-parba", "nuakhai", "pana-sankranti", "durga-puja", "kumar-purnima", "makar-sankranti-en", "dola-purnima", "snana-yatra", "chandan-yatra", "boita-bandana", "bali-jatra", "dhanu-jatra", "prathamastami", "manabasa-gurubara", "sitala-sasthi", "utkal-divas", "konark-dance-festival", "odia-parba-en"],
                },
                {
                    title: "Dance & performance",
                    slugs: ["odissi-dance", "gotipua-dance", "chhau-dance", "danda-nacha", "sambalpuri-dance", "ghumura-dance"],
                },
                {
                    title: "Handloom & crafts",
                    description: "Many carry Geographical Indication (GI) tags — learn how to recognise the genuine article.",
                    slugs: ["odisha-gi-tags", "sambalpuri-saree", "pattachitra", "pipili-applique", "bomkai-saree", "kotpad-handloom", "khandua-silk", "tarakasi-silver-filigree", "dhokra-craft", "sabai-grass-craft", "palm-leaf-engraving"],
                },
                { title: "Calendars & traditions", slugs: ["jagannath-panjika", "biraja-panjika"] },
            ]}
            after={
                <section className="container-page pb-20">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/calendar" className="card-link flex items-center gap-4 p-6">
                            <Icon name="calendar" className="h-8 w-8 text-laterite-600" />
                            <span><span className="block font-display text-xl font-semibold">Festival calendar</span><span className="text-sm text-ink-600">Dates and today&apos;s panjika</span></span>
                        </Link>
                        <Link href="/culture/cinema/timeline" className="card-link flex items-center gap-4 p-6">
                            <Icon name="star" className="h-8 w-8 text-laterite-600" />
                            <span><span className="block font-display text-xl font-semibold">Odia cinema timeline</span><span className="text-sm text-ink-600">From Sita Bibaha (1936) onward</span></span>
                        </Link>
                        <Link href="/shop" className="card-link flex items-center gap-4 p-6">
                            <Icon name="shop" className="h-8 w-8 text-laterite-600" />
                            <span><span className="block font-display text-xl font-semibold">Buy authentic crafts</span><span className="text-sm text-ink-600">From artisan co-operatives</span></span>
                        </Link>
                    </div>
                </section>
            }
        />
    );
}
