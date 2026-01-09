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

    const handleToggle = () => {
        const newLang = language === 'en' ? 'od' : 'en';

        // If there's an alternate URL for the new language, navigate to it
        if (alternates[newLang]) {
            setLanguage(newLang);
            router.push(alternates[newLang]);
        } else {
            // Just toggle the UI language
            toggleLanguage();
        }
    };

    return (
        <button
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                 bg-amber-900/30 hover:bg-amber-800/50 
                 border border-amber-700/30 hover:border-amber-600/50
                 transition-all duration-200 group"
            aria-label={`Switch to ${language === 'en' ? 'Odia' : 'English'}`}
            title={`Switch to ${language === 'en' ? 'Odia' : 'English'}`}
        >
            {/* Globe Icon */}
            <svg
                className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
            </svg>

            {/* Current / Switch To */}
            <span className="text-sm font-medium">
                <span className={`transition-all ${language === 'en' ? 'text-amber-100' : 'text-amber-400'}`}>
                    EN
                </span>
                <span className="text-amber-600 mx-1">/</span>
                <span className={`transition-all ${language === 'od' ? 'text-amber-100' : 'text-amber-400'} odia-text`}>
                    ଓ
                </span>
            </span>
        </button>
    );
}
