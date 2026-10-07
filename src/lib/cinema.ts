import filmsData from "@/data/cinema/films.json";
import peopleData from "@/data/cinema/people.json";
import aboutData from "@/data/cinema/about.json";

export type Role = "director" | "cast" | "music" | "producer" | "writer" | "cinematographer" | "editor";
export const ROLES: { id: Role; label: string; plural: string }[] = [
    { id: "director", label: "Director", plural: "Directed by" },
    { id: "cast", label: "Cast", plural: "Cast" },
    { id: "music", label: "Music", plural: "Music" },
    { id: "producer", label: "Producer", plural: "Produced by" },
    { id: "writer", label: "Writer", plural: "Written by" },
    { id: "cinematographer", label: "Cinematography", plural: "Cinematography" },
    { id: "editor", label: "Editor", plural: "Edited by" },
];

export interface Photo { src: string; w?: number; h?: number; page?: string; licence?: string; credit?: string; caption?: string }

/** Written description: original prose by Odiapedia, based on the sources listed in `src`. */
export interface About {
    lead: string;
    sections?: { h: string; p: string[] }[];
    knownFor?: string[];
    facts?: [string, string][];
    src?: { label: string; url: string }[];
}

export interface Film {
    id: string;
    q?: string;
    title: string;
    odia?: string;
    year?: number;
    date?: string;
    min?: number;
    wp?: string;
    director?: string[];
    cast?: string[];
    music?: string[];
    producer?: string[];
    writer?: string[];
    cinematographer?: string[];
    editor?: string[];
    genre?: string[];
    basedOn?: string[];
    awards?: string[];
    language?: string[];
    studio?: string[];
    location?: string[];
    /** Credits listed by name only (one-word or unidentified names from Wikipedia's year lists) */
    castText?: string[];
    directorText?: string[];
    musicText?: string[];
    producerText?: string[];
    writerText?: string[];
    cinematographerText?: string[];
    editorText?: string[];
    lyrics?: string[];
    singers?: string[];
    /** Wikipedia "List of Odia films of YEAR" page the credits were completed from */
    wl?: string;
    note?: string;
    orwiki?: string;
    gallery?: Photo[];
    auto?: string[];
}

export interface Person {
    id: string;
    q: string;
    name: string;
    odia?: string;
    desc?: string;
    birth?: string;
    death?: string;
    wp?: string;
    g?: "m" | "f";
    roles: Partial<Record<Role, number>>;
    img?: Photo;
    gallery?: Photo[];
    birthplace?: string;
    awards?: string[];
    orwiki?: string;
    /** Set for people known only from Wikipedia's film lists (no Wikidata item yet) */
    src?: "wl";
    auto?: string[];
}

export const FILMS = filmsData as Film[];
const PEOPLE_BY_Q = peopleData as unknown as Record<string, Person>;
export const PEOPLE = Object.values(PEOPLE_BY_Q);

const filmById = new Map(FILMS.map((f) => [f.id, f]));
const personBySlug = new Map(PEOPLE.map((p) => [p.id, p]));

export const getFilm = (id: string) => filmById.get(id);
const ABOUT = aboutData as unknown as Record<string, About>;
export const aboutFilm = (f: Film) => ABOUT[f.q ?? f.id] ?? ABOUT[f.id];
export const aboutPerson = (p: Person) => ABOUT[p.q];
export const isWikidata = (q?: string) => !!q && /^Q\d+$/.test(q);
export const getPerson = (slug: string) => personBySlug.get(slug);
export const personByQ = (q: string) => PEOPLE_BY_Q[q];

export const YEARS = [...new Set(FILMS.map((f) => f.year).filter((y): y is number => !!y))].sort((a, b) => a - b);
export const filmsOfYear = (y: number) => FILMS.filter((f) => f.year === y);

export function filmography(person: Person): { role: Role; films: Film[] }[] {
    return ROLES.map(({ id }) => ({ role: id, films: FILMS.filter((f) => f[id]?.includes(person.q)).sort((a, b) => (b.year ?? 0) - (a.year ?? 0)) })).filter((x) => x.films.length);
}

export function primaryRole(p: Person): Role {
    const order: Role[] = ["director", "music", "cast", "writer", "producer", "cinematographer", "editor"];
    const best = Object.entries(p.roles).sort((a, b) => b[1] - a[1])[0]?.[0] as Role | undefined;
    if (best === "cast") return "cast";
    return order.find((r) => p.roles[r]) ?? best ?? "cast";
}

export const roleNoun = (r: Role, g?: "m" | "f") =>
    ({ director: "director", cast: g === "f" ? "actress" : "actor", music: "music director", producer: "producer", writer: "writer", cinematographer: "cinematographer", editor: "film editor" })[r];

export const formatFilmDate = (f: Film) =>
    f.date ? new Date(f.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : f.year ? String(f.year) : "Year not recorded";

export function decade(y?: number) {
    return y ? `${Math.floor(y / 10) * 10}s` : "Undated";
}

export const CINEMA_SOURCE = "Wikidata (CC0) and Wikipedia's lists of Odia films";

/** People this person has worked with most often (directors for actors, lead actors for directors, co-stars). */
export function collaborators(p: Person, limit = 6): { person: Person; n: number; as: Role }[] {
    const count = new Map<string, { n: number; as: Role }>();
    for (const f of FILMS) {
        const mine = ROLES.filter(({ id }) => f[id]?.includes(p.q)).map((r) => r.id);
        if (!mine.length) continue;
        const theirRoles: Role[] = mine.includes("cast") ? ["director", "cast", "music"] : ["cast", "music", "director"];
        for (const r of theirRoles) {
            for (const q of (f[r] ?? []).slice(0, r === "cast" ? 4 : 2)) {
                if (q === p.q) continue;
                const c = count.get(q) ?? { n: 0, as: r };
                c.n += 1; count.set(q, c);
            }
        }
    }
    return [...count.entries()]
        .filter(([, c]) => c.n >= 2)
        .sort((a, b) => b[1].n - a[1].n)
        .slice(0, limit)
        .map(([q, c]) => ({ person: personByQ(q)!, n: c.n, as: c.as }))
        .filter((x) => x.person);
}

/** Names credited for a role: linked people first, then names known only as text. */
export function credits(f: Film, role: Role): { person?: Person; name: string }[] {
    const linked = (f[role] ?? []).map((q) => personByQ(q)).filter(Boolean).map((p) => ({ person: p!, name: p!.name }));
    const text = (f[`${role}Text` as keyof Film] as string[] | undefined) ?? [];
    return [...linked, ...text.map((name) => ({ name }))];
}
