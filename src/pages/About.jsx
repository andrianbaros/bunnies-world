import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Globe, BookOpen, Scale, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const historyMilestones = [
    {
      era: '2019–2021: Formation & Pre-Debut',
      desc: 'Preparation began with global auditions directed by Min Hee-jin under Big Hit & Source Music, leading to the launch of ADOR.'
    },
    {
      era: '2022–2023: Debut, "Ditto" & "Get Up"',
      desc: 'Surprise release of debut singles "Attention" & "Hype Boy". Followed by historic 13-week Korean #1 "Ditto" and 2nd EP "Get Up" debuting at #1 on Billboard 200.'
    },
    {
      era: '2024–2026: Japan Debut & Contract Evolution',
      desc: 'Japanese debut with "Supernatural". Legal contract disputes concluded with Danielle\'s profile officially preserved in the Former Member Archive.'
    },
    {
      era: '2026–Present: 4-Member Active Lineup',
      desc: 'NewJeans continues activities as a 4-member active lineup (Minji, Hanni, Haerin, Hyein) launching their latest global campaign.'
    }
  ];

  const controversies = [
    {
      title: '"Bubble Gum" Copyright Inquiry',
      detail: 'UK band Shakatak raised inquiry regarding melodic similarities with 1981 track "Easier Said Than Done". ADOR requested an independent musicological report.'
    },
    {
      title: '"How Sweet" Demo Inquiries',
      detail: 'Four composers raised claims regarding "One of a Kind" demo elements. ADOR confirmed track acquisition via BANA and reviewed internal records.'
    },
    {
      title: '"ETA" Instrumental Review',
      detail: 'All Surface Publishing filed a US lawsuit regarding horn samples in "Samir\'s Theme". Legally reviewed under standard production records.'
    }
  ];

  const faqs = [
    {
      q: 'What is the meaning behind NewJeans?',
      a: 'Jeans are timeless garments that never go out of style. The name is also a play on "new genes", symbolizing pioneering a brand new generation of pop music.'
    },
    {
      q: 'Who are the active members of NewJeans?',
      a: 'The active lineup consists of 4 members: Minji, Hanni, Haerin, and Hyein. Danielle is preserved separately in the Former Member Archive.'
    },
    {
      q: 'Where are community posts stored?',
      a: 'Community fan posts are stored in a live Supabase database, synced globally in real time. Your personal preferences (theme, language) are saved in local browser storage.'
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

      {/* 2. Group Identity & Naming Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="glass-surface p-6 rounded-2xl border flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('about_naming')}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>NewJeans</strong> carries a dual meaning: jeans are timeless everyday wear that people never tire of wearing, symbolizing an everlasting artistic image. It is also a play on <em>"new genes"</em>—signifying a new era in global pop.
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
              NewJeans operates organically without an official leader. The active lineup comprises <strong>Minji, Hanni, Haerin, and Hyein</strong>. Danielle is archived as a Former Member.
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

      {/* 3. History & Milestones */}
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

      {/* 4. Music & Copyright Records */}
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

      {/* 5. FAQ */}
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

      {/* 6. External Links & Weverse */}
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
