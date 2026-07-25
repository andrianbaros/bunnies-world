import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Search, Filter, Heart, Download, X } from 'lucide-react';
import galleryData from '../data/json/gallery.json';
import { useSettings } from '../contexts/SettingsContext';

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const { settings, toggleFavorite, addRecentlyViewed } = useSettings();

  const categories = ['All', 'Photocard', 'Concept Photo', 'Behind The Scenes', 'Fan Art', 'Magazine', 'Performance'];

  const filteredItems = galleryData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openLightbox = (item) => {
    setSelectedImage(item);
    addRecentlyViewed('gallery', item);
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Hero Banner with how sweet shoot.jpg */}
      <div className="text-center flex flex-col items-center gap-3 relative rounded-3xl p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img src="/assets/how sweet shoot.jpg" alt="How Sweet Shoot Gallery Hero" className="w-full h-full object-cover opacity-25 filter blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14] via-[#0d0b14]/75 to-transparent" />
        </div>

        <span className="px-4 py-1 rounded-full bg-purple-400/10 border border-purple-300/30 text-purple-300 text-xs font-bold tracking-widest uppercase z-10">
          POLAROID MASONRY STASH
        </span>
        <h1 className="text-hero font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent z-10">
          BUNNIES GALLERY
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md z-10">
          A Pinterest-style Y2K digital scrapbook featuring photocards, concept photos, and fan artwork.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-surface-purple p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-purple-300/30">
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-purple-300" />
          <input
            type="text"
            placeholder="Search gallery by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-bold text-white outline-none w-full"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                  : 'bg-black/30 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => openLightbox(item)}
                className="bg-white/95 text-gray-900 p-4 rounded-2xl shadow-2xl rotate-1 hover:rotate-0 transition-all duration-300 border-8 border-white flex flex-col gap-3 group cursor-pointer break-inside-avoid"
              >
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('gallery', item);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-black/50 text-white hover:bg-pink-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-pink-500 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-extrabold text-sm text-gray-900 leading-snug">{item.title}</h3>
                  <span className="text-[10px] text-gray-500 font-bold mt-1">{item.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-surface p-12 rounded-3xl text-center flex flex-col items-center gap-4">
          <span className="text-5xl">🖼️🔍</span>
          <h3 className="text-xl font-bold text-white">No Photo Found</h3>
          <p className="text-xs text-gray-400">Try searching for another keyword or category filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All');
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-white text-gray-900 p-6 rounded-3xl z-10 flex flex-col gap-4 shadow-2xl border-8 border-white"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[60vh] rounded-2xl overflow-hidden">
                <img src={selectedImage.image} alt={selectedImage.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-500 uppercase">{selectedImage.category}</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{selectedImage.title}</h3>
                  <span className="text-xs text-gray-500 font-bold">{selectedImage.date}</span>
                </div>

                <a
                  href={selectedImage.image}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
