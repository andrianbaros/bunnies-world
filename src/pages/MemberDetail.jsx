import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowLeft, ArrowRight, Music, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import { useSettings } from '../contexts/SettingsContext';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings, toggleFavorite, addRecentlyViewed, showToast } = useSettings();

  const currentIdx = membersData.findIndex((m) => m.id === id);
  const member = membersData[currentIdx] || membersData[0];

  const prevMember = membersData[(currentIdx - 1 + membersData.length) % membersData.length];
  const nextMember = membersData[(currentIdx + 1) % membersData.length];

  const isFav = settings.favorites?.members?.some((m) => m.id === member.id);
  const isFormer = member.status === 'former';

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const galleryImages = member.gallery && member.gallery.length > 0 ? member.gallery : [member.image];

  useEffect(() => {
    setActiveImageIdx(0);
    if (member) {
      addRecentlyViewed('members', member);
    }
  }, [id]);

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
    const bioText = t(`member_${member.id}_bio`, { defaultValue: member.bio });
    if (navigator.share) {
      navigator.share({
        title: `NewJeans ${member.name}`,
        text: bioText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('info', `Copied profile link for ${member.name}!`);
    }
  };

  const memberAnimal = t(`member_${member.id}_animal`, { defaultValue: member.animalRepresentation });
  const memberPosition = t(`member_${member.id}_position`, { defaultValue: member.position });
  const memberQuote = t(`member_${member.id}_quote`, { defaultValue: member.quote });
  const memberBio = t(`member_${member.id}_bio`, { defaultValue: member.bio });
  const memberBirth = t(`member_${member.id}_birth`, { defaultValue: member.birthDate });
  const memberNationality = t(`member_${member.id}_nationality`, { defaultValue: member.nationality });
  const memberSignature = t(`member_${member.id}_signature`, { defaultValue: member.signature });
  const signatureLabel = t('member_signature_label', { defaultValue: 'Signature' });

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      {/* Top Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors glass-surface px-4 py-2 rounded-full border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('member_back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite('members', member)}
            className={`p-2.5 rounded-full border transition-colors ${
              isFav
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-pink-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Former Member Disclaimer */}
      {isFormer && (
        <div className="glass-surface p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{t('member_archive_notice')}</span>
        </div>
      )}

      {/* Main Profile Showcase Card */}
      <motion.div
        key={member.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-surface p-6 sm:p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border"
      >
        {/* Photo Column */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-black/10 dark:border-white/15 shadow-md group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={galleryImages[activeImageIdx]}
                alt={`${member.name} photo ${activeImageIdx + 1}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20 z-10">
              <span>{memberAnimal}</span>
            </div>

            {isFormer && (
              <div className="absolute top-3 right-3 bg-amber-500 text-black font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider z-10">
                {t('former_member_badge', { defaultValue: 'ARCHIVE' })}
              </div>
            )}

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-pink-500 transition-all z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-pink-500 transition-all z-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto p-1 max-w-full">
              {galleryImages.map((imgSrc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === i
                      ? 'border-pink-500 scale-105 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgSrc} alt={`${member.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-7 flex flex-col gap-5 text-left">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{member.name}</h1>
              <span className="text-xl text-pink-600 dark:text-pink-400 font-bold">{member.koreanName}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 uppercase tracking-wider">{memberPosition}</p>
          </div>

          {/* Quote Block */}
          <blockquote className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border-l-4 border-pink-500 text-xs italic text-gray-700 dark:text-gray-300">
            "{memberQuote}"
          </blockquote>

          {/* Biography Text */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5">
            {memberBio}
          </p>

          {/* Biodata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">{t('member_full_name')}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white truncate block">{member.fullName}</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">{t('member_birth')}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">{memberBirth}</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">{t('member_nationality')}</span>
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 block">{memberNationality}</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">MBTI</span>
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 block">{member.mbti}</span>
            </div>
            <div className="col-span-2 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">{signatureLabel}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">{memberSignature}</span>
            </div>
          </div>

          {/* Favorite Songs Tag */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-pink-500" />
              <span>{t('member_fav_songs')}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {member.favoriteSongs?.map((song, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-semibold">
                  {song}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prev / Next Member Navigation */}
      <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-6">
        <Link
          to={`/members/${prevMember.id}`}
          className="flex items-center gap-3 glass-surface px-5 py-3 rounded-2xl hover:border-pink-500/30 transition-all text-left"
        >
          <ArrowLeft className="w-4 h-4 text-pink-500" />
          <div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">{t('member_prev')}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{prevMember.name}</span>
          </div>
        </Link>

        <Link
          to={`/members/${nextMember.id}`}
          className="flex items-center gap-3 glass-surface px-5 py-3 rounded-2xl hover:border-pink-500/30 transition-all text-right"
        >
          <div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-semibold">{t('member_next')}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{nextMember.name}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-pink-500" />
        </Link>
      </div>
    </div>
  );
}
