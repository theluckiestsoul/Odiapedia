import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Odia Calendar - Panjika with Tithi, Nakshatra & Festivals",
    description: "Odia Panjika showing 12 months, festivals, tithi, nakshatra, and Odia year. Reference for Jagannath and Biraja Panjika.",
};

// Odia months with festivals
const odiaMonths = [
    {
        name: "ବୈଶାଖ",
        transliteration: "Baisakha",
        gregorian: "Apr - May",
        festivals: [
            { name: "ପଣା ସଂକ୍ରାନ୍ତି", transliteration: "Pana Sankranti", description: "Odia New Year" },
            { name: "ଅକ୍ଷୟ ତୃତୀୟା", transliteration: "Akshaya Tritiya", description: "Chandan Yatra begins" },
            { name: "ପରଶୁରାମ ଜୟନ୍ତୀ", transliteration: "Parashurama Jayanti", description: "Birth of Lord Parashurama" },
        ],
        color: "from-green-900/50 to-emerald-900/50",
    },
    {
        name: "ଜ୍ୟେଷ୍ଠ",
        transliteration: "Jyestha",
        gregorian: "May - Jun",
        festivals: [
            { name: "ସାବିତ୍ରୀ ଅମାବାସ୍ୟା", transliteration: "Savitri Amavasya", description: "Married women's fast" },
            { name: "ସୀତଳ ଷଷ୍ଠୀ", transliteration: "Sitala Sasthi", description: "Worship of Goddess Sitala" },
        ],
        color: "from-yellow-900/50 to-amber-900/50",
    },
    {
        name: "ଆଷାଢ଼",
        transliteration: "Asadha",
        gregorian: "Jun - Jul",
        festivals: [
            { name: "ରଥଯାତ୍ରା", transliteration: "Rath Yatra", description: "Lord Jagannath's chariot festival" },
            { name: "ବାହୁଡ଼ା ଯାତ୍ରା", transliteration: "Bahuda Yatra", description: "Return journey" },
            { name: "ସୁନାବେଶ", transliteration: "Suna Besha", description: "Golden attire of deities" },
        ],
        color: "from-blue-900/50 to-indigo-900/50",
    },
    {
        name: "ଶ୍ରାବଣ",
        transliteration: "Shravana",
        gregorian: "Jul - Aug",
        festivals: [
            { name: "ଗମ୍ଭା ପୂର୍ଣ୍ଣିମା", transliteration: "Gamha Purnima", description: "Rakhi Purnima" },
            { name: "ଜନ୍ମାଷ୍ଟମୀ", transliteration: "Janmashtami", description: "Lord Krishna's birthday" },
            { name: "ଚିତଲାଗି ଅମାବାସ୍ୟା", transliteration: "Chitalagi Amavasya", description: "Deities retire to rest" },
        ],
        color: "from-cyan-900/50 to-teal-900/50",
    },
    {
        name: "ଭାଦ୍ରବ",
        transliteration: "Bhadrava",
        gregorian: "Aug - Sep",
        festivals: [
            { name: "ଗଣେଶ ଚତୁର୍ଥୀ", transliteration: "Ganesh Chaturthi", description: "Lord Ganesha's birthday" },
            { name: "ନୁଆଖାଇ", transliteration: "Nuakhai", description: "Harvest festival of Western Odisha" },
            { name: "ବିଶ୍ୱକର୍ମା ପୂଜା", transliteration: "Vishwakarma Puja", description: "Worship of divine architect" },
        ],
        color: "from-orange-900/50 to-red-900/50",
    },
    {
        name: "ଆଶ୍ୱିନ",
        transliteration: "Ashwina",
        gregorian: "Sep - Oct",
        festivals: [
            { name: "ଦୁର୍ଗା ପୂଜା", transliteration: "Durga Puja", description: "Worship of Goddess Durga" },
            { name: "ମହାଳୟା", transliteration: "Mahalaya", description: "Pitru Paksha ends" },
            { name: "କୁମାର ପୂର୍ଣ୍ଣିମା", transliteration: "Kumar Purnima", description: "Festival for unmarried girls" },
        ],
        color: "from-rose-900/50 to-pink-900/50",
    },
    {
        name: "କାର୍ତ୍ତିକ",
        transliteration: "Kartika",
        gregorian: "Oct - Nov",
        festivals: [
            { name: "ଦୀପାବଳୀ", transliteration: "Deepavali", description: "Festival of lights" },
            { name: "କାଳୀ ପୂଜା", transliteration: "Kali Puja", description: "Worship of Goddess Kali" },
            { name: "ବୋଇତା ବନ୍ଦାଣ", transliteration: "Boita Bandana", description: "Maritime heritage celebration" },
            { name: "କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା", transliteration: "Kartik Purnima", description: "Holy bath, Bali Yatra" },
        ],
        color: "from-amber-900/50 to-yellow-900/50",
    },
    {
        name: "ମାର୍ଗଶିର",
        transliteration: "Margashira",
        gregorian: "Nov - Dec",
        festivals: [
            { name: "ମାଣବସା ଗୁରୁବାର", transliteration: "Manabasa Gurubara", description: "Lakshmi Puja on Thursdays" },
            { name: "ପ୍ରଥମଷ୍ଟମୀ", transliteration: "Prathamastami", description: "First Ashtami - for firstborn" },
        ],
        color: "from-purple-900/50 to-violet-900/50",
    },
    {
        name: "ପୌଷ",
        transliteration: "Pausha",
        gregorian: "Dec - Jan",
        festivals: [
            { name: "ଧନୁ ସଂକ୍ରାନ୍ତି", transliteration: "Dhanu Sankranti", description: "Beginning of Dhanu month" },
            { name: "ପୌଷ ପୂର୍ଣ୍ଣିମା", transliteration: "Pausha Purnima", description: "Holy full moon" },
        ],
        color: "from-slate-800/50 to-gray-900/50",
    },
    {
        name: "ମାଘ",
        transliteration: "Magha",
        gregorian: "Jan - Feb",
        festivals: [
            { name: "ମକର ସଂକ୍ରାନ୍ତି", transliteration: "Makar Sankranti", description: "Sun enters Capricorn" },
            { name: "ବସନ୍ତ ପଞ୍ଚମୀ", transliteration: "Basanta Panchami", description: "Saraswati Puja" },
            { name: "ମାଘ ପୂର୍ଣ୍ଣିମା", transliteration: "Magha Purnima", description: "Holy bath at confluence" },
        ],
        color: "from-sky-900/50 to-blue-900/50",
    },
    {
        name: "ଫାଲ୍ଗୁନ",
        transliteration: "Phalguna",
        gregorian: "Feb - Mar",
        festivals: [
            { name: "ମହାଶିବରାତ୍ରି", transliteration: "Maha Shivaratri", description: "Night of Lord Shiva" },
            { name: "ଦୋଳ ପୂର୍ଣ୍ଣିମା", transliteration: "Dola Purnima", description: "Holi festival" },
        ],
        color: "from-fuchsia-900/50 to-purple-900/50",
    },
    {
        name: "ଚୈତ୍ର",
        transliteration: "Chaitra",
        gregorian: "Mar - Apr",
        festivals: [
            { name: "ଦୋଳଯାତ୍ରା", transliteration: "Dola Yatra", description: "Swing festival of Lord Jagannath" },
            { name: "ରାମ ନବମୀ", transliteration: "Rama Navami", description: "Lord Rama's birthday" },
            { name: "ହନୁମାନ ଜୟନ୍ତୀ", transliteration: "Hanuman Jayanti", description: "Lord Hanuman's birthday" },
        ],
        color: "from-lime-900/50 to-green-900/50",
    },
];

