import { Metadata } from "next";
import Link from "next/link";
import { getPanchanga, odiaMonths, nakshatras, varas } from "@/lib/panchanga";

export const metadata: Metadata = {
    title: "Odia Calendar - Panjika with Tithi, Nakshatra & Festivals",
    description: "Odia Panjika showing 12 months, festivals, tithi, nakshatra, yoga, karana, and Odia year. Reference for Jagannath and Biraja Panjika.",
};

// Festival data for each month
const monthFestivals = [
    // Baisakha
    [
        { name: "ପଣା ସଂକ୍ରାନ୍ତି", transliteration: "Pana Sankranti", description: "Odia New Year" },
        { name: "ଅକ୍ଷୟ ତୃତୀୟା", transliteration: "Akshaya Tritiya", description: "Chandan Yatra begins" },
    ],
    // Jyestha
    [
        { name: "ସାବିତ୍ରୀ ଅମାବାସ୍ୟା", transliteration: "Savitri Amavasya", description: "Married women's fast" },
        { name: "ସୀତଳ ଷଷ୍ଠୀ", transliteration: "Sitala Sasthi", description: "Lord Shiva-Maa Parvati marriage" },
    ],
    // Asadha
    [
        { name: "ରଥଯାତ୍ରା", transliteration: "Rath Yatra", description: "Lord Jagannath's chariot festival" },
        { name: "ବାହୁଡ଼ା ଯାତ୍ରା", transliteration: "Bahuda Yatra", description: "Return journey" },
        { name: "ସୁନାବେଶ", transliteration: "Suna Besha", description: "Golden attire of deities" },
    ],
    // Shravana
    [
        { name: "ଗମ୍ଭା ପୂର୍ଣ୍ଣିମା", transliteration: "Gamha Purnima", description: "Rakhi Purnima" },
        { name: "ଜନ୍ମାଷ୍ଟମୀ", transliteration: "Janmashtami", description: "Lord Krishna's birthday" },
    ],
    // Bhadrava
    [
        { name: "ଗଣେଶ ଚତୁର୍ଥୀ", transliteration: "Ganesh Chaturthi", description: "Lord Ganesha's birthday" },
        { name: "ନୁଆଖାଇ", transliteration: "Nuakhai", description: "Harvest festival of Western Odisha" },
    ],
    // Ashwina
    [
        { name: "ଦୁର୍ଗା ପୂଜା", transliteration: "Durga Puja", description: "Worship of Goddess Durga" },
        { name: "କୁମାର ପୂର୍ଣ୍ଣିମା", transliteration: "Kumar Purnima", description: "Festival for unmarried girls" },
    ],
    // Kartika
    [
        { name: "ଦୀପାବଳୀ", transliteration: "Deepavali", description: "Festival of lights" },
        { name: "ବୋଇତା ବନ୍ଦାଣ", transliteration: "Boita Bandana", description: "Maritime heritage celebration" },
        { name: "କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା", transliteration: "Kartik Purnima", description: "Bali Yatra begins" },
    ],
    // Margashira
    [
        { name: "ମାଣବସା ଗୁରୁବାର", transliteration: "Manabasa Gurubara", description: "Lakshmi Puja on Thursdays" },
        { name: "ପ୍ରଥମଷ୍ଟମୀ", transliteration: "Prathamastami", description: "For firstborn children" },
    ],
    // Pausha
    [
        { name: "ଧନୁ ସଂକ୍ରାନ୍ତି", transliteration: "Dhanu Sankranti", description: "Beginning of Dhanu month" },
        { name: "ପୌଷ ପୂର୍ଣ୍ଣିମା", transliteration: "Pausha Purnima", description: "Holy full moon" },
    ],
    // Magha
    [
        { name: "ମକର ସଂକ୍ରାନ୍ତି", transliteration: "Makar Sankranti", description: "Sun enters Capricorn" },
        { name: "ବସନ୍ତ ପଞ୍ଚମୀ", transliteration: "Basanta Panchami", description: "Saraswati Puja" },
        { name: "ମାଘ ପୂର୍ଣ୍ଣିମା", transliteration: "Magha Purnima", description: "Holy bath at confluence" },
    ],
    // Phalguna
    [
        { name: "ମହାଶିବରାତ୍ରି", transliteration: "Maha Shivaratri", description: "Night of Lord Shiva" },
        { name: "ଦୋଳ ପୂର୍ଣ୍ଣିମା", transliteration: "Dola Purnima", description: "Holi festival" },
    ],
    // Chaitra
    [
        { name: "ଦୋଳଯାତ୍ରା", transliteration: "Dola Yatra", description: "Swing festival of Lord Jagannath" },
        { name: "ରାମ ନବମୀ", transliteration: "Rama Navami", description: "Lord Rama's birthday" },
        { name: "ହନୁମାନ ଜୟନ୍ତୀ", transliteration: "Hanuman Jayanti", description: "Lord Hanuman's birthday" },
    ],
];

