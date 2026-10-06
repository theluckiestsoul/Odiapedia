// Panchanga calculation utilities
//
// Astronomical basis (pure TypeScript, no dependencies, safe in browser and Node):
//   - Julian Day from the UTC epoch (Date.getTime()), converted to TT with a ΔT estimate.
//   - Sun: VSOP87 (truncated, Meeus "Astronomical Algorithms" App. III, ~1")
//     with nutation and aberration corrections.
//   - Moon: Meeus ch. 47, full table of periodic longitude terms (47.A) plus the
//     A1/A2/A3 additive terms (~10" accuracy).
//   - Sidereal (nirayana) longitudes via the Lahiri / Chitrapaksha ayanamsa.
//   - Sunrise / sunset: the NOAA/Meeus hour-angle method with h0 = -0.833°
//     (upper limb, standard refraction), iterated on the true solar position.
//   - Tithi, nakshatra, yoga and karana are those prevailing at local sunrise
//     (traditional convention); end times are found by bisection.
//   - Odia months are solar (sankranti based) and follow the "Odisha rule":
//     the month begins on the civil (IST) day on which the sankranti occurs.
//   - All displayed times are IST (UTC+05:30), independent of the machine timezone.

export interface PanchangaLocation {
    name: string;
    latitude: number;   // degrees, north positive
    longitude: number;  // degrees, east positive
    timezone: string;   // display timezone (always IST for this module)
}

export interface PanchangaOptions {
    latitude?: number;
    longitude?: number;
    name?: string;
}

export interface PanchangaData {
    /** Currently the same as sakaYear (kept for backwards compatibility). */
    odiaYear: number;
    sakaYear: number;
    odiaMonth: string;
    odiaMonthIndex: number;
    tithi: string;
    tithiIndex: number;
    tithiEnglish: string;
    paksha: 'shukla' | 'krishna';
    pakshaEnglish: string;
    nakshatra: string;
    nakshatraIndex: number;
    nakshatraEnglish: string;
    vara: string;
    varaEnglish: string;
    yoga: string;
    karana: string;
    sunrise: string;
    sunset: string;
    // ---- Optional extras (added later; safe for existing consumers) ----
    /** Day number within the solar Odia month (1 = sankranti day). */
    odiaDay?: number;
    /** When the tithi prevailing at sunrise ends, IST, e.g. "3:42 PM, 06 Oct". */
    tithiEndsAt?: string;
    /** When the nakshatra prevailing at sunrise ends, IST. */
    nakshatraEndsAt?: string;
    /** Sunrise as an ISO-8601 string with +05:30 offset. */
    sunriseISO?: string;
    /** Sunset as an ISO-8601 string with +05:30 offset. */
    sunsetISO?: string;
    /** Location used for sunrise/sunset. */
    location?: PanchangaLocation;
}

/** Default location: Bhubaneswar, Odisha. */
export const DEFAULT_LOCATION: PanchangaLocation = {
    name: "Bhubaneswar",
    latitude: 20.2961,
    longitude: 85.8245,
    timezone: "Asia/Kolkata",
};

// Odia month names
export const odiaMonths = [
    { odia: "ବୈଶାଖ", english: "Baisakha", gregorian: "Apr-May" },
    { odia: "ଜ୍ୟେଷ୍ଠ", english: "Jyestha", gregorian: "May-Jun" },
    { odia: "ଆଷାଢ଼", english: "Asadha", gregorian: "Jun-Jul" },
    { odia: "ଶ୍ରାବଣ", english: "Shravana", gregorian: "Jul-Aug" },
    { odia: "ଭାଦ୍ରବ", english: "Bhadrava", gregorian: "Aug-Sep" },
    { odia: "ଆଶ୍ୱିନ", english: "Ashwina", gregorian: "Sep-Oct" },
    { odia: "କାର୍ତ୍ତିକ", english: "Kartika", gregorian: "Oct-Nov" },
    { odia: "ମାର୍ଗଶିର", english: "Margashira", gregorian: "Nov-Dec" },
    { odia: "ପୌଷ", english: "Pausha", gregorian: "Dec-Jan" },
    { odia: "ମାଘ", english: "Magha", gregorian: "Jan-Feb" },
    { odia: "ଫାଲ୍ଗୁନ", english: "Phalguna", gregorian: "Feb-Mar" },
    { odia: "ଚୈତ୍ର", english: "Chaitra", gregorian: "Mar-Apr" },
];