// Nakshatra list (27 nakshatras)
const nakshatras = [
    "ଅଶ୍ୱିନୀ (Ashwini)", "ଭରଣୀ (Bharani)", "କୃତ୍ତିକା (Krittika)",
    "ରୋହିଣୀ (Rohini)", "ମୃଗଶିରା (Mrigashira)", "ଆଦ୍ରା (Ardra)",
    "ପୁନର୍ବସୁ (Punarvasu)", "ପୁଷ୍ୟା (Pushya)", "ଆଶ୍ଲେଷା (Ashlesha)",
    "ମଘା (Magha)", "ପୂର୍ବାଫାଲ୍ଗୁନୀ (Purva Phalguni)", "ଉତ୍ତରାଫାଲ୍ଗୁନୀ (Uttara Phalguni)",
    "ହସ୍ତା (Hasta)", "ଚିତ୍ରା (Chitra)", "ସ୍ୱାତୀ (Swati)",
    "ବିଶାଖା (Vishakha)", "ଅନୁରାଧା (Anuradha)", "ଜ୍ୟେଷ୍ଠା (Jyeshtha)",
    "ମୂଳା (Mula)", "ପୂର୍ବାଷାଢ଼ା (Purva Ashadha)", "ଉତ୍ତରାଷାଢ଼ା (Uttara Ashadha)",
    "ଶ୍ରବଣ (Shravana)", "ଧନିଷ୍ଠା (Dhanishtha)", "ଶତଭିଷା (Shatabhisha)",
    "ପୂର୍ବାଭାଦ୍ରପଦ (Purva Bhadrapada)", "ଉତ୍ତରାଭାଦ୍ରପଦ (Uttara Bhadrapada)", "ରେବତୀ (Revati)"
];

