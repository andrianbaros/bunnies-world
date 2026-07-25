import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Disc, MessageSquare, Info, MoreHorizontal, Search, Bookmark, Calendar, Newspaper, Settings, Sun, Moon, LayoutGrid } from 'lucide-react';
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
    <header className="sticky top-2 sm:top-3 z-40 w-[96%] max-w-6xl mx-auto mb-4 sm:mb-6">
      <nav className="glass-surface rounded-full px-2.5 sm:px-6 py-2 flex items-center justify-between shadow-sm min-h-[50px] sm:min-h-[60px] relative">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2.5 font-bold tracking-tight text-current hover:opacity-80 transition-opacity flex-shrink-0">
          <img src="/assets/logo.png" alt="Bunnies World Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-md shadow-xs flex-shrink-0" />
          <span className="font-extrabold text-[11px] xs:text-xs sm:text-base tracking-normal sm:tracking-wider uppercase whitespace-nowrap text-[var(--text-heading)]">
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
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle-hover)] dark:hover:bg-white/5'
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isMoreOpen || moreNavItems.some((i) => location.pathname === i.path)
                  ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle-hover)] dark:hover:bg-white/5'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>{t('nav_more')}</span>
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 top-12 w-52 bg-[var(--bg-card)] p-2 rounded-2xl flex flex-col gap-1 border border-[var(--border-color)] shadow-2xl z-50">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle-hover)]'
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
            className="p-1.5 sm:p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle-hover)] dark:hover:bg-white/5 transition-colors"
            title="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </NavLink>

          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-subtle-hover)] dark:hover:bg-white/5 transition-colors"
            title="Toggle Theme"
          >
            {settings.theme === 'light' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />}
          </button>

          {/* Multi-Language Selector */}
          <div className="flex items-center bg-[var(--bg-subtle)] rounded-full p-0.5 sm:p-1 border border-[var(--border-color)] flex-shrink-0">
            {['en', 'id', 'ko', 'ja'].map((lang) => (
              <button
                key={lang}
                onClick={() => updateSetting('language', lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase transition-all ${
                  settings.language === lang
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMobileMoreOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-30"
          onClick={() => setIsMobileMoreOpen(false)}
        />
      )}

      {/* Mobile More Menu Panel */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed bottom-[140px] left-4 right-4 z-45 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border-color)] shadow-2xl flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMoreOpen(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold transition-all border ${
                    isItemActive
                      ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-transparent hover:text-[var(--text-heading)]'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)] bg-[var(--bg-surface)] backdrop-blur-md border-t border-[var(--border-color)] px-2 py-1.5 flex items-center justify-around rounded-none">
        {primaryNavItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-pink-500 font-bold' : 'text-[var(--text-muted)]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            isMobileMoreOpen || moreNavItems.some((i) => location.pathname === i.path)
              ? 'text-pink-500 font-bold'
              : 'text-[var(--text-muted)]'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="truncate max-w-[60px]">{t('nav_more')}</span>
        </button>
      </div>
    </header>
  );
}
