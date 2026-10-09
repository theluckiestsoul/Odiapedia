import climate from "@/data/climate.json";

type Month = { tmax: number; tmin: number; rain: number; rainyDays: number };
type C = { hq: string; lat: number; lon: number; elevation: number; months: Month[] };
const DATA = climate as unknown as { source: string; years: [number, number]; districts: Record<string, C> };
const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getClimate(district: string): C | null {
    const c = DATA.districts[district.replace(/-od$/, "")];
    return c && typeof c === "object" ? c : null;
}

/** Monthly climate averages near a district headquarters (ERA5 reanalysis via Open-Meteo). */
export default function ClimateTable({ district, name }: { district: string; name: string }) {
    const c = getClimate(district);
    if (!c) return null;
    const maxRain = Math.max(...c.months.map((m) => m.rain), 1);
    const annual = c.months.reduce((s, m) => s + m.rain, 0);
    const hottest = c.months.reduce((b, m, i) => (m.tmax > c.months[b].tmax ? i : b), 0);
    const coolest = c.months.reduce((b, m, i) => (m.tmin < c.months[b].tmin ? i : b), 0);
    const wettest = c.months.reduce((b, m, i) => (m.rain > c.months[b].rain ? i : b), 0);
    return (
        <section aria-labelledby="climate-h">
            <h2 id="climate-h" className="font-display text-2xl font-semibold">Climate of {name}</h2>
            <p className="mt-2 max-w-3xl text-ink-700">
                In {name} district (at {c.lat.toFixed(2)}°N, {c.lon.toFixed(2)}°E), the hottest month is {M[hottest]} (average highs of {c.months[hottest].tmax.toFixed(0)}°C) and the coolest nights come in {M[coolest]} ({c.months[coolest].tmin.toFixed(0)}°C).
                About {Math.round(annual / 10) * 10} mm of rain falls in a year, most of it in the monsoon; {M[wettest]} is the wettest month.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                <table className="w-full min-w-[44rem] text-center text-sm">
                    <thead className="bg-sand-100 text-xs uppercase tracking-wider text-ink-500">
                        <tr><th className="px-3 py-2 text-left"> </th>{M.map((m) => <th key={m} className="px-2 py-2">{m}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100 tabular-nums">
                        <tr><th className="px-3 py-2 text-left font-medium text-ink-600">Average high (°C)</th>{c.months.map((m, i) => <td key={i} className="px-2 py-2" style={{ background: `rgba(207,106,67,${Math.max(0, (m.tmax - 22) / 40)})` }}>{m.tmax.toFixed(0)}</td>)}</tr>
                        <tr><th className="px-3 py-2 text-left font-medium text-ink-600">Average low (°C)</th>{c.months.map((m, i) => <td key={i} className="px-2 py-2" style={{ background: `rgba(63,111,168,${Math.max(0, (26 - m.tmin) / 40)})` }}>{m.tmin.toFixed(0)}</td>)}</tr>
                        <tr><th className="px-3 py-2 text-left font-medium text-ink-600">Rainfall (mm)</th>{c.months.map((m, i) => <td key={i} className="px-2 py-2" style={{ background: `rgba(63,111,168,${(m.rain / maxRain) * 0.35})` }}>{m.rain}</td>)}</tr>
                        <tr><th className="px-3 py-2 text-left font-medium text-ink-600">Rainy days</th>{c.months.map((m, i) => <td key={i} className="px-2 py-2 text-ink-600">{m.rainyDays.toFixed(0)}</td>)}</tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-2 text-xs text-ink-500">
                Averages for {DATA.years[0]}–{DATA.years[1]} at that point ({c.elevation} m above sea level), from the <a href="https://open-meteo.com/en/docs/historical-weather-api" className="underline" target="_blank" rel="noopener noreferrer">Open-Meteo historical weather API</a> (ERA5 reanalysis by ECMWF/Copernicus, CC BY 4.0) — modelled values on a ~25 km grid, not station readings from the India Meteorological Department. A rainy day has 2.5 mm or more.
            </p>
        </section>
    );
}
