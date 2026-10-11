'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Çeviri dosyalarını import et
import commonTR from '../public/locales/tr/common.json';
import commonEN from '../public/locales/en/common.json';
import { Language, LANGUAGE_KEY, isLanguage } from '../lib/language';

function persistLanguage(lang: Language) {
  localStorage.setItem(LANGUAGE_KEY, lang);
  document.cookie = `${LANGUAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = lang;
}

type Translations = {
  common: typeof commonTR;
  // Diğer namespace'ler buraya eklenecek
  // 'dashboard': typeof dashboardTR;
  // 'settings': typeof settingsTR;
};

const translations: Record<Language, Translations> = {
  tr: {
    common: commonTR,
  },
  en: {
    common: commonEN,
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (namespace: keyof Translations, key: string, options?: { returnObjects?: boolean }) => any;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  // Dil artık sunucuda belirleniyor; bileşenlerdeki isLoading kontrolleri için alan korunuyor
  const isLoading = false;

  // Çerezi olmayan eski ziyaretçiler: localStorage'daki tercihi uygula ve çereze taşı
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (isLanguage(savedLanguage)) {
        setLanguage(savedLanguage);
        persistLanguage(savedLanguage);
      }
    } catch (error) {
      console.warn('localStorage erişim hatası:', error);
    }
  }, []);

  // Dil değiştiğinde localStorage'a ve çereze kaydet
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      persistLanguage(lang);
    } catch (error) {
      console.warn('localStorage yazma hatası:', error);
    }
  };

  // Nested key erişimi için helper fonksiyon
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path;
  };

  // Çeviri fonksiyonu
  const t = (
    namespace: keyof Translations,
    key: string,
    options?: { returnObjects?: boolean }
  ): any => {
    if (!translations[language] || !translations[language][namespace]) {
      console.warn(`Translation not found: ${namespace}.${key} for language ${language}`);
      return options?.returnObjects ? [] : key;
    }

    const namespaceData = translations[language][namespace];
    const result = getNestedValue(namespaceData, key);

    // Eğer returnObjects true ise ve result bir object/array ise, olduğu gibi döndür
    if (options?.returnObjects && typeof result === 'object') {
      return result;
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Kolay kullanım için hook
export function useTranslation(namespace: keyof Translations) {
  const { t: contextT, language, isLoading } = useLanguage();

  const t = (key: string, options?: { returnObjects?: boolean }) =>
    contextT(namespace, key, options);

  return { t, i18n: { language }, isLoading };
}
