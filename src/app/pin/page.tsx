import Link from "next/link";
import PageHero from "@/components/PageHero";
import { hubMetadata } from "@/lib/seo";
import { districtName } from "@/lib/districts";
import { PINS, PIN_CODES, PIN_SOURCE } from "@/lib/pins";

export const metadata = hubMetadata({
    title: "PIN Codes of Odisha: Villages by PIN Code",
    description: `${PIN_CODES.length} Odisha PIN codes with the villages recorded under each in the Census 2011 Village Directory — find the PIN code of any village, by district.`,
    path: "/pin",
    keywords: ["odisha pin code", "pin code of village odisha", "odisha pincode list", "village pin code"],
});

export default function PinIndex() {
    const byDistrict = new Map<string, string[]>();
    PIN_CODES.forEach((p) => {
        const counts = new Map<string, number>();
        PINS[p].forEach(([d]) => counts.set(d, (counts.get(d) || 0) + 1));
        const main = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
        byDistrict.set(main, [...(byDistrict.get(main) || []), p]);
    });
    return (
        <div>
            <PageHero title="PIN codes of Odisha" odia="ଓଡ଼ିଶାର ପିନ୍ କୋଡ୍" description={`${PIN_CODES.length} PIN codes and the villages listed under each. Open a district's codes, or search for a village to see its PIN code on its page.`} icon="mail" eyebrow="Places" crumbs={[{ name: "PIN codes", href: "/pin" }]} />
            <div className="container-page py-12">
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {[...byDistrict.entries()].sort((a, b) => (districtName(a[0]) || a[0]).localeCompare(districtName(b[0]) || b[0])).map(([d, list]) => (
                        <section key={d}>
                            <h2 className="font-display text-xl font-semibold"><Link href={`/district/${d}`} className="hover:underline">{districtName(d) || d}</Link> <span className="text-sm font-normal text-ink-500">· {list.length}</span></h2>
                            <ul className="mt-2 flex flex-wrap gap-1.5">
                                {list.map((p) => <li key={p}><Link href={`/pin/${p}`} className="chip !bg-white !px-2.5 !py-1 tabular-nums hover:border-laterite-300">{p}</Link></li>)}
                            </ul>
                        </section>
                    ))}
                </div>
                <p className="mt-10 max-w-3xl text-xs text-ink-500">Source: {PIN_SOURCE}. A PIN code belongs to a delivery post office and can cover many villages; codes and offices change, so confirm with India Post before sending anything important.</p>
            </div>
        </div>
    );
}