// Tithi names
export const tithiNames = {
    shukla: [
        { odia: "ପ୍ରତିପଦା", english: "Pratipada" },
        { odia: "ଦ୍ୱିତୀୟା", english: "Dwitiya" },
        { odia: "ତୃତୀୟା", english: "Tritiya" },
        { odia: "ଚତୁର୍ଥୀ", english: "Chaturthi" },
        { odia: "ପଞ୍ଚମୀ", english: "Panchami" },
        { odia: "ଷଷ୍ଠୀ", english: "Shashthi" },
        { odia: "ସପ୍ତମୀ", english: "Saptami" },
        { odia: "ଅଷ୍ଟମୀ", english: "Ashtami" },
        { odia: "ନବମୀ", english: "Navami" },
        { odia: "ଦଶମୀ", english: "Dashami" },
        { odia: "ଏକାଦଶୀ", english: "Ekadashi" },
        { odia: "ଦ୍ୱାଦଶୀ", english: "Dwadashi" },
        { odia: "ତ୍ରୟୋଦଶୀ", english: "Trayodashi" },
        { odia: "ଚତୁର୍ଦ୍ଦଶୀ", english: "Chaturdashi" },
        { odia: "ପୂର୍ଣ୍ଣିମା", english: "Purnima" },
    ],
    krishna: [
        { odia: "ପ୍ରତିପଦା", english: "Pratipada" },
        { odia: "ଦ୍ୱିତୀୟା", english: "Dwitiya" },
        { odia: "ତୃତୀୟା", english: "Tritiya" },
        { odia: "ଚତୁର୍ଥୀ", english: "Chaturthi" },
        { odia: "ପଞ୍ଚମୀ", english: "Panchami" },
        { odia: "ଷଷ୍ଠୀ", english: "Shashthi" },
        { odia: "ସପ୍ତମୀ", english: "Saptami" },
        { odia: "ଅଷ୍ଟମୀ", english: "Ashtami" },
        { odia: "ନବମୀ", english: "Navami" },
        { odia: "ଦଶମୀ", english: "Dashami" },
        { odia: "ଏକାଦଶୀ", english: "Ekadashi" },
        { odia: "ଦ୍ୱାଦଶୀ", english: "Dwadashi" },
        { odia: "ତ୍ରୟୋଦଶୀ", english: "Trayodashi" },
        { odia: "ଚତୁର୍ଦ୍ଦଶୀ", english: "Chaturdashi" },
        { odia: "ଅମାବାସ୍ୟା", english: "Amavasya" },
    ],
};

// 27 Nakshatras
export const nakshatras = [
    { odia: "ଅଶ୍ୱିନୀ", english: "Ashwini" },
    { odia: "ଭରଣୀ", english: "Bharani" },
    { odia: "କୃତ୍ତିକା", english: "Krittika" },
    { odia: "ରୋହିଣୀ", english: "Rohini" },
    { odia: "ମୃଗଶିରା", english: "Mrigashira" },
    { odia: "ଆଦ୍ରା", english: "Ardra" },
    { odia: "ପୁନର୍ବସୁ", english: "Punarvasu" },
    { odia: "ପୁଷ୍ୟା", english: "Pushya" },
    { odia: "ଆଶ୍ଲେଷା", english: "Ashlesha" },
    { odia: "ମଘା", english: "Magha" },
    { odia: "ପୂର୍ବାଫାଲ୍ଗୁନୀ", english: "Purva Phalguni" },
    { odia: "ଉତ୍ତରାଫାଲ୍ଗୁନୀ", english: "Uttara Phalguni" },
    { odia: "ହସ୍ତା", english: "Hasta" },
    { odia: "ଚିତ୍ରା", english: "Chitra" },
    { odia: "ସ୍ୱାତୀ", english: "Swati" },
    { odia: "ବିଶାଖା", english: "Vishakha" },
    { odia: "ଅନୁରାଧା", english: "Anuradha" },
    { odia: "ଜ୍ୟେଷ୍ଠା", english: "Jyeshtha" },
    { odia: "ମୂଳା", english: "Mula" },
    { odia: "ପୂର୍ବାଷାଢ଼ା", english: "Purva Ashadha" },
    { odia: "ଉତ୍ତରାଷାଢ଼ା", english: "Uttara Ashadha" },
    { odia: "ଶ୍ରବଣ", english: "Shravana" },
    { odia: "ଧନିଷ୍ଠା", english: "Dhanishtha" },
    { odia: "ଶତଭିଷା", english: "Shatabhisha" },
    { odia: "ପୂର୍ବାଭାଦ୍ରପଦ", english: "Purva Bhadrapada" },
    { odia: "ଉତ୍ତରାଭାଦ୍ରପଦ", english: "Uttara Bhadrapada" },
    { odia: "ରେବତୀ", english: "Revati" },
];

