import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import newsData from '../data/json/news.json';
import { useSettings } from '../contexts/SettingsContext';

export default function News() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { settings, toggleFavorite, showToast } = useSettings();

  const categories = ['All', 'Award', 'Comeback', 'Announcement'];

  const filteredNews = newsData.filter((n) => {
    const localizedTitle = t(`${n.id}_title`, { defaultValue: n.title });
    const localizedSummary = t(`${n.id}_summary`, { defaultValue: n.summary });
    const matchesSearch =
      localizedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      localizedSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleShare = (e, item) => {
    e.stopPropagation();
    const title = t(`${item.id}_title`, { defaultValue: item.title });
    const summary = t(`${item.id}_summary`, { defaultValue: item.summary });
    if (navigator.share) {
      navigator.share({ title, text: summary, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('info', 'Copied news link!');
    }
  };

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('news_tag')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('news_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('news_sub')}
        </p>
      </div>

      {/* Filter Bar (iPhone Frost Glass Style) */}
      <div className="glass-surface p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-pink-500/20 focus-within:border-pink-500 flex-grow max-w-md shadow-2xs transition-colors">
          <Search className="w-4 h-4 text-pink-500" />
          <input
            type="text"
            placeholder={t('news_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-pink-500/20 shadow-2xs overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="flex flex-col gap-5">
        {filteredNews.length === 0 ? (
          <div className="text-center py-10 text-xs font-bold text-slate-600 dark:text-zinc-400 glass-surface rounded-3xl border border-pink-500/25">
            {t('news_not_found')}
          </div>
        ) : (
          filteredNews.map((item, idx) => {
            const isFav = settings.favorites?.news?.some((n) => n.id === item.id);
            const localizedTitle = t(`${item.id}_title`, { defaultValue: item.title });
            const localizedSummary = t(`${item.id}_summary`, { defaultValue: item.summary });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="glass-surface p-6 rounded-3xl border border-pink-500/25 hover:border-pink-500/60 shadow-md flex flex-col md:flex-row gap-6 transition-all hover:-translate-y-1"
              >
                <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden shadow-xs border border-pink-500/20 flex-shrink-0">
                  <img src={item.image} alt={localizedTitle} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col justify-between flex-grow gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-black uppercase tracking-wider border border-pink-500/20">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-bold">{item.date}</span>
                    </div>
                    <h3 className="font-black text-base text-slate-950 dark:text-white leading-snug">{localizedTitle}</h3>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium line-clamp-3">{localizedSummary}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-pink-500/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('news', item);
                      }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-pink-500'
                      }`}
                      title="Bookmark News"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => handleShare(e, item)}
                      className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-pink-500 transition-colors cursor-pointer"
                      title="Share News"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