// Tithi list (15 tithis in each paksha)
const tithis = {
    shukla: ["ପ୍ରତିପଦା", "ଦ୍ୱିତୀୟା", "ତୃତୀୟା", "ଚତୁର୍ଥୀ", "ପଞ୍ଚମୀ", "ଷଷ୍ଠୀ", "ସପ୍ତମୀ", "ଅଷ୍ଟମୀ", "ନବମୀ", "ଦଶମୀ", "ଏକାଦଶୀ", "ଦ୍ୱାଦଶୀ", "ତ୍ରୟୋଦଶୀ", "ଚତୁର୍ଦ୍ଦଶୀ", "ପୂର୍ଣ୍ଣିମା"],
    krishna: ["ପ୍ରତିପଦା", "ଦ୍ୱିତୀୟା", "ତୃତୀୟା", "ଚତୁର୍ଥୀ", "ପଞ୍ଚମୀ", "ଷଷ୍ଠୀ", "ସପ୍ତମୀ", "ଅଷ୍ଟମୀ", "ନବମୀ", "ଦଶମୀ", "ଏକାଦଶୀ", "ଦ୍ୱାଦଶୀ", "ତ୍ରୟୋଦଶୀ", "ଚତୁର୍ଦ୍ଦଶୀ", "ଅମାବାସ୍ୟା"],
};

// Calculate approximate Odia/Saka year
function getOdiaYear(): { saka: number; odia: string; month: string } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11

    // Odia New Year starts in April (Baisakha), so before April use previous year
    const sakaYear = month >= 3 ? year - 78 : year - 79;

    // Odia months mapping (approximate based on Gregorian month)
    const monthNames = [
        "ପୌଷ", "ମାଘ", "ଫାଲ୍ଗୁନ", "ଚୈତ୍ର", // Jan-Apr
        "ବୈଶାଖ", "ଜ୍ୟେଷ୍ଠ", "ଆଷାଢ଼", "ଶ୍ରାବଣ", // May-Aug  
        "ଭାଦ୍ରବ", "ଆଶ୍ୱିନ", "କାର୍ତ୍ତିକ", "ମାର୍ଗଶିର" // Sep-Dec
    ];

    return {
        saka: sakaYear,
        odia: `ଶକାବ୍ଦ ${sakaYear}`,
        month: monthNames[month],
    };
}

// Get approximate tithi and nakshatra (simplified calculation)
function getPanchanga() {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

    // Approximate lunar day (tithi changes roughly every 12 hours)
    const lunarDay = (dayOfYear * 2) % 30;
    const paksha = lunarDay < 15 ? "shukla" : "krishna";
    const tithiIndex = lunarDay % 15;
    const tithi = tithis[paksha][tithiIndex];

    // Approximate nakshatra (changes roughly every day)
    const nakshatraIndex = dayOfYear % 27;
    const nakshatra = nakshatras[nakshatraIndex];

    return {
        tithi,
        tithiEnglish: paksha === "shukla" ? "Shukla Paksha" : "Krishna Paksha",
        nakshatra,
        paksha,
    };
}

