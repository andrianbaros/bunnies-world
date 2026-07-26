import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Disc, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import albumsData from '../data/json/albums.json';

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const matchingMembers = query.trim()
    ? membersData.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.koreanName.toLowerCase().includes(query.toLowerCase()) ||
        m.role?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingAlbums = query.trim()
    ? albumsData.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.concept.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalResults = matchingMembers.length + matchingAlbums.length;

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('search_tag')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('search_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('search_sub')}
        </p>
      </div>

      {/* Search Input Bar (iPhone Frost Glass) */}
      <div className="glass-surface p-4 sm:p-5 rounded-3xl border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-800/80 px-4 py-3 rounded-2xl border border-pink-500/20 focus-within:border-pink-500 shadow-2xs transition-colors">
          <Search className="w-5 h-5 text-pink-500" />
          <input
            type="text"
            placeholder={t('search_ph')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm font-extrabold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none w-full"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      {query.trim() !== '' ? (
        <div className="flex flex-col gap-8">
          <span className="text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
            {totalResults} {t('search_results_found')} "{query}"
          </span>

          {matchingMembers.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span>Members ({matchingMembers.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {matchingMembers.map((m) => (
                  <Link
                    key={m.id}
                    to={`/members/${m.id}`}
                    className="glass-surface p-4 rounded-3xl flex items-center gap-3 border border-pink-500/25 hover:border-pink-500/60 shadow-xs transition-all hover:-translate-y-1"
                  >
                    <img src={m.image} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-pink-500/20 shadow-2xs" />
                    <div>
                      <h4 className="font-black text-xs text-slate-950 dark:text-white">{m.name}</h4>
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold">{m.koreanName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {matchingAlbums.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <Disc className="w-4 h-4 text-pink-500" />
                <span>Albums ({matchingAlbums.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingAlbums.map((a) => (
                  <Link
                    key={a.id}
                    to="/discography"
                    className="glass-surface p-4 rounded-3xl flex items-center gap-3 border border-pink-500/25 hover:border-pink-500/60 shadow-xs transition-all hover:-translate-y-1"
                  >
                    <img src={a.cover} alt={a.title} className="w-12 h-12 rounded-2xl object-cover border border-pink-500/20 shadow-2xs" />
                    <div>
                      <h4 className="font-black text-xs text-slate-950 dark:text-white">{a.title}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">{a.releaseDate}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 glass-surface rounded-3xl p-8 border border-pink-500/25 shadow-md flex flex-col items-center gap-3">
          <Search className="w-8 h-8 text-pink-500" />
          <h3 className="text-base font-black text-slate-950 dark:text-white">{t('search_empty_title')}</h3>
          <p className="text-xs text-slate-700 dark:text-zinc-300 font-bold max-w-sm">{t('search_empty_sub')}</p>
        </div>
      )}
    </div>
  );
}
