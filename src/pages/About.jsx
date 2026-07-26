import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Heart, ExternalLink, Sparkles, Music, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const historyMilestones = [
    {
      era: "2019–2021: Formation & Beginnings",
      desc: "Preparation began under ADOR to create a fresh, timeless musical vision, bringing together bright talents for a historic debut."
    },
    {
      era: "2022–2023: Debut Phenomenon & Billboard #1",
      desc: "Surprise release of iconic singles 'Attention' and 'Hype Boy'. Followed by historic 13-week Korean #1 'Ditto' and 2nd EP 'Get Up' debuting at #1 on the Billboard 200."
    },
    {
      era: "2024: Tokyo Dome & Global Acclaim",
      desc: "Landmark sold-out 'Bunnies Camp 2024 Tokyo Dome' (90,000+ attendance), along with double single releases 'How Sweet' and Japanese debut 'Supernatural'."
    },
    {
      era: "2025–Present: New Chapter & Global Love",
      desc: "NewJeans continues their artistic journey with global campaigns, inspiring new music, and everlasting love for Bunnies worldwide."
    }
  ];

  const musicPillars = [
    {
      title: "Timeless Sound",
      detail: "Blending Y2K nostalgia, 90s/2000s R&B, UK garage, and jersey club beats into effortless pop melodies that never fade."
    },
    {
      title: "Pure Youth & Warmth",
      detail: "Authentic visual storytelling and natural friendship that capture genuine emotion, warmth, and nostalgic joy."
    },
    {
      title: "Global Unity",
      detail: "Connecting millions of Bunnies around the globe through positive energy, shared passion, and timeless music."
    }
  ];

  const faqs = [
    {
      q: "What is the meaning behind the name NewJeans?",
      a: "Just like a favorite pair of jeans that you never tire of wearing, NewJeans creates timeless music that stays in your heart forever. It is also a play on 'new genes', symbolizing a fresh new generation of pop music."
    },
    {
      q: "What can fans explore on Bunnies World?",
      a: "Stream official song previews, explore member profiles, download photocard scrapbooks, test your Bunny affinity score, and share messages with global fans on the fan wall!"
    },
    {
      q: "How can I support NewJeans officially?",
      a: "Stream official tracks on Spotify and Apple Music, watch music videos on YouTube, and join the official Weverse community."
    }
  ];

  return (
    <div className="flex flex-col gap-8 sm:gap-10 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      {/* 1. Hero Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FAN SANCTUARY & COMMUNITY</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white uppercase tracking-tight">
          ABOUT BUNNIES WORLD
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-xl leading-relaxed font-bold">
          Welcome to the interactive fan sanctuary dedicated to celebrating the music, journey, and magical universe of NewJeans.
        </p>
      </div>

      {/* 2. Portal Overview Card */}
      <section className="glass-surface p-6 sm:p-8 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-100 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-pink-500/20 flex items-center justify-center shadow-xs">
          <img src="/assets/logo.png" alt="Bunnies World Official Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col gap-2.5 text-center md:text-left">
          <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
            <Heart className="w-3 h-3 fill-current" />
            <span>OFFICIAL FAN SANCTUARY</span>
          </span>
          <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-wider">
            A DIGITAL HOME FOR GLOBAL BUNNIES
          </h2>
          <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
            Bunnies World is a warm, interactive universe built for fans of NewJeans worldwide. Stream official song previews, explore detailed member profiles, download photocard scrapbooks, share love on the global fan wall, and celebrate the music that brings us together.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] font-bold border border-pink-500/25">
              ✨ Music Previews
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] font-bold border border-pink-500/25">
              💌 Global Fan Wall
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] font-bold border border-pink-500/25">
              📸 Photocard Scrapbook
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] font-bold border border-pink-500/25">
              🐰 Member Profiles
            </span>
          </div>
        </div>
      </section>

      {/* 3. Group Identity & Naming Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="glass-surface p-6 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-pink-500" />
              <span>Naming Philosophy</span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              NewJeans carries a dual meaning: just like a favorite pair of jeans that you never tire of wearing, NewJeans' music is timeless, comfortable, and everlasting. It is also a play on "new genes"—symbolizing a fresh new generation of pop music.
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-pink-500/20 text-[11px] text-slate-700 dark:text-zinc-300 font-semibold">
            <strong className="text-pink-600 dark:text-pink-400">Hangul:</strong> 뉴진스 | <strong className="text-pink-600 dark:text-pink-400">Fandom:</strong> Bunnies (Tokki / 토끼)
          </div>
        </div>

        <div className="glass-surface p-6 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Group Harmony</span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              NewJeans creates music with organic harmony, warmth, and shared creative energy. The active lineup comprises Minji, Hanni, Haerin, and Hyein, alongside honoring every chapter of the group's journey with Bunnies around the world.
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

      {/* 4. Career Chronology & Milestones */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
          <BookOpen className="w-4 h-4 text-pink-500" />
          <span>JOURNEY & MILESTONES</span>
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

      {/* 5. Music Philosophy (Replaced Controversies Section) */}
      <section className="glass-surface p-6 rounded-3xl flex flex-col gap-5 border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2">
          <Music className="w-4 h-4 text-pink-500" />
          <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider">WHAT MAKES NEWJEANS SPECIAL</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {musicPillars.map((pillar, i) => (
            <div key={i} className="bg-slate-100 dark:bg-zinc-800/80 p-4 rounded-2xl border border-pink-500/20 flex flex-col gap-1.5 shadow-2xs">
              <h4 className="font-extrabold text-xs text-slate-950 dark:text-white">{pillar.title}</h4>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{pillar.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="flex flex-col gap-5">
        <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
          <HelpCircle className="w-4 h-4 text-pink-500" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
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
    </div>
  );
}
