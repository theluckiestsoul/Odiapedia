"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import SearchModal from "./SearchModal";
import LanguageToggle from "./LanguageToggle";
import Icon from "./Icon";
import { useLanguage } from "@/contexts/LanguageContext";
import type { IconName } from "@/lib/site";

interface MenuChild {
    href: string;
    label: string;
    odia: string;
    icon: IconName;
    hint: string;
}

interface MenuItem {
    href?: string;
    label: string;
    odia: string;
    children?: MenuChild[];
}

const menuItems: MenuItem[] = [
    {
        label: "Explore",
        odia: "ଅନୁସନ୍ଧାନ",
        children: [
            { href: "/language", label: "Language", odia: "ଭାଷା", icon: "language", hint: "Script, dialects, literature" },
            { href: "/learn", label: "Learn Odia", odia: "ଓଡ଼ିଆ ଶିଖନ୍ତୁ", icon: "pen", hint: "Interactive course & phrasebook" },
            { href: "/language/dictionary", label: "Dictionary", odia: "ଅଭିଧାନ", icon: "book", hint: "80,000+ Odia words" },
            { href: "/language/odia-typing", label: "Odia Typing", odia: "ଟାଇପିଂ", icon: "pen", hint: "Type Odia in English letters" },
            { href: "/history", label: "History", odia: "ଇତିହାସ", icon: "scroll", hint: "Kalinga to modern Odisha" },
            { href: "/history/timeline", label: "Timeline", odia: "ସମୟରେଖା", icon: "hourglass", hint: "Key events, era by era" },
            { href: "/culture", label: "Culture & Festivals", odia: "ସଂସ୍କୃତି", icon: "mask", hint: "Festivals, dance, crafts" },
            { href: "/food", label: "Food", odia: "ଖାଦ୍ୟ", icon: "bowl", hint: "Mahaprasad, pithas, sweets" },
            { href: "/food/recipes", label: "Recipes", odia: "ରୋଷେଇ", icon: "bowl", hint: "Step-by-step Odia recipes" },
            { href: "/people", label: "People", odia: "ବ୍ୟକ୍ତିତ୍ୱ", icon: "people", hint: "Poets, leaders, artists" },
            { href: "/cinema", label: "Odia Cinema", odia: "ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ର", icon: "star", hint: "Odia films since 1936" },
            { href: "/library", label: "Library", odia: "ଗ୍ରନ୍ଥାଗାର", icon: "book", hint: "Free Odia books & PDFs" },
        ],
    },
    {
        label: "Places",
        odia: "ସ୍ଥାନ",
        children: [
            { href: "/districts", label: "30 Districts", odia: "ଜିଲ୍ଲା", icon: "pin", hint: "Every district of Odisha" },
            { href: "/map", label: "Interactive Map", odia: "ମାନଚିତ୍ର", icon: "map", hint: "Explore Odisha visually" },
            { href: "/monuments", label: "Monuments", odia: "ସ୍ମାରକୀ", icon: "temple", hint: "ASI-protected heritage sites" },
            { href: "/pin", label: "PIN Codes", odia: "ପିନ୍ କୋଡ୍", icon: "mail", hint: "Villages by PIN code" },
            { href: "/schemes", label: "Govt Schemes", odia: "ଯୋଜନା", icon: "shield", hint: "Subhadra, CM-KISAN, GJAY" },
            { href: "/elections", label: "Elections", odia: "ନିର୍ବାଚନ", icon: "people", hint: "MLAs, MPs and results by seat" },
            { href: "/travel", label: "Travel Guides", odia: "ଭ୍ରମଣ", icon: "compass", hint: "Destinations & itineraries" },
            { href: "/travel/plan", label: "Plan a Trip", odia: "ଯାତ୍ରା ଯୋଜନା", icon: "suitcase", hint: "Free custom itinerary" },
        ],
    },
    { href: "/learn", label: "Learn Odia", odia: "ଶିଖନ୍ତୁ" },
    { href: "/cinema", label: "Cinema", odia: "ସିନେମା" },
    { href: "/calendar", label: "Calendar", odia: "ପଞ୍ଜିକା" },
    { href: "/shop", label: "Shop", odia: "ଦୋକାନ" },
    { href: "/about", label: "About", odia: "ବିଷୟରେ" },
];

