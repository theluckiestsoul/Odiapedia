import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const columns = [
    {
        title: "Encyclopedia",
        links: [
            { href: "/language", label: "Odia language" },
            { href: "/learn", label: "Learn Odia" },
            { href: "/history", label: "History" },
            { href: "/history/timeline", label: "Timeline" },
            { href: "/culture", label: "Culture & festivals" },
            { href: "/food", label: "Food" },
            { href: "/people", label: "People" },
            { href: "/library", label: "Library (free PDFs)" },
            { href: "/language/font-converter", label: "Akruti/Sreelipi converter" },
            { href: "/learn/daily", label: "Daily Odia quiz" },
        ],
    },
    {
        title: "Places & travel",
        links: [
            { href: "/districts", label: "30 districts" },
            { href: "/map", label: "Interactive map" },
            { href: "/monuments", label: "Protected monuments" },
            { href: "/elections", label: "Elections & MLAs" },
            { href: "/pin", label: "PIN codes" },
            { href: "/travel", label: "Travel guides" },
            { href: "/travel/odisha-3-day-itinerary", label: "3-day itinerary" },
            { href: "/travel/best-time-to-visit-odisha", label: "Best time to visit" },
            { href: "/travel/plan", label: "Plan a trip" },
            { href: "/calendar", label: "Odia calendar" },
        ],
    },
    {
        title: "Odiapedia",
        links: [
            { href: "/about", label: "About us" },
            { href: "/about/editorial-policy", label: "Editorial policy" },
            { href: "/about/corrections-policy", label: "Corrections" },
            { href: "/about/cite-odiapedia", label: "Cite Odiapedia" },
            { href: "/shop", label: "Shop authentic Odisha" },
            { href: "/partners", label: "Partner with us" },
            { href: "/latest", label: "Latest updates" },
            { href: "/data", label: "Open data (CSV)" },
        ],
    },
];

const legal = [
    { href: "/about/privacy-policy", label: "Privacy" },
    { href: "/about/terms", label: "Terms" },
    { href: "/about/sponsorship-policy", label: "Sponsorship & affiliate policy" },
    { href: "/sitemap.xml", label: "Sitemap" },
];

const socials = [
    { href: SITE.social.x, label: "X (Twitter)", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { href: SITE.social.instagram, label: "Instagram", path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 2.2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.4a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4zm0 6.9a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4zm5.3-7.1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" },
    { href: SITE.social.facebook, label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { href: SITE.social.youtube, label: "YouTube", path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" },
];

export default function Footer() {
    return (
        <footer className="relative mt-auto bg-ink-950 text-sand-100">
            <div className="border-temple" aria-hidden="true" />
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true"><div className="h-full w-full bg-ikat-light opacity-60" /></div>
            <div className="container-page relative pb-10 pt-16">
                <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-white">
                                <Image src="/logo.png" alt="" fill sizes="48px" className="object-cover" />
                            </span>
                            <span>
                                <span className="block font-display text-2xl font-semibold text-white">Odiapedia</span>
                                <span lang="or" className="block font-odia text-sm text-saffron-300">ଓଡ଼ିଆପିଡ଼ିଆ</span>
                            </span>
                        </Link>
                        <p className="mt-5 max-w-sm leading-relaxed text-sand-200/80">
                            A free, bilingual encyclopedia of Odisha and the Odia language — written from cited sources, reviewed, and corrected in the open.
                        </p>
                        <p lang="or" className="mt-3 font-odia text-sand-200/70">ଓଡ଼ିଶାର ଭାଷା, ଇତିହାସ ଓ ସଂସ୍କୃତିର ମୁକ୍ତ ବିଶ୍ୱକୋଷ</p>
                        <div className="mt-6 flex gap-2">
                            {socials.map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={`Odiapedia on ${s.label}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sand-100 transition-colors hover:border-saffron-400 hover:text-saffron-300">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] !text-saffron-300">{col.title}</h2>
                                <ul className="mt-4 space-y-2.5">
                                    {col.links.map((l) => (
                                        <li key={l.href}>
                                            <Link href={l.href} className="text-sm text-sand-100/80 transition-colors hover:text-white">{l.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-sand-200/60 md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} Odiapedia. Independent and not affiliated with the Government of Odisha. Text is original unless cited; images marked “Illustration” are artistic renderings.
                    </p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                        {legal.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="hover:text-white">{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
