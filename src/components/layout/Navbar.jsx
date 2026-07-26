import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Disc, MessageSquare, Info, MoreHorizontal, Search, Bookmark, Calendar, Newspaper, Settings, Sun, Moon, LayoutGrid, Sparkles, Download } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { settings, updateSetting, showToast } = useSettings();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    updateSetting('lastRoute', location.pathname);
    setIsMoreOpen(false);
    setIsMobileMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('success', 'Thank you for installing BUNNIES WORLD!');
        setDeferredPrompt(null);
        setIsAppInstalled(true);
      }
    } else if (isAppInstalled) {
      showToast('info', 'BUNNIES WORLD is already installed on your device!');
    } else {
      showToast('info', 'To install on Desktop: Click the Install icon (⊕) in your browser address bar or menu -> "Install BUNNIES WORLD"');
    }
  };

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
    <>
      {/* Top Header Bar (Logo, Title, Search, Theme, Language) */}
      <header className="sticky top-2 sm:top-3 z-40 w-[96%] max-w-6xl mx-auto mb-4 sm:mb-6">
        <nav className="glass-surface rounded-full px-3 sm:px-6 py-2 flex items-center justify-between shadow-md min-h-[50px] sm:min-h-[60px] relative border border-pink-500/25">
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2.5 font-extrabold tracking-tight text-current hover:opacity-90 transition-opacity flex-shrink-0">
            <img src="/assets/logo.png" alt="Bunnies World Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-md shadow-2xs flex-shrink-0" />
            <span className="font-black text-[11px] xs:text-xs sm:text-sm lg:text-base tracking-normal sm:tracking-wider uppercase whitespace-nowrap text-slate-950 dark:text-white">
              BUNNIES WORLD
            </span>
          </NavLink>

          {/* Primary Desktop Nav Links (Visible on Large Screens >= 1024px) */}
          <div className="hidden lg:flex items-center gap-1">
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

          {/* Controls: Search, Theme & Language Switcher & PWA Install */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 hover:bg-pink-500 hover:text-white border border-pink-500/40 text-xs font-black transition-all cursor-pointer shadow-2xs"
              title="Install Desktop / Mobile App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAppInstalled ? 'Installed ✓' : 'Install App'}</span>
            </button>
            <NavLink
              to="/search"
              className="p-1.5 sm:p-2 rounded-full text-slate-700 dark:text-zinc-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </NavLink>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-slate-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {settings.theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>

            {/* Multi-Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-full p-0.5 sm:p-1 border border-pink-500/20 flex-shrink-0">
              {['en', 'id', 'ko', 'ja'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateSetting('language', lang)}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] lg:text-xs font-black transition-all uppercase cursor-pointer ${
                    (settings.language || 'en') === lang
                      ? 'bg-pink-500 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Instagram-Style Mobile & Tablet Bottom Navigation Bar (< 1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border-t border-pink-500/25 px-1 sm:px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMoreOpen(false)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-1 sm:px-3 py-0.5 rounded-xl text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-extrabold transition-all min-w-0 ${
                  isActive
                    ? 'text-pink-500 font-black scale-105'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
                }`
              }
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate max-w-[55px] sm:max-w-none text-center">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Mobile & Tablet More Button */}
        <button
          onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
          className={`flex flex-col items-center gap-0.5 px-1 sm:px-3 py-0.5 rounded-xl text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-extrabold transition-all cursor-pointer min-w-0 ${
            isMobileMoreOpen || moreNavItems.some((i) => location.pathname === i.path)
              ? 'text-pink-500 font-black scale-105'
              : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
          }`}
        >
          <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate max-w-[55px] sm:max-w-none text-center">{t('nav_more')}</span>
        </button>
      </nav>

      {/* Mobile & Tablet Pop-Up Menu (Appears ABOVE Floating Audio Player with Clean Gap) */}
      {isMobileMoreOpen && (
        <div className="lg:hidden fixed bottom-44 left-4 right-4 max-w-md mx-auto z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-4 rounded-3xl border border-pink-500/30 shadow-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-2 mb-1 px-1">
            <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">More Features</span>
            <button
              onClick={() => setIsMobileMoreOpen(false)}
              className="text-xs font-bold text-pink-500 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-extrabold transition-colors ${
                      isActive
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-500/10'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
