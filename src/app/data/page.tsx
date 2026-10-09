import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import meta from "@/data/open-data.json";

export const metadata = hubMetadata({
    title: "Odisha Open Data: Villages, Towns, Elections (CSV)",
    description: "Free downloads of Odiapedia's Odisha datasets as CSV: 52,000 villages with Census 2011 figures and PIN codes, towns, districts, assembly constituencies, monuments, railway stations and climate.",
    path: "/data",
    keywords: ["odisha village list csv", "odisha census data download", "odisha open data", "odisha villages dataset", "odisha assembly constituency list csv"],
});

const FILES: { file: string; title: string; about: string; licence: string; licenceUrl: string; source: string }[] = [
    { file: "villages.csv", title: "Villages of Odisha", about: "Every LGD village with its district, sub-district, block and gram panchayat, Census 2011 population, households, sex, SC/ST, literacy rate, PIN code and area.", licence: "Government Open Data License – India", licenceUrl: "https://data.gov.in/government-open-data-license-india", source: "Local Government Directory (Dec 2022); Census of India 2011 Primary Census Abstract and Village Directory" },
    { file: "towns.csv", title: "Towns of Odisha", about: "The 223 statutory and census towns of Census 2011 with type, wards, population, literacy, SC/ST, area and size class.", licence: "Government Open Data License – India", licenceUrl: "https://data.gov.in/government-open-data-license-india", source: "Census of India 2011 Primary Census Abstract and Town Directory" },
    { file: "districts.csv", title: "Districts of Odisha", about: "Population (total, rural, urban), households, literacy, SC/ST and number of towns for the 30 districts.", licence: "Government Open Data License – India", licenceUrl: "https://data.gov.in/government-open-data-license-india", source: "Census of India 2011 Primary Census Abstract" },
    { file: "pin-codes.csv", title: "Village PIN codes", about: "PIN code of each village as recorded in the Census 2011 Village Directory (reference year 2009).", licence: "Government Open Data License – India", licenceUrl: "https://data.gov.in/government-open-data-license-india", source: "Census of India 2011 Village Directory" },
    { file: "assembly-constituencies.csv", title: "Assembly constituencies", about: "The 147 Vidhan Sabha seats with district, Lok Sabha seat, reservation, electors and the latest winner.", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "Election Commission of India results as compiled on Wikipedia" },
    { file: "monuments.csv", title: "Protected monuments", about: "The 78 ASI Monuments of National Importance in Odisha with locations and coordinates.", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "Archaeological Survey of India list, as transcribed on Wikipedia" },
    { file: "railway-stations.csv", title: "Railway stations", about: "Stations and halts in and around Odisha with codes, coordinates and district.", licence: "ODbL 1.0", licenceUrl: "https://opendatacommons.org/licenses/odbl/1-0/", source: "© OpenStreetMap contributors" },
    { file: "climate.csv", title: "District climate", about: "Monthly average high and low temperature, rainfall and rainy days, 1995–2024, for a point in each district.", licence: "CC BY 4.0", licenceUrl: "https://creativecommons.org/licenses/by/4.0/", source: "Open-Meteo Historical Weather API (ERA5 reanalysis, ECMWF/Copernicus)" },
];

const M = meta as { files: Record<string, { rows: number; bytes: number }> };
const size = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

export default function DataPage() {
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@graph": FILES.map((f) => ({ "@type": "Dataset", name: `${f.title} (Odiapedia)`, description: f.about, url: `${SITE.url}/data`, license: f.licenceUrl, isBasedOn: f.source, creator: { "@type": "Organization", name: SITE.name, url: SITE.url }, spatialCoverage: { "@type": "Place", name: "Odisha, India" }, distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE.url}/data/open/${f.file}` }] })) }} />
            <PageHero title="Open data" odia="ମୁକ୍ତ ତଥ୍ୟ" description="The tables behind Odiapedia's district, village, town and election pages, free to download as CSV. Please credit Odiapedia and the original source shown for each file." icon="list" eyebrow="Data" crumbs={[{ name: "Open data", href: "/data" }]} />
            <div className="container-page py-12">
                <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white">
                    <table className="w-full min-w-[46rem] text-sm">
                        <thead className="bg-sand-100 text-left text-xs uppercase tracking-wider text-ink-500"><tr><th className="px-5 py-3">Dataset</th><th className="px-5 py-3">Rows</th><th className="px-5 py-3">Source &amp; licence</th><th className="px-5 py-3">Download</th></tr></thead>
                        <tbody className="divide-y divide-sand-100">
                            {FILES.map((f) => (
                                <tr key={f.file} className="align-top">
                                    <td className="px-5 py-4"><p className="font-semibold text-ink-900">{f.title}</p><p className="mt-1 max-w-md text-ink-600">{f.about}</p></td>
                                    <td className="px-5 py-4 tabular-nums">{M.files[f.file]?.rows.toLocaleString("en-IN")}</td>
                                    <td className="px-5 py-4 text-ink-600">{f.source}<br /><a href={f.licenceUrl} className="text-xs underline" target="_blank" rel="noopener noreferrer">{f.licence}</a></td>
                                    <td className="px-5 py-4"><a href={`/data/open/${f.file}`} download className="btn-ghost !py-1.5 whitespace-nowrap">{f.file} · {size(M.files[f.file]?.bytes ?? 0)}</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-6 max-w-3xl text-sm text-ink-600">Suggested credit: “Source: Odiapedia (odiapedia.com), from {"<original source>"}.” Files are UTF-8 CSV and are rebuilt whenever the site&apos;s data is updated. Found a mistake? Write to us and we will correct the data and the pages.</p>
            </div>
        </div>
    );
}
