"use client";

import { useState } from "react";
import Link from "next/link";

interface PanjikaPageProps {
    panjikaType: "jagannath" | "biraja";
}

// Page content for Jagannath Panjika
const jagannathPages = [
    {
        title: "ଜଗନ୍ନାଥ ପଞ୍ଜିକା",
        subtitle: "Jagannath Panjika",
        year: "ଶକାବ୍ଦ ୧୯୪୭",
        content: [
            "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର, ପୁରୀ",
            "Shree Jagannath Temple, Puri",
            "",
            "ପ୍ରକାଶକ: ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ପ୍ରଶାସନ",
            "Publisher: Shree Jagannath Temple Administration",
        ],
        isTitle: true,
    },
    {
        title: "ବୈଶାଖ",
        subtitle: "Baisakha (Apr-May)",
        content: [
            "◆ ପଣା ସଂକ୍ରାନ୍ତି — ଓଡ଼ିଆ ନୂଆ ବର୍ଷ",
            "   Pana Sankranti — Odia New Year",
            "",
            "◆ ଅକ୍ଷୟ ତୃତୀୟା — ଚନ୍ଦନ ଯାତ୍ରା ଆରମ୍ଭ",
            "   Akshaya Tritiya — Chandan Yatra begins",
            "",
            "◆ ପରଶୁରାମ ଜୟନ୍ତୀ",
            "   Parashurama Jayanti",
        ],
    },
    {
        title: "ଜ୍ୟେଷ୍ଠ",
        subtitle: "Jyestha (May-Jun)",
        content: [
            "◆ ସାବିତ୍ରୀ ଅମାବାସ୍ୟା",
            "   Savitri Amavasya — Married women's fast",
            "",
            "◆ ସ୍ନାନ ଯାତ୍ରା — ପୂର୍ଣ୍ଣିମା",
            "   Snana Yatra — Deities' bathing festival",
            "",
            "◆ ଅନସର — ଭଗବାନ ଅସୁସ୍ଥ ରହନ୍ତି",
            "   Anasar — Deities in seclusion",
        ],
    },
    {
        title: "ଆଷାଢ଼",
        subtitle: "Asadha (Jun-Jul)",
        content: [
            "◆ ରଥ ଯାତ୍ରା — ଦ୍ୱିତୀୟା",
            "   Rath Yatra — The Chariot Festival",
            "",
            "◆ ଗୁଣ୍ଡିଚା ମନ୍ଦିର",
            "   Nine days at Gundicha Temple",
            "",
            "◆ ବାହୁଡ଼ା ଯାତ୍ରା — ଦଶମୀ",
            "   Bahuda Yatra — Return journey",
            "",
            "◆ ସୁନାବେଶ — ଏକାଦଶୀ",
            "   Suna Besha — Golden attire",
        ],
    },
    {
        title: "ଶ୍ରାବଣ",
        subtitle: "Shravana (Jul-Aug)",
        content: [
            "◆ ଗମ୍ଭା ପୂର୍ଣ୍ଣିମା — ରାକ୍ଷୀ ପୂର୍ଣ୍ଣିମା",
            "   Gamha Purnima — Rakhi Purnima",
            "",
            "◆ ଶ୍ରାବଣ ଏକାଦଶୀ — ଝୁଳଣ ଯାତ୍ରା",
            "   Jhulana Yatra begins",
            "",
            "◆ ଜନ୍ମାଷ୍ଟମୀ",
            "   Janmashtami — Krishna's birthday",
        ],
    },
    {
        title: "ଭାଦ୍ରବ",
        subtitle: "Bhadrava (Aug-Sep)",
        content: [
            "◆ ଗଣେଶ ଚତୁର୍ଥୀ",
            "   Ganesh Chaturthi",
            "",
            "◆ ନୁଆଖାଇ — ପଶ୍ଚିମ ଓଡ଼ିଶା",
            "   Nuakhai — Western Odisha harvest fest",
            "",
            "◆ ବିଶ୍ୱକର୍ମା ପୂଜା",
            "   Vishwakarma Puja",
        ],
    },
    {
        title: "ଆଶ୍ୱିନ",
        subtitle: "Ashwina (Sep-Oct)",
        content: [
            "◆ ମହାଳୟା — ପିତୃ ପକ୍ଷ ଶେଷ",
            "   Mahalaya — End of Pitru Paksha",
            "",
            "◆ ଦୁର୍ଗା ପୂଜା — ଷଷ୍ଠୀ ରୁ ଦଶମୀ",
            "   Durga Puja — Shashthi to Dashami",
            "",
            "◆ କୁମାର ପୂର୍ଣ୍ଣିମା",
            "   Kumar Purnima — For unmarried girls",
        ],
    },
    {
        title: "କାର୍ତ୍ତିକ",
        subtitle: "Kartika (Oct-Nov)",
        content: [
            "◆ ଦୀପାବଳୀ — କାଳୀ ପୂଜା",
            "   Deepavali — Festival of Lights",
            "",
            "◆ ବୋଇତା ବନ୍ଦାଣ — ପୂର୍ଣ୍ଣିମା",
            "   Boita Bandana — Maritime heritage day",
            "",
            "◆ ବାଲି ଯାତ୍ରା — କଟକ",
            "   Bali Yatra — Trade fair at Cuttack",
        ],
    },
    {
        title: "ମାର୍ଗଶିର",
        subtitle: "Margashira (Nov-Dec)",
        content: [
            "◆ ମାଣବସା ଗୁରୁବାର",
            "   Manabasa Gurubara — Lakshmi Puja",
            "   Every Thursday of Margashira",
            "",
            "◆ ପ୍ରଥମଷ୍ଟମୀ",
            "   Prathamastami — For firstborn",
        ],
    },
    {
        title: "ପୌଷ",
        subtitle: "Pausha (Dec-Jan)",
        content: [
            "◆ ଧନୁ ସଂକ୍ରାନ୍ତି",
            "   Dhanu Sankranti",
            "",
            "◆ ପୌଷ ସୋମବାର — ଶିବ ପୂଜା",
            "   Pausha Sombar — Shiva worship",
            "",
            "◆ ପୌଷ ପୂର୍ଣ୍ଣିମା",
            "   Pausha Purnima",
        ],
    },
    {
        title: "ମାଘ",
        subtitle: "Magha (Jan-Feb)",
        content: [
            "◆ ମକର ସଂକ୍ରାନ୍ତି",
            "   Makar Sankranti — Sun enters Capricorn",
            "",
            "◆ ବସନ୍ତ ପଞ୍ଚମୀ — ସରସ୍ୱତୀ ପୂଜା",
            "   Saraswati Puja — Goddess of learning",
            "",
            "◆ ମାଘ ପୂର୍ଣ୍ଣିମା — ପବିତ୍ର ସ୍ନାନ",
            "   Magha Purnima — Holy bath",
        ],
    },
    {
        title: "ଫାଲ୍ଗୁନ",
        subtitle: "Phalguna (Feb-Mar)",
        content: [
            "◆ ମହାଶିବରାତ୍ରି",
            "   Maha Shivaratri — Night of Lord Shiva",
            "",
            "◆ ଦୋଳ ପୂର୍ଣ୍ଣିମା — ହୋଲି",
            "   Dola Purnima — Holi festival",
        ],
    },
    {
        title: "ଚୈତ୍ର",
        subtitle: "Chaitra (Mar-Apr)",
        content: [
            "◆ ଦୋଳ ଯାତ୍ରା — ଝୁଲଣ",
            "   Dola Yatra — Swing festival",
            "",
            "◆ ରାମ ନବମୀ",
            "   Rama Navami — Lord Rama's birthday",
            "",
            "◆ ହନୁମାନ ଜୟନ୍ତୀ",
            "   Hanuman Jayanti",
            "",
            "◆ ମହାବିଷୁବ ସଂକ୍ରାନ୍ତି",
            "   End of year",
        ],
    },
];

