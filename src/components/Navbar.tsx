"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
    { href: "/learn", label: "Learn", odia: "ଶିଖନ୍ତୁ" },
    { href: "/language", label: "Language", odia: "ଭାଷା" },
    { href: "/culture", label: "Culture", odia: "ସଂସ୍କୃତି" },
    { href: "/history", label: "History", odia: "ଇତିହାସ" },
    { href: "/food", label: "Food", odia: "ଖାଦ୍ୟ" },
    { href: "/people", label: "People", odia: "ଲୋକ" },
    { href: "/about", label: "About", odia: "ବିଷୟରେ" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
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
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-amber-900/30 transition-colors border border-amber-800/30"
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
    );
}