// Vara (weekday) names
export const varas = [
    { odia: "ରବିବାର", english: "Sunday" },
    { odia: "ସୋମବାର", english: "Monday" },
    { odia: "ମଙ୍ଗଳବାର", english: "Tuesday" },
    { odia: "ବୁଧବାର", english: "Wednesday" },
    { odia: "ଗୁରୁବାର", english: "Thursday" },
    { odia: "ଶୁକ୍ରବାର", english: "Friday" },
    { odia: "ଶନିବାର", english: "Saturday" },
];

// Yoga names (27 yogas)
const yogas = [
    "ବିଷ୍କମ୍ଭ", "ପ୍ରୀତି", "ଆୟୁଷ୍ମାନ୍", "ସୌଭାଗ୍ୟ", "ଶୋଭନ",
    "ଅତିଗଣ୍ଡ", "ସୁକର୍ମା", "ଧୃତି", "ଶୂଳ", "ଗଣ୍ଡ",
    "ବୃଦ୍ଧି", "ଧ୍ରୁବ", "ବ୍ୟାଘାତ", "ହର୍ଷଣ", "ବଜ୍ର",
    "ସିଦ୍ଧି", "ବ୍ୟତୀପାତ", "ବରୀୟାନ୍", "ପରିଘ", "ଶିବ",
    "ସିଦ୍ଧ", "ସାଧ୍ୟ", "ଶୁଭ", "ଶୁକ୍ଳ", "ବ୍ରହ୍ମ",
    "ଇନ୍ଦ୍ର", "ବୈଧୃତି"
];

// Karana names (11 karanas, 2 repeating)
const karanas = [
    "ବବ", "ବାଲବ", "କୌଲବ", "ତୈତିଳ", "ଗର",
    "ବଣିଜ", "ବିଷ୍ଟି", "ଶକୁନି", "ଚତୁଷ୍ପାଦ", "ନାଗ", "କିଂସ୍ତୁଘ୍ନ"
];

// ---------------------------------------------------------------------------
// Basic helpers
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;
const IST_OFFSET_MS = 330 * 60 * 1000; // UTC+05:30
const MS_PER_DAY = 86400000;
const MS_PER_HOUR = 3600000;

const norm360 = (x: number): number => ((x % 360) + 360) % 360;
const norm180 = (x: number): number => {
    const r = norm360(x);
    return r > 180 ? r - 360 : r;
};
const sind = (x: number): number => Math.sin(x * DEG);
const cosd = (x: number): number => Math.cos(x * DEG);

/** Julian Day (UT) from a UTC epoch in milliseconds. */
function julianDayUT(ms: number): number {
    return ms / MS_PER_DAY + 2440587.5;
}

/** ΔT = TT - UT in seconds (Espenak & Meeus polynomials; ~69 s in the 2020s). */
function deltaTSeconds(jdUT: number): number {
    const y = 2000 + (jdUT - 2451545.0) / 365.25;
    if (y >= 2015 && y < 2035) return 69.2; // observed value has been ~69 s since 2017
    if (y >= 2005 && y < 2050) {
        const t = y - 2000;
        return 62.92 + 0.32217 * t + 0.005589 * t * t;
    }
    if (y >= 1986 && y < 2005) {
        const t = y - 2000;
        return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t ** 3
            + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5;
    }
    const u = (y - 1820) / 100;
    return -20 + 32 * u * u;
}

/** Julian centuries of TT since J2000.0, for a UTC epoch in ms. */
function centuriesTT(ms: number): number {
    const jd = julianDayUT(ms);
    return (jd + deltaTSeconds(jd) / 86400 - 2451545.0) / 36525;
}

// ---------------------------------------------------------------------------
// Nutation (Meeus ch. 22, low-precision: ~0.5" in Δψ, ~0.1" in Δε)
// ---------------------------------------------------------------------------

