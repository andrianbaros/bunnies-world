import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share2 } from 'lucide-react';
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('news_tag')}
        </span>
        <h1 className="text-hero">
          {t('news_title')}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {t('news_sub')}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-surface p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border">
        <div className="flex items-center gap-2.5 bg-[var(--bg-subtle)] px-4 py-2.5 rounded-xl border border-[var(--border-color)] flex-grow max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={t('news_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-medium text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none w-full"
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
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-heading)] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Stream */}
      <div className="flex flex-col gap-5">
        {filteredNews.map((item, idx) => {
          const isFav = settings.favorites?.news?.some((n) => n.id === item.id);
          const itemTitle = t(`${item.id}_title`, { defaultValue: item.title });
          const itemSummary = t(`${item.id}_summary`, { defaultValue: item.summary });
          const itemCat = t(`${item.id}_cat`, { defaultValue: item.category });

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="glass-surface p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center border hover:border-pink-500/30 transition-all"
            >
              <img src={item.image} alt={itemTitle} className="w-full sm:w-48 h-36 object-cover rounded-xl flex-shrink-0" />
              <div className="flex flex-col gap-2 text-left flex-grow">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-bold border border-pink-500/20">
                    {itemCat}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">{item.date}</span>
                </div>
                <h3 className="font-bold text-base text-[var(--text-heading)]">{itemTitle}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{itemSummary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => toggleFavorite('news', item)}
                    className={`p-2 rounded-full border transition-colors ${
                      isFav
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-pink-500'
                    }`}
                    title="Bookmark News"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleShare(e, item)}
                    className="p-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors"
                    title="Share News"
                  >
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
