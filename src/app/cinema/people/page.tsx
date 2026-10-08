import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FILMS, PEOPLE, type Person, type Role } from "@/lib/cinema";
import { hubMetadata } from "@/lib/seo";

/* eslint-disable @next/next/no-img-element */

export const metadata = hubMetadata({
    title: "Odia Film Actors, Actresses, Directors & Music Directors",
    description: "Who's who of Odia cinema: actors, actresses, directors and music directors of Ollywood with the films they are credited on.",
    path: "/cinema/people",
    keywords: ["odia actors", "odia actress", "ollywood actors list", "odia film directors", "odia music directors", "odia film heroes"],
});

function top(role: Role, filter: (p: Person) => boolean = () => true, n = 30) {
    return PEOPLE.filter((p) => (p.roles[role] ?? 0) > 0 && filter(p)).sort((a, b) => (b.roles[role] ?? 0) - (a.roles[role] ?? 0) || a.name.localeCompare(b.name)).slice(0, n);
}

function Grid({ title, people, role }: { title: string; people: Person[]; role: Role }) {
    return (
        <section>
            <h2 className="font-display text-3xl font-semibold text-ink-900">{title}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((p) => (
                    <li key={p.q}>
                        <Link href={`/cinema/people/${p.id}`} className="card-link flex items-center gap-3 p-3">
                            {p.img ? <img src={p.img.src} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover object-top" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand-200 font-display text-lg text-ink-600">{p.name[0]}</span>}
                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold text-ink-900">{p.name}</span>
                                <span className="text-xs text-ink-500">{p.roles[role]} film{p.roles[role] === 1 ? "" : "s"}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function PeopleIndex() {
    const all = [...PEOPLE].filter((p) => Object.values(p.roles).reduce((a, b) => a + (b ?? 0), 0) >= 2).sort((a, b) => a.name.localeCompare(b.name));
    return (
        <div>
            <PageHero title="People of Odia cinema" odia="ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ରର କଳାକାର" description={`Actors, actresses, directors and music directors across ${FILMS.length.toLocaleString("en-IN")} Odia films — each with the film credits we have recorded.`} icon="people" eyebrow="Odia cinema" crumbs={[{ name: "Odia cinema", href: "/cinema" }, { name: "People", href: "/cinema/people" }]} />
            <div className="container-page space-y-14 py-12">
                <Grid title="Actors" role="cast" people={top("cast", (p) => p.g !== "f")} />
                <Grid title="Actresses" role="cast" people={top("cast", (p) => p.g === "f")} />
                <Grid title="Directors" role="director" people={top("director")} />
                <Grid title="Music directors" role="music" people={top("music", () => true, 18)} />
                <section>
                    <h2 className="font-display text-3xl font-semibold text-ink-900">Everyone A–Z</h2>
                    <p className="mt-1 text-sm text-ink-500">People with two or more Odia film credits.</p>
                    <ul className="mt-5 columns-2 gap-6 text-sm sm:columns-3 lg:columns-4">
                        {all.map((p) => <li key={p.q} className="break-inside-avoid py-0.5"><Link href={`/cinema/people/${p.id}`} className="text-ink-800 hover:text-laterite-600 hover:underline">{p.name}</Link></li>)}
                    </ul>
                </section>
            </div>
        </div>
    );
}