function nutation(T: number): { dPsi: number; dEps: number; omega: number } {
    const omega = 125.04452 - 1934.136261 * T;
    const Ls = 280.4665 + 36000.7698 * T;   // mean longitude of the Sun
    const Lm = 218.3165 + 481267.8813 * T;  // mean longitude of the Moon
    const dPsi = (-17.20 * sind(omega) - 1.32 * sind(2 * Ls) - 0.23 * sind(2 * Lm) + 0.21 * sind(2 * omega)) / 3600;
    const dEps = (9.20 * cosd(omega) + 0.57 * cosd(2 * Ls) + 0.10 * cosd(2 * Lm) - 0.09 * cosd(2 * omega)) / 3600;
    return { dPsi, dEps, omega };
}

/** True obliquity of the ecliptic (degrees). */
function obliquity(T: number): number {
    const eps0 = 23.439291111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T ** 3) / 3600;
    return eps0 + nutation(T).dEps;
}

// ---------------------------------------------------------------------------
// Sun
// Longitude: VSOP87 (Earth, heliocentric) truncated as printed in Meeus,
// Appendix III — accurate to ~1". The simpler ch. 25 series is off by up to
// ~25" (≈10 minutes in sankranti times), so it is used only for the Sun-Earth
// distance (needed for the 20.5" aberration term).
// Each row: [A (1e-8 rad), B (rad), C (rad per Julian millennium)] → A·cos(B + C·τ)
// ---------------------------------------------------------------------------

const VSOP_L0: number[][] = [
    [175347046,0,0], [3341656,4.6692568,6283.07585], [34894,4.6261,12566.1517], [3497,2.7441,5753.3849],
    [3418,2.8289,3.5231], [3136,3.6277,77713.7715], [2676,4.4181,7860.4194], [2343,6.1352,3930.2097],
    [1324,0.7425,11506.7698], [1273,2.0371,529.691], [1199,1.1096,1577.3435], [990,5.233,5884.927],
    [902,2.045,26.298], [857,3.508,398.149], [780,1.179,5223.694], [753,2.533,5507.553],
    [505,4.583,18849.228], [492,4.205,775.523], [357,2.92,0.067], [317,5.849,11790.629], [284,1.899,796.298],
    [271,0.315,10977.079], [243,0.345,5486.778], [206,4.806,2544.314], [205,1.869,5573.143],
    [202,2.458,6069.777], [156,0.833,213.299], [132,3.411,2942.463], [126,1.083,20.775], [115,0.645,0.98],
    [103,0.636,4694.003], [102,0.976,15720.839], [102,4.267,7.114], [99,6.21,2146.17], [98,0.68,155.42],
    [86,5.98,161000.69], [85,1.3,6275.96], [85,3.67,71430.7], [80,1.81,17260.15], [79,3.04,12036.46],
    [75,1.76,5088.63], [74,3.5,3154.69], [74,4.68,801.82], [70,0.83,9437.76], [62,3.98,8827.39],
    [61,1.82,7084.9], [57,2.78,6286.6], [56,4.39,14143.5], [56,3.47,6279.55], [52,0.19,12139.55],
    [52,1.33,1748.02], [51,0.28,5856.48], [49,0.49,1194.45], [41,5.37,8429.24], [41,2.4,19651.05],
    [39,6.17,10447.39], [37,6.04,10213.29], [37,2.57,1059.38], [36,1.71,2352.87], [36,1.78,6812.77],
    [33,0.59,17789.85], [30,0.44,83996.85], [30,2.74,1349.87], [25,3.16,4690.48],
];
const VSOP_L1: number[][] = [
    [628331966747,0,0], [206059,2.678235,6283.07585], [4303,2.6351,12566.1517], [425,1.59,3.523],
    [119,5.796,26.298], [109,2.966,1577.344], [93,2.59,18849.23], [72,1.14,529.69], [68,1.87,398.15],
    [67,4.41,5507.55], [59,2.89,5223.69], [56,2.17,155.42], [45,0.4,796.3], [36,0.47,775.52], [29,2.65,7.11],
    [21,5.34,0.98], [19,1.85,5486.78], [19,4.97,213.3], [17,2.99,6275.96], [16,0.03,2544.31],
    [16,1.43,2146.17], [15,1.21,10977.08], [12,2.83,1748.02], [12,3.26,5088.63], [12,5.27,1194.45],
    [12,2.08,4694], [11,0.77,553.57], [10,1.3,6286.6], [10,4.24,1349.87], [9,2.7,242.73], [9,5.64,951.72],
    [8,5.3,2352.87], [6,2.65,9437.76], [6,4.67,4690.48],
];
const VSOP_L2: number[][] = [
    [52919,0,0], [8720,1.0721,6283.0758], [309,0.867,12566.152], [27,0.05,3.52], [16,5.19,26.3],
    [16,3.68,155.42], [10,0.76,18849.23], [9,2.06,77713.77], [7,0.83,775.52], [5,4.66,1577.34], [4,1.03,7.11],
    [4,3.44,5573.14], [3,5.14,796.3], [3,6.05,5507.55], [3,1.19,242.73], [3,6.12,529.69], [3,0.31,398.15],
    [3,2.28,553.57], [2,4.38,5223.69], [2,3.75,0.98],
];
const VSOP_L3: number[][] = [
    [289,5.844,6283.076], [35,0,0], [17,5.49,12566.15], [3,5.2,155.42], [1,4.72,3.52], [1,5.3,18849.23],
    [1,5.97,242.73],
];
const VSOP_L4: number[][] = [[114,3.142,0],[8,4.13,6283.08],[1,3.84,12566.15]];
const VSOP_L5: number[][] = [[1,3.14,0]];

