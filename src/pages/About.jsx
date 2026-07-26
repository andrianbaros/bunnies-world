import React from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Globe,
  BookOpen,
  Scale,
  ExternalLink,
  Code,
  Sparkles,
  Share2,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Music,
  Headphones,
  Video,
  User,
  Radio
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const officialSNSLinks = [
    {
      name: 'Weverse Highlight',
      url: 'https://weverse.io/newjeansofficial/highlight',
      handle: 'Official Community',
      color: 'from-emerald-500/15 to-teal-500/5 border-emerald-500/30 text-emerald-500 dark:text-emerald-400',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/newjeans_official/',
      handle: '@newjeans_official',
      color: 'from-pink-500/15 to-rose-500/5 border-pink-500/30 text-pink-500 dark:text-pink-400',
      icon: <Instagram className="w-4 h-4 text-pink-500" />
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/NewJeans_ADOR',
      handle: '@NewJeans_ADOR',
      color: 'from-sky-500/15 to-blue-500/5 border-sky-500/30 text-sky-500 dark:text-sky-400',
      icon: <Twitter className="w-4 h-4 text-sky-400" />
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/official.newjeans',
      handle: '@official.newjeans',
      color: 'from-blue-600/15 to-indigo-600/5 border-blue-500/30 text-blue-500 dark:text-blue-400',
      icon: <Facebook className="w-4 h-4 text-blue-500" />
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@newjeans_official',
      handle: '@newjeans_official',
      color: 'from-purple-500/15 to-pink-500/5 border-purple-500/30 text-purple-500 dark:text-purple-400',
      icon: <Video className="w-4 h-4 text-purple-400" />
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/c/NewJeans_official',
      handle: '@NewJeans_official',
      color: 'from-red-500/15 to-rose-600/5 border-red-500/30 text-red-500 dark:text-red-400',
      icon: <Youtube className="w-4 h-4 text-red-500" />
    },
    {
      name: 'Spotify',
      url: 'https://open.spotify.com/artist/6HvZYsbFfjnjFrWF950C9d',
      handle: 'NewJeans Official',
      color: 'from-green-500/15 to-emerald-600/5 border-green-500/30 text-green-500 dark:text-green-400',
      icon: <Headphones className="w-4 h-4 text-emerald-500" />
    },
    {
      name: 'Apple Music',
      url: 'https://music.apple.com/id/artist/newjeans/1635469693?l=id',
      handle: 'NewJeans on Apple',
      color: 'from-rose-500/15 to-red-500/5 border-rose-500/30 text-rose-500 dark:text-rose-400',
      icon: <Music className="w-4 h-4 text-rose-500" />
    },
    {
      name: 'Official Website',
      url: 'https://newjeans.kr',
      handle: 'newjeans.kr',
      color: 'from-indigo-500/15 to-purple-500/5 border-indigo-500/30 text-indigo-500 dark:text-indigo-400',
      icon: <Globe className="w-4 h-4 text-indigo-400" />
    }
  ];

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
        <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
          {t('about_sub')}
        </p>
      </div>

      {/* 2. About Bunnies World Web Portal with Official Logo */}
      <section className="glass-surface p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[var(--bg-subtle)] p-3.5 rounded-2xl border border-[var(--border-color)] flex items-center justify-center shadow-xs">
          <img src="/assets/logo.png" alt="Bunnies World Official Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col gap-2.5 text-center md:text-left">
          <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">
            OFFICIAL FAN PLATFORM
          </span>
          <h2 className="text-xl font-black text-[var(--text-heading)] uppercase tracking-wider">
            {t('about_portal_title')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('about_portal_desc')}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[11px] font-semibold border border-[var(--border-color)]">
              Version 2.5 Pro
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[11px] font-semibold border border-[var(--border-color)]">
              Live Audio Previews
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[11px] font-semibold border border-[var(--border-color)]">
              Supabase Realtime
            </span>
          </div>
        </div>
      </section>

      {/* Official NewJeans SNS & Streaming Platforms */}
      <section className="glass-surface p-6 rounded-2xl border flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
          <Share2 className="w-4 h-4 text-pink-500" />
          <h2 className="text-base font-bold text-[var(--text-heading)] uppercase tracking-wider">
            OFFICIAL NEWJEANS MEDIA & STREAMING
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {officialSNSLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 rounded-xl border bg-gradient-to-r ${item.color} flex items-center justify-between hover:scale-[1.02] transition-all group shadow-2xs`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bg-card)]/60 border border-[var(--border-color)] flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-[var(--text-heading)]">{item.name}</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">{item.handle}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-heading)] transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* Developer & HavenGPT AI Project Section */}
      <section className="glass-surface p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-heading)] uppercase tracking-wider">DEVELOPER & AI CHATBOT PORTAL</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Developed by <strong className="text-[var(--text-heading)]">Andrian Baros</strong>. For general AI Chatbot inquiries, visit HavenGPT!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
          <a
            href="https://github.com/andrianbaros"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-heading)] text-xs font-bold hover:border-pink-500 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Code className="w-4 h-4 text-pink-500" />
            <span>GitHub (@andrianbaros)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://havengpt.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>HavenGPT Chatbot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 3. Group Identity & Naming Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="glass-surface p-6 rounded-2xl border flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-[var(--text-heading)] uppercase tracking-wider">
              {t('about_naming')}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('about_naming_desc')}
            </p>
          </div>
          <div className="bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
            <strong>Hangul:</strong> 뉴진스 | <strong>Alternative:</strong> NJZ | <strong>Label:</strong> ADOR / Hybe Corporation
          </div>
        </div>

        <div className="glass-surface p-6 rounded-2xl border flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-[var(--text-heading)] uppercase tracking-wider">
              {t('about_membership')}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
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
        <h2 className="text-base font-bold text-[var(--text-heading)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
          <BookOpen className="w-4 h-4 text-pink-500" />
          <span>{t('about_chronology')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {historyMilestones.map((m, idx) => (
            <div key={idx} className="glass-surface p-5 rounded-2xl flex flex-col gap-2 border">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">{m.era}</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Music & Copyright Records */}
      <section className="glass-surface p-6 rounded-2xl flex flex-col gap-5 border">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
          <Scale className="w-4 h-4 text-pink-500" />
          <h2 className="text-base font-bold text-[var(--text-heading)] uppercase tracking-wider">{t('about_records')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {controversies.map((c, i) => (
            <div key={i} className="bg-[var(--bg-subtle)] p-4 rounded-xl border border-[var(--border-color)] flex flex-col gap-1.5">
              <h4 className="font-bold text-xs text-[var(--text-heading)]">{c.title}</h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-bold text-[var(--text-heading)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
          <HelpCircle className="w-4 h-4 text-pink-500" />
          <span>{t('about_faq')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-surface p-5 rounded-2xl flex flex-col gap-2 border">
              <h3 className="font-bold text-xs text-[var(--text-heading)]">{faq.q}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. External Links & Weverse */}
      <section className="glass-surface p-6 sm:p-8 rounded-2xl text-center flex flex-col items-center gap-3 border">
        <h3 className="text-lg font-extrabold text-[var(--text-heading)]">{t('about_portal')}</h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-md">{t('about_portal_sub')}</p>
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
            href="https://weverse.io/newjeansofficial/highlight"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-heading)] font-semibold text-xs hover:bg-[var(--bg-subtle-hover)] transition-colors flex items-center gap-1.5"
          >
            <span>Weverse Official</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
