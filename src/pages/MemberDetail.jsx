import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowLeft, ArrowRight, Sparkles, Music, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import { useSettings } from '../contexts/SettingsContext';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings, toggleFavorite, addRecentlyViewed } = useSettings();

  const currentIdx = membersData.findIndex((m) => m.id === id);
  const member = membersData[currentIdx] || membersData[0];

  const prevMember = membersData[(currentIdx - 1 + membersData.length) % membersData.length];
  const nextMember = membersData[(currentIdx + 1) % membersData.length];

  const isFav = settings.favorites?.members?.some((m) => m.id === member.id);
  const isFormer = member.status === 'former';

  // Slideshow active image index state
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const galleryImages = member.gallery && member.gallery.length > 0 ? member.gallery : [member.image];

  // Reset active image index when member changes
  useEffect(() => {
    setActiveImageIdx(0);
    if (member) {
      addRecentlyViewed('members', member);
    }
  }, [id]);

  // Slideshow auto-play (switch photo every 4 seconds)
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `NewJeans ${member.name}`,
        text: member.bio,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(`Copied profile link for ${member.name}!`);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-5xl mx-auto z-10 relative">
      {/* Top Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-pink-300 transition-colors glass-surface px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('member_back')}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite('members', member)}
            className={`p-2.5 rounded-full border transition-all ${
              isFav
                ? 'bg-pink-400/20 border-pink-300 text-pink-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-300' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Former Member Archive Disclaimer Alert */}
      {isFormer && (
        <div className="glass-surface p-4 rounded-2xl border border-yellow-400/40 bg-yellow-400/10 flex items-center gap-3 text-yellow-300 text-xs font-bold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>
            {t('member_archive_notice')}
          </span>
        </div>
      )}

      {/* Main Profile Showcase Card */}
      <motion.div
        key={member.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-surface-pink p-6 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-pink-300/30"
      >
        {/* Interactive Slideshow Photo Column */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-pink-300/40 shadow-2xl group">
            {/* Animated Photo Transition */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={galleryImages[activeImageIdx]}
                alt={`${member.name} photo ${activeImageIdx + 1}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Animal Representation Badge */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-300 flex items-center gap-1.5 border border-pink-300/30 z-10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{member.animalRepresentation}</span>
            </div>

            {/* Former Member Badge */}
            {isFormer && (
              <div className="absolute top-4 right-4 bg-yellow-400/90 text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider z-10">
                Former Member
              </div>
            )}

            {/* Prev / Next Controls over Main Image */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-pink-400 transition-all z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-pink-400 transition-all z-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Clickable Gallery Thumbnails / Dots */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto p-1 max-w-full">
              {galleryImages.map((imgSrc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === i
                      ? 'border-pink-300 scale-110 shadow-[0_0_12px_rgba(255,166,207,0.8)]'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgSrc} alt={`${member.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-black text-white">{member.name}</h1>
              <span className="text-2xl text-pink-300 font-extrabold">{member.koreanName}</span>
            </div>
            <p className="text-xs text-purple-300 font-bold mt-1 tracking-wider uppercase">{member.position}</p>
          </div>

          {/* Quote Block */}
          <blockquote className="bg-black/30 p-4 rounded-2xl border-l-4 border-pink-300 text-xs italic text-gray-200">
            "{member.quote}"
          </blockquote>

          {/* Biography Text */}
          <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
            {member.bio}
          </p>

          {/* Biodata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 block font-bold">{t('member_full_name')}</span>
              <span className="text-xs font-bold text-white truncate block">{member.fullName}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 block font-bold">{t('member_birth')}</span>
              <span className="text-xs font-bold text-white block">{member.birthDate}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 block font-bold">{t('member_nationality')}</span>
              <span className="text-xs font-bold text-cyan-300 block">{member.nationality}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 block font-bold">MBTI</span>
              <span className="text-xs font-bold text-purple-300 block">{member.mbti}</span>
            </div>
            <div className="col-span-2 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 block font-bold">Signature</span>
              <span className="text-xs font-bold text-pink-300 block">{member.signature}</span>
            </div>
          </div>

          {/* Favorite Songs Tag */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t('member_fav_songs')}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {member.favoriteSongs?.map((song, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
                  {song}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prev / Next Member Navigation */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <Link
          to={`/members/${prevMember.id}`}
          className="flex items-center gap-3 glass-surface px-5 py-3 rounded-2xl hover:border-pink-300/40 transition-all text-left"
        >
          <ArrowLeft className="w-5 h-5 text-pink-300" />
          <div>
            <span className="text-[10px] text-gray-400 block font-bold">{t('member_prev')}</span>
            <span className="text-xs font-extrabold text-white">{prevMember.name}</span>
          </div>
        </Link>

        <Link
          to={`/members/${nextMember.id}`}
          className="flex items-center gap-3 glass-surface px-5 py-3 rounded-2xl hover:border-pink-300/40 transition-all text-right"
        >
          <div>
            <span className="text-[10px] text-gray-400 block font-bold">{t('member_next')}</span>
            <span className="text-xs font-extrabold text-white">{nextMember.name}</span>
          </div>
          <ArrowRight className="w-5 h-5 text-pink-300" />
        </Link>
      </div>
    </div>
  );
}
