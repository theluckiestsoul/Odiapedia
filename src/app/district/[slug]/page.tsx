import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { getDistrictById } from "@/data/districts";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";
import { getAdminDistrict, ADMIN_SOURCE, subdistrictSlug } from "@/lib/admin";
import { getDistrictAreas, AREA_CENSUS_SOURCE, AREA_CENSUS_SOURCE_URL } from "@/lib/census-areas";
import { getVillageRows, sumVillages, CENSUS_SOURCE, CENSUS_SOURCE_URL } from "@/lib/census";
import AreaProfile from "@/components/AreaProfile";
import ClimateTable, { getClimate } from "@/components/ClimateTable";
import { MONUMENTS, monumentTitle, districtStations } from "@/lib/geo-data";
import { acsOfDistrict, latest, winner, partyColor, partyAbbr } from "@/lib/elections";
import { AreaAmenitiesView } from "@/components/Amenities";
import { getAmenitiesFor, summariseAmenities } from "@/lib/amenities";
import { useMDXComponents } from "../../../../mdx-components";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import ArticleCard from "@/components/ArticleCard";
import DistrictTabs, { type DistrictTab } from "@/components/DistrictTabs";
import AdminExplorer from "@/components/AdminExplorer";
import { ChariotWheel } from "@/components/Motifs";
import { getAllArticlesMetadata } from "@/lib/mdx";
import { SITE, formatDate } from "@/lib/site";
import type { IconName } from "@/lib/site";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllDistrictSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const district = getDistrictBySlug(slug);

    if (!district) {
        return { title: "District not found", robots: { index: false } };
    }

    const isOdia = slug.endsWith("-od");
    const base = slug.replace(/-od$/, "");
    const nameEn = getDistrictBySlug(base)?.title || getDistrictById(base)?.name_en || district.title;
    const title = isOdia ? `${district.title} ଜିଲ୍ଲା – ${nameEn} District, Odisha (ଓଡ଼ିଆ)` : `${district.title} District, Odisha: Places, History & Facts`;
    const description =
        district.description ||
        `${nameEn} district of Odisha: headquarters, population, places to visit, history, food and administrative blocks.`;
    const hasOdia = getAllDistrictSlugs().includes(`${base}-od`);

    return {
        title,
        description,
        keywords: district.keywords.length ? district.keywords : undefined,
        alternates: {
            canonical: `/district/${slug}`,
            ...(hasOdia
                ? { languages: { en: `${SITE.url}/district/${base}`, or: `${SITE.url}/district/${base}-od`, "x-default": `${SITE.url}/district/${base}` } }
                : {}),
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: `${SITE.url}/district/${slug}`,
            locale: isOdia ? "or_IN" : "en_IN",
        },
    };
}

/** H2 headings used by the English district pages, grouped into tabs. */
const TAB_GROUPS: { id: string; label: string; icon: IconName; headings: string[] }[] = [
    { id: "overview", label: "Overview", icon: "info", headings: ["overview"] },
    { id: "history", label: "History", icon: "scroll", headings: ["history"] },
    { id: "places", label: "Places & travel", icon: "compass", headings: ["places to visit", "how to reach"] },
    { id: "culture", label: "Culture & food", icon: "mask", headings: ["culture and festivals", "food"] },
    { id: "land", label: "Land & economy", icon: "leaf", headings: ["geography and climate", "economy"] },
    { id: "people", label: "People", icon: "people", headings: ["notable people"] },
];

