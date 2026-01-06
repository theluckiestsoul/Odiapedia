"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

// Default context value for SSR
const defaultContextValue: LanguageContextType = {
    language: 'en',
    setLanguage: () => { },
    toggleLanguage: () => { },
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

const STORAGE_KEY = 'odiapedia-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    // Load saved language preference on mount
    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Language;
            if (saved && (saved === 'en' || saved === 'od')) {
                setLanguageState(saved);
            }
        } catch {
            // localStorage not available (SSR)
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            // Update HTML lang attribute
            if (typeof document !== 'undefined') {
                document.documentElement.lang = lang === 'od' ? 'or' : 'en';
            }
        } catch {
            // localStorage not available
        }
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'od' : 'en';
        setLanguage(newLang);
    };

    // Always provide context, use mounted state for content that needs hydration
    const contextValue: LanguageContextType = mounted
        ? { language, setLanguage, toggleLanguage }
        : defaultContextValue;

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    return useContext(LanguageContext);
}

// Hook to get translated text
export function useTranslation() {
    const { language } = useLanguage();

    const t = (key: string): string => {
        // Import translations dynamically to avoid issues
        const { translations } = require('@/lib/translations');
        const keys = key.split('.');
        let value: unknown = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                return key;
            }
        }

        if (value && typeof value === 'object' && language in value) {
            return (value as Record<string, string>)[language];
        }

        return key;
    };

    return { t, language };
}
