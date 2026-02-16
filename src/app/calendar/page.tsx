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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">🗓️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Odia Calendar
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8">
                        ଓଡ଼ିଆ ପଞ୍ଜିକା
                    </p>
                    <p className="text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed text-shadow-sm">
                        Complete Panchanga with tithi, nakshatra, yoga, karana —
                        accurate calculations based on Vedic astronomy.
                    </p>
                </div>
            </section>

            {/* Today's Panchanga - Detailed */}
            <section className="py-12 border-y border-slate-200 bg-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center font-display flex items-center justify-center gap-3">
                        <span className="text-teal-600">ଆଜିର ପଞ୍ଚାଙ୍ଗ</span>
                        <span className="text-slate-400">|</span>
                        <span>Today&apos;s Panchanga</span>
                    </h2>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 mb-6">
                        <div className="text-center mb-6">
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-4xl font-bold text-slate-900 odia-text mt-2">{panchanga.vara}</p>
                            <p className="text-teal-600 font-medium">{panchanga.varaEnglish}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Odia Year */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ଓଡ଼ିଆ ବର୍ଷ</p>
                                <p className="text-2xl font-bold text-slate-800 odia-text">ଶକାବ୍ଦ {panchanga.sakaYear}</p>
                                <p className="text-teal-600 text-sm">Saka {panchanga.sakaYear}</p>
                            </div>

                            {/* Odia Month */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ଓଡ଼ିଆ ମାସ</p>
                                <p className="text-2xl font-bold text-slate-800 odia-text">{panchanga.odiaMonth}</p>
                                <p className="text-teal-600 text-sm">{odiaMonths[panchanga.odiaMonthIndex].english}</p>
                            </div>

                            {/* Tithi */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ତିଥି</p>
                                <p className="text-xl font-bold text-slate-800 odia-text">{panchanga.tithi}</p>
                                <p className="text-teal-600 text-sm">{panchanga.tithiEnglish}</p>
                            </div>

                            {/* Paksha */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ପକ୍ଷ</p>
                                <p className="text-xl font-bold text-slate-800">
                                    {panchanga.paksha === 'shukla' ? '🌙 ଶୁକ୍ଳ' : '🌑 କୃଷ୍ଣ'}
                                </p>
                                <p className="text-teal-600 text-sm">{panchanga.paksha === 'shukla' ? 'Waxing Moon' : 'Waning Moon'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {/* Nakshatra */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ନକ୍ଷତ୍ର</p>
                                <p className="text-lg font-bold text-slate-800 odia-text">{panchanga.nakshatra}</p>
                                <p className="text-teal-600 text-xs">{panchanga.nakshatraEnglish}</p>
                            </div>

                            {/* Yoga */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ଯୋଗ</p>
                                <p className="text-lg font-bold text-slate-800 odia-text">{panchanga.yoga}</p>
                                <p className="text-teal-600 text-xs">Yoga</p>
                            </div>

                            {/* Karana */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">କରଣ</p>
                                <p className="text-lg font-bold text-slate-800 odia-text">{panchanga.karana}</p>
                                <p className="text-teal-600 text-xs">Karana</p>
                            </div>

                            {/* Sun Times */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-slate-400 text-xs uppercase mb-1">ସୂର୍ଯ୍ୟୋଦୟ / ଅସ୍ତ</p>
                                <p className="text-lg font-bold text-slate-800">🌅 {panchanga.sunrise}</p>
                                <p className="text-teal-600 text-xs">🌇 {panchanga.sunset}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Panjika References */}
            <section className="py-8 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 text-center font-display">
                        📖 Browse Traditional Panjikas
                    </h2>
                    <p className="text-slate-500 text-center mb-6 text-sm">
                        Click to open like a traditional printed book
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href="/panjika/jagannath"
                            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-orange-500 hover:shadow-lg hover:scale-105 transition-all group"
                        >
                            <div className="text-center">
                                <span className="text-5xl mb-4 block">🛕</span>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2 odia-text group-hover:text-orange-600 transition-colors">ଜଗନ୍ନାଥ ପଞ୍ଜିକା</h3>
                                <p className="text-teal-600 font-medium">Jagannath Panjika</p>
                                <p className="text-slate-500 text-sm mt-3">
                                    Coastal Odisha • Temple Rituals
                                </p>
                                <p className="text-orange-500 text-sm mt-4 group-hover:underline">📖 Open Book →</p>
                            </div>
                        </Link>

                        <Link
                            href="/panjika/biraja"
                            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-500 hover:shadow-lg hover:scale-105 transition-all group"
                        >
                            <div className="text-center">
                                <span className="text-5xl mb-4 block">🔱</span>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2 odia-text group-hover:text-purple-600 transition-colors">ବିରଜା ପଞ୍ଜିକା</h3>
                                <p className="text-teal-600 font-medium">Biraja Panjika</p>
                                <p className="text-slate-500 text-sm mt-3">
                                    Western Odisha • Agricultural
                                </p>
                                <p className="text-purple-500 text-sm mt-4 group-hover:underline">📖 Open Book →</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 12 Months with Festivals */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center font-display">
                        ବାରମାସ — Twelve Months
                    </h2>
                    <p className="text-slate-500 text-center mb-12">
                        The Odia calendar follows the lunisolar system with 12 months
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {odiaMonths.map((month, index) => (
                            <div
                                key={month.english}
                                className={`bg-white rounded-xl p-6 border transition-all hover:shadow-lg ${index === panchanga.odiaMonthIndex ? 'ring-2 ring-teal-500 border-teal-500 shadow-md' : 'border-slate-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <span className="text-teal-500 text-sm font-mono font-bold">#{index + 1}</span>
                                        {index === panchanga.odiaMonthIndex && (
                                            <span className="ml-2 text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">Current</span>
                                        )}
                                        <h3 className="text-2xl font-bold text-slate-900 odia-text mt-1">{month.odia}</h3>
                                        <p className="text-slate-500 font-medium">{month.english}</p>
                                    </div>
                                    <span className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded">{month.gregorian}</span>
                                </div>

                                <div className="space-y-2">
                                    {monthFestivals[index].map((festival) => (
                                        <div key={festival.transliteration} className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                                            <p className="text-slate-800 font-medium odia-text text-sm">{festival.name}</p>
                                            <p className="text-teal-600 text-xs font-medium">{festival.transliteration}</p>
                                            <p className="text-slate-500 text-xs mt-1">{festival.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nakshatra Reference */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center font-display">
                        ୨୭ ନକ୍ଷତ୍ର — 27 Nakshatras
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                        {nakshatras.map((nak, i) => (
                            <div
                                key={i}
                                className={`rounded-lg p-3 text-center border transition-all hover:shadow-sm ${i === panchanga.nakshatraIndex
                                    ? 'bg-teal-50 border-teal-500 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-teal-300'
                                    }`}
                            >
                                <span className="text-slate-400 text-xs font-mono mb-1 block">{i + 1}</span>
                                <p className="text-slate-900 text-sm odia-text leading-tight font-medium">{nak.odia}</p>
                                <p className="text-teal-600 text-[10px] mt-1">{nak.english}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vara (Weekdays) Reference */}
            <section className="py-12 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 text-center font-display">
                        ଏ ସପ୍ତାହ — Days of the Week
                    </h2>
                    <div className="grid grid-cols-7 gap-3">
                        {varas.map((vara, i) => (
                            <div
                                key={i}
                                className={`rounded-lg p-3 text-center border transition-all ${i === new Date().getDay()
                                    ? 'bg-teal-50 border-teal-500 shadow-sm'
                                    : 'bg-white border-slate-200'
                                    }`}
                            >
                                <p className="text-slate-900 text-sm odia-text font-medium">{vara.odia}</p>
                                <p className="text-slate-500 text-xs mt-1">{vara.english.slice(0, 3)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore Related */}
            <section className="py-12 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Explore Related</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/culture/rath-yatra"
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:text-teal-700 font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                            🛕 Rath Yatra
                        </Link>
                        <Link
                            href="/culture/durga-puja"
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:text-teal-700 font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                            🎭 Durga Puja
                        </Link>
                        <Link
                            href="/culture/nuakhai"
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:text-teal-700 font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                            🌾 Nuakhai
                        </Link>
                        <Link
                            href="/history/timeline"
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-medium transition-colors shadow-lg shadow-teal-900/20"
                        >
                            📜 View Timeline
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
