import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTehsilBySlug, getAllTehsilsForDistrict } from "@/lib/tehsils";
import { getDistrictBySlug, getAllDistrictSlugs } from "@/lib/districts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/../mdx-components";
import Link from "next/link";
import { getSpotsByTehsil } from "@/lib/spots";
import remarkGfm from "remark-gfm";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";

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
        title: `${tehsilData.title} Tehsil, ${tehsilData.district} District`,
        description: tehsilData.description,
        alternates: { canonical: `/district/${slug}/${tehsil}` },
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const components = useMDXComponents({});

    const facts = [
        { k: "District", v: districtData?.title || slug },
        { k: "Population", v: tehsilData.population },
        { k: "Villages", v: tehsilData.villages_count },
    ].filter((f) => f.v);

    return (
        <div>
            <header className="relative overflow-hidden border-b border-sand-200 bg-sand-100">
                <div className="absolute inset-0 bg-ikat opacity-60" aria-hidden="true" />
                <div className="container-page relative py-10 md:py-14">
                    <Breadcrumbs items={[{ name: "Districts", href: "/districts" }, { name: districtData?.title || slug, href: `/district/${slug}` }, { name: tehsilData.title, href: `/district/${slug}/${tehsil}` }]} />
                    <p className="eyebrow mt-6"><Icon name="pin" className="h-4 w-4" />Tehsil (Tahasila)</p>
                    <h1 className="mt-3 font-display text-5xl font-semibold">{tehsilData.title}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-ink-600">{tehsilData.description}</p>
                    {facts.length > 0 && (
                        <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                            {facts.map((f) => (
                                <div key={f.k} className="rounded-2xl border border-sand-200 bg-white/80 p-4">
                                    <dt className="text-xs uppercase tracking-wider text-ink-500">{f.k}</dt>
                                    <dd className="mt-1 font-display text-lg font-semibold text-ink-900">{String(f.v)}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </header>

            <div className="container-page py-12">
                {spots.length > 0 && (
                    <section className="mb-12">
                        <h2 className="mb-6 font-display text-3xl font-semibold">Places to visit in {tehsilData.title}</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {spots.map((spot) => (
                                <Link key={spot.slug} href={`/district/${slug}/${tehsil}/${spot.slug}`} className="group card-link block p-6">
                                    <span className="eyebrow">{spot.category}</span>
                                    <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-laterite-700">{spot.title}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm text-ink-600">{spot.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <article className="article-body max-w-[46rem]">
                    <MDXRemote
                        source={tehsilData.content.replace(/^\s*#\s+[^\n]+\n+/, "")}
                        components={components}
                        options={{ mdxOptions: { remarkPlugins: [remarkGfm] }, blockJS: false }}
                    />
                </article>

                <section className="mt-16 max-w-[46rem] rounded-3xl border border-sand-200 bg-sand-100 p-8">
                    <h2 className="font-display text-2xl font-semibold">Are you from {tehsilData.title}?</h2>
                    <p className="mt-2 text-ink-600">Help us document local history: send rights-cleared photos, local legends (we label them as tradition) or corrections, with a source where possible.</p>
                    <a href={`mailto:contact@odiapedia.com?subject=${encodeURIComponent(`Local knowledge: ${tehsilData.title}`)}`} className="btn-primary mt-5"><Icon name="mail" className="h-4 w-4" />Share what you know</a>
                </section>
            </div>
        </div>
    );
}
