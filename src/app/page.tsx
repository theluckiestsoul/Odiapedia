import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllArticlesMetadata, getArticleBySlug, type ArticleMeta } from "@/lib/mdx";
import { CATEGORIES, SITE } from "@/lib/site";
import { odishaDistricts, districtPageSlug } from "@/data/districts";
import Icon from "@/components/Icon";
import ArticleCard from "@/components/ArticleCard";
import TodayInOdisha from "@/components/TodayInOdisha";
import OnThisDay from "@/components/OnThisDay";
import { ChariotWheel, OrnamentDivider } from "@/components/Motifs";
import { FILMS, PEOPLE, YEARS } from "@/lib/cinema";

export const metadata: Metadata = {
  title: { absolute: "Odiapedia – Encyclopedia of Odisha, Odia Language, Culture & Travel" },
  description:
    "Explore Odisha in one trusted place: the Odia language and script, history from Kalinga to today, Jagannath culture, festivals, food, crafts, people, all 30 districts, today's Odia panjika and travel guides — with cited sources.",
  alternates: { canonical: "/" },
};

const PILLARS = ["language", "history", "culture", "food", "people", "travel", "districts", "calendar"] as const;

const FEATURED: [string, string][] = [
  ["history", "odisha-at-a-glance"],
  ["history", "jagannath-temple"],
  ["language", "odia-language"],
  ["culture", "rath-yatra"],
  ["history", "konark-sun-temple"],
  ["food", "mahaprasad"],
  ["culture", "odisha-gi-tags"],
  ["history", "kharavela"],
];

const TRAVEL_PICKS: [string, string][] = [
  ["travel", "puri"],
  ["travel", "konark"],
  ["travel", "bhubaneswar"],
  ["travel", "chilika-lake-travel-guide"],
  ["travel", "simlipal-national-park"],
  ["travel", "koraput"],
];

const ITINERARIES: { slug: string; days: string; label: string }[] = [
  { slug: "odisha-3-day-itinerary", days: "3 days", label: "Bhubaneswar · Puri · Konark" },
  { slug: "odisha-5-day-itinerary", days: "5 days", label: "Temples, Chilika & craft villages" },
  { slug: "odisha-7-day-itinerary", days: "7 days", label: "Heritage, lagoon & mangroves" },
  { slug: "odisha-buddhist-trail-itinerary", days: "2–3 days", label: "Dhauli to the Diamond Triangle" },
];

const LETTERS = [
  { o: "ଅ", r: "a" }, { o: "ଆ", r: "ā" }, { o: "ଇ", r: "i" }, { o: "କ", r: "ka" }, { o: "ଖ", r: "kha" }, { o: "ଗ", r: "ga" },
  { o: "ଚ", r: "ca" }, { o: "ଜ", r: "ja" }, { o: "ତ", r: "ta" }, { o: "ପ", r: "pa" }, { o: "ମ", r: "ma" }, { o: "ଳ", r: "ḷa" },
];

