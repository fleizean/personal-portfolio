'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative inline-flex items-center justify-center 
        rounded-full p-2
        bg-gray-200/70 dark:bg-gray-700/70 backdrop-blur-sm
        hover:bg-gray-300/70 dark:hover:bg-gray-600/70 
        transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        focus:ring-offset-2 dark:focus:ring-offset-gray-800
      "
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
