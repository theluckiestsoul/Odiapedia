import type { ReactNode } from "react";
import { AMENITY_SOURCE, AMENITY_SOURCE_URL, type AreaAmenities, type VillageAmenities, type TownDirectory } from "@/lib/amenities";

const fmt = (n: number) => n.toLocaleString("en-IN");
const ha = (n: number) => `${fmt(Math.round(n))} ha`;
const km2 = (hectares: number) => (hectares / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const REACH: Record<string, string> = { a: "under 5 km away", b: "5–10 km away", c: "over 10 km away" };

function reach(v: unknown): { ok: boolean; text: string } | null {
    if (v === 1) return { ok: true, text: "In the village" };
    if (typeof v === "string" && REACH[v]) return { ok: false, text: `Nearest ${REACH[v]}` };
    return null;
}

function Status({ ok, children }: { ok: boolean; children: ReactNode }) {
    return (
        <span className={`inline-flex items-center gap-1.5 ${ok ? "text-[#3d6b33]" : "text-ink-600"}`}>
            <span className={`h-2 w-2 shrink-0 rounded-full ${ok ? "bg-[#5f8f4e]" : "bg-sand-300"}`} aria-hidden="true" />
            {children}
        </span>
    );
}

function Group({ title, rows }: { title: string; rows: [string, ReactNode][] }) {
    const shown = rows.filter(([, v]) => v != null && v !== "");
    if (!shown.length) return null;
    return (
        <div className="rounded-2xl border border-sand-200 bg-white">
            <h3 className="border-b border-sand-200 bg-sand-50 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-ink-600">{title}</h3>
            <dl className="divide-y divide-sand-100 text-sm">
                {shown.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 px-5 py-2.5">
                        <dt className="text-ink-600">{k}</dt>
                        <dd className="text-ink-900">{v}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

function SourceNote({ extra }: { extra?: string }) {
    return (
        <p className="mt-4 text-xs text-ink-500">
            Source: <a href={AMENITY_SOURCE_URL} className="underline" target="_blank" rel="noopener noreferrer">{AMENITY_SOURCE}</a>. The facilities were recorded for the 2011 census (reference year 2009 for most items); many places have changed since.{extra ? ` ${extra}` : ""}
        </p>
    );
}

/** Facilities of one village from the Census 2011 Village Directory. */
export function VillageAmenitiesView({ a, name }: { a: VillageAmenities; name: string }) {
    const r = (k: string) => {
        const x = reach(a[k]);
        return x ? <Status ok={x.ok}>{x.text}</Status> : null;
    };
    const school = (label: string, g: string, p: string, near: string, at?: string): [string, ReactNode] => {
        const n = Number(a[g]) + Number(a[p]);
        if (n > 0) return [label, <Status key={label} ok>{n} in the village ({Number(a[g])} government, {Number(a[p])} private)</Status>];
        const x = typeof a[near] === "string" && REACH[a[near] as string];
        return [label, x ? <Status key={label} ok={false}>Nearest {x}{at && a[at] ? ` (${a[at]})` : ""}</Status> : null];
    };
    const count = (label: string, k: string, near?: string): [string, ReactNode] => {
        const n = Number(a[k]);
        if (n > 0) return [label, <Status key={label} ok>{n} in the village</Status>];
        const x = near && typeof a[near] === "string" ? REACH[a[near] as string] : "";
        return [label, x ? <Status key={label} ok={false}>Nearest {x}</Status> : null];
    };
    const water = [
        ["tapTreated", "treated tap water"],
        ["tapUntreated", "untreated tap water"],
        ["handPump", "hand pumps"],
        ["tubeWell", "tube wells"],
        ["coveredWell", "covered wells"],
        ["uncoveredWell", "open wells"],
        ["tank", "tanks or ponds"],
        ["river", "river or canal"],
        ["spring", "springs"],
    ].filter(([k]) => a[k] === 1).map(([, l]) => l);
    const list = (k: string) => String(a[k] || "").split("|").filter(Boolean);
    const land: [string, number][] = [
        ["Net area sown", Number(a.netSown)],
        ["Forest", Number(a.forest)],
        ["Non-agricultural use", Number(a.nonAgri)],
        ["Culturable waste", Number(a.culturableWaste)],
        ["Pasture and grazing", Number(a.pasture)],
        ["Tree crops", Number(a.treeCrops)],
        ["Fallow", Number(a.fallowCurrent) + Number(a.fallowOther)],
        ["Barren", Number(a.barren)],
    ];
    const landTotal = land.reduce((s, [, v]) => s + v, 0);
    const COLORS = ["#5f8f4e", "#2f5d3a", "#a98a5c", "#c9a227", "#8fb573", "#cf6a43", "#d8c7a4", "#8c8173"];
    const irrig = Number(a.irrigated);
    const irrSources = ([["canals", a.irrCanal], ["wells and tube wells", a.irrWell], ["tanks and lakes", a.irrTank], ["other sources", a.irrOther]] as [string, unknown][]).filter(([, v]) => Number(v) > 0).map(([k]) => k);
    const powerHours = Number(a.powerSummer) || Number(a.powerWinter) ? ` (about ${Number(a.powerSummer) || "?"} h a day in summer, ${Number(a.powerWinter) || "?"} h in winter)` : "";

    return (
        <section className="mb-10" aria-labelledby="facilities-h">
            <h2 id="facilities-h" className="font-display text-2xl font-semibold">Facilities and land</h2>
            <p className="mt-3 text-ink-700">
                What the Census 2011 Village Directory recorded for {name}
                {Number(a.area) > 0 ? `: an area of ${ha(Number(a.area))} (${km2(Number(a.area))} km²)` : ""}
                {a.town ? `, ${Number(a.townKm)} km from the nearest town, ${a.town}` : ""}
                {Number(a.dhqKm) ? `, and ${Number(a.dhqKm)} km from the district headquarters` : ""}.
                {a.pin ? ` PIN code ${a.pin}.` : ""}
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <Group
                    title="Schools and colleges"
                    rows={[
                        school("Pre-primary", "prePrimaryG", "prePrimaryP", "_"),
                        school("Primary school", "primaryG", "primaryP", "primaryNear"),
                        school("Middle school", "middleG", "middleP", "middleNear"),
                        school("Secondary school", "secondaryG", "secondaryP", "secondaryNear", "secondaryAt"),
                        school("Senior secondary", "seniorG", "seniorP", "seniorNear", "seniorAt"),
                        [
                            "Degree college",
                            Number(a.college) > 0 ? <Status key="c" ok>{Number(a.college)} in the village</Status> : a.collegeNear && REACH[a.collegeNear as string] ? <Status key="c" ok={false}>Nearest {REACH[a.collegeNear as string]}{a.collegeAt ? ` (${a.collegeAt})` : ""}</Status> : null,
                        ],
                        ["ITI / vocational", Number(a.iti) > 0 ? <Status key="i" ok>{Number(a.iti)} in the village</Status> : null],
                    ]}
                />
                <Group
                    title="Health"
                    rows={[
                        count("Community health centre", "chc", "chcNear"),
                        count("Primary health centre", "phc", "phcNear"),
                        count("Health sub-centre", "subCentre", "subCentreNear"),
                        count("Hospital", "hospital", "hospitalNear"),
                        count("Dispensary", "dispensary"),
                        count("Veterinary hospital", "vet", "vetNear"),
                        ["Anganwadi centre", r("anganwadi")],
                        ["ASHA health worker", r("asha")],
                        ["Medicine shops", Number(a.medicineShop) > 0 ? `${Number(a.medicineShop)}` : null],
                    ]}
                />
                <Group
                    title="Water, power and sanitation"
                    rows={[
                        ["Drinking water", water.length ? water.join(", ") : null],
                        ["Electricity for homes", a.power === 1 ? <Status key="p" ok>Yes{powerHours}</Status> : a.power === 0 && Number(a.area) > 0 ? <Status key="p" ok={false}>Not recorded</Status> : null],
                        ["Electricity for farming", a.powerAgri === 1 ? <Status key="pa" ok>Yes</Status> : null],
                        ["Drainage", a.closedDrain === 1 ? "Closed drains" : a.openDrain === 1 ? "Open drains" : "No drainage recorded"],
                        ["Total Sanitation Campaign", a.tsc === 1 ? "Covered" : null],
                        ["Garbage collection", a.wasteCollection === 1 ? "House-to-house collection" : null],
                    ]}
                />
                <Group
                    title="Roads, transport and communication"
                    rows={[
                        ["All-weather road", r("allWeather")],
                        ["Pucca (black-topped) road", r("pucca")],
                        ["National highway", r("nh")],
                        ["State highway", r("sh")],
                        ["Public bus", r("publicBus")],
                        ["Private bus", r("privateBus")],
                        ["Railway station", r("railway")],
                        ["Autorickshaw", r("auto")],
                        ["Ferry", r("ferry")],
                        ["Post office", a.postOffice === 1 ? <Status key="po" ok>Post office in the village</Status> : a.subPostOffice === 1 ? <Status key="po" ok>Sub post office in the village</Status> : r("postOffice")],

                        ["Mobile coverage", r("mobile")],
                        ["Internet / common service centre", r("internet")],
                    ]}
                />
                <Group
                    title="Banks, markets and services"
                    rows={[
                        ["Commercial bank", r("bank")],
                        ["Co-operative bank", r("coopBank")],
                        ["ATM", r("atm")],
                        ["Agricultural credit society", r("creditSociety")],
                        ["Self-help group", r("shg")],
                        ["Ration (PDS) shop", r("pds")],
                        ["Weekly haat", r("haat")],
                        ["Mandi / regular market", r("mandi")],
                        ["Polling station", r("pollingStation")],
                        ["Birth and death registration", r("birthRegistration")],
                    ]}
                />
                <Group
                    title="Community and leisure"
                    rows={[
                        ["Community centre", r("communityCentre")],
                        ["Sports field", r("sportsField")],
                        ["Public library", r("library")],
                        ["Reading room", r("readingRoom")],
                        ["Cinema or video hall", r("cinema")],
                        ["Daily newspaper", r("newspaper")],
                    ]}
                />
            </div>

            {(list("agri").length > 0 || list("manufactured").length > 0 || list("handicraft").length > 0) && (
                <div className="mt-6">
                    <h3 className="font-display text-xl font-semibold">What {name} produces</h3>
                    <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                        {list("agri").map((x) => <li key={`a${x}`} className="chip !bg-white">🌾 {x}</li>)}
                        {list("manufactured").map((x) => <li key={`m${x}`} className="chip !bg-white">🏭 {x}</li>)}
                        {list("handicraft").map((x) => <li key={`h${x}`} className="chip !bg-white">🧺 {x}</li>)}
                    </ul>
                    <p className="mt-2 text-xs text-ink-500">The main farm, manufactured and handicraft products named in the directory, most important first.</p>
                </div>
            )}

            {landTotal > 0 && (
                <div className="mt-6">
                    <h3 className="font-display text-xl font-semibold">How the land is used</h3>
                    <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-sand-100" role="img" aria-label={land.filter(([, v]) => v > 0).map(([k, v]) => `${k} ${ha(v)}`).join(", ")}>
                        {land.map(([k, v], i) => (v > 0 ? <span key={k} style={{ width: `${(v / landTotal) * 100}%`, background: COLORS[i] }} /> : null))}
                    </div>
                    <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                        {land.filter(([, v]) => v > 0).map(([k, v]) => (
                            <li key={k} className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: COLORS[land.findIndex(([x]) => x === k)] }} aria-hidden="true" />
                                <span className="text-ink-700">{k}</span>
                                <span className="ml-auto tabular-nums text-ink-900">{ha(v)}</span>
                            </li>
                        ))}
                    </ul>
                    {Number(a.netSown) > 0 && (
                        <p className="mt-3 text-sm text-ink-700">
                            {irrig > 0
                                ? `${ha(irrig)} of farmland was irrigated${irrSources.length ? `, from ${irrSources.join(", ")}` : ""}.`
                                : "No irrigated land was recorded; farming here depended on rain."}
                        </p>
                    )}
                </div>
            )}
            <SourceNote />
        </section>
    );
}

/** Summary of the facilities across the villages of a gram panchayat, block or district. */
export function AreaAmenitiesView({ s, name, unit }: { s: AreaAmenities; name: string; unit: string }) {
    if (!s.villages) return null;
    const groups = [...new Set(s.facilities.map((f) => f.group))];
    const L = s.land;
    return (
        <section aria-labelledby="area-facilities-h">
            <h2 id="area-facilities-h" className="font-display text-2xl font-semibold">Facilities in the villages of {name}</h2>
            <p className="mt-3 max-w-3xl text-ink-700">
                How many of the {fmt(s.inhabited)} inhabited villages of this {unit} had each facility within the village itself, from the Census 2011 Village Directory.
                {L.area > 0 ? ` Together the ${fmt(s.villages)} villages cover ${fmt(Math.round(L.area / 100))} km², ${L.netSown > 0 ? `${Math.round((L.netSown / L.area) * 100)}% of it sown with crops` : ""}${L.forest > 0 ? ` and ${Math.round((L.forest / L.area) * 100)}% forest` : ""}.` : ""}
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((g) => (
                    <div key={g} className="rounded-2xl border border-sand-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-600">{g}</h3>
                        <ul className="mt-3 space-y-2.5 text-sm">
                            {s.facilities.filter((f) => f.group === g).map((f) => (
                                <li key={f.key}>
                                    <div className="flex justify-between gap-3"><span className="text-ink-700">{f.label}</span><span className="tabular-nums text-ink-900">{fmt(f.count)} <span className="text-ink-500">of {fmt(s.inhabited)}</span></span></div>
                                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand-100"><div className="h-full rounded-full bg-[#5f8f4e]" style={{ width: `${s.inhabited ? (f.count / s.inhabited) * 100 : 0}%` }} /></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
                {[
                    ["Primary schools", s.schools.primary],
                    ["Middle schools", s.schools.middle],
                    ["Secondary schools", s.schools.secondary + s.schools.senior],
                    ["Degree colleges", s.schools.colleges],
                    ["Primary health centres", s.health.phc + s.health.chc],
                    ["Health sub-centres", s.health.subCentre],
                ].map(([k, v]) => (
                    <div key={k as string} className="rounded-xl border border-sand-200 bg-sand-50 px-4 py-3">
                        <dt className="text-ink-600">{k}</dt>
                        <dd className="mt-0.5 font-display text-xl font-semibold tabular-nums">{fmt(v as number)}</dd>
                    </div>
                ))}
            </dl>
            {(s.crops.length > 0 || s.crafts.length > 0) && (
                <p className="mt-5 text-sm text-ink-700">
                    {s.crops.length > 0 && <>Main crops named by villages: {s.crops.map((c) => `${c.name} (${fmt(c.villages)})`).join(", ")}. </>}
                    {s.crafts.length > 0 && <>Handicrafts: {s.crafts.map((c) => `${c.name} (${fmt(c.villages)})`).join(", ")}.</>}
                </p>
            )}
            <SourceNote extra="Facilities in towns are not included." />
        </section>
    );
}

/** Civic facilities and history of a town from the Census 2011 Town Directory. */
export function TownDirectoryView({ t, name, population2011 }: { t: TownDirectory; name: string; population2011: number }) {
    const hist = [...t.history, ...(population2011 ? ([[2011, population2011]] as [number, number][]) : [])].filter(([, p]) => p > 0);
    const max = Math.max(...hist.map(([, p]) => p), 1);
    const sch = (x: [number, number]) => (x[0] + x[1] > 0 ? `${x[0] + x[1]} (${x[0]} government, ${x[1]} private)` : null);
    return (
        <section className="space-y-8">
            {hist.length > 1 && (
                <div>
                    <h2 className="font-display text-2xl font-semibold">Population since {hist[0][0]}</h2>
                    <div className="mt-4 flex h-44 items-end gap-2 rounded-2xl border border-sand-200 bg-white p-4" role="img" aria-label={hist.map(([y, p]) => `${y}: ${fmt(p)}`).join(", ")}>
                        {hist.map(([y, p]) => (
                            <div key={y} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                                <span className="text-[10px] tabular-nums text-ink-600">{p >= 100000 ? `${(p / 100000).toFixed(1)}L` : p >= 1000 ? `${Math.round(p / 1000)}k` : p}</span>
                                <span className="w-full rounded-t bg-[#3f6fa8]" style={{ height: `${(p / max) * 100}%`, minHeight: 2 }} />
                                <span className="text-[10px] text-ink-500">{y}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-ink-500">Census counts for each decade in which {name} was counted as a town (L = lakh).</p>
                </div>
            )}
            <div className="grid gap-4 lg:grid-cols-2">
                <Group
                    title="Place and climate"
                    rows={[
                        ["Area", t.area ? `${t.area} km²` : null],
                        ["Population class", t.class ? `Class ${t.class}` : null],
                        ["Community development block", t.block || null],
                        ["Annual rainfall", t.rain ? `${fmt(t.rain)} mm` : null],
                        ["Temperature range", t.tmax || t.tmin ? `${t.tmin}°C to ${t.tmax}°C` : null],
                        ["Distance to Bhubaneswar", t.stateKm ? `${t.stateKm} km by road` : t.stateKm === 0 && name === "Bhubaneswar" ? "State capital" : null],
                        ["District headquarters", t.dhqKm ? `${t.dhq}, ${t.dhqKm} km` : t.dhq ? "In the town" : null],
                        ["Nearest railway station", t.rail ? (t.railKm ? `${t.rail}, ${t.railKm} km` : `${t.rail} (in the town)`) : null],
                        ["Nearest city of 1 lakh+", t.city1 && t.city1Km ? `${t.city1}, ${t.city1Km} km` : null],
                        ["Roads", t.roadPucca || t.roadKutcha ? `${fmt(t.roadPucca)} km pucca, ${fmt(t.roadKutcha)} km kutcha` : null],
                        ["Fire station", t.fire ? "In the town" : t.fireAt ? `Nearest at ${t.fireAt}${t.fireKm ? `, ${t.fireKm} km` : ""}` : null],
                        ["Homes with electricity connections", t.electricHomes ? fmt(t.electricHomes) : null],
                    ]}
                />
                <Group
                    title="Schools and colleges"
                    rows={[
                        ["Primary schools", sch(t.primary)],
                        ["Middle schools", sch(t.middle)],
                        ["Secondary schools", sch(t.secondary)],
                        ["Senior secondary schools", sch(t.senior)],
                        ["Degree colleges", t.colleges ? fmt(t.colleges) : null],
                        ["Medical colleges", t.medical ? fmt(t.medical) : null],
                        ["Engineering colleges", t.engineering ? fmt(t.engineering) : null],
                        ["Management institutes", t.management ? fmt(t.management) : null],
                        ["Polytechnics", t.polytechnic ? fmt(t.polytechnic) : null],
                    ]}
                />
                <Group
                    title="Health"
                    rows={[
                        ["Hospitals (allopathic)", t.hospitals ? `${fmt(t.hospitals)}${t.hospitalBeds ? `, ${fmt(t.hospitalBeds)} beds` : ""}` : null],
                        ["Hospitals (other systems)", t.altHospitals ? fmt(t.altHospitals) : null],
                        ["Dispensaries and health centres", t.dispensaries ? fmt(t.dispensaries) : null],
                        ["Nursing homes", t.nursingHomes ? fmt(t.nursingHomes) : null],
                        ["Family welfare centres", t.familyWelfare ? fmt(t.familyWelfare) : null],
                        ["Maternity homes", t.maternity ? fmt(t.maternity) : null],
                        ["TB clinics", t.tb ? fmt(t.tb) : null],
                        ["Veterinary hospitals", t.vet ? fmt(t.vet) : null],
                        ["Medicine shops", t.medicineShops ? fmt(t.medicineShops) : null],
                    ]}
                />
                <Group
                    title="Banks, culture and products"
                    rows={[
                        ["Nationalised banks", t.banks[0] ? fmt(t.banks[0]) : null],
                        ["Private banks", t.banks[1] ? fmt(t.banks[1]) : null],
                        ["Co-operative banks", t.banks[2] ? fmt(t.banks[2]) : null],
                        ["Cinema halls", t.cinema ? fmt(t.cinema) : null],
                        ["Public libraries", t.library ? fmt(t.library) : null],
                        ["Reading rooms", t.readingRoom ? fmt(t.readingRoom) : null],
                        ["Auditoriums / community halls", t.auditorium ? fmt(t.auditorium) : null],
                        ["Stadiums", t.stadium ? fmt(t.stadium) : null],
                        ["Main manufactured products", t.products.length ? t.products.join(", ") : null],
                    ]}
                />
            </div>
            <SourceNote />
        </section>
    );
}
