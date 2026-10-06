import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getOdiaPages } from "@/lib/lang-map";
import { getAllDistrictSlugs } from "@/lib/districts";
import { getDistrictById } from "@/data/districts";
import { categoryInfo } from "@/lib/site";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ – Odiapedia in Odia",
    description: "ଓଡ଼ିଆପିଡ଼ିଆର ସମସ୍ତ ଓଡ଼ିଆ ଲେଖା: ଇତିହାସ, ସଂସ୍କୃତି, ଖାଦ୍ୟ, ଭାଷା, ବ୍ୟକ୍ତିତ୍ୱ ଓ ଓଡ଼ିଶାର ୩୦ ଜିଲ୍ଲା। All Odia-language articles on Odiapedia.",
    path: "/odia",
    keywords: ["odia articles", "odia wikipedia alternative", "odisha in odia", "ଓଡ଼ିଆ ଲେଖା", "ଓଡ଼ିଶା ଇତିହାସ ଓଡ଼ିଆରେ"],
});

const CAT_OD: Record<string, string> = { culture: "ସଂସ୍କୃତି ଓ ପର୍ବପର୍ବାଣି", history: "ଇତିହାସ", food: "ଖାଦ୍ୟ", language: "ଭାଷା ଓ ସାହିତ୍ୟ", people: "ବ୍ୟକ୍ତିତ୍ୱ", travel: "ଭ୍ରମଣ", learn: "ଶିକ୍ଷା", about: "ଆମ ବିଷୟରେ" };

export default function OdiaIndex() {
    const pages = getOdiaPages();
    const cats = [...new Set(pages.map((p) => p.category))];
    const districts = getAllDistrictSlugs().filter((s) => s.endsWith("-od"));
    return (
        <div lang="or">
            <PageHero title="ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ" description={`ଓଡ଼ିଆପିଡ଼ିଆର ${pages.length + districts.length}ଟି ଲେଖା ଓଡ଼ିଆରେ ଉପଲବ୍ଧ। ଅଧିକ ଲେଖା ନିୟମିତ ଭାବେ ଅନୁବାଦ କରାଯାଉଛି।`} icon="language" eyebrow="Odia · ଓଡ଼ିଆ" crumbs={[{ name: "ଓଡ଼ିଆ", href: "/odia" }]} />
            <div className="container-page space-y-12 py-12">
                {cats.map((c) => (
                    <section key={c}>
                        <h2 className="font-odia-serif text-3xl font-semibold text-ink-900">{CAT_OD[c] ?? categoryInfo(c).label}</h2>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {pages.filter((p) => p.category === c).sort((a, b) => a.title.localeCompare(b.title, "or")).map((p) => (
                                <li key={p.slug}>
                                    <Link href={`/${p.category}/${p.slug}`} className="card-link block p-4">
                                        <span className="block font-odia text-lg font-semibold text-ink-900">{p.title}</span>
                                        <span className="mt-1 line-clamp-2 block font-odia text-sm text-ink-600">{p.description}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
                <section>
                    <h2 className="font-odia-serif text-3xl font-semibold text-ink-900">ଓଡ଼ିଶାର ୩୦ ଜିଲ୍ଲା</h2>
                    <ul className="mt-5 flex flex-wrap gap-2">
                        {districts.map((d) => (
                            <li key={d}><Link href={`/district/${d}`} className="chip hover:bg-sand-200">{getDistrictById(d.replace(/-od$/, ""))?.name_od ?? d}</Link></li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