export default function CalendarPage() {
    const odiaYear = getOdiaYear();
    const panchanga = getPanchanga();
    const today = new Date();

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">🗓️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Odia Calendar
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଆ ପଞ୍ଜିକା
                    </p>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        Traditional Odia calendar with festivals, tithi, nakshatra, and panchanga —
                        reference for Jagannath Panjika and Biraja Panjika.
                    </p>
                </div>
            </section>

            {/* Panchanga Widget */}
            <section className="py-8 border-y border-amber-900/30 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        {/* Odia Year */}
                        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
                            <p className="text-amber-500/60 text-xs uppercase mb-1">ଓଡ଼ିଆ ବର୍ଷ</p>
                            <p className="text-2xl font-bold text-amber-100 odia-text">{odiaYear.odia}</p>
                            <p className="text-amber-400 text-sm">Saka {odiaYear.saka}</p>
                        </div>

                        {/* Odia Month */}
                        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
                            <p className="text-amber-500/60 text-xs uppercase mb-1">ଓଡ଼ିଆ ମାସ</p>
                            <p className="text-2xl font-bold text-amber-100 odia-text">{odiaYear.month}</p>
                            <p className="text-amber-400 text-sm">{today.toLocaleDateString('en-US', { month: 'long' })}</p>
                        </div>

                        {/* Tithi */}
                        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
                            <p className="text-amber-500/60 text-xs uppercase mb-1">ତିଥି</p>
                            <p className="text-xl font-bold text-amber-100 odia-text">{panchanga.tithi}</p>
                            <p className="text-amber-400 text-sm">{panchanga.tithiEnglish}</p>
                        </div>

                        {/* Nakshatra */}
                        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30 col-span-2 md:col-span-1">
                            <p className="text-amber-500/60 text-xs uppercase mb-1">ନକ୍ଷତ୍ର</p>
                            <p className="text-lg font-bold text-amber-100 odia-text leading-tight">{panchanga.nakshatra.split(' ')[0]}</p>
                            <p className="text-amber-400 text-xs">{panchanga.nakshatra.split(' ')[1]}</p>
                        </div>

                        {/* Paksha */}
                        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30 col-span-2 md:col-span-1">
                            <p className="text-amber-500/60 text-xs uppercase mb-1">ପକ୍ଷ</p>
                            <p className="text-xl font-bold text-amber-100">
                                {panchanga.paksha === "shukla" ? "🌙 ଶୁକ୍ଳ" : "🌑 କୃଷ୍ଣ"}
                            </p>
                            <p className="text-amber-400 text-sm">{panchanga.paksha === "shukla" ? "Waxing" : "Waning"}</p>
                        </div>
                    </div>

                    <p className="text-center text-amber-500/40 text-xs mt-4">
                        * Approximate values. For exact panchanga, refer to Jagannath or Biraja Panjika.
                    </p>
                </div>
            </section>

            {/* Panjika Reference */}
            <section className="py-8 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-700/30">
                            <h3 className="text-xl font-bold text-amber-100 mb-2">🛕 Jagannath Panjika</h3>
                            <p className="text-amber-100/70 text-sm mb-4">
                                The official panjika of Shree Jagannath Temple, Puri. Followed across coastal Odisha and for temple rituals.
                            </p>
                            <p className="text-amber-500/60 text-xs">Published by: Shree Jagannath Temple Administration</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 rounded-xl p-6 border border-purple-700/30">
                            <h3 className="text-xl font-bold text-amber-100 mb-2">🔱 Biraja Panjika</h3>
                            <p className="text-amber-100/70 text-sm mb-4">
                                Traditional panjika from Jajpur (Biraja Kshetra). Popular in central and western Odisha regions.
                            </p>
                            <p className="text-amber-500/60 text-xs">Published by: Biraja Temple, Jajpur</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12 Months */}
            <section className="py-16 bg-black">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-amber-100 mb-4 text-center font-display">
                        ବାରମାସ — Twelve Months
                    </h2>
                    <p className="text-amber-100/60 text-center mb-12">
                        The Odia calendar follows the lunisolar system with 12 months
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {odiaMonths.map((month, index) => (
                            <div
                                key={month.transliteration}
                                className={`bg-gradient-to-br ${month.color} rounded-xl p-6 border border-amber-800/30`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-amber-400 text-sm font-mono">#{index + 1}</span>
                                        <h3 className="text-2xl font-bold text-amber-100 odia-text">{month.name}</h3>
                                        <p className="text-amber-300">{month.transliteration}</p>
                                    </div>
                                    <span className="text-amber-500/60 text-sm">{month.gregorian}</span>
                                </div>

                                <div className="space-y-2">
                                    {month.festivals.map((festival) => (
                                        <div key={festival.transliteration} className="bg-black/30 rounded-lg p-3">
                                            <p className="text-amber-100 font-medium odia-text text-sm">{festival.name}</p>
                                            <p className="text-amber-400 text-xs">{festival.transliteration}</p>
                                            <p className="text-amber-100/50 text-xs mt-1">{festival.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nakshatra Reference */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 text-center font-display">
                        ୨୭ ନକ୍ଷତ୍ର — 27 Nakshatras
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                        {nakshatras.map((nak, i) => (
                            <div key={i} className="bg-amber-900/10 rounded-lg p-2 text-center border border-amber-800/20">
                                <span className="text-amber-400 text-xs font-mono">{i + 1}</span>
                                <p className="text-amber-100 text-xs odia-text leading-tight">{nak.split(' ')[0]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learn More */}
            <section className="py-12 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xl font-bold text-amber-100 mb-6">Explore Related</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/culture/durga-puja"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🎭 Durga Puja
                        </Link>
                        <Link
                            href="/culture/rath-yatra"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🛕 Rath Yatra
                        </Link>
                        <Link
                            href="/culture/nuakhai"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🌾 Nuakhai
                        </Link>
                        <Link
                            href="/history/timeline"
                            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-black font-medium transition-colors"
                        >
                            📜 View Timeline
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
