import { FaMoon, FaSun } from 'react-icons/fa';

import { Theme, useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return isDark ? <FaMoon size={20} /> : <FaSun size={20} />;
    }
    return theme === 'dark' ? <FaMoon size={20} /> : <FaSun size={20} />;
  };

  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <button
      onClick={cycleTheme}
      className="min-w-[44px] min-h-[44px] p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-95 touch-manipulation"
      title={`Theme: ${getThemeLabel()} (Click to cycle)`}
      aria-label={`Current theme: ${getThemeLabel()}. Click to change.`}
    >
      {getThemeIcon()}
    </button>
  );
}
