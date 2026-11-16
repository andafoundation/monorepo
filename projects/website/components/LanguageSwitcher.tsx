'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'nl', name: 'NL', flag: '🇳🇱' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'tr', name: 'TR', flag: '🇹🇷' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' }
  ];


  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'nl' || segments[1] === 'tr' || segments[1] === 'ru') {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/') || '/';
    const hash = typeof window === 'undefined' ? '' : window.location.hash;
    router.push(newPath + hash);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-ink hover:bg-porcelain/80 transition-colors duration-200"
        aria-label="Change language"
      >
        <span className="hidden sm:inline text-primary font-semibold">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="sm:hidden text-primary font-semibold">
          {currentLanguage.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 rounded-2xl bg-porcelain shadow-lg border border-ink/10 z-50 overflow-hidden">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={cn(
                'w-full px-3 py-2 text-left flex items-center gap-2 text-sm hover:bg-porcelain/80 transition-colors duration-200',
                locale === language.code && 'bg-porcelain/80 font-semibold'
              )}
            >
              <span className="text-lg leading-none">{language.flag}</span>
              <span className="text-ink text-sm">{language.name}</span>
              {locale === language.code && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
