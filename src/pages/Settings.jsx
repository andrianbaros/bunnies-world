import React from 'react';
import { RefreshCw, Moon, Sun, Monitor, Globe, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Settings() {
  const { t } = useTranslation();
  const { settings, updateSetting, resetAllSettings } = useSettings();

  const themes = [
    { id: 'dark', label: t('theme_dark'), icon: Moon },
    { id: 'light', label: t('theme_light'), icon: Sun },
    { id: 'system', label: t('theme_system'), icon: Monitor }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'id', label: 'Indonesia' },
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' }
  ];

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PREFERENCES</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('settings_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('settings_sub')}
        </p>
      </div>

      {/* Main Preference Card (iPhone Frost Glass Style) */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl flex flex-col gap-8 border border-pink-500/25 shadow-md">
        {/* 1. Theme Segment Button Selector */}
        <div className="flex flex-col gap-3">
          <label className="font-black text-xs uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
            <span>{t('theme_mode')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-pink-500/20 shadow-2xs">
            {themes.map((item) => {
              const Icon = item.icon;
              const isActive = settings.theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => updateSetting('theme', item.id)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selector */}
        <div className="flex flex-col gap-3">
          <label className="font-black text-xs uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-pink-500" />
            <span>{t('select_language')}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((lang) => {
              const isActive = (settings.language || 'en') === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => updateSetting('language', lang.code)}
                  className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                      : 'bg-slate-100/80 dark:bg-zinc-800/80 border-pink-500/20 text-slate-950 dark:text-white hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Reset Button */}
        <div className="pt-4 border-t border-pink-500/20 flex justify-end">
          <button
            onClick={resetAllSettings}
            className="px-5 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white font-extrabold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-2xs border border-rose-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
