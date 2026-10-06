import filmsData from "@/data/cinema/films.json";
import peopleData from "@/data/cinema/people.json";

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

export interface Film {
    id: string;
    q: string;
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
    img?: { src: string; w?: number; h?: number; page?: string; licence?: string; credit?: string };
}

export const FILMS = filmsData as Film[];
const PEOPLE_BY_Q = peopleData as unknown as Record<string, Person>;
export const PEOPLE = Object.values(PEOPLE_BY_Q);

const filmById = new Map(FILMS.map((f) => [f.id, f]));
const personBySlug = new Map(PEOPLE.map((p) => [p.id, p]));

export const getFilm = (id: string) => filmById.get(id);
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

export const CINEMA_SOURCE = "Wikidata (CC0), the free knowledge base of the Wikimedia movement";
