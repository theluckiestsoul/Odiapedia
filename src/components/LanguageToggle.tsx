"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
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
