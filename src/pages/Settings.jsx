import React from 'react';
import { RefreshCw, Moon, Sun, Monitor, Globe } from 'lucide-react';
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          PREFERENCES
        </span>
        <h1 className="text-hero">
          {t('settings_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-gray-400 max-w-md">
          {t('settings_sub')}
        </p>
      </div>

      {/* Main Preference Card */}
      <div className="glass-surface p-6 sm:p-8 rounded-2xl flex flex-col gap-8 border">
        {/* 1. Theme Segment Button Selector */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
            <span>{t('theme_mode')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-black/5 dark:bg-black/40 p-1.5 rounded-xl border border-black/10 dark:border-white/10">
            {themes.map((item) => {
              const Icon = item.icon;
              const isActive = settings.theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => updateSetting('theme', item.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'text-slate-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selector Grid */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-pink-500" />
            <span>Language / 언어 / 言語</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((lang) => {
              const isActive = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => updateSetting('language', lang.code)}
                  className={`flex items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-pink-500/15 border-pink-500/30 text-pink-600 dark:text-pink-400 font-bold'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-800 dark:text-gray-200 hover:border-black/20 dark:hover:border-white/20'
                  }`}
                >
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Reduced Motion Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">{t('reduced_motion')}</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">{t('reduced_motion_sub')}</p>
          </div>
          <button
            onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.reducedMotion ? 'bg-pink-500' : 'bg-gray-300 dark:bg-zinc-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.reducedMotion ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* 4. Reset Local Storage Button */}
        <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">{t('reset_data')}</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">{t('reset_data_sub')}</p>
          </div>
          <button
            onClick={resetAllSettings}
            className="px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
