import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import { districtName } from "@/lib/districts";
import { getAdminDistrict, villageId, gpId } from "@/lib/admin";
import { PINS, PIN_CODES, PIN_SOURCE } from "@/lib/pins";

type Props = { params: Promise<{ code: string }> };
export function generateStaticParams() {
    return PIN_CODES.map((code) => ({ code }));
}

async function load(code: string) {
    const rows = PINS[code];
    if (!rows) return null;
    const groups: { d: string; name: string; blocks: { block: string; slug: string; villages: { n: string; href: string; gp?: { name: string; href: string } }[] }[] }[] = [];
    for (const d of [...new Set(rows.map((r) => r[0]))]) {
        const a = await getAdminDistrict(d);
        if (!a) continue;
        const codes = new Set(rows.filter((r) => r[0] === d).map((r) => r[1]));
        const vs = a.villages.filter((v) => codes.has(v.c));
        const blocks = new Map<string, { block: string; slug: string; villages: { n: string; href: string; gp?: { name: string; href: string } }[] }>();
        for (const v of vs) {
            const b = a.blocks.find((x) => x.code === v.b);
            const g = b?.gps.find((x) => x.code === v.g && x.code !== "0");
            const k = b?.code ?? "0";
            if (!blocks.has(k)) blocks.set(k, { block: b && b.code !== "0" ? b.name : "Other", slug: b && b.code !== "0" ? b.slug : "", villages: [] });
            blocks.get(k)!.villages.push({ n: v.n, href: `/district/${d}/village/${villageId(v)}`, gp: g ? { name: g.name, href: `/district/${d}/gp/${gpId(g)}` } : undefined });
        }
        groups.push({ d, name: districtName(d) || a.lgdName, blocks: [...blocks.values()].sort((x, y) => y.villages.length - x.villages.length) });
    }
    return { rows, groups };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { code } = await params;
    const r = await load(code);
    if (!r) return { title: "PIN code not found", robots: { index: false } };
    const places = r.groups.flatMap((g) => g.blocks.map((b) => b.block)).filter((x) => x !== "Other").slice(0, 3).join(", ");
    return {
        title: [`PIN Code ${code}: Villages in ${r.groups.map((g) => g.name).join(" & ")}, Odisha`, `PIN Code ${code}: Villages in ${r.groups[0].name}`].find((t) => t.length <= 58) || `PIN Code ${code}, Odisha`,
        description: `PIN code ${code} covers ${r.rows.length} village${r.rows.length === 1 ? "" : "s"} in ${places ? `${places} block${places.includes(",") ? "s" : ""}, ` : ""}${r.groups.map((g) => g.name).join(" and ")} district, Odisha, according to the Census 2011 Village Directory. Full list of villages.`,
        alternates: { canonical: `/pin/${code}` },
    };
}

export default async function PinPage({ params }: Props) {
    const { code } = await params;
    const r = await load(code);
    if (!r) notFound();
    const idx = PIN_CODES.indexOf(code);
    const near = PIN_CODES.slice(Math.max(0, idx - 6), idx + 7).filter((p) => p !== code);
    return (
        <div>
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-12">
                    <Breadcrumbs items={[{ name: "PIN codes", href: "/pin" }, { name: code, href: `/pin/${code}` }]} />
                    <p className="eyebrow mt-6"><Icon name="mail" className="h-4 w-4" />PIN code · Odisha</p>
                    <h1 className="mt-3 font-display text-5xl font-semibold tabular-nums">{code}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">
                        {r.rows.length} village{r.rows.length === 1 ? " was" : "s were"} recorded with PIN code {code} in the Census 2011 Village Directory, in {r.groups.map((g, i) => <span key={g.d}>{i ? " and " : ""}<Link href={`/district/${g.d}`} className="text-laterite-600 hover:underline">{g.name}</Link></span>)} district.
                    </p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`post office ${code}`)}`} target="_blank" rel="noopener noreferrer nofollow" className="btn-ghost mt-5 !bg-white"><Icon name="map" className="h-4 w-4" />Find the post office on Google Maps</a>
                </div>
            </header>
            <div className="container-page space-y-10 py-10">
                {r.groups.map((g) => (
                    <section key={g.d}>
                        {r.groups.length > 1 && <h2 className="font-display text-2xl font-semibold">{g.name} district</h2>}
                        {g.blocks.map((b) => (
                            <div key={b.block} className="mt-6">
                                <h3 className="font-display text-xl font-semibold">{b.slug ? <Link href={`/district/${g.d}/block/${b.slug}`} className="hover:text-laterite-700 hover:underline">{b.block} block</Link> : b.block} <span className="text-sm font-normal text-ink-500">· {b.villages.length} villages</span></h3>
                                <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                    {b.villages.sort((x, y) => x.n.localeCompare(y.n)).map((v) => (
                                        <li key={v.href}><Link prefetch={false} href={v.href} className="font-semibold text-laterite-600 hover:underline">{v.n}</Link>{v.gp && <span className="text-xs text-ink-500"> · <Link prefetch={false} href={v.gp.href} className="hover:underline">{v.gp.name} GP</Link></span>}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                ))}
                <section>
                    <h2 className="font-display text-xl font-semibold">Nearby PIN codes</h2>
                    <ul className="mt-3 flex flex-wrap gap-2">{near.map((p) => <li key={p}><Link href={`/pin/${p}`} className="chip !bg-white !px-3 !py-1 tabular-nums hover:border-laterite-300">{p}</Link></li>)}</ul>
                </section>
                <p className="max-w-3xl text-xs text-ink-500">Source: {PIN_SOURCE}. Towns are not included. A PIN code belongs to a delivery post office; codes and post-office areas change, so confirm with India Post before sending anything important.</p>
            </div>
        </div>
    );
}
