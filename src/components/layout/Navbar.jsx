import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Users, Disc, MessageSquare, Info, MoreHorizontal, Search, Bookmark, Calendar, Newspaper, Settings, Sun, Moon } from 'lucide-react';
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
    { path: '/', label: t('nav_home'), icon: Sparkles },
    { path: '/members', label: t('nav_members'), icon: Users },
    { path: '/discography', label: t('nav_discography'), icon: Disc },
    { path: '/community', label: t('nav_community'), icon: MessageSquare }
  ];

  const moreNavItems = [
    { path: '/about', label: t('nav_about'), icon: Info },
    { path: '/timeline', label: t('nav_timeline'), icon: Calendar },
    { path: '/gallery', label: t('nav_gallery'), icon: Sparkles },
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
      <nav className="glass-surface rounded-full px-3 sm:px-5 py-2 flex items-center justify-between shadow-xl border border-white/15 min-h-[54px] sm:min-h-[62px]">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-1.5 font-extrabold tracking-wider text-pink-300 hover:text-white transition-colors flex-shrink-0">
          <span className="text-lg sm:text-xl">🐰</span>
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent font-black tracking-widest text-xs sm:text-base">
            BUNNIES UNIVERSE
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
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-cyan-400/20 text-white border border-pink-300/40 shadow-md'
                      : 'text-gray-400 hover:text-pink-300 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>{t('nav_more')}</span>
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 top-10 w-44 glass-surface-pink p-2 rounded-2xl flex flex-col gap-1 border border-pink-300/30 shadow-2xl z-50">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-pink-300" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Utility Controls: Theme & Language Switcher (Compact & Responsive on Mobile) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Search Button */}
          <NavLink to="/search" className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors" title="Search">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </NavLink>

          {/* Quick Theme Toggle */}
          <button onClick={toggleTheme} className="p-1.5 sm:p-2 rounded-full text-pink-300 hover:bg-white/5 transition-colors" title="Toggle Theme">
            {settings.theme === 'light' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Multi-Language Selector (Compact Pills for Mobile) */}
          <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/10">
            {['en', 'id', 'ko', 'ja'].map((lang) => (
              <button
                key={lang}
                onClick={() => updateSetting('language', lang)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase transition-all ${
                  settings.language === lang
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
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
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMoreOpen(false)}
        />
      )}

      {/* Mobile More Menu Bottom Drawer Panel */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed bottom-[140px] left-3 right-3 z-45 glass-surface-pink p-4 rounded-3xl border border-pink-300/30 shadow-2xl flex flex-col gap-2 max-h-[50vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
          <div className="grid grid-cols-2 gap-2">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMoreOpen(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all border ${
                    isItemActive
                      ? 'bg-pink-400/20 text-pink-300 border-pink-300/40'
                      : 'bg-black/40 text-gray-300 border-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-pink-300" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Fixed for Mobile Screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-white/10 px-1 py-1.5 flex items-center justify-around">
        {primaryNavItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 p-1 text-[9px] font-bold ${
                  isActive ? 'text-pink-300 font-black' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[55px]">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Mobile More Navigation Button */}
        <button
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={`flex flex-col items-center gap-0.5 p-1 text-[9px] font-bold transition-all ${
            isMobileMoreOpen || moreNavItems.some(i => location.pathname === i.path) || location.pathname === '/about'
              ? 'text-pink-300 font-black'
              : 'text-gray-400'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="truncate max-w-[55px]">{t('nav_more')}</span>
        </button>
      </div>
    </header>
  );
}
