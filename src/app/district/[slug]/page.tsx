import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { getDistrictById } from "@/data/districts";
import { getBlocksByDistrictId } from "@/data/blocks";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "../../../../mdx-components";
import Link from "next/link";
import { getAllTehsilsForDistrict } from "@/lib/tehsils";
import remarkGfm from "remark-gfm";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const regionColors: Record<string, string> = {
    coastal: "#0d9488", // Teal
    central: "#7c3aed", // Violet
    northern: "#059669", // Emerald
    southern: "#e11d48", // Rose
    western: "#d97706", // Amber
};

export async function generateStaticParams() {
    const slugs = getAllDistrictSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const district = getDistrictBySlug(slug);

    if (!district) {
        return { title: "District Not Found" };
    }

    return {
        title: `${district.title} - Odiapedia`,
        description: district.description,
        openGraph: {
            title: district.title,
            description: district.description,
            type: "article",
        },
    };
}

function TehsilList({ districtSlug }: { districtSlug: string }) {
    const tehsils = getAllTehsilsForDistrict(districtSlug);
    const blocks = getBlocksByDistrictId(districtSlug);

    // Check if we have any administrative content
    if (tehsils.length === 0 && blocks.length === 0) {
        return (
            <div className="col-span-full text-slate-500 italic text-sm py-4">
                Administrative entries coming soon...
            </div>
        );
    }

    return (
        <div className="contents">
            {/* MDX Tehsils (Rich Content) */}
            {tehsils.map((tehsil) => (
                <Link
                    key={tehsil.slug}
                    href={`/district/${districtSlug}/${tehsil.slug}`}
                    className="group block p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-800 group-hover:text-teal-700 font-bold">{tehsil.title}</span>
                        <span className="text-slate-400 group-hover:translate-x-1 group-hover:text-teal-500 transition-transform">→</span>
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tehsil (Diary Entry)</div>
                </Link>
            ))}

            {/* Data Blocks (Data Only) */}
            {blocks.map((block) => {
                return (
                    <div
                        key={block.id}
                        className="group block p-4 rounded-xl bg-slate-50 border border-slate-200/60"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-700 font-medium">{block.name_en}</span>
                        </div>
                        <div className="text-xs text-slate-500 odia-text mb-1">{block.name_od}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider flex gap-2">
                            <span>Block</span>
                            <span>•</span>
                            <span>{block.gps_count} GPs</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default async function DistrictPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch from both sources
    const districtContent = getDistrictBySlug(slug); // MDX Content
    const districtData = getDistrictById(slug);      // Map Data

    if (!districtContent) {
        notFound();
    }

    const components = useMDXComponents({});

    // Schema.org Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AdministrativeArea",
                "name": districtContent.title,
                "description": districtContent.description,
                "containedInPlace": {
                    "@type": "State",
                    "name": "Odisha"
                },
                ...(districtData && {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": districtData.centroid[0],
                        "longitude": districtData.centroid[1]
                    }
                })
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://odiapedia.com" },
                    { "@type": "ListItem", "position": 2, "name": "Districts", "item": "https://odiapedia.com/districts" },
                    { "@type": "ListItem", "position": 3, "name": districtContent.title, "item": `https://odiapedia.com/district/${slug}` }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
                {/* Hero Background */}
                <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-transparent" />
                    <div className="absolute inset-0 bg-water opacity-40" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-8 text-slate-500 font-medium">
                        <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <Link href="/districts" className="hover:text-teal-700 transition-colors">Districts</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-teal-700">{districtContent.title}</span>
                    </nav>

                    <header className="mb-12 text-center">
                        {districtData && (
                            <div
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border bg-white shadow-sm"
                                style={{
                                    borderColor: `${regionColors[districtData.region]}30`,
                                    color: regionColors[districtData.region]
                                }}
                            >
                                {districtData.region} Region
                            </div>
                        )}
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-display text-slate-900 tracking-tight">
                            {districtContent.title}
                        </h1>
                        {districtData && (
                            <p className="text-3xl text-slate-400 odia-text mb-6">
                                {districtData.name_od}
                            </p>
                        )}
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            {districtContent.description}
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Main Narrative */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* At a Glance Section */}
                            <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="text-teal-600">📊</span> At a Glance
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">Headquarters</span>
                                        <span className="text-lg font-bold text-slate-800">{districtContent.headquarters || districtData?.headquarters || "N/A"}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">Population</span>
                                        <span className="text-lg font-bold text-slate-800">{districtContent.population || (districtData ? `${(districtData.population / 100000).toFixed(2)}L` : "N/A")}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">Area</span>
                                        <span className="text-lg font-bold text-slate-800">{districtContent.area || (districtData ? `${districtData.area_sq_km} sq km` : "N/A")}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1 font-semibold">Literacy</span>
                                        <span className="text-lg font-bold text-slate-800">{districtData ? `${districtData.literacy}%` : "N/A"}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Main Content */}
                            <article className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                                <MDXRemote
                                    source={districtContent.content}
                                    components={components}
                                    options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }}
                                />
                            </article>
                        </div>

                        {/* RIGHT COLUMN: Map & Admin */}
                        <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                            {/* Location Map */}
                            {districtData && (
                                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <span className="text-teal-600">📍</span> Location
                                        </h3>
                                    </div>
                                    <div className="h-[250px] relative">
                                        <iframe
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${districtData.bounds[0][1] - 0.5},${districtData.bounds[0][0] - 0.5},${districtData.bounds[1][1] + 0.5},${districtData.bounds[1][0] + 0.5}&layer=mapnik&marker=${districtData.centroid[0]},${districtData.centroid[1]}`}
                                            style={{ width: '100%', height: '100%', border: 0 }}
                                            title={`Map of ${districtData.name_en}`}
                                        />
                                    </div>
                                    <div className="p-4 bg-white">
                                        <a
                                            href={`https://www.google.com/maps/search/${districtData.name_en}+district+odisha/@${districtData.centroid[0]},${districtData.centroid[1]},9z`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center px-4 py-2 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg text-slate-700 hover:text-teal-700 text-sm transition-all font-medium"
                                        >
                                            Open in Google Maps ↗
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Tehsils/Blocks List */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="text-teal-600">🏙️</span> Administration
                                </h2>
                                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    <TehsilList districtSlug={slug} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                        <p>© {new Date().getFullYear()} Odiapedia - The Diary of Odisha</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
