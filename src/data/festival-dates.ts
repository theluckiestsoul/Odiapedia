/**
 * Upcoming festival dates shown in "Today in Odisha" and the calendar.
 *
 * ONLY add dates that are confirmed by an official holiday list or a reliable panchang.
 * Each entry records where the date came from. Dates are IST calendar days (YYYY-MM-DD).
 * When the list runs out the widget simply links to the calendar — it never guesses.
 */
export interface FestivalDate {
    name: string;
    odia: string;
    start: string;
    end?: string;
    href?: string;
    note?: string;
    source: string;
}

export const FESTIVAL_DATES: FestivalDate[] = [
    { name: "Dola Purnima", odia: "ଦୋଳ ପୂର୍ଣ୍ଣିମା", start: "2026-03-03", href: "/culture/dola-purnima", source: "Government of Odisha holiday list 2026" },
    { name: "Utkal Divas (Odisha Day)", odia: "ଉତ୍କଳ ଦିବସ", start: "2026-04-01", href: "/culture/utkal-divas", source: "Fixed date — formation of Odisha province, 1 April 1936" },
    { name: "Pana Sankranti (Odia New Year)", odia: "ପଣା ସଂକ୍ରାନ୍ତି", start: "2026-04-14", href: "/culture/pana-sankranti", source: "Government of Odisha holiday list 2026" },
    { name: "Chandan Yatra begins", odia: "ଚନ୍ଦନ ଯାତ୍ରା", start: "2026-04-20", href: "/culture/chandan-yatra", source: "News reports, 2026" },
    { name: "Sitala Sasthi (Sambalpur)", odia: "ସୀତଳ ଷଷ୍ଠୀ", start: "2026-06-20", href: "/culture/sitala-sasthi", source: "Sambalpur local holiday notice, 2026" },
    { name: "Snana Purnima", odia: "ସ୍ନାନ ପୂର୍ଣ୍ଣିମା", start: "2026-06-29", href: "/culture/snana-yatra", source: "News reports, 2026" },
    { name: "Ratha Yatra", odia: "ରଥଯାତ୍ରା", start: "2026-07-16", href: "/culture/rath-yatra", source: "Government of Odisha holiday list 2026" },
    { name: "Kartika Purnima · Boita Bandana · Bali Jatra begins", odia: "କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା", start: "2026-11-24", href: "/culture/boita-bandana", source: "Higher Education Dept. holiday list 2026" },
    { name: "Bali Jatra, Cuttack", odia: "ବାଲିଯାତ୍ରା", start: "2026-11-24", end: "2026-12-01", href: "/culture/bali-jatra", source: "Cuttack district administration, as reported" },
    { name: "Prathamastami", odia: "ପ୍ରଥମାଷ୍ଟମୀ", start: "2026-12-01", href: "/culture/prathamastami", source: "Higher Education Dept. holiday list 2026" },
    { name: "Konark Dance Festival", odia: "କୋଣାର୍କ ନୃତ୍ୟ ଉତ୍ସବ", start: "2026-12-01", end: "2026-12-05", href: "/culture/konark-dance-festival", note: "Usual schedule; confirm the year's programme", source: "Odisha Tourism (annual 1–5 December schedule)" },
    { name: "Makar Sankranti", odia: "ମକର ସଂକ୍ରାନ୍ତି", start: "2027-01-14", href: "/culture/makar-sankranti-en", source: "Computed: Sun enters sidereal Makara (Odiapedia panchanga)" },
    { name: "Utkal Divas (Odisha Day)", odia: "ଉତ୍କଳ ଦିବସ", start: "2027-04-01", href: "/culture/utkal-divas", source: "Fixed date" },
    { name: "Pana Sankranti (Odia New Year)", odia: "ପଣା ସଂକ୍ରାନ୍ତି", start: "2027-04-14", href: "/culture/pana-sankranti", source: "Drik Panchang (Bhubaneswar), 2027" },
];

/** Today's date in IST as YYYY-MM-DD (independent of the visitor's timezone). */
export function todayIST(now: Date = new Date()): string {
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    const y = ist.getFullYear();
    const m = String(ist.getMonth() + 1).padStart(2, "0");
    const d = String(ist.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function upcomingFestivals(limit = 4, now: Date = new Date()): FestivalDate[] {
    const today = todayIST(now);
    return FESTIVAL_DATES.filter((f) => (f.end || f.start) >= today)
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, limit);
}

export function daysUntil(iso: string, now: Date = new Date()): number {
    const today = todayIST(now);
    const a = Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, +today.slice(8, 10));
    const b = Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
    return Math.round((b - a) / 86400000);
}