// Page content for Biraja Panjika
const birajaPages = [
    {
        title: "ବିରଜା ପଞ୍ଜିକା",
        subtitle: "Biraja Panjika",
        year: "ଶକାବ୍ଦ ୧୯୪୭",
        content: [
            "ବିରଜା କ୍ଷେତ୍ର, ଯାଜପୁର",
            "Biraja Kshetra, Jajpur",
            "",
            "ପ୍ରକାଶକ: ବିରଜା ମନ୍ଦିର ଟ୍ରଷ୍ଟ",
            "Publisher: Biraja Temple Trust",
        ],
        isTitle: true,
    },
    {
        title: "ବୈଶାଖ",
        subtitle: "Baisakha (Apr-May)",
        content: [
            "◆ ପଣା ସଂକ୍ରାନ୍ତି — ମହାବିଷୁବ",
            "   Pana Sankranti — Odia New Year",
            "",
            "◆ ବୈଶାଖୀ — ପଞ୍ଜାବ ନୂଆ ବର୍ଷ",
            "   Baisakhi — Harvest celebration",
            "",
            "◆ ଅକ୍ଷୟ ତୃତୀୟା — ଶୁଭ ଦିନ",
            "   Akshaya Tritiya — Auspicious day",
        ],
    },
    {
        title: "ଜ୍ୟେଷ୍ଠ",
        subtitle: "Jyestha (May-Jun)",
        content: [
            "◆ ସୀତଳ ଷଷ୍ଠୀ",
            "   Sitala Sasthi — Shiva-Parvati marriage",
            "",
            "◆ ସାବିତ୍ରୀ ଅମାବାସ୍ୟା",
            "   Savitri Amavasya",
            "",
            "◆ ବଟ ଓଷା — ବିବାହିତ ମହିଳା",
            "   Bat Osha — For married women",
        ],
    },
    {
        title: "ଆଷାଢ଼",
        subtitle: "Asadha (Jun-Jul)",
        content: [
            "◆ ରଥ ଯାତ୍ରା",
            "   Rath Yatra",
            "",
            "◆ ଆଷାଢ଼ିଆ ଏକାଦଶୀ — ଶୟନ ଏକାଦଶୀ",
            "   Ashadhi Ekadashi — Vishnu sleeps",
            "",
            "◆ ଗୁରୁ ପୂର୍ଣ୍ଣିମା",
            "   Guru Purnima — Teacher's Day",
        ],
    },
    {
        title: "ଶ୍ରାବଣ",
        subtitle: "Shravana (Jul-Aug)",
        content: [
            "◆ ଶ୍ରାବଣ ସୋମବାର — ଶିବ ପୂଜା",
            "   Shravana Sombar — Shiva worship",
            "",
            "◆ ନାଗ ପଞ୍ଚମୀ",
            "   Nag Panchami — Snake worship",
            "",
            "◆ ରାକ୍ଷୀ ପୂର୍ଣ୍ଣିମା",
            "   Raksha Bandhan",
        ],
    },
    {
        title: "ଭାଦ୍ରବ",
        subtitle: "Bhadrava (Aug-Sep)",
        content: [
            "★ ନୁଆଖାଇ — ଭାଦ୍ରବ ଶୁକ୍ଳ ପଞ୍ଚମୀ",
            "   NUAKHAI — Fifth day harvest festival",
            "   Primary festival of Western Odisha",
            "",
            "◆ ଗଣେଶ ଚତୁର୍ଥୀ",
            "   Ganesh Chaturthi",
            "",
            "◆ ଅନନ୍ତ ଚତୁର୍ଦ୍ଦଶୀ",
            "   Anant Chaturdashi",
        ],
    },
    {
        title: "ଆଶ୍ୱିନ",
        subtitle: "Ashwina (Sep-Oct)",
        content: [
            "◆ ଶାରଦୀୟ ନବରାତ୍ରି",
            "   Sharadiya Navratri — 9 nights",
            "",
            "◆ ଦୁର୍ଗା ପୂଜା",
            "   Durga Puja",
            "",
            "◆ ଦଶହରା — ବିଜୟ ଦଶମୀ",
            "   Dussehra — Victory of good over evil",
        ],
    },
    {
        title: "କାର୍ତ୍ତିକ",
        subtitle: "Kartika (Oct-Nov)",
        content: [
            "◆ ଦୀପାବଳୀ",
            "   Deepavali — Row of lamps",
            "",
            "◆ ଗୋବର୍ଦ୍ଧନ ପୂଜା",
            "   Govardhan Puja",
            "",
            "◆ ଭାଇ ଦୂଜ — ଭାଇ ଫୋଣ୍ଟା",
            "   Bhai Dooj — Sister-brother bond",
        ],
    },
    {
        title: "ମାର୍ଗଶିର",
        subtitle: "Margashira (Nov-Dec)",
        content: [
            "◆ ମାଣବସା ଗୁରୁବାର",
            "   Manabasa Gurubara — Lakshmi Puja",
            "",
            "◆ ମୋକ୍ଷଦା ଏକାଦଶୀ — ଗୀତା ଜୟନ୍ତୀ",
            "   Gita Jayanti — Bhagavad Gita recital",
        ],
    },
    {
        title: "ପୌଷ",
        subtitle: "Pausha (Dec-Jan)",
        content: [
            "◆ ସାପ୍ତାହିକ ପୌଷ",
            "   Pausha fasts and rituals",
            "",
            "◆ ପୁଷ ପୁଣି — ପଶ୍ଚିମ ଓଡ଼ିଶା",
            "   Push Puni — Western Odisha",
            "",
            "◆ ଲୋହଡ଼ି",
            "   Lohri celebrations",
        ],
    },
    {
        title: "ମାଘ",
        subtitle: "Magha (Jan-Feb)",
        content: [
            "◆ ମକର ସଂକ୍ରାନ୍ତି — ମକର ମେଳା",
            "   Makar Sankranti — Makar Mela",
            "",
            "◆ ମାଘ ମେଳା — ଛକ ମେଳା",
            "   Local village fairs",
            "",
            "◆ ବସନ୍ତ ପଞ୍ଚମୀ",
            "   Saraswati Puja",
        ],
    },
    {
        title: "ଫାଲ୍ଗୁନ",
        subtitle: "Phalguna (Feb-Mar)",
        content: [
            "◆ ମହାଶିବରାତ୍ରି",
            "   Maha Shivaratri",
            "",
            "◆ ହୋଲି — ଦୋଳ ଉତ୍ସବ",
            "   Holi — Festival of colours",
            "",
            "◆ ରଙ୍ଗ ପଞ୍ଚମୀ",
            "   Rang Panchami — Fifth day of Holi",
        ],
    },
    {
        title: "ଚୈତ୍ର",
        subtitle: "Chaitra (Mar-Apr)",
        content: [
            "◆ ବିରଜା ମେଳା",
            "   Biraja Mela — Annual temple fair",
            "",
            "◆ ଚୈତ୍ର ନବରାତ୍ରି",
            "   Chaitra Navratri — 9 nights",
            "",
            "◆ ରାମ ନବମୀ",
            "   Rama Navami",
            "",
            "◆ ମହାବିଷୁବ ସଂକ୍ରାନ୍ତି",
            "   Year ends, new cycle begins",
        ],
    },
];