const DIST_EN = {
    tab: "People & towns",
    source: "Source",
    sourceNote: "Figures are from 2011, the most recent census with published district, town and village figures.",
    peopleH: (d: string) => `People of ${d} district`,
    peopleLead: (d: string, pop: string, hh: string, urb: string, lit: string, towns: number) =>
        `Census 2011 counted ${pop} people in ${hh} households in ${d} district. ${urb} lived in towns, and the literacy rate (age 7 and over) was ${lit}. The census recognised ${towns} towns in the district.`,
    townsH: (d: string) => `Towns of ${d}`,
    townsLead: (s: number, c: number) => `${s} statutory town${s === 1 ? "" : "s"} (municipal corporation, municipality, notified area council or industrial township) and ${c} census town${c === 1 ? "" : "s"} — places the census counted as urban but which are governed by gram panchayats.`,
    town: "Town",
    type: "Type",
    pop: "Population",
    lit: "Literacy",
    wards: "Wards",
    kind: (k: string) => k,
    townsNote: "Population of the town itself; for towns with outgrowths, the town page also gives the figure including them. Ward counts are the census wards of 2011.",
    sdH: "Census sub-districts: town and country",
    sd: "Sub-district",
    rural: "Rural",
    urban: "Urban",
    sdNote: "Odisha's census sub-districts are police-station areas, not revenue tahasils.",
    blocksH: (d: string) => `All blocks in ${d}`,
    block: "Block",
    gps: "GPs",
    villages: "Villages",
    villagePop: "Village pop.",
    stShare: "ST share",
    blocksNote: "GPs and villages: Local Government Directory (Dec 2022). Village population, literacy and Scheduled Tribe share: sum of the block's villages in",
    notIn2011: "no matching Census 2011 town",
};
const DIST_OR: typeof DIST_EN = {
    tab: "ଲୋକ ଓ ସହର",
    source: "ଉତ୍ସ",
    sourceNote: "ତଥ୍ୟ ୨୦୧୧ ଜନଗଣନାର — ଜିଲ୍ଲା, ସହର ଓ ଗ୍ରାମ ସ୍ତରର ପ୍ରକାଶିତ ସର୍ବଶେଷ ଜନଗଣନା।",
    peopleH: (d: string) => `${d} ଜିଲ୍ଲାର ଲୋକ`,
    peopleLead: (d: string, pop: string, hh: string, urb: string, lit: string, towns: number) =>
        `୨୦୧୧ ଜନଗଣନାରେ ${d} ଜିଲ୍ଲାରେ ${hh} ପରିବାରରେ ${pop} ଜଣ ଲୋକ ଗଣାଯାଇଥିଲେ। ${urb} ଲୋକ ସହରରେ ରହୁଥିଲେ ଏବଂ ସାକ୍ଷରତା ହାର (୭ ବର୍ଷରୁ ଅଧିକ) ${lit} ଥିଲା। ଜିଲ୍ଲାରେ ${towns}ଟି ସହର ଥିଲା।`,
    townsH: (d: string) => `${d}ର ସହର`,
    townsLead: (s: number, c: number) => `${s}ଟି ବିଧିବଦ୍ଧ ସହର (ମହାନଗର ନିଗମ, ପୌରପାଳିକା, ବିଜ୍ଞାପିତ ଅଞ୍ଚଳ ପରିଷଦ ବା ଶିଳ୍ପ ଟାଉନସିପ୍) ଓ ${c}ଟି ଜନଗଣନା ସହର — ଯାହାକୁ ଜନଗଣନା ସହର ଭାବେ ଗଣିଥିଲା କିନ୍ତୁ ଗ୍ରାମ ପଞ୍ଚାୟତ ଶାସନ କରେ।`,
    town: "ସହର",
    type: "ପ୍ରକାର",
    pop: "ଜନସଂଖ୍ୟା",
    lit: "ସାକ୍ଷରତା",
    wards: "ୱାର୍ଡ",
    kind: (k: string) => ({ "Census town": "ଜନଗଣନା ସହର", "Notified Area Council": "ବିଜ୍ଞାପିତ ଅଞ୍ଚଳ ପରିଷଦ", Municipality: "ପୌରପାଳିକା", "Municipal Corporation": "ମହାନଗର ନିଗମ", "Industrial township": "ଶିଳ୍ପ ଟାଉନସିପ୍" } as Record<string, string>)[k] || k,
    townsNote: "ସହରର ନିଜ ଜନସଂଖ୍ୟା; ବହିର୍ବୃଦ୍ଧି (outgrowth) ଥିବା ସହର ପାଇଁ ସହର ପୃଷ୍ଠାରେ ତାହା ସହିତ ସଂଖ୍ୟା ମଧ୍ୟ ଅଛି। ୱାର୍ଡ ସଂଖ୍ୟା ୨୦୧୧ର।",
    sdH: "ଜନଗଣନା ଉପ-ଜିଲ୍ଲା: ସହର ଓ ଗାଁ",
    sd: "ଉପ-ଜିଲ୍ଲା",
    rural: "ଗ୍ରାମାଞ୍ଚଳ",
    urban: "ସହରାଞ୍ଚଳ",
    sdNote: "ଓଡ଼ିଶାର ଜନଗଣନା ଉପ-ଜିଲ୍ଲାଗୁଡ଼ିକ ଥାନା ଅଞ୍ଚଳ, ରାଜସ୍ୱ ତହସିଲ ନୁହେଁ।",
    blocksH: (d: string) => `${d}ର ସମସ୍ତ ବ୍ଲକ`,
    block: "ବ୍ଲକ",
    gps: "ପଞ୍ଚାୟତ",
    villages: "ଗ୍ରାମ",
    villagePop: "ଗ୍ରାମ ଜନସଂଖ୍ୟା",
    stShare: "ଅ.ଜ.ଜା. ଅଂଶ",
    blocksNote: "ପଞ୍ଚାୟତ ଓ ଗ୍ରାମ: ସ୍ଥାନୀୟ ସରକାର ନିର୍ଦ୍ଦେଶିକା (ଡିସେମ୍ବର ୨୦୨୨)। ଗ୍ରାମ ଜନସଂଖ୍ୟା, ସାକ୍ଷରତା ଓ ଅନୁସୂଚିତ ଜନଜାତି ଅଂଶ: ବ୍ଲକର ଗ୍ରାମଗୁଡ଼ିକର ସମଷ୍ଟି —",
    notIn2011: "୨୦୧୧ ଜନଗଣନାରେ ମେଳ ଖାଉଥିବା ସହର ନାହିଁ",
};

