import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Quote, Music, Image as ImageIcon, ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import albumsData from '../data/json/albums.json';
import galleryData from '../data/json/gallery.json';
import musicData from '../data/json/music.json';
import { useAudio } from '../contexts/AudioContext';

export default function Home() {
  const { t } = useTranslation();
  const { playSongById } = useAudio();

  const heroImages = [
    { src: '/assets/Ditto era.jpg', title: 'Ditto Era' },
    { src: '/assets/getup.jpg', title: 'Get Up EP' },
    { src: '/assets/how sweet shoot.jpg', title: 'How Sweet Single' },
    { src: '/assets/summerofnewjeans22072026.jpg', title: 'Summer of NewJeans 2026 (Part 1)' },
    { src: '/assets/summerofnewjeans22072026(2).jpg', title: 'Summer of NewJeans 2026 (Part 2)' }
  ];

  const quotes = [
    { text: "Jeans are a timeless fashion item you never get tired of wearing. We want NewJeans to be just like that.", author: "Minji" },
    { text: "We want to bring music that feels like a comfortable breeze on a warm summer afternoon.", author: "Hanni" },
    { text: "Bunnies give us so much love and inspiration every single day.", author: "Haerin" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const activeMembers = membersData.filter((m) => m.status === 'Active');
  const featuredAlbum = albumsData[0] || {};
  const wallpaperOfDay = galleryData[0] || { image: '/assets/Ditto era.jpg', title: 'Group Concept Photo' };

  return (
    <div className="flex flex-col gap-8 sm:gap-12 py-4 px-4 max-w-6xl mx-auto z-10 relative">
      {/* 1. Hero Carousel (iPhone Frost Glass Style) */}
      <section className="p-6 sm:p-12 rounded-3xl text-center flex flex-col items-center gap-4 sm:gap-5 border border-pink-500/25 hover:border-pink-500/50 transition-all relative overflow-hidden min-h-[360px] sm:min-h-[440px] justify-center group glass-surface shadow-md">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={heroImages[currentSlide].src}
              alt={heroImages[currentSlide].title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-[1px]" />
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 dark:bg-black/60 text-slate-800 dark:text-white border border-pink-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 dark:bg-black/60 text-slate-800 dark:text-white border border-pink-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/80 dark:bg-black/80 px-3 py-1.5 rounded-full border border-pink-500/30">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-5 bg-pink-500' : 'w-1.5 bg-white/50 hover:bg-white/90'
              }`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase z-10 backdrop-blur-xs shadow-2xs"
        >
          <span>{t('hero_tag')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-hero font-black tracking-tight text-slate-950 dark:text-white z-10 drop-shadow-sm"
        >
          {t('hero_title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-900 dark:text-zinc-100 max-w-xl leading-relaxed z-10 font-bold drop-shadow-2xs"
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mt-2 z-10"
        >
          <Link
            to="/members"
            className="px-6 py-3 rounded-full bg-pink-500 text-white font-extrabold text-xs tracking-wider shadow-sm hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <span>{t('btn_explore')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/universe"
            className="px-6 py-3 rounded-full bg-white/80 dark:bg-zinc-800/80 text-slate-950 dark:text-white font-extrabold text-xs tracking-wider border border-pink-500/30 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/20 transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>{t('btn_calc_affinity')}</span>
          </Link>
        </motion.div>
      </section>

      {/* 2. Quote of the Day */}
      <section className="p-6 sm:p-8 rounded-3xl text-center flex flex-col items-center gap-3 border border-pink-500/25 hover:border-pink-500/50 glass-surface shadow-sm transition-all">
        <Quote className="w-6 h-6 text-pink-500 opacity-90" />
        <p className="text-sm sm:text-base italic text-slate-950 dark:text-gray-100 font-serif max-w-2xl leading-relaxed font-bold">
          "{quotes[0].text}"
        </p>
        <span className="text-xs font-black text-pink-600 dark:text-pink-400 tracking-wider uppercase">— {quotes[0].author} (NewJeans)</span>
      </section>

      {/* 3. Active Members */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
          <h2 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
            {t('home_active_members')}
          </h2>
          <Link to="/members" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1">
            <span>{t('home_view_all')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeMembers.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              className="p-5 rounded-3xl flex flex-col items-center text-center gap-3 border border-pink-500/25 hover:border-pink-500/60 transition-all hover:-translate-y-1 group glass-surface shadow-xs"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500/30 p-1 group-hover:border-pink-500 transition-colors shadow-xs">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-950 dark:text-white">{member.name}</h3>
                <span className="text-[11px] text-pink-600 dark:text-pink-400 font-extrabold">{member.koreanName}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-1 font-medium">{member.position}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Album */}
      <section className="p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-pink-500/25 hover:border-pink-500/50 glass-surface shadow-sm">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-pink-500/30">
          <img src={featuredAlbum.cover} alt={featuredAlbum.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2.5 text-center sm:text-left">
          <span className="px-3 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-black tracking-wider uppercase w-fit mx-auto sm:mx-0 border border-pink-500/20">
            {t('home_featured_disc')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">{featuredAlbum.title}</h2>
          <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed max-w-lg font-medium">
            {featuredAlbum.concept} — Released {featuredAlbum.releaseDate}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
            <Link
              to="/discography"
              className="px-5 py-2 rounded-full bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition-colors shadow-xs"
            >
              {t('home_explore_ep')}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Wallpaper + Audio */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 sm:p-6 rounded-3xl flex flex-col gap-4 border border-pink-500/25 hover:border-pink-500/50 glass-surface shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-500" />
              <span>{t('home_wallpaper')}</span>
            </h3>
            <Link to="/gallery" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline">{t('nav_gallery')} →</Link>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xs border border-pink-500/20">
            <img src={wallpaperOfDay.image} alt={wallpaperOfDay.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 flex items-end p-3.5">
              <span className="text-xs font-bold text-white">{wallpaperOfDay.title}</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl flex flex-col gap-4 border border-pink-500/25 hover:border-pink-500/50 glass-surface shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-500" />
              <span>{t('home_top_audio')}</span>
            </h3>
            <Link to="/discography" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline">{t('home_all_songs')} →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {musicData.slice(0, 3).map((track) => (
              <div
                key={track.id}
                onClick={() => playSongById(track.id)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/80 dark:bg-zinc-800/80 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all cursor-pointer border border-pink-500/20"
              >
                <div className="flex items-center gap-3">
                  <img src={track.cover} alt={track.title} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-950 dark:text-white">{track.title}</h4>
                    <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium">{track.album}</span>
                  </div>
                </div>
                <button className="p-1.5 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