export default function PanjikaBook({ panjikaType }: PanjikaPageProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const pages = panjikaType === "jagannath" ? jagannathPages : birajaPages;
    const totalPages = pages.length;

    const nextPage = () => {
        if (currentPage < totalPages - 1 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const prevPage = () => {
        if (currentPage > 0 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const page = pages[currentPage];
    const bgColor = panjikaType === "jagannath"
        ? "from-orange-950 to-amber-950"
        : "from-purple-950 to-fuchsia-950";

    return (
        <div className="min-h-screen bg-black py-8">
            {/* Header */}
            <div className="max-w-3xl mx-auto px-4 mb-6">
                <Link
                    href="/calendar"
                    className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-2"
                >
                    ← Back to Calendar
                </Link>
            </div>

            {/* Book Container */}
            <div className="max-w-3xl mx-auto px-4">
                <div
                    className={`bg-gradient-to-br ${bgColor} rounded-lg shadow-2xl overflow-hidden border-4 border-amber-900/50`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h50v50H0zM50 50h50v50H50z' fill='rgba(139,69,19,0.05)'/%3E%3C/svg%3E")`,
                    }}
                >
                    {/* Book Spine Effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-900/80 to-transparent"></div>

                    {/* Page Content */}
                    <div
                        className={`relative min-h-[600px] p-8 transition-all duration-300 ${isFlipping ? 'opacity-0 transform scale-95' : 'opacity-100'
                            }`}
                    >
                        {/* Aged Paper Overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23d4a574' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
                            }}
                        ></div>

                        {/* Page Number */}
                        <div className="absolute top-4 right-8 text-amber-700/60 font-mono text-sm">
                            {currentPage + 1} / {totalPages}
                        </div>

                        {/* Content Area */}
                        <div className="relative z-10 text-center pt-8">
                            {/* Title */}
                            <h1 className={`text-4xl font-bold odia-text mb-3 ${page.isTitle ? 'text-amber-300' : 'text-amber-200'
                                }`}>
                                {page.title}
                            </h1>
                            <p className="text-amber-400/80 text-lg mb-2">{page.subtitle}</p>

                            {page.year && (
                                <p className="text-amber-500/60 text-2xl odia-text mb-8">{page.year}</p>
                            )}

                            {/* Decorative Divider */}
                            <div className="flex items-center justify-center gap-4 my-6">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600/50"></div>
                                <div className="text-amber-600">❈</div>
                                <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600/50"></div>
                            </div>

                            {/* Page Content */}
                            <div className="text-left max-w-md mx-auto space-y-1">
                                {page.content.map((line, i) => (
                                    <p
                                        key={i}
                                        className={`font-serif leading-relaxed ${line.startsWith('◆')
                                                ? 'text-amber-200 text-lg odia-text'
                                                : line.startsWith('★')
                                                    ? 'text-yellow-300 text-xl font-bold odia-text'
                                                    : line.startsWith('   ')
                                                        ? 'text-amber-400/70 text-sm pl-4'
                                                        : line === ''
                                                            ? 'h-4'
                                                            : 'text-amber-300/90 odia-text'
                                            }`}
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>

                            {/* Decorative Footer */}
                            {page.isTitle && (
                                <div className="mt-12">
                                    <div className="text-6xl opacity-30">
                                        {panjikaType === "jagannath" ? "🛕" : "🔱"}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Page Corner Fold Effect */}
                        <div
                            className="absolute bottom-0 right-0 w-12 h-12"
                            style={{
                                background: 'linear-gradient(135deg, transparent 50%, rgba(139,69,19,0.3) 50%)',
                            }}
                        ></div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 px-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === 0
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-amber-900/50 text-amber-100 hover:bg-amber-800/50'
                            }`}
                    >
                        ← Previous Page
                    </button>

                    {/* Page Dots */}
                    <div className="flex gap-1 overflow-x-auto max-w-[200px] py-2">
                        {pages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${i === currentPage
                                        ? 'bg-amber-400 w-4'
                                        : 'bg-amber-800 hover:bg-amber-600'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${currentPage === totalPages - 1
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-amber-900/50 text-amber-100 hover:bg-amber-800/50'
                            }`}
                    >
                        Next Page →
                    </button>
                </div>

                {/* Quick Jump */}
                <div className="text-center mt-8">
                    <p className="text-amber-500/60 text-sm mb-3">Jump to month:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {pages.slice(1).map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded-lg text-xs transition-all ${i + 1 === currentPage
                                        ? 'bg-amber-600 text-black'
                                        : 'bg-amber-900/30 text-amber-300 hover:bg-amber-800/50'
                                    }`}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
