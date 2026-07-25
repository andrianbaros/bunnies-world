import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Heart, Share2, Calendar, Tag } from 'lucide-react';
import newsData from '../data/json/news.json';
import { useSettings } from '../contexts/SettingsContext';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { settings, toggleFavorite } = useSettings();

  const categories = ['All', 'Award', 'Comeback', 'Announcement'];

  const filteredNews = newsData.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleShare = (e, item) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(`Copied article link!`);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300 text-xs font-bold tracking-widest uppercase">
          OFFICIAL PRESS & ANNOUNCEMENTS
        </span>
        <h1 className="text-hero font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          LATEST NEWS
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md">
          Stay updated with official awards, comeback news, and Bunnies Universe updates.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-surface-pink p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-pink-300/30">
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-pink-300" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-bold text-white outline-none w-full"
          />
        </div>

        <div className="flex justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                  : 'bg-black/30 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Stream */}
      <div className="flex flex-col gap-6">
        {filteredNews.map((item, idx) => {
          const isFav = settings.favorites?.news?.some((n) => n.id === item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-surface p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center border border-white/10 hover:border-pink-300/40 transition-all"
            >
              <img src={item.image} alt={item.title} className="w-full sm:w-48 h-36 object-cover rounded-2xl flex-shrink-0" />
              <div className="flex flex-col gap-2 text-left flex-grow">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-bold border border-purple-400/30">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
                <h3 className="font-extrabold text-base text-white">{item.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{item.summary}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => toggleFavorite('news', item)}
                    className={`p-2 rounded-full border transition-colors ${
                      isFav ? 'bg-pink-400/20 border-pink-300 text-pink-300' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-300' : ''}`} />
                  </button>
                  <button onClick={(e) => handleShare(e, item)} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
