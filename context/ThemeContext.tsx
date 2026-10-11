// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Tema sınıfını ilk boyamadan önce layout'taki inline script ekler
  // (localStorage, yoksa sistem teması); burada sadece state'e alınır.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // HTML root elementine tema classını ekle
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);

      // Yerel depolamaya kaydet
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // İçerik sunucuda da render edilsin diye mount beklenmez; temaya bağlı
  // görünüm dark: sınıflarıyla çözülür, state yalnızca mount sonrası güncellenir.
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