interface Section {
    heading: string;
    body: string;
}

/** Split MDX into the intro and H2 sections (code fences respected). */
function splitSections(content: string): { intro: string; sections: Section[] } {
    const lines = content.replace(/^\s*#\s+[^\n]+\n+/, "").split("\n");
    let inCode = false;
    let intro: string[] = [];
    const sections: Section[] = [];
    for (const line of lines) {
        if (/^\s*```/.test(line)) inCode = !inCode;
        const m = !inCode && line.match(/^##\s+(.+?)\s*$/);
        if (m) {
            sections.push({ heading: m[1].trim(), body: "" });
            continue;
        }
        if (sections.length) sections[sections.length - 1].body += line + "\n";
        else intro.push(line);
    }
    return { intro: intro.join("\n").trim(), sections };
}

export default async function DistrictPage({ params }: PageProps) {
    const { slug } = await params;

    const districtContent = getDistrictBySlug(slug);
    const baseSlug = slug.replace(/-od$/, "");
    const isOdia = slug !== baseSlug;
    const districtData = getDistrictById(baseSlug);

    if (!districtContent) {
        notFound();
    }

    const admin = await getAdminDistrict(baseSlug);
    const mdxTehsils = getAllTehsilsForDistrict(baseSlug);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const components = useMDXComponents({});
    const { intro, sections } = splitSections(districtContent.content);

    // Build tabs from the content's H2 sections
    const used = new Set<number>();
    const tabs: DistrictTab[] = [];
    const panels: React.ReactNode[] = [];
    const renderMdx = (src: string) => (
        <MDXRemote source={src} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }} />
    );
    const nameEn = (isOdia ? getDistrictBySlug(baseSlug)?.title : districtContent.title) || districtData?.name_en || districtContent.title;

    for (const g of TAB_GROUPS) {
        const idx = sections.map((s, i) => (g.headings.includes(s.heading.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
        if (!idx.length && !(g.id === "overview" && intro)) continue;
        idx.forEach((i) => used.add(i));
        const src = [
            g.id === "overview" ? intro : "",
            ...idx.map((i) => (idx.length > 1 || g.id !== "overview" ? `## ${sections[i].heading}\n\n${sections[i].body}` : sections[i].body)),
        ]
            .filter(Boolean)
            .join("\n\n");
        tabs.push({ id: g.id, label: g.label, icon: g.icon });
        panels.push(
            <div className={g.id === "overview" ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]" : ""}>
                <div className="article-body min-w-0 max-w-[46rem]" lang={isOdia ? "or" : "en"}>
                    {renderMdx(src)}
                </div>
                {g.id === "overview" && districtContent.facts.length > 0 && (
                    <aside>
                        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white lg:sticky lg:top-40">
                            <div className="flex items-center gap-2 border-b border-sand-200 bg-sand-100 px-5 py-3">
                                <Icon name="info" className="h-4 w-4 text-laterite-600" />
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">Quick facts</p>
                            </div>
                            <dl className="divide-y divide-sand-100">
                                {districtContent.facts.map((f) => (
                                    <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3 text-sm">
                                        <dt className="font-medium text-ink-500">{f.label}</dt>
                                        <dd className="text-ink-900">{f.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <Link href={`/map#d=${baseSlug}`} className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-5 py-3 text-sm font-semibold text-laterite-600 hover:bg-laterite-50">
                                <span className="flex items-center gap-2"><Icon name="map" className="h-4 w-4" />Explore blocks &amp; villages on the map</span>
                                <Icon name="arrow" className="h-4 w-4" />
                            </Link>
                        </div>
                    </aside>
                )}
            </div>
        );
    }
    // Any section not in a known group (e.g. Odia-language pages) gets its own tab
    sections.forEach((s, i) => {
        if (used.has(i)) return;
        tabs.push({ id: `section-${i + 1}`, label: s.heading.replace(/[*_]/g, "").slice(0, 28), icon: "book" });
        panels.push(
            <div className="article-body max-w-[46rem]" lang={isOdia ? "or" : "en"}>
                {renderMdx(`## ${s.heading}\n\n${s.body}`)}
            </div>
        );
    });

    // Heritage, railways and climate (appended to the matching tabs, or a tab of their own)
    {
        const mons = MONUMENTS.filter((m) => m.district === baseSlug);
        const stns = districtStations(baseSlug).filter((x) => !x.halt);
        const halts = districtStations(baseSlug).filter((x) => x.halt);
        const travel = (mons.length > 0 || stns.length > 0) && (
            <div className="mt-12 grid gap-8 md:grid-cols-2">
                {mons.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold">Protected monuments ({mons.length})</h2>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            {mons.map((m) => <li key={m.id}><Link href={`/monuments/${m.id}`} className="font-semibold text-laterite-600 hover:underline">{monumentTitle(m)}</Link> <span className="text-xs text-ink-400">{m.number}</span></li>)}
                        </ul>
                        <p className="mt-2 text-xs text-ink-500">Monuments of National Importance protected by the Archaeological Survey of India. <Link href="/monuments" className="underline">All of Odisha</Link>.</p>
                    </section>
                )}
                <section>
                    <h2 className="font-display text-2xl font-semibold">Railway stations</h2>
                    {stns.length + halts.length > 0 ? (
                        <>
                            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                                {[...stns, ...halts].map((x) => <li key={`${x.name}${x.lat}`}><a href={`https://www.google.com/maps/search/?api=1&query=${x.lat},${x.lon}`} target="_blank" rel="noopener noreferrer nofollow" className="chip !bg-white !px-3 !py-1 hover:border-laterite-300">{x.name}{x.code ? ` · ${x.code}` : ""}{x.halt ? " (halt)" : ""}</a></li>)}
                            </ul>
                            <p className="mt-2 text-xs text-ink-500">{stns.length} stations and {halts.length} halts inside the district, as mapped on OpenStreetMap; some on new lines may not yet have regular trains.</p>
                        </>
                    ) : (
                        <p className="mt-3 text-sm text-ink-700">No railway station is mapped inside the district. Village pages list the nearest stations outside it.</p>
                    )}
                </section>
            </div>
        );
        const clim = getClimate(baseSlug) ? <div className="mt-12"><ClimateTable district={baseSlug} name={nameEn} /></div> : null;
        const iPlaces = tabs.findIndex((t) => t.id === "places");
        const iLand = tabs.findIndex((t) => t.id === "land");
        if (iPlaces >= 0 && travel) panels[iPlaces] = <div>{panels[iPlaces]}{travel}</div>;
        if (iLand >= 0 && clim) panels[iLand] = <div>{panels[iLand]}{clim}</div>;
        const leftover = [iPlaces < 0 ? travel : null, iLand < 0 ? clim : null].filter(Boolean);
        if (leftover.length) {
            tabs.push({ id: "heritage", label: isOdia ? "ଜଳବାୟୁ ଓ ଐତିହ୍ୟ" : "Climate & heritage", icon: "compass" });
            panels.push(<div>{leftover}</div>);
        }
    }

    const areas = getDistrictAreas(baseSlug);
    const localName = isOdia ? districtData?.name_od || nameEn : nameEn;
    const T = isOdia ? DIST_OR : DIST_EN;
    const fmt = (n: number) => n.toLocaleString("en-IN");
    const pc = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : "–");
    const sourceLine = (
        <>
            {T.source}: <a href={AREA_CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{AREA_CENSUS_SOURCE}</a>. {T.sourceNote}
        </>
    );
    const vrowsAll = await getVillageRows(baseSlug);
    const districtAmen = admin ? summariseAmenities(await getAmenitiesFor(baseSlug, admin.villages.map((v) => v.c).filter(Boolean)), (a) => !!vrowsAll[String(a.code)] && vrowsAll[String(a.code)][1] > 0) : null;
    if (areas?.total) {
        const c = areas.total;
        const statutory = areas.towns.filter((t) => t.kind !== "Census town");
        const censusTowns = areas.towns.filter((t) => t.kind === "Census town");
        tabs.splice(1, 0, { id: "population", label: T.tab, icon: "people" });
        panels.splice(
            1,
            0,
            <div className="space-y-12">
                <section>
                    <h2 className="font-display text-3xl font-semibold">{T.peopleH(localName)}</h2>
                    <p className="mt-3 max-w-3xl text-ink-700">
                        {T.peopleLead(localName, fmt(c.population), fmt(c.households), areas.urban ? pc(areas.urban.population, c.population) : "–", c.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–", areas.towns.length)}
                    </p>
                    <div className="mt-6">
                        <AreaProfile census={c} rural={areas.rural} urban={areas.urban} areaKm2={districtData?.area_sq_km} lang={isOdia ? "or" : "en"} source={sourceLine} />
                    </div>
                </section>
                {districtAmen && districtAmen.villages > 0 && !isOdia && <AreaAmenitiesView s={districtAmen} name={nameEn} unit="district" />}
                {areas.towns.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold">{T.townsH(localName)}</h2>
                        <p className="mt-2 max-w-3xl text-sm text-ink-600">{T.townsLead(statutory.length, censusTowns.length)}</p>
                        <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                            <table className="w-full min-w-[36rem] text-sm">
                                <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500">
                                    <tr><th className="px-4 py-2.5">{T.town}</th><th className="px-4 py-2.5">{T.type}</th><th className="px-4 py-2.5 text-right">{T.pop}</th><th className="px-4 py-2.5 text-right">{T.lit}</th><th className="px-4 py-2.5 text-right">{T.wards}</th></tr>
                                </thead>
                                <tbody className="divide-y divide-sand-100">
                                    {areas.towns.map((t) => (
                                        <tr key={t.code}>
                                            <td className="px-4 py-2"><Link href={`/district/${baseSlug}/town/${t.slug}`} className="font-semibold text-laterite-600 hover:underline">{t.name}</Link></td>
                                            <td className="px-4 py-2 text-ink-600">{T.kind(t.kind)}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{fmt(t.census.population)}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{t.census.literacyRate != null ? `${t.census.literacyRate.toFixed(1)}%` : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums text-ink-600">{t.wards ?? "–"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-2 text-xs text-ink-500">{T.townsNote}</p>
                    </section>
                )}
                {areas.subdistricts.length > 0 && admin && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold">{T.sdH}</h2>
                        <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                            <table className="w-full min-w-[34rem] text-sm">
                                <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500">
                                    <tr><th className="px-4 py-2.5">{T.sd}</th><th className="px-4 py-2.5 text-right">{T.pop}</th><th className="px-4 py-2.5 text-right">{T.rural}</th><th className="px-4 py-2.5 text-right">{T.urban}</th><th className="px-4 py-2.5 text-right">{T.lit}</th></tr>
                                </thead>
                                <tbody className="divide-y divide-sand-100">
                                    {areas.subdistricts.map((s) => {
                                        const sd = admin.subdistricts.find((x) => x.code === s.code);
                                        return (
                                            <tr key={s.code}>
                                                <td className="px-4 py-2">{sd ? <Link href={`/district/${baseSlug}/tahasil/${subdistrictSlug(sd)}`} className="font-semibold text-laterite-600 hover:underline">{s.name}</Link> : s.name}</td>
                                                <td className="px-4 py-2 text-right tabular-nums">{s.total ? fmt(s.total.population) : "–"}</td>
                                                <td className="px-4 py-2 text-right tabular-nums text-ink-600">{s.rural ? fmt(s.rural.population) : "–"}</td>
                                                <td className="px-4 py-2 text-right tabular-nums text-ink-600">{s.urban ? fmt(s.urban.population) : "–"}</td>
                                                <td className="px-4 py-2 text-right tabular-nums">{s.total?.literacyRate != null ? `${s.total.literacyRate.toFixed(1)}%` : "–"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-2 text-xs text-ink-500">{T.sdNote}</p>
                    </section>
                )}
            </div>
        );
    }

    // Administration tab (Government data)
    if (admin) {
        const summary = {
            district: baseSlug,
            districtName: nameEn,
            blocks: admin.blocks.map((b) => ({ code: b.code, name: b.name, slug: b.slug, gps: b.gps.filter((g) => g.code !== "0").length, villages: b.villages })),
            subdistricts: admin.subdistricts.map((s) => ({ code: s.code, name: s.name, slug: subdistrictSlug(s), villages: s.villages })),
            ulbs: admin.ulbs.map((u) => ({ code: u.code, name: u.name, type: u.type })),
        };
        const realBlocks = admin.blocks.filter((b) => b.code !== "0");
        const vrows = vrowsAll;
        const blockStats = realBlocks.map((b) => ({ b, c: sumVillages(admin.villages.filter((v) => v.b === b.code).map((v) => vrows[v.c])) }));
        const gpCount = realBlocks.reduce((n, b) => n + b.gps.filter((g) => g.code !== "0").length, 0);
        tabs.push({ id: "administration", label: isOdia ? "ବ୍ଲକ ଓ ଗ୍ରାମ" : "Blocks & villages", icon: "list" });
        panels.push(
            <div>
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="font-display text-3xl font-semibold">Blocks, sub-districts, panchayats &amp; villages</h2>
                        <p className="mt-2 max-w-2xl text-ink-600">
                            Choose a block, sub-district or town to see its details and its gram panchayats and villages. Open any village for its own page.
                        </p>
                        <p className="mt-1 text-xs text-ink-500">Counts below: Local Government Directory, December 2022 snapshot (LGD villages, which can differ from the district administration&apos;s revenue-village count).</p>
                    </div>
                    <dl className="grid grid-cols-4 gap-2 text-center">
                        {[
                            ["Blocks", realBlocks.length],
                            ["Sub-districts", admin.subdistricts.length],
                            ["GPs", gpCount],
                            ["LGD villages", admin.villages.length],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-xl border border-sand-200 bg-white px-3 py-2">
                                <dt className="text-[11px] uppercase tracking-wider text-ink-500">{k}</dt>
                                <dd className="font-display text-lg font-semibold">{Number(v).toLocaleString("en-IN")}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <AdminExplorer summary={summary} />

                {/* Crawlable index of blocks and tahasils */}
                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <h3 className="font-display text-xl font-semibold">{T.blocksH(localName)}</h3>
                        <div className="mt-3 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                            <table className="w-full min-w-[40rem] text-sm">
                                <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500">
                                    <tr><th className="px-4 py-2.5">{T.block}</th><th className="px-4 py-2.5 text-right">{T.gps}</th><th className="px-4 py-2.5 text-right">{T.villages}</th><th className="px-4 py-2.5 text-right">{T.villagePop}</th><th className="px-4 py-2.5 text-right">{T.lit}</th><th className="px-4 py-2.5 text-right">{T.stShare}</th></tr>
                                </thead>
                                <tbody className="divide-y divide-sand-100">
                                    {blockStats.map(({ b, c }) => (
                                        <tr key={b.code}>
                                            <td className="px-4 py-2"><Link href={`/district/${baseSlug}/block/${b.slug}`} className="font-semibold text-laterite-600 hover:underline">{b.name}</Link></td>
                                            <td className="px-4 py-2 text-right tabular-nums">{b.gps.filter((g) => g.code !== "0").length}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{fmt(b.villages)}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{c ? fmt(c.population) : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums">{c?.literacyRate != null ? `${c.literacyRate.toFixed(1)}%` : "–"}</td>
                                            <td className="px-4 py-2 text-right tabular-nums text-ink-600">{c ? pc(c.st, c.population) : "–"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-2 text-xs text-ink-500">{T.blocksNote} <a href={CENSUS_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{CENSUS_SOURCE}</a>.</p>
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-semibold">All census sub-districts</h3>
                        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                            {admin.subdistricts.map((s) => (
                                <li key={s.code}><Link href={`/district/${baseSlug}/tahasil/${subdistrictSlug(s)}`} className="text-laterite-600 hover:underline">{s.name}</Link> <span className="text-ink-400">({s.villages})</span></li>
                            ))}
                        </ul>
                        {admin.ulbs.length > 0 && (
                            <>
                                <h3 className="mt-6 font-display text-xl font-semibold">Towns (urban local bodies)</h3>
                                <ul className="mt-3 space-y-1 text-sm text-ink-700">
                                    {admin.ulbs.map((u) => {
                                        const t = areas?.towns.find((x) => x.code === u.census2011);
                                        return <li key={u.code}>{t ? <Link href={`/district/${baseSlug}/town/${t.slug}`} className="text-laterite-600 hover:underline">{u.name}</Link> : u.name} <span className="text-ink-400">· {u.type || "Urban local body"}{t ? "" : ` · ${T.notIn2011}`}</span></li>;
                                    })}
                                </ul>
                            </>
                        )}
                        {mdxTehsils.length > 0 && (
                            <>
                                <h3 className="mt-6 font-display text-xl font-semibold">Tehsil guides</h3>
                                <ul className="mt-3 space-y-1 text-sm">
                                    {mdxTehsils.map((t) => <li key={t.slug}><Link href={`/district/${baseSlug}/${t.slug}`} className="text-laterite-600 hover:underline">{t.title}</Link></li>)}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
                {acsOfDistrict(baseSlug).length > 0 && (
                    <div className="mt-10">
                        <h3 className="font-display text-xl font-semibold">{isOdia ? "ବିଧାନସଭା ନିର୍ବାଚନମଣ୍ଡଳୀ" : `Assembly constituencies in ${nameEn}`}</h3>
                        <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                            {acsOfDistrict(baseSlug).map((a) => { const w = winner(latest(a.results)); return (
                                <li key={a.no} className="flex items-baseline gap-2"><span className="w-7 text-right text-xs text-ink-400">{a.no}</span><Link href={`/elections/assembly/${a.slug}`} className="font-semibold text-laterite-600 hover:underline">{a.name}</Link>{a.reservation !== "None" && <span className="text-xs text-ink-500">{a.reservation}</span>}{w && <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-600"><span className="h-2 w-2 rounded-full" style={{ background: partyColor(w.party) }} />{w.name} · {partyAbbr(w.party)}</span>}</li>
                            ); })}
                        </ul>
                    </div>
                )}
                <p className="mt-8 text-xs text-ink-500">
                    Source: {ADMIN_SOURCE}. Sub-districts follow the Local Government Directory, which for Odisha uses the Census sub-districts (police-station areas) — these are not the same as revenue tahasils. Boundaries and names change over time; check the district administration for current status.
                </p>
            </div>
        );
    }

    // Related articles that mention the district (internal linking)
    const escaped = nameEn.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
    const nameRe = new RegExp("\\b" + escaped + "\\b", "i");
    const related = isOdia
        ? []
        : getAllArticlesMetadata()
              .filter((a) => (!a.lang || a.lang === "en") && !a.noindex && a.category !== "about")
              .filter((a) => a.facts.some((f) => /district|location|region|where/i.test(f.label) && nameRe.test(f.value)) || nameRe.test(a.title))
              .slice(0, 6);

    const stats = [
        { k: "Headquarters", v: districtContent.headquarters || districtData?.headquarters },
        { k: "Population (2011)", v: districtContent.population || (districtData ? districtData.population.toLocaleString("en-IN") : undefined) },
        { k: "Area", v: districtContent.area || (districtData ? `${districtData.area_sq_km.toLocaleString("en-IN")} sq km` : undefined) },
        { k: "Villages", v: admin ? admin.villages.length.toLocaleString("en-IN") : undefined },
        { k: "Literacy (2011)", v: getDistrictAreas(baseSlug)?.total?.literacyRate?.toFixed(1)?.concat("%") },
        { k: "Towns (2011)", v: getDistrictAreas(baseSlug)?.towns.length ? String(getDistrictAreas(baseSlug)!.towns.length) : undefined },
    ].filter((x) => x.v);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AdministrativeArea",
                name: `${nameEn} district`,
                alternateName: districtData?.name_od,
                description: districtContent.description,
                url: `${SITE.url}/district/${slug}`,
                containedInPlace: { "@type": "State", name: "Odisha", containedInPlace: { "@type": "Country", name: "India" } },
                ...(districtData ? { geo: { "@type": "GeoCoordinates", latitude: districtData.centroid[0], longitude: districtData.centroid[1] } } : {}),
                ...(admin ? { identifier: [{ "@type": "PropertyValue", propertyID: "LGD district code", value: admin.lgdCode }, { "@type": "PropertyValue", propertyID: "Census 2011 code", value: admin.census2011 }] } : {}),
            },
            ...(districtContent.faq.length
                ? [{ "@type": "FAQPage", mainEntity: districtContent.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
                : []),
        ],
    };
    const reportHref = `mailto:${SITE.correctionsEmail}?subject=${encodeURIComponent(`Correction: ${nameEn} district`)}&body=${encodeURIComponent(`Page: ${SITE.url}/district/${slug}\n\nWhat is incorrect or missing?\n\nSource:\n`)}`;

    return (
        <div lang={isOdia ? "or" : undefined}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <ChariotWheel className="pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] text-laterite-500/[0.07]" />
                <div className="container-page relative py-10 md:py-14">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: districtContent.title, href: `/district/${slug}` }]} />
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {districtData && (
                            <span className="eyebrow"><Icon name="pin" className="h-4 w-4" />{districtData.region} Odisha</span>
                        )}
                        <Link href={isOdia ? `/district/${baseSlug}` : `/district/${baseSlug}-od`} className="chip hover:border-laterite-300" lang={isOdia ? "en" : "or"}>
                            {isOdia ? "Read in English" : "ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ"}
                        </Link>
                    </div>
                    <h1 className="mt-3 font-display text-5xl font-semibold md:text-6xl" lang={isOdia ? "or" : "en"}>
                        {districtContent.title}{!isOdia && <span className="text-ink-400"> district</span>}
                    </h1>
                    {districtData && !isOdia && <p lang="or" className="mt-2 font-odia-serif text-2xl text-laterite-600">{districtData.name_od} ଜିଲ୍ଲା</p>}
                    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-600 md:text-xl" lang={isOdia ? "or" : "en"}>{districtContent.description}</p>
                    {stats.length > 0 && (
                        <dl className="mt-8 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                            {stats.map((x) => (
                                <div key={x.k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                    <dt className="text-xs uppercase tracking-wider text-ink-500">{x.k}</dt>
                                    <dd className="mt-1 font-display text-lg font-semibold text-ink-900">{x.v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </header>

            <div className="container-page pb-12">
                <DistrictTabs tabs={tabs} panels={panels} />

                {districtContent.faq.length > 0 && (
                    <section className="mt-16 max-w-[46rem]">
                        <h2 className="font-display text-[1.75rem] font-semibold">Frequently asked questions</h2>
                        <div className="mt-6 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
                            {districtContent.faq.map((f, i) => (
                                <details key={i} className="group p-5" open={i === 0}>
                                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink-900">
                                        <h3 className="font-sans text-base font-semibold">{f.q}</h3>
                                        <Icon name="chevron" className="mt-0.5 h-5 w-5 shrink-0 text-laterite-500 transition-transform group-open:rotate-180" />
                                    </summary>
                                    <p className="mt-3 leading-relaxed text-ink-700">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </section>
                )}

                {districtContent.sources.length > 0 && (
                    <section id="sources" className="mt-14 max-w-[46rem]">
                        <h2 className="font-display text-[1.75rem] font-semibold">Sources &amp; references</h2>
                        <ol className="mt-5 space-y-3 text-sm">
                            {districtContent.sources.map((s, i) => (
                                <li key={s.url} className="flex gap-3">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand-100 text-xs font-semibold text-ink-600">{i + 1}</span>
                                    <span>
                                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-900 underline decoration-sand-300 underline-offset-4 hover:text-laterite-600">{s.title}</a>
                                        {s.publisher && <span className="text-ink-500"> — {s.publisher}</span>}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                <div className="mt-10 flex max-w-[46rem] flex-col gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-5 text-sm text-ink-600 sm:flex-row sm:items-center sm:justify-between">
                    <p>{districtContent.updated ? <>Last reviewed <time dateTime={districtContent.updated}>{formatDate(districtContent.updated)}</time>. </> : null}<Link href="/about/editorial-policy" className="underline underline-offset-4 hover:text-laterite-600">How we check articles</Link></p>
                    <a href={reportHref} className="btn-ghost shrink-0 !py-2"><Icon name="flag" className="h-4 w-4" />Report an error</a>
                </div>
            </div>

            {related.length > 0 && (
                <section className="border-t border-sand-200 bg-sand-100/60 py-14">
                    <div className="container-page">
                        <h2 className="font-display text-3xl font-semibold">On Odiapedia: {nameEn}</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {related.map((a) => <ArticleCard key={`${a.category}/${a.slug}`} article={a} compact />)}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
