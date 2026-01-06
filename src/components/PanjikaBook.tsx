"use client";

import { useState, useRef } from "react";
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
    const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
    const bookRef = useRef<HTMLDivElement>(null);

    const pages = panjikaType === "jagannath" ? jagannathPages : birajaPages;
    const totalPages = pages.length;

    const nextPage = () => {
        if (currentPage < totalPages - 1 && !isFlipping) {
            setFlipDirection('next');
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setIsFlipping(false);
            }, 600);
        }
    };

    const prevPage = () => {
        if (currentPage > 0 && !isFlipping) {
            setFlipDirection('prev');
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsFlipping(false);
            }, 600);
        }
    };

    const goToPage = (pageNum: number) => {
        if (!isFlipping && pageNum !== currentPage) {
            setFlipDirection(pageNum > currentPage ? 'next' : 'prev');
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(pageNum);
                setIsFlipping(false);
            }, 400);
        }
    };

    const page = pages[currentPage];
    const primaryColor = panjikaType === "jagannath" ? "orange" : "purple";

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-amber-950/20 to-neutral-900 py-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto px-4 mb-6">
                <Link
                    href="/calendar"
                    className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-2"
                >
                    ← Back to Calendar
                </Link>
            </div>

            {/* Book Container */}
            <div className="max-w-4xl mx-auto px-4 perspective-1000">
                <div
                    ref={bookRef}
                    className="relative mx-auto"
                    style={{
                        maxWidth: '700px',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Book Shadow */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/40 blur-xl rounded-full"></div>

                    {/* Book Binding (Left Side) */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-8 z-20"
                        style={{
                            background: `linear-gradient(to right, 
                ${panjikaType === 'jagannath' ? '#7c2d12' : '#581c87'} 0%, 
                ${panjikaType === 'jagannath' ? '#9a3412' : '#7e22ce'} 30%, 
                ${panjikaType === 'jagannath' ? '#78350f' : '#581c87'} 60%,
                transparent 100%)`,
                            borderRadius: '4px 0 0 4px',
                        }}
                    >
                        {/* Spine Lines */}
                        <div className="absolute inset-0 flex flex-col justify-evenly py-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-px w-full bg-amber-900/30"></div>
                            ))}
                        </div>
                    </div>

                    {/* Main Page */}
                    <div
                        className={`relative ml-6 rounded-r-lg overflow-hidden transition-all duration-500
              ${isFlipping ? (flipDirection === 'next'
                                ? 'animate-flip-next'
                                : 'animate-flip-prev') : ''}`}
                        style={{
                            minHeight: '650px',
                            transformOrigin: 'left center',
                            boxShadow: '4px 4px 20px rgba(0,0,0,0.4), -2px 0 5px rgba(0,0,0,0.1) inset',
                        }}
                    >
                        {/* Paper Texture - Old Oil Printed Look */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `
                  linear-gradient(135deg, 
                    #f5e6c8 0%, 
                    #ebd5a7 25%, 
                    #f0ddb3 50%, 
                    #e8d4a0 75%, 
                    #f2e0bb 100%)`,
                            }}
                        ></div>

                        {/* Aged Paper Stains and Texture */}
                        <div
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                                backgroundImage: `
                  radial-gradient(ellipse at 20% 30%, rgba(139,69,19,0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 70%, rgba(139,69,19,0.1) 0%, transparent 40%),
                  radial-gradient(ellipse at 50% 90%, rgba(139,69,19,0.12) 0%, transparent 35%),
                  radial-gradient(ellipse at 10% 80%, rgba(139,69,19,0.08) 0%, transparent 30%)
                `,
                            }}
                        ></div>

                        {/* Paper Grain Texture */}
                        <div
                            className="absolute inset-0 opacity-40 pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            }}
                        ></div>

                        {/* Page Edge Lines */}
                        <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-amber-900/20 via-amber-800/30 to-amber-900/20"></div>
                        <div className="absolute right-1 top-4 bottom-4 w-px bg-amber-900/10"></div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-12">
                            {/* Page Number */}
                            <div className="absolute top-4 right-6 font-serif text-amber-800/50 text-sm italic">
                                Page {currentPage + 1} of {totalPages}
                            </div>

                            {/* Decorative Top Border */}
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>
                                <span className="text-amber-800/60 text-xl">❧</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>
                            </div>

                            {/* Title */}
                            <h1
                                className={`text-center font-serif mb-2 ${page.isTitle ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'
                                    }`}
                                style={{
                                    color: '#4a3728',
                                    textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
                                    fontFamily: 'serif',
                                }}
                            >
                                <span className="odia-text">{page.title}</span>
                            </h1>

                            <p className="text-center text-amber-900/70 text-lg mb-2 font-serif italic">
                                {page.subtitle}
                            </p>

                            {page.year && (
                                <p className="text-center text-3xl odia-text mb-8" style={{ color: '#6b4423' }}>
                                    {page.year}
                                </p>
                            )}

                            {/* Decorative Divider */}
                            <div className="flex items-center justify-center gap-4 my-8">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-800/40"></div>
                                <span className="text-amber-800/50">✦</span>
                                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-800/40"></div>
                            </div>

                            {/* Page Content */}
                            <div className="max-w-lg mx-auto space-y-1 text-left">
                                {page.content.map((line, i) => (
                                    <p
                                        key={i}
                                        className="font-serif leading-relaxed"
                                        style={{
                                            color: line.startsWith('★')
                                                ? '#8b4513'
                                                : line.startsWith('◆')
                                                    ? '#5d4037'
                                                    : line.startsWith('   ')
                                                        ? '#7c6a59'
                                                        : '#4a3728',
                                            fontSize: line.startsWith('★')
                                                ? '1.25rem'
                                                : line.startsWith('◆')
                                                    ? '1.1rem'
                                                    : line.startsWith('   ')
                                                        ? '0.9rem'
                                                        : '1rem',
                                            fontWeight: line.startsWith('★') ? 600 : 400,
                                        }}
                                    >
                                        {line || '\u00A0'}
                                    </p>
                                ))}
                            </div>

                            {/* Title Page Decoration */}
                            {page.isTitle && (
                                <div className="mt-12 text-center">
                                    <div className="inline-block p-6 rounded-full opacity-20">
                                        <span className="text-8xl">
                                            {panjikaType === "jagannath" ? "🛕" : "🔱"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Decorative Bottom Border */}
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>
                                <span className="text-amber-800/60 text-xl">❧</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>
                            </div>
                        </div>

                        {/* Page Curl Effect (Bottom Right) */}
                        <div
                            className="absolute bottom-0 right-0 w-16 h-16 cursor-pointer"
                            onClick={nextPage}
                            style={{
                                background: 'linear-gradient(135deg, transparent 50%, #d4b896 50%, #c9a882 100%)',
                                boxShadow: '-2px -2px 5px rgba(0,0,0,0.1)',
                            }}
                        ></div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-8 px-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0 || isFlipping}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${currentPage === 0 || isFlipping
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-amber-900/50 text-amber-100 hover:bg-amber-800/50 hover:scale-105'
                            }`}
                    >
                        <span className="text-xl">📖</span>
                        Previous
                    </button>

                    {/* Page Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-amber-500/60 text-sm hidden md:inline">Flip pages:</span>
                        <div className="flex gap-1 overflow-x-auto max-w-[200px] py-2">
                            {pages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    disabled={isFlipping}
                                    className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${i === currentPage
                                            ? `${primaryColor === 'orange' ? 'bg-orange-400' : 'bg-purple-400'} w-5`
                                            : 'bg-amber-800/50 hover:bg-amber-600/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1 || isFlipping}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${currentPage === totalPages - 1 || isFlipping
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-amber-900/50 text-amber-100 hover:bg-amber-800/50 hover:scale-105'
                            }`}
                    >
                        Next
                        <span className="text-xl">📖</span>
                    </button>
                </div>

                {/* Quick Month Navigation */}
                <div className="text-center mt-8">
                    <p className="text-amber-500/60 text-sm mb-4">Jump to month:</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                        {pages.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i)}
                                disabled={isFlipping}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${i === currentPage
                                        ? `${primaryColor === 'orange' ? 'bg-orange-600' : 'bg-purple-600'} text-white`
                                        : 'bg-amber-900/20 text-amber-300 hover:bg-amber-800/40 border border-amber-800/30'
                                    }`}
                            >
                                <span className="odia-text">{p.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS for flip animation */}
            <style jsx global>{`
        .perspective-1000 {
          perspective: 2000px;
        }
        
        @keyframes flipNext {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-15deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        
        @keyframes flipPrev {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(15deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
        
        .animate-flip-next {
          animation: flipNext 0.6s ease-in-out;
        }
        
        .animate-flip-prev {
          animation: flipPrev 0.6s ease-in-out;
        }
      `}</style>
        </div>
    );
}