const monthColors = [
    "from-green-900/50 to-emerald-900/50",
    "from-yellow-900/50 to-amber-900/50",
    "from-blue-900/50 to-indigo-900/50",
    "from-cyan-900/50 to-teal-900/50",
    "from-orange-900/50 to-red-900/50",
    "from-rose-900/50 to-pink-900/50",
    "from-amber-900/50 to-yellow-900/50",
    "from-purple-900/50 to-violet-900/50",
    "from-slate-800/50 to-gray-900/50",
    "from-sky-900/50 to-blue-900/50",
    "from-fuchsia-900/50 to-purple-900/50",
    "from-lime-900/50 to-green-900/50",
];

export default function CalendarPage() {
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
                        Complete Panchanga with tithi, nakshatra, yoga, karana —
                        accurate calculations based on Vedic astronomy.
                    </p>
                </div>
            </section>

            {/* Today's Panchanga - Detailed */}
            <section className="py-8 border-y border-amber-900/30 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 text-center font-display">
                        ଆଜିର ପଞ୍ଚାଙ୍ଗ — Today&apos;s Panchanga
                    </h2>

                    <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/30 rounded-2xl p-6 border border-amber-800/30 mb-6">
                        <div className="text-center mb-6">
                            <p className="text-amber-500/60 text-sm">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-3xl font-bold text-amber-100 odia-text mt-2">{panchanga.vara}</p>
                            <p className="text-amber-400">{panchanga.varaEnglish}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Odia Year */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ଓଡ଼ିଆ ବର୍ଷ</p>
                                <p className="text-2xl font-bold text-amber-100 odia-text">ଶକାବ୍ଦ {panchanga.sakaYear}</p>
                                <p className="text-amber-400 text-sm">Saka {panchanga.sakaYear}</p>
                            </div>

                            {/* Odia Month */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ଓଡ଼ିଆ ମାସ</p>
                                <p className="text-2xl font-bold text-amber-100 odia-text">{panchanga.odiaMonth}</p>
                                <p className="text-amber-400 text-sm">{odiaMonths[panchanga.odiaMonthIndex].english}</p>
                            </div>

                            {/* Tithi */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ତିଥି</p>
                                <p className="text-xl font-bold text-amber-100 odia-text">{panchanga.tithi}</p>
                                <p className="text-amber-400 text-sm">{panchanga.tithiEnglish}</p>
                            </div>

                            {/* Paksha */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ପକ୍ଷ</p>
                                <p className="text-xl font-bold text-amber-100">
                                    {panchanga.paksha === 'shukla' ? '🌙 ଶୁକ୍ଳ' : '🌑 କୃଷ୍ଣ'}
                                </p>
                                <p className="text-amber-400 text-sm">{panchanga.paksha === 'shukla' ? 'Waxing Moon' : 'Waning Moon'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {/* Nakshatra */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ନକ୍ଷତ୍ର</p>
                                <p className="text-lg font-bold text-amber-100 odia-text">{panchanga.nakshatra}</p>
                                <p className="text-amber-400 text-xs">{panchanga.nakshatraEnglish}</p>
                            </div>

                            {/* Yoga */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ଯୋଗ</p>
                                <p className="text-lg font-bold text-amber-100 odia-text">{panchanga.yoga}</p>
                                <p className="text-amber-400 text-xs">Yoga</p>
                            </div>

                            {/* Karana */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">କରଣ</p>
                                <p className="text-lg font-bold text-amber-100 odia-text">{panchanga.karana}</p>
                                <p className="text-amber-400 text-xs">Karana</p>
                            </div>

                            {/* Sun Times */}
                            <div className="bg-black/40 rounded-xl p-4 text-center">
                                <p className="text-amber-500/60 text-xs uppercase mb-1">ସୂର୍ଯ୍ୟୋଦୟ / ଅସ୍ତ</p>
                                <p className="text-lg font-bold text-amber-100">🌅 {panchanga.sunrise}</p>
                                <p className="text-amber-400 text-xs">🌇 {panchanga.sunset}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Panjika References */}
            <section className="py-8 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-amber-100 mb-6 text-center font-display">
                        📖 Browse Traditional Panjikas
                    </h2>
                    <p className="text-amber-100/60 text-center mb-6 text-sm">
                        Click to open like a traditional printed book
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href="/panjika/jagannath"
                            className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-700/30 hover:border-orange-500 hover:scale-105 transition-all group"
                        >
                            <div className="text-center">
                                <span className="text-5xl mb-4 block">🛕</span>
                                <h3 className="text-2xl font-bold text-amber-100 mb-2 odia-text group-hover:text-amber-300 transition-colors">ଜଗନ୍ନାଥ ପଞ୍ଜିକା</h3>
                                <p className="text-amber-400">Jagannath Panjika</p>
                                <p className="text-amber-100/50 text-sm mt-3">
                                    Coastal Odisha • Temple Rituals
                                </p>
                                <p className="text-amber-500 text-sm mt-4 group-hover:underline">📖 Open Book →</p>
                            </div>
                        </Link>

                        <Link
                            href="/panjika/biraja"
                            className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 rounded-xl p-6 border border-purple-700/30 hover:border-purple-500 hover:scale-105 transition-all group"
                        >
                            <div className="text-center">
                                <span className="text-5xl mb-4 block">🔱</span>
                                <h3 className="text-2xl font-bold text-amber-100 mb-2 odia-text group-hover:text-amber-300 transition-colors">ବିରଜା ପଞ୍ଜିକା</h3>
                                <p className="text-amber-400">Biraja Panjika</p>
                                <p className="text-amber-100/50 text-sm mt-3">
                                    Western Odisha • Agricultural
                                </p>
                                <p className="text-amber-500 text-sm mt-4 group-hover:underline">📖 Open Book →</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 12 Months with Festivals */}
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
                                key={month.english}
                                className={`bg-gradient-to-br ${monthColors[index]} rounded-xl p-6 border border-amber-800/30 ${index === panchanga.odiaMonthIndex ? 'ring-2 ring-amber-500' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-amber-400 text-sm font-mono">#{index + 1}</span>
                                        {index === panchanga.odiaMonthIndex && (
                                            <span className="ml-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full">Current</span>
                                        )}
                                        <h3 className="text-2xl font-bold text-amber-100 odia-text">{month.odia}</h3>
                                        <p className="text-amber-300">{month.english}</p>
                                    </div>
                                    <span className="text-amber-500/60 text-sm">{month.gregorian}</span>
                                </div>

                                <div className="space-y-2">
                                    {monthFestivals[index].map((festival) => (
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
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 text-center font-display">
                        ୨୭ ନକ୍ଷତ୍ର — 27 Nakshatras
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                        {nakshatras.map((nak, i) => (
                            <div
                                key={i}
                                className={`rounded-lg p-2 text-center border ${i === panchanga.nakshatraIndex
                                    ? 'bg-amber-600/30 border-amber-500'
                                    : 'bg-amber-900/10 border-amber-800/20'
                                    }`}
                            >
                                <span className="text-amber-400 text-xs font-mono">{i + 1}</span>
                                <p className="text-amber-100 text-xs odia-text leading-tight">{nak.odia}</p>
                                <p className="text-amber-500/60 text-[10px]">{nak.english}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vara (Weekdays) Reference */}
            <section className="py-12 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-amber-100 mb-6 text-center font-display">
                        ଏ ସପ୍ତାହ — Days of the Week
                    </h2>
                    <div className="grid grid-cols-7 gap-2">
                        {varas.map((vara, i) => (
                            <div
                                key={i}
                                className={`rounded-lg p-3 text-center ${i === new Date().getDay()
                                    ? 'bg-amber-600/30 border border-amber-500'
                                    : 'bg-amber-900/10'
                                    }`}
                            >
                                <p className="text-amber-100 text-sm odia-text">{vara.odia}</p>
                                <p className="text-amber-500/60 text-xs">{vara.english.slice(0, 3)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore Related */}
            <section className="py-12 bg-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xl font-bold text-amber-100 mb-6">Explore Related</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/culture/rath-yatra"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🛕 Rath Yatra
                        </Link>
                        <Link
                            href="/culture/durga-puja"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🎭 Durga Puja
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
