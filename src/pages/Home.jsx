import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Disc, Heart, ArrowRight, Quote, Music, Image as ImageIcon, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import albumsData from '../data/json/albums.json';
import galleryData from '../data/json/gallery.json';
import musicData from '../data/json/music.json';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';

export default function Home() {
  const { t } = useTranslation();
  const { playSongById } = useAudio();
  const { settings } = useSettings();

  const heroImages = [
    { src: '/assets/Ditto era.jpg', title: 'Ditto Era' },
    { src: '/assets/getup.jpg', title: 'Get Up EP' },
    { src: '/assets/how sweet shoot.jpg', title: 'How Sweet Single' },
    { src: '/assets/fanart collage.png', title: 'Bunnies Fanart Collage' },
    { src: '/assets/supershy power puff.jpg', title: 'Super Shy Powerpuff Girls' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play hero slideshow every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const activeMembers = membersData.filter((m) => m.status === 'active');
  const featuredAlbum = albumsData[2] || albumsData[0]; // Get Up EP
  const wallpaperOfDay = galleryData.find(g => g.image.includes('supershy')) || galleryData[0];
  const communityPosts = settings.communityPosts || [];

  const quotes = [
    { text: "I want NewJeans to be like a pair of classic jeans that you never get tired of wearing.", author: "Minji" },
    { text: "Music is our way of telling honest stories that stay with people forever.", author: "Hanni" },
    { text: "Every melody we sing is a gift filled with all our heart for our Bunnies.", author: "Hyein" }
  ];

  return (
    <div className="flex flex-col gap-16 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* 1. Fullscreen Hero Section with Interactive Auto Slideshow */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 relative my-auto rounded-3xl p-8 overflow-hidden shadow-2xl group">
        {/* Background Slideshow Overlay with AnimatePresence */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={heroImages[currentSlide].src}
              alt={heroImages[currentSlide].title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover filter blur-[1px]"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14] via-[#0d0b14]/75 to-transparent" />
        </div>

        {/* Hero Manual Controls (Chevron Chevrons) */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 text-white/80 hover:text-white border border-white/10 hover:border-pink-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
          title="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 text-white/80 hover:text-white border border-white/10 hover:border-pink-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
          title="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slideshow Indicators Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-6 bg-pink-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-surface-pink text-pink-300 text-xs font-extrabold tracking-widest border border-pink-300/30 z-10"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('hero_tag')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-hero font-black tracking-widest bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl z-10"
        >
          {t('hero_title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-body-custom text-gray-300 max-w-xl leading-relaxed z-10"
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-4 z-10"
        >
          <Link
            to="/members"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-extrabold text-xs tracking-wider shadow-lg hover:shadow-pink-400/50 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>{t('btn_explore')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/universe"
            className="px-8 py-3.5 rounded-full glass-surface-blue text-cyan-300 font-extrabold text-xs tracking-wider border border-cyan-300/30 hover:bg-cyan-400/10 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-cyan-300" />
            <span>{t('btn_calc_affinity')}</span>
          </Link>
        </motion.div>
      </section>

      {/* 2. Quote of the Day Section */}
      <section className="glass-surface-pink p-8 rounded-3xl text-center flex flex-col items-center gap-3 border border-pink-300/30">
        <Quote className="w-8 h-8 text-pink-300 opacity-60" />
        <p className="text-base sm:text-lg italic text-white font-serif max-w-2xl">
          "{quotes[0].text}"
        </p>
        <span className="text-xs font-bold text-pink-300 tracking-widest uppercase">— {quotes[0].author} (NewJeans)</span>
      </section>

      {/* 3. Featured Members (Minji, Hanni, Haerin, Hyein) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-300" />
            <span>ACTIVE MEMBERS</span>
          </h2>
          <Link to="/members" className="text-xs font-bold text-pink-300 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeMembers.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              className="glass-surface p-5 rounded-3xl flex flex-col items-center text-center gap-3 border border-white/10 hover:border-pink-300/40 transition-all hover:-translate-y-2 group"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-pink-300/30 p-1 group-hover:border-pink-300 transition-colors shadow-xl">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">{member.name}</h3>
                <span className="text-[10px] text-pink-300 font-bold">{member.koreanName}</span>
              </div>
              <p className="text-[11px] text-gray-300 line-clamp-1">{member.position}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Album Spotlight */}
      <section className="glass-surface-blue p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-8 border border-cyan-300/30">
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-cyan-300/40">
          <img src={featuredAlbum.cover} alt={featuredAlbum.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold tracking-widest uppercase w-fit mx-auto sm:mx-0">
            FEATURED DISCOGRAPHY
          </span>
          <h2 className="text-2xl font-extrabold text-white">{featuredAlbum.title}</h2>
          <p className="text-xs text-gray-300 leading-relaxed max-w-lg">
            Concept: {featuredAlbum.concept}. Released on {featuredAlbum.releaseDate} with hit title tracks.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
            <Link
              to="/discography"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-bold text-xs hover:scale-105 transition-transform"
            >
              Explore EP & Tracklists
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Wallpaper of the Day & Quick Music Player */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-surface p-6 rounded-3xl flex flex-col gap-4 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-300" />
              <span>WALLPAPER OF THE DAY</span>
            </h3>
            <Link to="/gallery" className="text-xs font-bold text-purple-300 hover:underline">Gallery →</Link>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <img src={wallpaperOfDay.image} alt={wallpaperOfDay.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white">{wallpaperOfDay.title}</span>
            </div>
          </div>
        </div>

        <div className="glass-surface p-6 rounded-3xl flex flex-col gap-4 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-300" />
              <span>TOP AUDIO PREVIEWS</span>
            </h3>
            <Link to="/discography" className="text-xs font-bold text-pink-300 hover:underline">All Songs →</Link>
          </div>

          <div className="flex flex-col gap-2">
            {musicData.slice(0, 3).map((track) => (
              <div
                key={track.id}
                onClick={() => playSongById(track.id)}
                className="flex items-center justify-between p-3 rounded-2xl bg-black/30 hover:bg-white/10 transition-all cursor-pointer border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-white">{track.title}</h4>
                    <span className="text-[10px] text-gray-400">{track.album}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-pink-300">Play ▶</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
