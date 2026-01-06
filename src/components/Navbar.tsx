"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SearchModal from "./SearchModal";

// Article data for search (pre-built at module load)
const searchArticles = [
    { title: "Odia Alphabet & Script", description: "Learn about the Odia script, its unique rounded letters designed for palm leaf writing", category: "language", slug: "odia-alphabet" },
    { title: "Common Odia Greetings", description: "Essential Odia greetings and phrases for everyday conversations", category: "language", slug: "common-greetings" },
    { title: "Raja Parba Festival", description: "A unique three-day festival celebrating womanhood and the earth", category: "culture", slug: "raja-parba" },
    { title: "Rath Yatra - The Chariot Festival", description: "The world-famous chariot festival where millions gather", category: "culture", slug: "rath-yatra" },
    { title: "Odissi Dance", description: "One of India's eight classical dance forms originating from temples", category: "culture", slug: "odissi-dance" },
    { title: "Durga Puja in Odisha", description: "How Durga Puja is celebrated with unique Odia traditions", category: "culture", slug: "durga-puja" },
    { title: "Kumar Purnima", description: "The festival of unmarried girls worshipping the moon", category: "culture", slug: "kumar-purnima" },
    { title: "Manabasa Gurubara", description: "Month-long tradition of worshipping Goddess Lakshmi", category: "culture", slug: "manabasa-gurubara" },
    { title: "Nuakhai Harvest Festival", description: "The most important festival of Western Odisha", category: "culture", slug: "nuakhai" },
    { title: "Pattachitra Art", description: "Traditional cloth scroll painting from Raghurajpur", category: "culture", slug: "pattachitra" },
    { title: "History of Odisha", description: "From ancient Kalinga to modern Odisha", category: "history", slug: "odisha-history-brief" },
    { title: "Konark Sun Temple", description: "UNESCO World Heritage Site designed as a giant chariot", category: "history", slug: "konark-sun-temple" },
    { title: "Jagannath Temple History", description: "The sacred abode and one of the four Char Dhams", category: "history", slug: "jagannath-temple" },
    { title: "Lingaraj Temple", description: "The magnificent 11th-century temple in Bhubaneswar", category: "history", slug: "lingaraj-temple" },
    { title: "Chilika Lake", description: "Asia's largest brackish water lagoon", category: "history", slug: "chilika-lake" },
    { title: "Famous Foods of Odisha", description: "From sacred Mahaprasad to legendary Rasagola", category: "food", slug: "famous-foods" },
    { title: "Chhena Poda", description: "The caramelized cheese cake dessert of Odisha", category: "food", slug: "chhena-poda" },
    { title: "Pakhala Bhata", description: "The fermented rice summer staple", category: "food", slug: "pakhala-bhata" },
    { title: "Rasagola", description: "The iconic sweet with GI tag belonging to Odisha", category: "food", slug: "rasagola" },
    { title: "Fakir Mohan Senapati", description: "Father of modern Odia literature", category: "people", slug: "fakir-mohan-senapati" },
    { title: "Biju Patnaik", description: "The legendary pilot and leader who shaped modern Odisha", category: "people", slug: "biju-patnaik" },
    { title: "Kelucharan Mohapatra", description: "The maestro who revived Odissi dance", category: "people", slug: "kelucharan-mohapatra" },
    { title: "What is Odiapedia", description: "Learn about our mission to preserve Odia heritage", category: "about", slug: "what-is-odiapedia" },
];

const navLinks = [
    { href: "/learn", label: "Learn", odia: "ଶିଖନ୍ତୁ" },
    { href: "/language", label: "Language", odia: "ଭାଷା" },
    { href: "/culture", label: "Culture", odia: "ସଂସ୍କୃତି" },
    { href: "/history", label: "History", odia: "ଇତିହାସ" },
    { href: "/history/timeline", label: "Timeline", odia: "ସମୟରେଖା" },
    { href: "/calendar", label: "Calendar", odia: "ପଞ୍ଜିକା" },
    { href: "/food", label: "Food", odia: "ଖାଦ୍ୟ" },
    { href: "/people", label: "People", odia: "ଲୋକ" },
    { href: "/about", label: "About", odia: "ବିଷୟରେ" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-md border-b border-amber-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-600/50 group-hover:border-amber-500 transition-colors">
                                <Image
                                    src="/logo.png"
                                    alt="Odiapedia Logo"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-display">
                                    Odiapedia
                                </span>
                                <span className="text-sm text-amber-600/80 odia-text -mt-1">
                                    ଓଡ଼ିଆପିଡ଼ିଆ
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-amber-100/80 hover:text-amber-300 transition-all duration-300 font-medium animated-underline"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="ml-2 p-2 rounded-lg hover:bg-amber-900/30 transition-colors border border-amber-800/30 group"
                                aria-label="Search"
                            >
                                <svg
                                    className="w-5 h-5 text-amber-400 group-hover:text-amber-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile: Search + Menu Buttons */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 rounded-lg hover:bg-amber-900/30 transition-colors border border-amber-800/30"
                                aria-label="Search"
                            >
                                <svg
                                    className="w-5 h-5 text-amber-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg hover:bg-amber-900/30 transition-colors border border-amber-800/30"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="w-6 h-6 text-amber-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-amber-900/30">
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-3 rounded-lg text-amber-100/80 hover:text-amber-300 hover:bg-amber-900/20 transition-all duration-200 font-medium flex justify-between items-center"
                                    >
                                        <span>{link.label}</span>
                                        <span className="text-amber-600/60 text-sm odia-text">{link.odia}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                articles={searchArticles}
            />
        </>
    );
}
