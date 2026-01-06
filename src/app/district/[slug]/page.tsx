import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import Link from "next/link";

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
        return { title: "District Not Found" };
    }

    return {
        title: `${district.title} - The Diary of Odisha`,
        description: district.description,
        openGraph: {
            title: district.title,
            description: district.description,
            type: "article",
        },
    };
}

export default async function DistrictPage({ params }: PageProps) {
    const { slug } = await params;
    const district = getDistrictBySlug(slug);

    if (!district) {
        notFound();
    }

    const components = useMDXComponents({});

    return (
        <div className="min-h-screen bg-black text-amber-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="text-amber-500 hover:text-amber-400 text-sm mb-8 inline-block">
                    ← Back to Map
                </Link>

                <header className="mb-12 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                        {district.title}
                    </h1>
                    <p className="text-xl text-amber-100/60 max-w-2xl mx-auto">
                        {district.description}
                    </p>
                </header>

                {/* At a Glance Section */}
                <section className="mb-12 bg-amber-950/20 border border-amber-900/40 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-display font-bold text-amber-500 mb-6 flex items-center gap-2">
                        <span>📊</span> At a Glance
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Headquarters</span>
                            <span className="text-lg font-semibold text-amber-100">{district.headquarters || "N/A"}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Population</span>
                            <span className="text-lg font-semibold text-amber-100">{district.population || "N/A"}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">Area</span>
                            <span className="text-lg font-semibold text-amber-100">{district.area || "N/A"}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-amber-900/20">
                            <span className="block text-amber-500/60 text-xs uppercase tracking-wider mb-1">MLA / MP</span>
                            <span className="text-lg font-semibold text-amber-100">{district.mla_mp || "N/A"}</span>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <article className="prose prose-lg prose-invert prose-amber max-w-none">
                    <MDXRemote source={district.content} components={components} />
                </article>

                <footer className="mt-16 pt-8 border-t border-amber-900/30 text-center text-amber-500/40 text-sm">
                    <p>Part of Odiapedia - The Diary of Odisha</p>
                </footer>
            </div>
        </div>
    );
}