const vsopSum = (terms: number[][], tau: number): number =>
    terms.reduce((acc, [A, B, C]) => acc + A * Math.cos(B + C * tau), 0);

/** Apparent geocentric ecliptic longitude of the Sun (tropical, degrees). */
function sunApparentLongitude(T: number): number {
    // Geometric longitude from VSOP87 (τ = Julian millennia of TT from J2000)
    const tau = T / 10;
    const Lrad = (vsopSum(VSOP_L0, tau) + tau * vsopSum(VSOP_L1, tau) + tau ** 2 * vsopSum(VSOP_L2, tau)
        + tau ** 3 * vsopSum(VSOP_L3, tau) + tau ** 4 * vsopSum(VSOP_L4, tau) + tau ** 5 * vsopSum(VSOP_L5, tau)) / 1e8;
    const geometric = Lrad / DEG + 180 - 0.09033 / 3600; // heliocentric Earth → geocentric Sun, FK5

    // Sun-Earth distance from Meeus ch. 25 (only needed for aberration)
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M)
        + (0.019993 - 0.000101 * T) * sind(2 * M)
        + 0.000289 * sind(3 * M);
    const R = (1.000001018 * (1 - e * e)) / (1 + e * cosd(M + C)); // AU
    const aberration = -20.4898 / 3600 / R;

    return norm360(geometric + aberration + nutation(T).dPsi);
}

// ---------------------------------------------------------------------------
// Moon (Meeus ch. 47, table 47.A — all 60 longitude terms)
// Columns: D, M, M', F, coefficient of sine (unit 1e-6 degree)
// ---------------------------------------------------------------------------

