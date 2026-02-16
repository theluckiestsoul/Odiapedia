"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Map language codes to URL suffixes
const LANG_SUFFIXES: Record<string, string> = {
    en: '-en',
    od: '-od',
    hi: '-hi',
};

export default function LanguageToggle() {
    const { language, toggleLanguage, setLanguage } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [alternates, setAlternates] = useState<Record<string, string>>({});
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'od', name: 'Odia', flag: '🇮🇳' }
    ];

    const currentLanguage = languages.find(l => l.code === language) || languages[0];

    // Check for alternate language links in the page head
    useEffect(() => {
        const checkAlternates = () => {
            const altLinks: Record<string, string> = {};

            // Look for alternate links in the document head
            const links = document.querySelectorAll('link[rel="alternate"][hreflang]');
            links.forEach((link) => {
                const hreflang = link.getAttribute('hreflang');
                const href = link.getAttribute('href');
                if (hreflang && href) {
                    // Map hreflang codes to our language codes
                    const langCode = hreflang === 'or' ? 'od' : hreflang;
                    altLinks[langCode] = href;
                }
            });

            // Also check URL patterns for language suffixes
            if (Object.keys(altLinks).length === 0) {
                // Check if current URL has a language suffix
                const currentPath = pathname;
                for (const [lang, suffix] of Object.entries(LANG_SUFFIXES)) {
                    if (currentPath.endsWith(suffix)) {
                        // This is a multi-language article
                        const basePath = currentPath.slice(0, -suffix.length);
                        // Add all possible alternates
                        for (const [altLang, altSuffix] of Object.entries(LANG_SUFFIXES)) {
                            altLinks[altLang] = basePath + altSuffix;
                        }
                        break;
                    }
                }
            }

            setAlternates(altLinks);
        };

        checkAlternates();

        // Re-check when pathname changes
    }, [pathname]);

    const handleLanguageSelect = (newLangCode: string) => {
        if (newLangCode === currentLanguage.code) {
            setIsOpen(false);
            return;
        }

        // Update the language in the context
        setLanguage(newLangCode as 'en' | 'od');

        const currentPath = pathname;
        // Basic logic: if switching to 'od', prefix with /od if not already there.
        // If switching to 'en', remove /od prefix.
        // This relies on middleware or next.js config to handle the actual routing/locale detection better,
        // but for a simple toggle:

        let newPath = currentPath;
        if (newLangCode === 'od' && !currentPath.startsWith('/od')) {
            newPath = `/od${currentPath}`;
        } else if (newLangCode === 'en' && currentPath.startsWith('/od')) {
            newPath = currentPath.replace(/^\/od/, '') || '/';
        }

        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-100 bg-white/50 hover:bg-white hover:border-teal-200 transition-all text-sm font-medium text-slate-700 hover:text-teal-700 shadow-sm hover:shadow-md ring-1 ring-transparent hover:ring-teal-50"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={`Current language: ${currentLanguage.name}`}
            >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-[10px] shadow-sm">
                    {currentLanguage.code.toUpperCase()}
                </span>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-teal-100 rounded-xl shadow-xl shadow-teal-900/10 py-1 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 hover:bg-teal-50/50 ${language === lang.code
                                ? 'text-teal-700 bg-teal-50 font-medium'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            role="menuitem"
                        >
                            <span className={`w-2 h-2 rounded-full ${language === lang.code ? 'bg-teal-500' : 'bg-slate-200'}`}></span>
                            {lang.name}
                            {language === lang.code && (
                                <svg className="w-4 h-4 ml-auto text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
