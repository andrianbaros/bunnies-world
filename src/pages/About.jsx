import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Scale, ExternalLink, Sparkles } from 'lucide-react';
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('about_tag')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('about_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-xl leading-relaxed font-bold">
          {t('about_sub')}
        </p>
      </div>

      {/* 2. About Bunnies World Web Portal with Official Logo */}
      <section className="glass-surface p-6 sm:p-8 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-100 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-pink-500/20 flex items-center justify-center shadow-xs">
          <img src="/assets/logo.png" alt="Bunnies World Official Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col gap-2.5 text-center md:text-left">
          <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest">
            OFFICIAL FAN PLATFORM
          </span>
          <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-wider">
            {t('about_portal_title')}
          </h2>
          <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
            {t('about_portal_desc')}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 text-slate-950 dark:text-white text-[11px] font-bold border border-pink-500/20">
              Version 2.5 Pro
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 text-slate-950 dark:text-white text-[11px] font-bold border border-pink-500/20">
              Live Audio Previews
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 text-slate-950 dark:text-white text-[11px] font-bold border border-pink-500/20">
              Supabase Realtime
            </span>
          </div>
        </div>
      </section>

      {/* 3. Group Identity & Naming Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="glass-surface p-6 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider">
              {t('about_naming')}
            </h2>
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              {t('about_naming_desc')}
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-pink-500/20 text-[11px] text-slate-700 dark:text-zinc-300 font-semibold">
            <strong className="text-pink-600 dark:text-pink-400">Hangul:</strong> 뉴진스 | <strong className="text-pink-600 dark:text-pink-400">Alternative:</strong> NJZ | <strong className="text-pink-600 dark:text-pink-400">Label:</strong> ADOR / Hybe Corporation
          </div>
        </div>

        <div className="glass-surface p-6 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider">
              {t('about_membership')}
            </h2>
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              {t('about_membership_desc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 text-xs font-bold border border-pink-500/30">Minji</span>
            <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 text-xs font-bold border border-pink-500/30">Hanni</span>
            <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 text-xs font-bold border border-pink-500/30">Haerin</span>
            <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 text-xs font-bold border border-pink-500/30">Hyein</span>
          </div>
        </div>
      </section>

      {/* 4. History & Milestones */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
          <BookOpen className="w-4 h-4 text-pink-500" />
          <span>{t('about_chronology')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {historyMilestones.map((m, idx) => (
            <div key={idx} className="glass-surface p-5 rounded-3xl flex flex-col gap-2 border border-pink-500/25 hover:border-pink-500/50 shadow-xs">
              <span className="text-xs font-black text-pink-600 dark:text-pink-400 uppercase tracking-wider">{m.era}</span>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Music & Copyright Records */}
      <section className="glass-surface p-6 rounded-3xl flex flex-col gap-5 border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2">
          <Scale className="w-4 h-4 text-pink-500" />
          <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider">{t('about_records')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {controversies.map((c, i) => (
            <div key={i} className="bg-slate-100 dark:bg-zinc-800/80 p-4 rounded-2xl border border-pink-500/20 flex flex-col gap-1.5 shadow-2xs">
              <h4 className="font-extrabold text-xs text-slate-950 dark:text-white">{c.title}</h4>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
          <HelpCircle className="w-4 h-4 text-pink-500" />
          <span>{t('about_faq')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-surface p-5 rounded-3xl flex flex-col gap-2 border border-pink-500/25 hover:border-pink-500/50 shadow-xs">
              <h3 className="font-extrabold text-xs text-slate-950 dark:text-white">{faq.q}</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Official NewJeans Media & Streaming Platforms */}
      <section className="glass-surface p-6 sm:p-8 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md text-center flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tight">
            Official NewJeans Media & Streaming Platforms
          </h3>
          <p className="text-xs text-slate-700 dark:text-zinc-300 max-w-md font-medium">
            Follow NewJeans across official social media, community channels, and music streaming services.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 max-w-3xl">
          <a
            href="https://newjeans.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Official Website (newjeans.kr)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {[
            { name: 'Weverse Official', url: 'https://weverse.io/newjeansofficial/highlight' },
            { name: 'Instagram', url: 'https://www.instagram.com/newjeans_official/' },
            { name: 'X (Twitter)', url: 'https://x.com/NewJeans_ADOR' },
            { name: 'Facebook', url: 'https://www.facebook.com/official.newjeans' },
            { name: 'YouTube', url: 'https://www.youtube.com/c/NewJeans_official' },
            { name: 'TikTok', url: 'https://www.tiktok.com/@newjeans_official' },
            { name: 'Spotify', url: 'https://open.spotify.com/artist/6HvZYsbFfjnjFrWF950C9d' },
            { name: 'Apple Music', url: 'https://music.apple.com/id/artist/newjeans/1635469693?l=id' }
          ].map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-pink-50 dark:hover:bg-pink-500/20 border border-pink-500/25 hover:border-pink-500 text-slate-950 dark:text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>{item.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
            </a>
          ))}
        </div>
      </section>

      {/* 8. Developer & HavenGPT AI Project Portal */}
      <section className="glass-surface p-6 sm:p-8 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md text-center flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tight">
            Developer & AI Chatbot Portal
          </h3>
          <p className="text-xs text-slate-700 dark:text-zinc-300 max-w-md font-medium">
            Developed by <strong>Andrian Baros</strong>. Access general AI Chatbot features at HavenGPT.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <a
            href="https://github.com/andrianbaros"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-pink-50 dark:hover:bg-pink-500/20 border border-pink-500/25 hover:border-pink-500 text-slate-950 dark:text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>GitHub (@andrianbaros)</span>
            <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
          </a>

          <a
            href="https://havengpt.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>HavenGPT Chatbot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
