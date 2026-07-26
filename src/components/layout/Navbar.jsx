import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Disc, MessageSquare, Info, MoreHorizontal, Search, Bookmark, Calendar, Newspaper, Settings, Sun, Moon, LayoutGrid, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  useEffect(() => {
    updateSetting('lastRoute', location.pathname);
    setIsMoreOpen(false);
    setIsMobileMoreOpen(false);
  }, [location.pathname]);

  const primaryNavItems = [
    { path: '/', label: t('nav_home'), icon: LayoutGrid },
    { path: '/members', label: t('nav_members'), icon: Users },
    { path: '/discography', label: t('nav_discography'), icon: Disc },
    { path: '/community', label: t('nav_community'), icon: MessageSquare }
  ];

  const moreNavItems = [
    { path: '/chat', label: 'BUNNY AI', icon: Sparkles },
    { path: '/about', label: t('nav_about'), icon: Info },
    { path: '/timeline', label: t('nav_timeline'), icon: Calendar },
    { path: '/gallery', label: t('nav_gallery'), icon: LayoutGrid },
    { path: '/news', label: t('nav_news'), icon: Newspaper },
    { path: '/search', label: t('nav_search'), icon: Search },
    { path: '/favorites', label: t('nav_favorites'), icon: Bookmark },
    { path: '/settings', label: t('nav_settings'), icon: Settings }
  ];

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSetting('theme', nextTheme);
  };

  return (
    <header className="fixed bottom-3 md:sticky md:top-3 md:bottom-auto left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 z-40 w-[96%] max-w-6xl mx-auto mb-0 md:mb-6">
      <nav className="glass-surface rounded-full px-3 sm:px-6 py-2 flex items-center justify-between shadow-md min-h-[50px] sm:min-h-[60px] relative border border-pink-500/25">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2.5 font-extrabold tracking-tight text-current hover:opacity-90 transition-opacity flex-shrink-0">
          <img src="/assets/logo.png" alt="Bunnies World Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-md shadow-2xs flex-shrink-0" />
          <span className="font-black text-[11px] xs:text-xs sm:text-base tracking-normal sm:tracking-wider uppercase whitespace-nowrap text-slate-950 dark:text-white">
            BUNNIES WORLD
          </span>
        </NavLink>

        {/* Primary Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* More Menu Dropdown (Desktop) */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                isMoreOpen || moreNavItems.some((i) => location.pathname === i.path)
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>{t('nav_more')}</span>
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white dark:bg-zinc-900 p-2 rounded-3xl flex flex-col gap-1 border border-pink-500/30 shadow-2xl z-50">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-extrabold transition-colors ${
                          isActive
                            ? 'bg-pink-500 text-white font-black'
                            : 'text-slate-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-500'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 opacity-75" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Controls: Theme & Language Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <NavLink
            to="/search"
            className="p-2 rounded-full text-slate-700 dark:text-zinc-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </NavLink>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {settings.theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-300" />}
          </button>

          {/* Multi-Language Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-full p-1 border border-pink-500/20 flex-shrink-0">
            {['en', 'id', 'ko', 'ja'].map((lang) => (
              <button
                key={lang}
                onClick={() => updateSetting('language', lang)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black transition-all uppercase cursor-pointer ${
                  (settings.language || 'en') === lang
                    ? 'bg-pink-500 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 dark:text-zinc-300 hover:text-pink-500 transition-colors cursor-pointer ml-1"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {isMobileMoreOpen && (
          <div className="md:hidden absolute bottom-16 left-0 right-0 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-pink-500/30 shadow-2xl flex flex-col gap-2 z-50">
            <div className="grid grid-cols-2 gap-2">
              {[...primaryNavItems, ...moreNavItems].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2.5 rounded-2xl text-xs font-extrabold transition-colors ${
                        isActive
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-500/10'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