const MOON_LON_TERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
    [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
    [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
    [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
    [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
    [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
    [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
    [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
    [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
    [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
    [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
    [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
    [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
    [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
    [3, 0, -1, 0, -892], [2, 1, 1, 0, -810], [4, -1, -2, 0, 759],
    [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
    [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
    [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399],
    [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340],
    [4, 0, -3, 0, 330], [2, -1, 2, 0, 327], [0, 2, 1, 0, -323],
    [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
];

/** Apparent geocentric ecliptic longitude of the Moon (tropical, degrees). */
function moonApparentLongitude(T: number): number {
    const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
    const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
    const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;
    const A1 = 119.75 + 131.849 * T;
    const A2 = 53.09 + 479264.290 * T;
    const E = 1 - 0.002516 * T - 0.0000074 * T2; // Earth-orbit eccentricity factor

    let sumL = 0;
    for (const [d, m, mp, f, coeff] of MOON_LON_TERMS) {
        let c = coeff;
        if (m === 1 || m === -1) c *= E;
        else if (m === 2 || m === -2) c *= E * E;
        sumL += c * sind(d * D + m * M + mp * Mp + f * F);
    }
    sumL += 3958 * sind(A1) + 1962 * sind(Lp - F) + 318 * sind(A2);

    return norm360(Lp + sumL / 1e6 + nutation(T).dPsi);
}

// ---------------------------------------------------------------------------
// Lahiri (Chitrapaksha) ayanamsa
// Anchored to the official value 23°15'00.658" at 21 Mar 1956 0h TT
// (JD 2435553.5, as used by the Swiss Ephemeris "Lahiri" mode), advanced
// with the IAU 1976 general precession in longitude. ≈ 23.857° at J2000.
// ---------------------------------------------------------------------------

const LAHIRI_T0 = (2435553.5 - 2451545.0) / 36525;
const LAHIRI_AYAN0 = 23.245524743;

function precessionArcsec(T: number): number {
    return 5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T;
}

/** Mean Lahiri ayanamsa (degrees). */
function lahiriAyanamsa(T: number): number {
    return LAHIRI_AYAN0 + (precessionArcsec(T) - precessionArcsec(LAHIRI_T0)) / 3600;
}

/**
 * Sidereal longitude from an apparent tropical one. Nutation is removed so the
 * longitude is referred to the mean equinox, which is what the (mean) Lahiri
 * ayanamsa is measured from.
 */
function toSidereal(apparentTropical: number, T: number): number {
    return norm360(apparentTropical - nutation(T).dPsi - lahiriAyanamsa(T));
}

// Convenience accessors on a UTC epoch (ms)
function sunSidereal(ms: number): number {
    const T = centuriesTT(ms);
    return toSidereal(sunApparentLongitude(T), T);
}
function moonSidereal(ms: number): number {
    const T = centuriesTT(ms);
    return toSidereal(moonApparentLongitude(T), T);
}
/** Moon − Sun elongation (0..360). Ayanamsa-independent. */
function elongation(ms: number): number {
    const T = centuriesTT(ms);
    return norm360(moonApparentLongitude(T) - sunApparentLongitude(T));
}
/** Sum of sidereal longitudes, used for yoga. */
function yogaLongitude(ms: number): number {
    const T = centuriesTT(ms);
    const ayan = lahiriAyanamsa(T) + nutation(T).dPsi;
    return norm360(sunApparentLongitude(T) + moonApparentLongitude(T) - 2 * ayan);
}

// ---------------------------------------------------------------------------
// Sunrise / sunset (NOAA / Meeus hour-angle method, h0 = −0.833°)
// ---------------------------------------------------------------------------

/** Greenwich mean sidereal time (degrees) for a UT Julian Day. */
function gmst(jdUT: number): number {
    const d = jdUT - 2451545.0;
    const T = d / 36525;
    return norm360(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - T * T * T / 38710000);
}

/** Sun right ascension and declination (degrees) at a UTC epoch. */
function sunEquatorial(ms: number): { ra: number; dec: number } {
    const T = centuriesTT(ms);
    const lam = sunApparentLongitude(T);
    const eps = obliquity(T);
    const ra = norm360(Math.atan2(cosd(eps) * sind(lam), cosd(lam)) / DEG);
    const dec = Math.asin(sind(eps) * sind(lam)) / DEG;
    return { ra, dec };
}

/**
 * Time (UTC ms) of sunrise (`rising = true`) or sunset near `guessMs`.
 * Iterates t ← t − (H(t) ∓ H0(t)) / 360.9856 °/day until converged.
 * Returns null for polar day/night.
 */
function sunEvent(guessMs: number, lat: number, lon: number, rising: boolean): number | null {
    const h0 = -0.833;
    let t = guessMs;
    for (let i = 0; i < 8; i++) {
        const { ra, dec } = sunEquatorial(t);
        const cosH0 = (sind(h0) - sind(lat) * sind(dec)) / (cosd(lat) * cosd(dec));
        if (cosH0 < -1 || cosH0 > 1) return null;
        const H0 = Math.acos(cosH0) / DEG;
        const H = norm180(gmst(julianDayUT(t)) + lon - ra); // local hour angle
        const target = rising ? -H0 : H0;
        const dtDeg = norm180(H - target);
        t -= (dtDeg / 360.98564736629) * MS_PER_DAY;
        if (Math.abs(dtDeg) < 1e-5) break;
    }
    return t;
}

// ---------------------------------------------------------------------------
// IST formatting / calendar helpers
// ---------------------------------------------------------------------------

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** IST calendar parts of a UTC epoch. */
function istParts(ms: number) {
    const d = new Date(ms + IST_OFFSET_MS);
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        weekday: d.getUTCDay(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
    };
}

/** UTC epoch of IST midnight starting the given IST calendar date. */
function istMidnight(year: number, month: number, day: number): number {
    return Date.UTC(year, month - 1, day) - IST_OFFSET_MS;
}

const pad2 = (n: number): string => n.toString().padStart(2, '0');

/** "hh:mm AM" (zero-padded hour, as used by the existing UI). */
function formatTimeIST(ms: number): string {
    const p = istParts(Math.round(ms / 60000) * 60000);
    const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
    return `${pad2(h12)}:${pad2(p.minute)} ${p.hour < 12 ? 'AM' : 'PM'}`;
}

/** "h:mm AM/PM, DD Mon" in IST. */
function formatDateTimeIST(ms: number): string {
    const p = istParts(Math.round(ms / 60000) * 60000);
    const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
    return `${h12}:${pad2(p.minute)} ${p.hour < 12 ? 'AM' : 'PM'}, ${pad2(p.day)} ${MONTH_ABBR[p.month - 1]}`;
}

/** ISO-8601 with explicit +05:30 offset, to the minute. */
function isoIST(ms: number): string {
    const p = istParts(Math.round(ms / 60000) * 60000);
    return `${p.year}-${pad2(p.month)}-${pad2(p.day)}T${pad2(p.hour)}:${pad2(p.minute)}:00+05:30`;
}

// ---------------------------------------------------------------------------
// Root finding: when does a monotonically increasing angle cross a boundary?
// ---------------------------------------------------------------------------

/**
 * Find the first time in (startMs, startMs + windowHours] at which `angleFn`
 * (an increasing angle in degrees, mod 360) crosses `boundary`. Brackets in
 * 1-hour steps then bisects to ~1 second. Returns null if not found.
 */
function findCrossing(angleFn: (ms: number) => number, boundary: number, startMs: number,
    windowHours = 30, direction: 1 | -1 = 1): number | null {
    const g = (ms: number) => norm180(angleFn(ms) - boundary);
    let a = startMs;
    let ga = g(a);
    for (let h = 1; h <= windowHours; h++) {
        const b = startMs + direction * h * MS_PER_HOUR;
        const gb = g(b);
        // crossing forward in time: g goes from negative to non-negative
        const before = direction === 1 ? ga : gb;
        const after = direction === 1 ? gb : ga;
        if (before < 0 && after >= 0 && after - before < 90) {
            let lo = Math.min(a, b), hi = Math.max(a, b);
            while (hi - lo > 1000) {
                const mid = (lo + hi) / 2;
                if (g(mid) < 0) lo = mid; else hi = mid;
            }
            return (lo + hi) / 2;
        }
        a = b;
        ga = gb;
    }
    return null;
}

// ---------------------------------------------------------------------------
// Panchanga elements
// ---------------------------------------------------------------------------

/** Tithi number 0..29 (0 = Shukla Pratipada, 14 = Purnima, 29 = Amavasya). */
function tithiNumber(ms: number): number {
    return Math.floor(elongation(ms) / 12) % 30;
}

function nakshatraNumber(ms: number): number {
    return Math.floor(moonSidereal(ms) / (360 / 27)) % 27;
}

function yogaNumber(ms: number): number {
    return Math.floor(yogaLongitude(ms) / (360 / 27)) % 27;
}

/** Index into `karanas` for the half-tithi in progress. */
function karanaIndexAt(ms: number): number {
    const k = Math.floor(elongation(ms) / 6) % 60;
    // Fixed karanas: Kimstughna (first half of Shukla Pratipada) and the last three.
    if (k === 0) return 10; // Kimstughna
    if (k === 59) return 9; // Naga
    if (k === 58) return 8; // Chatushpada
    if (k === 57) return 7; // Shakuni
    return (k - 1) % 7;     // Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti
}

/** Sidereal rashi of the Sun (0 = Mesha … 11 = Meena). */
function sunRashi(ms: number): number {
    return Math.floor(sunSidereal(ms) / 30) % 12;
}

/**
 * Odia solar month for an IST civil date.
 * Odia months are named after the sidereal Sun's rashi: Mesha → Baisakha,
 * Vrishabha → Jyestha, … Meena → Chaitra, so odiaMonthIndex === rashi.
 * Odisha rule: the month begins on the civil day the sankranti falls on, so we
 * take the rashi at the end of the IST day (24:00) and count days from the
 * sankranti's IST date.
 */
function odiaSolarMonth(year: number, month: number, day: number): { index: number; day: number } {
    const dayStart = istMidnight(year, month, day);
    const dayEnd = dayStart + MS_PER_DAY - 1;
    const rashi = sunRashi(dayEnd);
    // Search backwards (Sun moves ~1°/day, so ≤ 32 days) for the sankranti.
    const sankranti = findCrossing(sunSidereal, rashi * 30, dayEnd, 33 * 24, -1);
    let dayOfMonth = 1;
    if (sankranti !== null) {
        const s = istParts(sankranti);
        dayOfMonth = Math.round((dayStart - istMidnight(s.year, s.month, s.day)) / MS_PER_DAY) + 1;
    }
    return { index: rashi, day: dayOfMonth };
}

/**
 * Saka year per the Indian national calendar: 1 Chaitra falls on 22 March,
 * or 21 March in Gregorian leap years.
 */
function getSakaYear(year: number, month: number, day: number): number {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const chaitraStart = leap ? 21 : 22;
    const afterNewYear = month > 3 || (month === 3 && day >= chaitraStart);
    return afterNewYear ? year - 78 : year - 79;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute the panchanga for the IST calendar day containing `date`.
 * Tithi, nakshatra, yoga and karana are those prevailing at local sunrise.
 */
export function getPanchanga(date: Date = new Date(), options: PanchangaOptions = {}): PanchangaData {
    const location: PanchangaLocation = {
        name: options.name ?? (options.latitude !== undefined || options.longitude !== undefined ? "Custom" : DEFAULT_LOCATION.name),
        latitude: options.latitude ?? DEFAULT_LOCATION.latitude,
        longitude: options.longitude ?? DEFAULT_LOCATION.longitude,
        timezone: DEFAULT_LOCATION.timezone,
    };
    const { latitude: lat, longitude: lon } = location;

    // IST civil date of the given instant (independent of the machine timezone)
    const ist = istParts(date.getTime());
    const midnight = istMidnight(ist.year, ist.month, ist.day);

    // Sunrise / sunset; fall back to 06:00 / 18:00 IST at extreme latitudes
    const sunriseMs = sunEvent(midnight + 6 * MS_PER_HOUR, lat, lon, true) ?? midnight + 6 * MS_PER_HOUR;
    const sunsetMs = sunEvent(midnight + 18 * MS_PER_HOUR, lat, lon, false) ?? midnight + 18 * MS_PER_HOUR;

    // Elements at sunrise
    const tithiNum = tithiNumber(sunriseMs);
    const paksha: 'shukla' | 'krishna' = tithiNum < 15 ? 'shukla' : 'krishna';
    const tithiIndex = tithiNum % 15;
    const nakshatraIndex = nakshatraNumber(sunriseMs);
    const yogaIndex = yogaNumber(sunriseMs);
    const karanaIndex = karanaIndexAt(sunriseMs);

    // End times of the sunrise tithi / nakshatra
    const tithiEnd = findCrossing(elongation, ((tithiNum + 1) % 30) * 12, sunriseMs, 30);
    const nakEnd = findCrossing(moonSidereal, ((nakshatraIndex + 1) % 27) * (360 / 27), sunriseMs, 30);

    const { index: odiaMonthIndex, day: odiaDay } = odiaSolarMonth(ist.year, ist.month, ist.day);
    const sakaYear = getSakaYear(ist.year, ist.month, ist.day);

    const tithiData = tithiNames[paksha][tithiIndex];
    const nakshatraData = nakshatras[nakshatraIndex];
    const varaData = varas[ist.weekday];

    return {
        // NOTE: odiaYear is kept equal to the Saka year for backwards compatibility.
        // (The traditional Odia "Anka"/Amli era is a different count and is not computed here.)
        odiaYear: sakaYear,
        sakaYear,
        odiaMonth: odiaMonths[odiaMonthIndex].odia,
        odiaMonthIndex,
        tithi: tithiData.odia,
        tithiIndex,
        tithiEnglish: tithiData.english,
        paksha,
        pakshaEnglish: paksha === 'shukla' ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)',
        nakshatra: nakshatraData.odia,
        nakshatraIndex,
        nakshatraEnglish: nakshatraData.english,
        vara: varaData.odia,
        varaEnglish: varaData.english,
        yoga: yogas[yogaIndex],
        karana: karanas[karanaIndex],
        sunrise: formatTimeIST(sunriseMs),
        sunset: formatTimeIST(sunsetMs),
        odiaDay,
        tithiEndsAt: tithiEnd !== null ? formatDateTimeIST(tithiEnd) : undefined,
        nakshatraEndsAt: nakEnd !== null ? formatDateTimeIST(nakEnd) : undefined,
        sunriseISO: isoIST(sunriseMs),
        sunsetISO: isoIST(sunsetMs),
        location,
    };
}

/** Panchanga for an IST calendar date (month is 1-12). */
export function getPanchangaForDate(year: number, month: number, day: number, options: PanchangaOptions = {}): PanchangaData {
    // Noon IST of the requested date: unambiguous regardless of machine timezone.
    return getPanchanga(new Date(Date.UTC(year, month - 1, day, 12) - IST_OFFSET_MS), options);
}