function DropdownMenu({ item, language, active }: { item: MenuItem; language: string; active: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setIsOpen(false);
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const base = `rounded-full px-3.5 py-2 text-[0.94rem] font-medium transition-colors ${active ? "text-laterite-700" : "text-ink-700 hover:text-laterite-700"}`;

    if (!item.children) {
        return (
            <Link href={item.href || "/"} className={base} aria-current={active ? "page" : undefined}>
                {language === "od" ? item.odia : item.label}
            </Link>
        );
    }

    return (
        <div className="relative" ref={ref} onMouseLeave={() => setIsOpen(false)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`${base} flex items-center gap-1`}
            >
                {language === "od" ? item.odia : item.label}
                <Icon name="chevron" className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
                    <div className={`grid gap-1 rounded-2xl border border-sand-200 bg-white p-2 shadow-2xl shadow-ink-900/10 ${item.children.length > 4 ? "w-[34rem] grid-cols-2" : "w-72"}`}>
                        {item.children.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-sand-100"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-laterite-50 text-laterite-600 transition-colors group-hover:bg-laterite-500 group-hover:text-white">
                                    <Icon name={child.icon} className="h-[1.1rem] w-[1.1rem]" />
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-sm font-semibold text-ink-900">{language === "od" ? child.odia : child.label}</span>
                                    <span className="text-xs text-ink-500">{child.hint}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language } = useLanguage();
    const pathname = usePathname() || "/";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isActive = (item: MenuItem) =>
        item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : !!item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

    return (
        <>
            <header className={`sticky top-0 z-50 border-b transition-all ${scrolled ? "border-sand-200 bg-white/90 shadow-sm backdrop-blur-md" : "border-transparent bg-background/80 backdrop-blur"}`}>
                <div className="container-page">
                    <div className="flex h-[4.5rem] items-center justify-between gap-4">
                        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Odiapedia home">
                            <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-sand-200">
                                <Image src="/logo.png" alt="" fill sizes="44px" className="object-cover" priority />
                            </span>
                            <span className="flex flex-col leading-none">
                                <span className="font-display text-[1.45rem] font-semibold tracking-tight text-ink-900">Odiapedia</span>
                                <span lang="or" className="mt-1 font-odia text-[0.8rem] text-laterite-600">ଓଡ଼ିଆପିଡ଼ିଆ</span>
                            </span>
                        </Link>

                        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
                            {menuItems.map((item) => (
                                <DropdownMenu key={item.label} item={item} language={language} active={isActive(item)} />
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden items-center gap-2 rounded-full border border-sand-300 bg-white px-3.5 py-2 text-sm text-ink-500 transition-colors hover:border-laterite-300 hover:text-ink-800 md:flex"
                                aria-label="Search Odiapedia"
                            >
                                <Icon name="search" className="h-4 w-4" />
                                <span>Search</span>
                                <kbd className="ml-2 rounded border border-sand-200 bg-sand-50 px-1.5 text-[10px] font-medium text-ink-400">⌘K</kbd>
                            </button>
                            <div className="hidden lg:block">
                                <LanguageToggle />
                            </div>
                            <Link href="/travel/plan" className="btn-primary hidden !px-4 !py-2 xl:inline-flex">
                                Plan a trip
                            </Link>
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                className="rounded-full border border-sand-300 bg-white p-2.5 text-ink-700 md:hidden"
                                aria-label="Search"
                            >
                                <Icon name="search" className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="rounded-full border border-sand-300 bg-white p-2.5 text-ink-700 lg:hidden"
                                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isMenuOpen}
                            >
                                <Icon name={isMenuOpen ? "close" : "menu"} className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-sand-200 bg-white lg:hidden">
                        <nav aria-label="Mobile" className="container-page space-y-6 py-6">
                            {menuItems.map((item) =>
                                item.children ? (
                                    <div key={item.label}>
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">{language === "od" ? item.odia : item.label}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.children.map((c) => (
                                                <Link key={c.href} href={c.href} className="flex items-center gap-2.5 rounded-xl border border-sand-200 p-3 text-sm font-medium text-ink-800 active:bg-sand-100">
                                                    <Icon name={c.icon} className="h-4 w-4 shrink-0 text-laterite-600" />
                                                    {language === "od" ? c.odia : c.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                            <div className="flex flex-wrap gap-2">
                                {menuItems.filter((i) => !i.children).map((i) => (
                                    <Link key={i.href} href={i.href!} className="chip !px-4 !py-2 !text-sm">
                                        {language === "od" ? i.odia : i.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="flex items-center justify-between border-t border-sand-200 pt-5">
                                <span className="text-sm text-ink-500">{language === "od" ? "ଭାଷା" : "Language"}</span>
                                <LanguageToggle />
                            </div>
                            <Link href="/travel/plan" className="btn-primary w-full">Plan a trip to Odisha</Link>
                        </nav>
                    </div>
                )}
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