function pick(list: [string, string][]): ArticleMeta[] {
  return list
    .map(([c, s]) => getArticleBySlug(c, s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map(({ content: _c, ...m }) => m); // eslint-disable-line @typescript-eslint/no-unused-vars
}

export default function Home() {
  const all = getAllArticlesMetadata().filter((a) => !a.noindex);
  const english = all.filter((a) => !a.lang || a.lang === "en");
  const counts: Record<string, number> = {};
  for (const a of english) counts[a.category] = (counts[a.category] || 0) + 1;
  const sourced = english.filter((a) => a.sources.length > 0).length;
  const featured = pick(FEATURED);
  const travel = pick(TRAVEL_PICKS);
  // Most recently updated, interleaved across categories so one section never fills the grid
  const byCat = new Map<string, ArticleMeta[]>();
  for (const a of english
    .filter((x) => x.category !== "about" && x.category !== "learn")
    .sort((x, y) => y.updated.localeCompare(x.updated) || y.date.localeCompare(x.date))) {
    byCat.set(a.category, [...(byCat.get(a.category) || []), a]);
  }
  const stars = PEOPLE.filter((p) => p.img && (p.roles.cast ?? 0) >= 5)
    .sort((a, b) => (b.roles.cast ?? 0) - (a.roles.cast ?? 0)).slice(0, 8);
  const latestYear = YEARS[YEARS.length - 1];
  const recent: ArticleMeta[] = [];
  while (recent.length < 6 && [...byCat.values()].some((l) => l.length)) {
    for (const l of byCat.values()) if (l.length && recent.length < 6) recent.push(l.shift()!);
  }

  return (
    <div>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden bg-sand-100">
        <div className="absolute inset-0 bg-ikat opacity-70" aria-hidden="true" />
        <ChariotWheel className="pointer-events-none absolute -left-40 bottom-[-12rem] h-[34rem] w-[34rem] text-laterite-500/[0.07]" />
        <div className="container-page relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow"><Icon name="sparkle" className="h-4 w-4" />Free · Bilingual · Cited</p>
            <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.02] md:text-6xl lg:text-7xl">
              Everything Odisha, <span className="italic text-laterite-600">in one trusted place.</span>
            </h1>
            <p lang="or" className="mt-4 font-odia-serif text-2xl text-ink-600 md:text-3xl">ଓଡ଼ିଶା ଓ ଓଡ଼ିଆ ଭାଷାର ବିଶ୍ୱକୋଷ</p>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-600">
              The Odia language, Kalinga to modern history, Jagannath culture, festivals, food, crafts, people and all 30 districts — plus travel guides for planning your visit.
            </p>

            <form action="/search" method="get" role="search" className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-sand-300 bg-white p-2 pl-5 shadow-lg shadow-laterite-900/5 focus-within:border-laterite-400">
              <Icon name="search" className="h-5 w-5 shrink-0 text-laterite-500" />
              <label htmlFor="home-q" className="sr-only">Search Odiapedia</label>
              <input id="home-q" name="q" type="search" placeholder="Search Rath Yatra, pakhala, Konark, Odia alphabet…" className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink-900 outline-none placeholder:text-ink-400" />
              <button type="submit" className="btn-primary !px-5">Search</button>
            </form>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/learn/course" className="btn-primary"><Icon name="pen" className="h-4 w-4" />Start learning Odia</Link>
              <Link href="/districts" className="btn-ghost"><Icon name="pin" className="h-4 w-4" />Explore the 30 districts</Link>
              <Link href="/travel/plan" className="btn-ghost"><Icon name="suitcase" className="h-4 w-4" />Plan a trip</Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink-500">Popular:</span>
              {[
                ["Rath Yatra", "/culture/rath-yatra"],
                ["Odia calendar", "/calendar"],
                ["Puri", "/travel/puri"],
                ["Pakhala", "/food/pakhala-bhata"],
                ["Odia alphabet", "/learn/alphabet"],
              ].map(([l, h]) => (
                <Link key={h} href={h} className="chip hover:border-laterite-300 hover:text-laterite-700">{l}</Link>
              ))}
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <div><dt className="text-xs uppercase tracking-wider text-ink-500">Articles</dt><dd className="font-display text-3xl font-semibold text-ink-900">{english.length}+</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-ink-500">Districts</dt><dd className="font-display text-3xl font-semibold text-ink-900">30</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-ink-500">With sources</dt><dd className="font-display text-3xl font-semibold text-ink-900">{sourced}</dd></div>
            </dl>
          </div>

          <div className="relative hidden h-[34rem] lg:block" aria-hidden="true">
            <div className="absolute right-0 top-0 h-[22rem] w-[19rem] overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl shadow-laterite-900/20">
              <Image src="/images/konark-sun-temple.png" alt="" fill priority sizes="320px" className="object-cover" />
            </div>
            <div className="absolute bottom-0 left-4 h-[19rem] w-[16rem] overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl shadow-laterite-900/20">
              <Image src="/images/ratha-yatra-chariots.png" alt="" fill sizes="260px" className="object-cover" />
            </div>
            <div className="absolute bottom-16 right-10 h-40 w-40 overflow-hidden rounded-full border-[6px] border-white shadow-xl">
              <Image src="/images/pattachitra.png" alt="" fill sizes="160px" className="object-cover" />
            </div>
            <ChariotWheel className="absolute left-10 top-10 h-28 w-28 text-laterite-500/70" />
            <p className="absolute -bottom-2 right-0 text-[11px] text-ink-400">Illustrations</p>
          </div>
        </div>
        <div className="border-temple" aria-hidden="true" />
      </section>

      {/* ───────────── Pillars ───────────── */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Explore</p>
              <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">What would you like to discover?</h2>
            </div>
            <p className="max-w-md text-ink-600">Eight doorways into Odisha. Every article opens with a short answer, then the detail and the sources.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((k) => {
              const c = CATEGORIES[k];
              const n = k === "districts" ? 30 : counts[k];
              return (
                <Link key={k} href={c.href} className="group card-link relative flex flex-col overflow-hidden p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-laterite-50 text-laterite-600 transition-colors group-hover:bg-laterite-500 group-hover:text-white">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{c.label}</h3>
                  <p lang="or" className="font-odia text-sm text-laterite-600">{c.odia}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{c.blurb}</p>
                  <span className="mt-5 flex items-center justify-between text-sm font-semibold text-ink-800">
                    {n ? <span className="text-ink-500">{n} {k === "districts" ? "districts" : "articles"}</span> : <span className="text-ink-500">Open</span>}
                    <Icon name="arrow" className="h-4 w-4 text-laterite-500 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── Today in Odisha ───────────── */}
      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Today in Odisha</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Panjika &amp; festival calendar</h2>
            </div>
            <Link href="/calendar" className="hidden font-semibold text-laterite-600 hover:text-laterite-700 md:inline-flex md:items-center md:gap-2">Odia calendar <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <TodayInOdisha />
          <div className="mt-6">
            <OnThisDay />
          </div>
        </div>
      </section>

      {/* ───────────── Travel ───────────── */}
      <section className="relative overflow-hidden bg-ink-950 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-ikat-light" aria-hidden="true" />
        <ChariotWheel className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] text-white/[0.05]" />
        <div className="container-page relative">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow !text-saffron-300"><Icon name="compass" className="h-4 w-4" />Odisha travel</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold !text-white md:text-5xl">Temples, lagoons, forests and a 480-km coast — planned properly.</h2>
              <p className="mt-4 max-w-2xl text-sand-100/80">Destination guides with the rules, seasons and closures you need to know, and day-by-day itineraries you can adapt.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/travel" className="btn-ghost !border-white/20 !bg-white/5 !text-white hover:!bg-white/10">All guides</Link>
              <Link href="/travel/plan" className="btn-primary">Plan my trip <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {travel.map((t) => (
              <Link key={t.slug} href={`/travel/${t.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-saffron-300/40 hover:bg-white/[0.08]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold !text-white">{t.title.replace(/\s+Travel Guide$/i, "")}</h3>
                    {t.odiaTitle && <p lang="or" className="font-odia text-sm text-saffron-200/90">{t.odiaTitle}</p>}
                  </div>
                  <Icon name="arrow" className="mt-2 h-5 w-5 text-saffron-300 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-sand-100/75">{t.description}</p>
                {t.facts.find((f) => /best time/i.test(f.label)) && (
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-sand-100">
                    <Icon name="sun" className="h-3.5 w-3.5" />Best: {t.facts.find((f) => /best time/i.test(f.label))!.value.split(/[;(.]/)[0]}
                  </p>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ITINERARIES.map((it) => (
              <Link key={it.slug} href={`/travel/${it.slug}`} className="group flex items-center gap-4 rounded-2xl bg-laterite-500/90 p-5 transition-colors hover:bg-laterite-500">
                <span className="whitespace-nowrap font-display text-2xl font-semibold leading-none">{it.days}</span>
                <span className="text-sm leading-snug text-laterite-50">{it.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Featured knowledge ───────────── */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Essential reading</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Start with these</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a) => (
              <ArticleCard key={`${a.category}/${a.slug}`} article={a} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Odia cinema ───────────── */}
      <section className="relative overflow-hidden bg-ink-950 py-16 text-white md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-saffron-300"><Icon name="star" className="h-4 w-4" />Odia cinema · Ollywood</p>
            <h2 className="mt-3 font-display text-4xl font-semibold !text-white md:text-5xl">Odia films from {YEARS[0]} to today</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-200">
              {FILMS.length.toLocaleString("en-IN")} films with their directors, cast and music, plus filmographies of {PEOPLE.length} actors and film-makers. Browse by year, search by title or start with the first Odia talkie.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cinema" className="btn-primary">Browse all films <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/cinema/people" className="btn-ghost !border-white/20 !bg-white/5 !text-white hover:!bg-white/10">Actors &amp; directors</Link>
              <Link href={`/cinema/year/${latestYear}`} className="btn-ghost !border-white/20 !bg-white/5 !text-white hover:!bg-white/10">Films of {latestYear}</Link>
            </div>
          </div>
          {stars.length > 0 && (
            <ul className="grid grid-cols-4 gap-4">
              {stars.map((p) => (
                <li key={p.id}>
                  <Link href={`/cinema/people/${p.id}`} className="group block text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img!.src} alt="" loading="lazy" className="mx-auto aspect-square w-full rounded-full border-2 border-white/10 bg-ink-800 object-cover object-top transition-colors group-hover:border-saffron-300" />
                    <span className="mt-2 block text-xs font-medium leading-tight text-ink-100 group-hover:text-white">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ───────────── Learn Odia ───────────── */}
      <section className="bg-sand-100 py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow"><Icon name="pen" className="h-4 w-4" />Learn Odia</p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Speak your first Odia today.</h2>
            <p className="mt-4 max-w-lg text-lg text-ink-600">
              Odia is one of India&apos;s classical languages, with a rounded script shaped by centuries of writing on palm leaves. Our free interactive course starts with greetings and builds up to everyday conversation, with practice, review and a phrasebook. No sign-up needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/learn/course" className="btn-primary">Start the course <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/learn/alphabet" className="btn-ghost">Alphabet reference</Link>
              <Link href="/language/dictionary" className="btn-ghost">Dictionary</Link>
              <Link href="/library" className="btn-ghost"><Icon name="book" className="h-4 w-4" />Free Odia books (PDF)</Link>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {LETTERS.map((l) => (
              <Link key={l.o} href="/learn/alphabet" className="card-link flex aspect-square flex-col items-center justify-center">
                <span lang="or" className="font-odia-serif text-4xl text-ink-900">{l.o}</span>
                <span className="mt-1 text-xs text-ink-500">{l.r}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Districts ───────────── */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow"><Icon name="pin" className="h-4 w-4" />30 districts</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">From Mayurbhanj to Malkangiri</h2>
              <p className="mt-4 text-ink-600">Every district has its own page: headquarters, history, places, food and people — in English and Odia.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/map" className="btn-dark"><Icon name="map" className="h-4 w-4" />Open the interactive map</Link>
                <Link href="/districts" className="btn-ghost">All districts</Link>
              </div>
            </div>
            <ul className="flex flex-wrap content-start gap-2">
              {[...odishaDistricts].sort((a, b) => a.name_en.localeCompare(b.name_en)).map((d) => (
                <li key={d.id}>
                  <Link href={`/district/${districtPageSlug(d.id)}`} className="group inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-3.5 py-2 text-sm transition-colors hover:border-laterite-300">
                    <span className="font-medium text-ink-800 group-hover:text-laterite-700">{d.name_en}</span>
                    <span lang="or" className="font-odia text-xs text-ink-400">{d.name_od}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── Crafts & shop ───────────── */}
      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] border border-sand-200 bg-white">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <p className="eyebrow"><Icon name="shop" className="h-4 w-4" />Crafts &amp; shop</p>
                <h2 className="mt-3 font-display text-4xl font-semibold">Buy the real thing — Sambalpuri, Pattachitra, filigree.</h2>
                <p className="mt-4 text-ink-600">Odisha has more than two dozen Geographical Indication (GI) products. Learn how to recognise them and where to buy from artisan co-operatives.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop" className="btn-primary">Shop authentic Odisha <Icon name="arrow" className="h-4 w-4" /></Link>
                  <Link href="/culture/odisha-gi-tags" className="btn-ghost">Odisha GI tags</Link>
                </div>
              </div>
              <div className="relative grid min-h-[18rem] grid-cols-2">
                <div className="relative"><Image src="/images/sambalpuri-saree.png" alt="Sambalpuri saree illustration" fill sizes="25vw" className="object-cover" /></div>
                <div className="relative"><Image src="/images/pipili-applique.png" alt="Pipili applique illustration" fill sizes="25vw" className="object-cover" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Trust ───────────── */}
      <section className="bg-sand-100 py-16 md:py-20">
        <div className="container-page">
          <OrnamentDivider className="mx-auto mb-10 max-w-md" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: "shield" as const, t: "Written from sources", d: "Articles cite official records, scholarship and reputable reporting. Legends are labelled as legends." },
              { icon: "check" as const, t: "Reviewed and dated", d: "Every page shows when it was last reviewed, and errors can be reported in one click." },
              { icon: "handshake" as const, t: "Independent", d: "Sponsors can never buy facts or rankings. Commercial links are clearly labelled." },
            ].map((x) => (
              <div key={x.t} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-laterite-600 shadow-sm"><Icon name={x.icon} className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-xl font-semibold">{x.t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-ink-600">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm">
            <Link href="/about/editorial-policy" className="font-semibold text-laterite-600 underline underline-offset-4">Read our editorial policy</Link>
            <span className="mx-2 text-ink-400">·</span>
            <Link href="/about/cite-odiapedia" className="font-semibold text-laterite-600 underline underline-offset-4">How to cite Odiapedia</Link>
          </p>
        </div>
      </section>

      {/* ───────────── Recently updated ───────────── */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Fresh on {SITE.name}</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Recently updated</h2>
            </div>
            <Link href="/latest" className="hidden items-center gap-2 font-semibold text-laterite-600 md:inline-flex">All updates <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((a) => (
              <ArticleCard key={`${a.category}/${a.slug}`} article={a} compact />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
