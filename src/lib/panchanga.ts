// Panchanga calculation utilities
// Based on Hindu/Vedic astronomical calculations

export interface PanchangaData {
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
}

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

// Calculate Julian Day Number
function getJulianDayNumber(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() + date.getMinutes() / 60;

    let y = year;
    let m = month;

    if (m <= 2) {
        y -= 1;
        m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);

    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + b - 1524.5;
}

// Calculate Sun's longitude (simplified)
function getSunLongitude(jd: number): number {
    const T = (jd - 2451545.0) / 36525;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const Mrad = M * Math.PI / 180;
    const C = (1.914602 - 0.004817 * T) * Math.sin(Mrad) +
        0.019993 * Math.sin(2 * Mrad) +
        0.00029 * Math.sin(3 * Mrad);
    return ((L0 + C) % 360 + 360) % 360;
}

// Calculate Moon's longitude (simplified)
function getMoonLongitude(jd: number): number {
    const T = (jd - 2451545.0) / 36525;
    const L = 218.3165 + 481267.8813 * T;
    const M = 134.9634 + 477198.8676 * T;
    const F = 93.2721 + 483202.0175 * T;
    const D = 297.8502 + 445267.1115 * T;

    const Mrad = M * Math.PI / 180;
    const Frad = F * Math.PI / 180;
    const Drad = D * Math.PI / 180;

    const longitude = L +
        6.289 * Math.sin(Mrad) +
        1.274 * Math.sin(2 * Drad - Mrad) +
        0.658 * Math.sin(2 * Drad) +
        0.214 * Math.sin(2 * Mrad) -
        0.186 * Math.sin((M * Math.PI / 180)) -
        0.114 * Math.sin(2 * Frad);

    return ((longitude % 360) + 360) % 360;
}

// Calculate tithi (lunar day)
function calculateTithi(jd: number): { tithi: number; paksha: 'shukla' | 'krishna' } {
    const sunLong = getSunLongitude(jd);
    const moonLong = getMoonLongitude(jd);

    let diff = moonLong - sunLong;
    if (diff < 0) diff += 360;

    const tithiNum = Math.floor(diff / 12);
    const paksha = tithiNum < 15 ? 'shukla' : 'krishna';
    const tithi = tithiNum % 15;

    return { tithi, paksha };
}

// Calculate nakshatra
function calculateNakshatra(jd: number): number {
    const moonLong = getMoonLongitude(jd);
    return Math.floor(moonLong * 27 / 360) % 27;
}

// Calculate yoga
function calculateYoga(jd: number): number {
    const sunLong = getSunLongitude(jd);
    const moonLong = getMoonLongitude(jd);
    const sum = (sunLong + moonLong) % 360;
    return Math.floor(sum * 27 / 360) % 27;
}

// Calculate karana
function calculateKarana(jd: number): number {
    const sunLong = getSunLongitude(jd);
    const moonLong = getMoonLongitude(jd);

    let diff = moonLong - sunLong;
    if (diff < 0) diff += 360;

    const karanaNum = Math.floor(diff / 6) % 60;

    // First 4 karanas are fixed, then 7 repeat
    if (karanaNum === 0) return 10; // Kimstughna
    if (karanaNum === 59) return 9; // Naga
    if (karanaNum === 58) return 8; // Chatushpada
    if (karanaNum === 57) return 7; // Shakuni

    return ((karanaNum - 1) % 7);
}

// Get Odia month from Gregorian date
function getOdiaMonthIndex(date: Date): number {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Approximate mapping (varies each year)
    // Baisakha starts around April 14
    const monthMap: { [key: number]: number } = {
        0: 8,  // January -> Pausha/Magha
        1: 9,  // February -> Magha
        2: 10, // March -> Phalguna
        3: 11, // April (early) -> Chaitra
        4: 0,  // May -> Baisakha
        5: 1,  // June -> Jyestha
        6: 2,  // July -> Asadha
        7: 3,  // August -> Shravana
        8: 4,  // September -> Bhadrava
        9: 5,  // October -> Ashwina
        10: 6, // November -> Kartika
        11: 7, // December -> Margashira
    };

    // Adjust for transition period
    if (month === 0 && day >= 14) return 9; // Mid-Jan -> Magha
    if (month === 3 && day >= 14) return 0; // Mid-Apr -> Baisakha

    return monthMap[month];
}

// Get Saka year
function getSakaYear(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Saka year starts in March/April
    return month >= 3 ? year - 78 : year - 79;
}

// Approximate sunrise/sunset for Bhubaneswar (IST)
function getSunTimes(date: Date): { sunrise: string; sunset: string } {
    const month = date.getMonth();

    // Approximate times for different seasons
    const sunriseHours = [6, 6, 6, 5, 5, 5, 5, 5, 6, 6, 6, 6];
    const sunriseMinutes = [30, 15, 0, 45, 30, 15, 30, 45, 0, 15, 30, 30];
    const sunsetHours = [17, 17, 18, 18, 18, 18, 18, 18, 18, 17, 17, 17];
    const sunsetMinutes = [30, 45, 0, 15, 30, 45, 30, 15, 0, 45, 30, 15];

    const sunrise = `${sunriseHours[month].toString().padStart(2, '0')}:${sunriseMinutes[month].toString().padStart(2, '0')} AM`;
    const sunset = `${(sunsetHours[month] > 12 ? sunsetHours[month] - 12 : sunsetHours[month]).toString().padStart(2, '0')}:${sunsetMinutes[month].toString().padStart(2, '0')} PM`;

    return { sunrise, sunset };
}

// Main function to get complete Panchanga
export function getPanchanga(date: Date = new Date()): PanchangaData {
    // Adjust to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
    const istDate = new Date(utc + istOffset);

    const jd = getJulianDayNumber(istDate);

    const { tithi: tithiIndex, paksha } = calculateTithi(jd);
    const nakshatraIndex = calculateNakshatra(jd);
    const yogaIndex = calculateYoga(jd);
    const karanaIndex = calculateKarana(jd);
    const varaIndex = istDate.getDay();

    const odiaMonthIndex = getOdiaMonthIndex(istDate);
    const sakaYear = getSakaYear(istDate);
    const { sunrise, sunset } = getSunTimes(istDate);

    const tithiData = paksha === 'shukla' ? tithiNames.shukla[tithiIndex] : tithiNames.krishna[tithiIndex];
    const nakshatraData = nakshatras[nakshatraIndex];
    const varaData = varas[varaIndex];

    return {
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
        sunrise,
        sunset,
    };
}

// Get Panchanga for a specific date
export function getPanchangaForDate(year: number, month: number, day: number): PanchangaData {
    return getPanchanga(new Date(year, month - 1, day));
}
