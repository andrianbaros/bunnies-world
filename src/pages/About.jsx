import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Globe, BookOpen, Scale, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const historyMilestones = [
    {
      era: t('about_milestone_1_era'),
      desc: t('about_milestone_1_desc')
    },
    {
      era: t('about_milestone_2_era'),
      desc: t('about_milestone_2_desc')
    },
    {
      era: t('about_milestone_3_era'),
      desc: t('about_milestone_3_desc')
    },
    {
      era: t('about_milestone_4_era'),
      desc: t('about_milestone_4_desc')
    }
  ];

  const controversies = [
    {
      title: t('about_record_1_title'),
      detail: t('about_record_1_detail')
    },
    {
      title: t('about_record_2_title'),
      detail: t('about_record_2_detail')
    },
    {
      title: t('about_record_3_title'),
      detail: t('about_record_3_detail')
    }
  ];

  const faqs = [
    {
      q: t('about_faq_1_q'),
      a: t('about_faq_1_a')
    },
    {
      q: t('about_faq_2_q'),
      a: t('about_faq_2_a')
    },
    {
      q: t('about_faq_3_q'),
      a: t('about_faq_3_a')
    }
  ];

  return (
    <div className="flex flex-col gap-8 sm:gap-10 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      {/* 1. Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('about_tag')}
        </span>
        <h1 className="text-hero">
          {t('about_title')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
          {t('about_sub')}
        </p>
      </div>

      {/* 2. About Bunnies Universe Web Portal with Official Logo */}
      <section className="glass-surface p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-black/5 dark:bg-black/40 p-3.5 rounded-2xl border border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
          <img src="/assets/logo.png" alt="Bunnies Universe Official Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col gap-2.5 text-center md:text-left">
          <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">
            OFFICIAL FAN PLATFORM
          </span>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
            {t('about_portal_title')}
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('about_portal_desc')}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[11px] font-semibold border border-black/10 dark:border-white/10">
              Version 2.5 Pro
            </span>
            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[11px] font-semibold border border-black/10 dark:border-white/10">
              Live Audio Previews
            </span>
            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[11px] font-semibold border border-black/10 dark:border-white/10">
              Supabase Realtime
            </span>
          </div>
        </div>
      </section>

      {/* 3. Group Identity & Naming Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="glass-surface p-6 rounded-2xl border flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('about_naming')}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about_naming_desc')}
            </p>
          </div>
          <div className="bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/5 text-[11px] text-gray-500 dark:text-gray-400">
            <strong>Hangul:</strong> 뉴진스 | <strong>Alternative:</strong> NJZ | <strong>Label:</strong> ADOR / Hybe Corporation
          </div>
        </div>

        <div className="glass-surface p-6 rounded-2xl border flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('about_membership')}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about_membership_desc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold border border-pink-500/20">Minji</span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold border border-pink-500/20">Hanni</span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold border border-pink-500/20">Haerin</span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold border border-pink-500/20">Hyein</span>
          </div>
        </div>
      </section>

      {/* 4. History & Milestones */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
          <BookOpen className="w-4 h-4 text-pink-500" />
          <span>{t('about_chronology')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {historyMilestones.map((m, idx) => (
            <div key={idx} className="glass-surface p-5 rounded-2xl flex flex-col gap-2 border">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">{m.era}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Music & Copyright Records */}
      <section className="glass-surface p-6 rounded-2xl flex flex-col gap-5 border">
        <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
          <Scale className="w-4 h-4 text-pink-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('about_records')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {controversies.map((c, i) => (
            <div key={i} className="bg-black/5 dark:bg-black/40 p-4 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1.5">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">{c.title}</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
          <HelpCircle className="w-4 h-4 text-pink-500" />
          <span>{t('about_faq')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-surface p-5 rounded-2xl flex flex-col gap-2 border">
              <h3 className="font-bold text-xs text-gray-900 dark:text-white">{faq.q}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. External Links & Weverse */}
      <section className="glass-surface p-6 sm:p-8 rounded-2xl text-center flex flex-col items-center gap-3 border">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{t('about_portal')}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md">{t('about_portal_sub')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <a
            href="https://newjeans.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-semibold text-xs hover:bg-pink-600 transition-colors flex items-center gap-1.5"
          >
            <span>{t('about_official_web')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://weverse.io/newjeans"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-xs hover:bg-black/10 dark:hover:bg-white/20 transition-colors flex items-center gap-1.5"
          >
            <span>{t('about_weverse')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
