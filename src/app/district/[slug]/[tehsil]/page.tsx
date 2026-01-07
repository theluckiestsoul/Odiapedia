import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTehsilBySlug, getAllTehsilsForDistrict } from "@/lib/tehsils";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import Link from "next/link";
import { getSpotsByTehsil } from "@/lib/spots";
import remarkGfm from "remark-gfm";

interface PageProps {
    params: Promise<{ slug: string; tehsil: string }>;
}

export async function generateStaticParams() {
    const districtSlugs = getAllDistrictSlugs();
    const params: { slug: string; tehsil: string }[] = [];

    for (const districtSlug of districtSlugs) {
        const tehsils = getAllTehsilsForDistrict(districtSlug);
        for (const tehsil of tehsils) {
            params.push({ slug: districtSlug, tehsil: tehsil.slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, tehsil } = await params;
    const tehsilData = getTehsilBySlug(slug, tehsil);

    if (!tehsilData) {
        return { title: "Tehsil Not Found" };
    }

    return {
        title: `${tehsilData.title} - ${tehsilData.district} District | Odiapedia`,
        description: tehsilData.description,
        openGraph: {
            title: tehsilData.title,
            description: tehsilData.description,
            type: "article",
        },
    };
}

export default async function TehsilPage({ params }: PageProps) {
    const { slug, tehsil } = await params;
    const tehsilData = getTehsilBySlug(slug, tehsil);
    const districtData = getDistrictBySlug(slug);

    // Fetch Spots for this Tehsil
    const spots = getSpotsByTehsil(slug, tehsil);

    if (!tehsilData) {
        notFound();
    }

    const components = useMDXComponents({});

    return (
        <div className="min-h-screen bg-black text-amber-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="flex items-center gap-2 text-sm mb-8 text-amber-500/60">
                    <Link href="/" className="hover:text-amber-400">Home</Link>
                    <span>/</span>
                    <Link href="/districts" className="hover:text-amber-400">Districts</Link>
                    <span>/</span>
                    <Link href={`/district/${slug}`} className="hover:text-amber-400">
                        {districtData?.title || slug}
                    </Link>
                    <span>/</span>
                    <span className="text-amber-300">{tehsilData.title}</span>
                </nav>

                <header className="mb-12 text-center">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-amber-900/30 border border-amber-800/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                        Tehsil (Tahasila)
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                        {tehsilData.title}
                    </h1>
                    <p className="text-xl text-amber-100/60 max-w-2xl mx-auto">
                        {tehsilData.description}
                    </p>
                </header>

                {/* At a Glance Section */}
                <section className="mb-12 bg-amber-950/20 border border-amber-900/40 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-display font-bold text-amber-500 mb-6 flex items-center gap-2">
                        <span>📍</span> Functional Facts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Parent District</span>
                            <span className="text-lg font-semibold text-amber-100 capitalize">{districtData?.title || slug}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Population</span>
                            <span className="text-lg font-semibold text-amber-100">{tehsilData.population || "N/A"}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Villages</span>
                            <span className="text-lg font-semibold text-amber-100">{tehsilData.villages_count || "N/A"}</span>
                        </div>
                    </div>
                </section>

                {/* SPOTS SECTION (New in Phase 3) */}
                {spots.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-display font-bold text-amber-500 mb-6 flex items-center gap-2">
                            <span>🗺️</span> Places to Visit in {tehsilData.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {spots.map((spot) => (
                                <Link
                                    key={spot.slug}
                                    href={`/district/${slug}/${tehsil}/${spot.slug}`}
                                    className="group block bg-neutral-900/50 border border-amber-900/20 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-900/40 text-amber-400 mb-2">
                                                {spot.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-amber-100 mb-2 group-hover:text-amber-400 transition-colors">
                                            {spot.title}
                                        </h3>
                                        <p className="text-amber-100/60 text-sm line-clamp-2">
                                            {spot.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <article className="prose prose-lg prose-invert prose-amber max-w-none">
                    <MDXRemote
                        source={tehsilData.content}
                        components={components}
                        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                    />
                </article>

                <section className="mt-16 pt-12 border-t border-amber-900/30">
                    <div className="bg-gradient-to-br from-amber-950/30 to-black p-8 rounded-2xl border border-amber-900/20 text-center">
                        <h3 className="text-2xl font-bold text-amber-100 mb-2 font-display">Are you from {tehsilData.title}?</h3>
                        <p className="text-amber-100/60 mb-6">
                            Help us preserve the history of your village. Add photos, local legends, or corrections.
                        </p>
                        <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-full transition-colors">
                            Contribute Story (Coming Soon)
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
