import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, HelpCircle, ShieldCheck, Globe, Mail, MessageCircle, Code, Star, CheckCircle, BookOpen, Scale } from 'lucide-react';
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
      era: '2026–Present: 4-Member Active Re-Activation',
      desc: 'NewJeans continues activities as a 4-member active lineup (Minji, Hanni, Haerin, Hyein) launching the "2026 Summer of NewJeans" campaign.'
    }
  ];

  const controversies = [
    {
      title: '"Bubble Gum" Copyright Claim',
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
    <div className="flex flex-col gap-10 sm:gap-14 py-6 sm:py-8 px-4 max-w-5xl mx-auto z-10 relative">
      {/* 1. Hero Section */}
      <section className="text-center flex flex-col items-center gap-4 relative rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img src="/assets/fanart collage.png" alt="Fanart Collage" className="w-full h-full object-cover opacity-20 filter blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14] via-[#0d0b14]/80 to-transparent" />
        </div>

        <span className="px-4 py-1 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300 text-xs font-bold tracking-widest uppercase z-10">
          ENCYCLOPEDIA & DIGITAL SANCTUARY
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent z-10">
          NEWJEANS (NJZ) ENCYCLOPEDIA
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed z-10">
          Official history, group naming philosophy, active membership, former member archives, and complete career milestones.
        </p>
      </section>

      {/* 2. Group Identity & Naming Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        <div className="glass-surface-pink p-6 sm:p-8 rounded-3xl border border-pink-300/30 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-300 flex-shrink-0" />
              <span>Naming Philosophy</span>
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong>NewJeans</strong> carries a dual meaning: jeans are timeless everyday wear that people never tire of wearing, symbolizing an everlasting artistic image. It is also a play on <em>"new genes"</em>—signifying a new era in global pop.
            </p>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-[11px] text-gray-400">
            <strong>Hangul:</strong> 뉴진스 | <strong>Alternative:</strong> NJZ | <strong>Label:</strong> ADOR / Hybe Corporation
          </div>
        </div>

        <div className="glass-surface-blue p-6 sm:p-8 rounded-3xl border border-cyan-300/30 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-cyan-300 flex-shrink-0" />
              <span>Membership Structure</span>
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              NewJeans operates organically without an official leader. The active lineup comprises <strong>Minji, Hanni, Haerin, and Hyein</strong>. Danielle is archived as a Former Member.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold border border-cyan-300/30">Minji (Bear 🐻)</span>
            <span className="px-3 py-1 rounded-full bg-pink-400/20 text-pink-300 text-xs font-bold border border-pink-300/30">Hanni (Bunny 🐰)</span>
            <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-xs font-bold border border-purple-300/30">Haerin (Cat 🐱)</span>
            <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-bold border border-green-300/30">Hyein (Chick 🐥)</span>
          </div>
        </div>
      </section>

      {/* 3. History & Milestones */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 flex-shrink-0" />
          <span>FULL CAREER CHRONOLOGY</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {historyMilestones.map((m, idx) => (
            <div key={idx} className="glass-surface p-5 sm:p-6 rounded-3xl flex flex-col gap-2 border border-white/10">
              <span className="text-xs font-extrabold text-pink-300 uppercase tracking-wider">{m.era}</span>
              <p className="text-xs text-gray-300 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Music & Copyright Records */}
      <section className="glass-surface p-6 sm:p-8 rounded-3xl flex flex-col gap-6 border border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Music Production & Industry Records</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {controversies.map((c, i) => (
            <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
              <h4 className="font-extrabold text-xs text-yellow-300">{c.title}</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 flex-shrink-0" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-surface p-5 sm:p-6 rounded-3xl flex flex-col gap-2 border border-white/10">
              <h3 className="font-bold text-xs sm:text-sm text-white">{faq.q}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. External Links & Weverse */}
      <section className="glass-surface-pink p-6 sm:p-8 rounded-3xl text-center flex flex-col items-center gap-3 border border-pink-300/30">
        <h3 className="text-lg sm:text-xl font-extrabold text-white">Official NewJeans & Bunnies Portal</h3>
        <p className="text-xs text-gray-300 max-w-md">Updated regularly from official press releases & global encyclopedia data.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <a href="https://newjeans.kr" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs hover:scale-105 transition-transform">
            Official Website (newjeans.kr)
          </a>
          <a href="https://weverse.io/newjeans" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-black/40 border border-white/20 text-white font-bold text-xs hover:scale-105 transition-transform">
            Official Weverse Community
          </a>
        </div>
      </section>
    </div>
  );
}
