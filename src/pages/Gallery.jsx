import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Download, X, Loader2 } from 'lucide-react';
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

  const categories = ['All', 'Photocard', 'Concept Photo', 'Behind The Scenes', 'Fan Art', 'Magazine', 'Performance'];

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
      link.download = `${selectedImage.title}.jpg`;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  // Pure Canvas API HD Framed Polaroid Generator
  const generateFramedPolaroid = (item) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1040;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Draw outer Polaroid card background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, width, height, 32);
      } else {
        ctx.rect(0, 0, width, height);
      }
      ctx.fill();

      // Outer border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 4;
      ctx.stroke();

      // 2. Load Image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const imgX = 40;
        const imgY = 40;
        const imgW = 720;
        const imgH = 720;

        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(imgX, imgY, imgW, imgH, 24);
        } else {
          ctx.rect(imgX, imgY, imgW, imgH);
        }
        ctx.clip();

        // Aspect ratio cover fill calculation
        const imgAspect = img.width / img.height;
        const boxAspect = imgW / imgH;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > boxAspect) {
          drawH = imgH;
          drawW = imgH * imgAspect;
          drawX = imgX - (drawW - imgW) / 2;
          drawY = imgY;
        } else {
          drawW = imgW;
          drawH = imgW / imgAspect;
          drawX = imgX;
          drawY = imgY - (drawH - imgH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        // Image inner stroke
        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 2;
        ctx.strokeRect(imgX, imgY, imgW, imgH);

        // 3. Draw Footer Metadata
        const footerY = 800;

        // Category Badge
        ctx.fillStyle = '#db2777'; // pink-600
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText((item.category || 'PHOTOCARD').toUpperCase(), 48, footerY + 40);

        // Title
        ctx.fillStyle = '#111827'; // gray-900
        ctx.font = '900 32px sans-serif';

        let titleText = item.title || 'NewJeans Photocard';
        if (titleText.length > 28) {
          titleText = titleText.substring(0, 26) + '...';
        }
        ctx.fillText(titleText, 48, footerY + 88);

        // Date
        ctx.fillStyle = '#6b7280'; // gray-500
        ctx.font = '600 20px sans-serif';
        ctx.fillText(item.date || '2026', 48, footerY + 130);

        // Brand Stamp on Bottom Right
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('BUNNIES WORLD', width - 48, footerY + 130);

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = item.image;
    });
  };

  return (
    <div className="flex flex-col gap-8 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Hero Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('gallery_tag')}
        </span>
        <h1 className="text-hero">
          {t('gallery_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-gray-400 max-w-md">
          {t('gallery_sub')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-surface p-4 flex flex-wrap items-center justify-between gap-4 border">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-black/40 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('gallery_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-medium text-gray-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 outline-none w-full"
          />
        </div>
        <div className="flex justify-center flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent'
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
            const isFav = settings.favorites?.gallery?.some((g) => g.id === item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => openLightbox(item)}
                className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col gap-3 group cursor-pointer break-inside-avoid"
              >
                <div className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite('gallery', item); }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-black/50 text-white hover:bg-pink-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col text-left px-1">
                  <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug">{item.title}</h3>
                  <span className="text-[10px] text-gray-500 font-semibold mt-0.5">{item.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-surface p-12 rounded-3xl text-center flex flex-col items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('gallery_no_photo')}</h3>
          <p className="text-xs text-slate-600 dark:text-gray-400">{t('gallery_no_photo_sub')}</p>
          <button
            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
            className="px-5 py-2 rounded-full bg-pink-500 text-white text-xs font-semibold"
          >
            {t('gallery_reset')}
          </button>
        </div>
      )}

      {/* Portal-rendered Lightbox Modal: Locked to Viewport Screen Center */}
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
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Rendered Polaroid Card */}
              <div className="bg-white text-gray-900 p-5 sm:p-6 rounded-3xl shadow-2xl flex flex-col gap-4 border-8 border-white">
                <div className="w-full max-h-[55vh] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain max-h-[55vh] rounded-2xl"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wider">{selectedImage.category}</span>
                    <h3 className="text-lg font-black text-gray-900 leading-snug">{selectedImage.title}</h3>
                    <span className="text-xs text-gray-500 font-semibold">{selectedImage.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest block uppercase">BUNNIES WORLD</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between glass-surface p-4 rounded-2xl border">
                <button
                  onClick={() => toggleFavorite('gallery', selectedImage)}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold text-xs flex items-center gap-2 hover:bg-pink-500 hover:text-white transition-colors"
                >
                  <Heart className={`w-4 h-4 ${settings.favorites?.gallery?.some((g) => g.id === selectedImage.id) ? 'fill-current text-pink-500' : ''}`} />
                  <span>Bookmark</span>
                </button>

                <button
                  onClick={handleDownloadFrame}
                  disabled={isDownloading}
                  className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-pink-600 transition-colors shadow-md disabled:opacity-50"
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
