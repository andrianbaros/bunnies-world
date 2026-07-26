import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Download, X, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import galleryData from '../data/json/gallery.json';
import { useSettings } from '../contexts/SettingsContext';

export default function Gallery() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { settings, toggleFavorite, addRecentlyViewed, showToast } = useSettings();

  const categories = ['All', 'Photocard', 'Selfie', 'Concept Photo', 'Behind The Scenes', 'Fan Art', 'Magazine', 'Performance'];

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  const filteredItems = galleryData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openLightbox = (item) => {
    setSelectedImage(item);
    addRecentlyViewed('gallery', item);
  };

  const generateFramedPolaroid = (item) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = item.image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const cardWidth = 1000;
        const cardHeight = 1350;
        canvas.width = cardWidth;
        canvas.height = cardHeight;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, cardWidth, cardHeight);

        ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, cardWidth - 10, cardHeight - 10);

        const photoMargin = 60;
        const photoWidth = cardWidth - photoMargin * 2;
        const photoHeight = 960;

        // Calculate aspect ratio crop to mimic object-fit: cover and prevent image stretching
        const imgRatio = img.width / img.height;
        const targetRatio = photoWidth / photoHeight;

        let srcX = 0;
        let srcY = 0;
        let srcWidth = img.width;
        let srcHeight = img.height;

        if (imgRatio > targetRatio) {
          srcWidth = img.height * targetRatio;
          srcX = (img.width - srcWidth) / 2;
        } else {
          srcHeight = img.width / targetRatio;
          srcY = (img.height - srcHeight) / 2;
        }

        ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, photoMargin, photoMargin, photoWidth, photoHeight);

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText((item.category || 'NEWJEANS').toUpperCase(), photoMargin, 1100);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(item.title, photoMargin, 1160);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 28px sans-serif';
        ctx.fillText(item.date || 'NewJeans Era', photoMargin, 1210);

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('BUNNIES WORLD OFFICIAL', cardWidth - photoMargin, 1210);

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleDownloadFrame = async () => {
    if (!selectedImage) return;
    try {
      setIsDownloading(true);
      showToast('info', 'Generating framed polaroid...');

      const dataUrl = await generateFramedPolaroid(selectedImage);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${selectedImage.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_polaroid.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('success', 'Framed polaroid downloaded!');
    } catch (err) {
      console.error('Download frame error:', err);
      showToast('info', 'Downloading raw image fallback...');
      const link = document.createElement('a');
      link.href = selectedImage.image;
      link.download = `${selectedImage.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Hero Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('gallery_tag')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('gallery_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('gallery_sub')}
        </p>
      </div>

      {/* Search & Filter Bar (iPhone Frost Glass) */}
      <div className="glass-surface p-4 sm:p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-pink-500/20 focus-within:border-pink-500 flex-grow max-w-md shadow-2xs transition-colors">
          <Search className="w-4 h-4 text-pink-500" />
          <input
            type="text"
            placeholder={t('gallery_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none w-full"
          />
        </div>
        <div className="flex justify-center flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-pink-500 border border-pink-500/20'
              }`}
            >
              {cat === 'All' ? t('gallery_cat_all') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Polaroid Grid */}
      {filteredItems.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, idx) => {
            const isFav = settings.favorites?.gallery?.some((g) => (g.id && item.id ? g.id === item.id : g.title === item.title));
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => openLightbox(item)}
                className="glass-surface p-4.5 rounded-3xl shadow-md border border-pink-500/25 hover:border-pink-500/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 group cursor-pointer break-inside-avoid"
              >
                <div className="aspect-square rounded-2xl overflow-hidden relative border border-pink-500/20 shadow-xs">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite('gallery', item); }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-black/60 text-white hover:bg-pink-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col text-left px-1">
                  <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-extrabold text-sm text-slate-950 dark:text-white leading-snug">{item.title}</h3>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold mt-0.5">{item.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-surface p-12 rounded-3xl text-center flex flex-col items-center gap-3 border border-pink-500/25 shadow-md">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">{t('gallery_no_photo')}</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-bold">{t('gallery_no_photo_sub')}</p>
          <button
            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
            className="px-5 py-2.5 rounded-full bg-pink-500 text-white text-xs font-extrabold shadow-xs cursor-pointer"
          >
            {t('gallery_reset')}
          </button>
        </div>
      )}

      {/* Portal-rendered Lightbox Modal */}
      {selectedImage &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-xl w-full z-10 flex flex-col gap-4 my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Rendered Polaroid Card */}
              <div className="bg-white text-gray-900 p-5 sm:p-6 rounded-3xl shadow-2xl flex flex-col gap-4 border-4 border-pink-500/30">
                <div className="w-full max-h-[55vh] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain max-h-[55vh] rounded-2xl"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] font-black text-pink-600 uppercase tracking-wider">{selectedImage.category}</span>
                    <h3 className="text-lg font-black text-gray-900 leading-snug">{selectedImage.title}</h3>
                    <span className="text-xs text-gray-500 font-bold">{selectedImage.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-pink-500 tracking-widest block uppercase">BUNNIES WORLD</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between glass-surface p-4 rounded-3xl border border-pink-500/30 shadow-xl">
                {(() => {
                  const isModalFav = settings.favorites?.gallery?.some((g) =>
                    g.id && selectedImage.id ? g.id === selectedImage.id : g.title === selectedImage.title
                  );
                  return (
                    <button
                      onClick={() => toggleFavorite('gallery', selectedImage)}
                      className={`px-4 py-2.5 rounded-full font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer border border-pink-500/20 ${
                        isModalFav
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-950 dark:text-white hover:bg-pink-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isModalFav ? 'fill-current text-white' : ''}`} />
                      <span>{isModalFav ? 'Bookmarked ❤️' : 'Bookmark'}</span>
                    </button>
                  );
                })()}

                <button
                  onClick={handleDownloadFrame}
                  disabled={isDownloading}
                  className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-extrabold text-xs flex items-center gap-2 hover:bg-pink-600 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isDownloading ? 'Generating...' : `${t('gallery_download')} Full Frame`}</span>
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}
