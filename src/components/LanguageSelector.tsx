'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  path: string;
}

interface LanguageSelectorProps {
  languages: {
    en?: string;
    od?: string;
    hi?: string;
  };
  currentLang: 'en' | 'od' | 'hi';
}

const languageConfig: Record<string, Omit<LanguageOption, 'path'>> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸',
  },
  od: {
    code: 'od',
    label: 'Odia',
    nativeLabel: 'ଓଡ଼ିଆ',
    flag: '🇮🇳',
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    flag: '🇮🇳',
  },
};

export default function LanguageSelector({ languages, currentLang }: LanguageSelectorProps) {
  const pathname = usePathname();

  if (!languages) {
    return null;
  }

  // Build available languages
  const availableLanguages: LanguageOption[] = Object.entries(languages)
    .filter(([, path]) => path) // Filter out undefined paths
    .map(([code, path]) => ({
      ...languageConfig[code],
      path: path as string,
    }));

  if (availableLanguages.length <= 1) {
    return null; // Don't show selector if only one language
  }

  return (
    <div className="language-selector">
      <div className="language-selector-inner">
        <span className="language-icon">🌐</span>
        <span className="language-label">Read in:</span>
        <div className="language-buttons">
          {availableLanguages.map((lang, index) => {
            const isActive = lang.code === currentLang;
            return (
              <span key={lang.code}>
                {isActive ? (
                  <span className="language-button active">
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.nativeLabel}</span>
                  </span>
                ) : (
                  <Link href={lang.path} className="language-button">
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.nativeLabel}</span>
                  </Link>
                )}
                {index < availableLanguages.length - 1 && (
                  <span className="lang-divider">|</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .language-selector {
          margin: 1.5rem 0 2rem;
          padding: 0;
        }
        
        .language-selector-inner {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 9999px;
          font-size: 0.95rem;
        }
        
        .language-icon {
          font-size: 1.2rem;
        }
        
        .language-label {
          color: rgba(245, 245, 245, 0.7);
          font-weight: 500;
        }
        
        .language-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .language-button {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          color: rgba(245, 245, 245, 0.9);
          text-decoration: none;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .language-button:hover {
          background: rgba(201, 162, 39, 0.2);
          color: #fbbf24;
        }
        
        .language-button.active {
          background: linear-gradient(135deg, #c9a227, #d4a842);
          color: #0f0f0f;
          cursor: default;
        }
        
        .lang-flag {
          font-size: 1rem;
        }
        
        .lang-name {
          font-size: 0.9rem;
        }
        
        .lang-divider {
          color: rgba(201, 162, 39, 0.4);
          margin: 0 0.25rem;
        }
        
        @media (max-width: 640px) {
          .language-selector-inner {
            flex-wrap: wrap;
            justify-content: center;
            padding: 0.6rem 1rem;
            gap: 0.5rem;
          }
          
          .language-label {
            display: none;
          }
          
          .language-button {
            padding: 0.3rem 0.6rem;
          }
          
          .lang-name {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
