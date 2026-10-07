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

const DP27 = "Drik Panchang (Bhubaneswar), 2027";

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
    // 2027: Drik Panchang, computed for Bhubaneswar (Odia calendar, Purnima calendar and monthly festival lists), checked October 2026.
    { name: "Makar Sankranti", odia: "ମକର ସଂକ୍ରାନ୍ତି", start: "2027-01-14", href: "/culture/makar-sankranti-en", source: DP27 },
    { name: "Sri Panchami (Saraswati Puja)", odia: "ଶ୍ରୀ ପଞ୍ଚମୀ", start: "2027-02-11", source: DP27 },
    { name: "Maha Shivaratri", odia: "ମହାଶିବରାତ୍ରି", start: "2027-03-06", source: DP27 },
    { name: "Dola Purnima", odia: "ଦୋଳ ପୂର୍ଣ୍ଣିମା", start: "2027-03-22", href: "/culture/dola-purnima", source: DP27 },
    { name: "Utkal Divas (Odisha Day)", odia: "ଉତ୍କଳ ଦିବସ", start: "2027-04-01", href: "/culture/utkal-divas", source: "Fixed date — formation of Odisha province, 1 April 1936" },
    { name: "Pana Sankranti (Odia New Year)", odia: "ପଣା ସଂକ୍ରାନ୍ତି", start: "2027-04-14", href: "/culture/pana-sankranti", source: DP27 },
    { name: "Rama Navami", odia: "ରାମ ନବମୀ", start: "2027-04-15", source: DP27 },
    { name: "Akshaya Tritiya · Chandan Yatra begins", odia: "ଅକ୍ଷୟ ତୃତୀୟା", start: "2027-05-09", href: "/culture/chandan-yatra", note: "Chandan Yatra in Puri begins on Akshaya Tritiya", source: DP27 },
    { name: "Savitri Amabasya", odia: "ସାବିତ୍ରୀ ଅମାବାସ୍ୟା", start: "2027-06-04", source: DP27 },
    { name: "Jamai Shashti", odia: "ଜାମାଇ ଷଷ୍ଠୀ", start: "2027-06-10", source: DP27 },
    { name: "Raja Sankranti (Raja Parba)", odia: "ରଜ ସଂକ୍ରାନ୍ତି", start: "2027-06-15", href: "/culture/raja-parba", note: "Main day of the three-day Raja festival", source: DP27 },
    { name: "Snana Purnima", odia: "ସ୍ନାନ ପୂର୍ଣ୍ଣିମା", start: "2027-06-18", href: "/culture/snana-yatra", note: "Snana Yatra is held on Jyeshtha Purnima", source: DP27 },
    { name: "Ratha Yatra", odia: "ରଥଯାତ୍ରା", start: "2027-07-05", href: "/culture/rath-yatra", source: DP27 },
    { name: "Gamha Purnima", odia: "ଗହ୍ମା ପୂର୍ଣ୍ଣିମା", start: "2027-08-17", source: DP27 },
    { name: "Krishna Janmashtami", odia: "ଜନ୍ମାଷ୍ଟମୀ", start: "2027-08-25", source: DP27 },
    { name: "Ganesh Chaturthi", odia: "ଗଣେଶ ଚତୁର୍ଥୀ", start: "2027-09-04", source: DP27 },
    { name: "Mahalaya Amabasya", odia: "ମହାଳୟା ଅମାବାସ୍ୟା", start: "2027-09-29", source: DP27 },
    { name: "Durga Puja: Maha Ashtami", odia: "ମହାଷ୍ଟମୀ", start: "2027-10-07", href: "/culture/durga-puja", source: DP27 },
    { name: "Dasahara (Vijaya Dashami)", odia: "ଦଶହରା", start: "2027-10-09", href: "/culture/durga-puja", source: DP27 },
    { name: "Kumar Purnima", odia: "କୁମାର ପୂର୍ଣ୍ଣିମା", start: "2027-10-14", href: "/culture/kumar-purnima", note: "Ashwina (Sharad) Purnima", source: DP27 },
    { name: "Kali Puja", odia: "କାଳୀ ପୂଜା", start: "2027-10-28", source: DP27 },
    { name: "Dipavali", odia: "ଦୀପାବଳି", start: "2027-10-29", source: DP27 },
    { name: "Kartika Purnima · Boita Bandana · Bali Jatra begins", odia: "କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା", start: "2027-11-14", href: "/culture/boita-bandana", source: DP27 },
    { name: "Dhanu Sankranti", odia: "ଧନୁ ସଂକ୍ରାନ୍ତି", start: "2027-12-16", source: DP27 },
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

/** Years that have at least one festival date. */
export function festivalYears(): number[] {
    return [...new Set(FESTIVAL_DATES.map((f) => +f.start.slice(0, 4)))].sort();
}

export function festivalsInYear(year: number): FestivalDate[] {
    return FESTIVAL_DATES.filter((f) => f.start.startsWith(`${year}-`)).sort((a, b) => a.start.localeCompare(b.start));
}

/** Dates for one article (by its href), soonest first, ignoring dates already past. */
export function datesFor(href: string, now: Date = new Date()): FestivalDate[] {
    const today = todayIST(now);
    return FESTIVAL_DATES.filter((f) => f.href === href && (f.end || f.start) >= today).sort((a, b) => a.start.localeCompare(b.start));
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** "Monday, 5 July 2027" for an ISO date (calendar date, no timezone shift). */
export function longDate(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}
export const monthName = (m: number) => MONTHS[m - 1];
