import React, { useState } from 'react';
import { Settings as SettingsIcon, Eye, Volume2, ShieldCheck, Database, Award, RefreshCw, Moon, Sun, Monitor, Sparkles } from 'lucide-react';
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
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ];

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-purple-400/10 border border-purple-300/30 text-purple-300 text-xs font-bold tracking-widest uppercase">
          PREFERENCES & CONTROLS
        </span>
        <h1 className="text-hero font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          {t('settings_title')}
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md">
          {t('settings_sub')}
        </p>
      </div>

      {/* Main Preference Cards Container */}
      <div className="glass-surface p-6 sm:p-8 rounded-3xl flex flex-col gap-8 border border-white/10 shadow-2xl">
        {/* 1. Theme Segment Button Selector */}
        <div className="flex flex-col gap-3">
          <label className="font-extrabold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>{t('theme_mode')}</span>
          </label>
          <div className="grid grid-cols-3 gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/10">
            {themes.map((item) => {
              const Icon = item.icon;
              const isActive = settings.theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => updateSetting('theme', item.id)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white'
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
          <label className="font-extrabold text-sm text-white flex items-center gap-2">
            <span>🌐</span>
            <span>Language / 언어 / 言語</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((lang) => {
              const isActive = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => updateSetting('language', lang.code)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-pink-400/20 border-pink-300 text-pink-300 shadow-md scale-105'
                      : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Reduced Motion Animated Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <h4 className="font-bold text-sm text-white">{t('reduced_motion')}</h4>
            <p className="text-xs text-gray-400">{t('reduced_motion_sub')}</p>
          </div>
          <button
            onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
            className={`w-14 h-7 rounded-full p-1 transition-colors ${
              settings.reducedMotion ? 'bg-pink-400' : 'bg-gray-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.reducedMotion ? 'translate-x-7' : ''}`} />
          </button>
        </div>

        {/* 4. Reset Local Storage Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <h4 className="font-bold text-sm text-white">{t('reset_data')}</h4>
            <p className="text-xs text-gray-400">{t('reset_data_sub')}</p>
          </div>
          <button
            onClick={resetAllSettings}
            className="px-4 py-2 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
