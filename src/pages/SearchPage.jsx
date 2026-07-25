import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Disc, Users } from 'lucide-react';
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('search_tag')}
        </span>
        <h1 className="text-hero">
          {t('search_title')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          {t('search_sub')}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="glass-surface p-4 rounded-2xl border">
        <div className="flex items-center gap-3 bg-black/5 dark:bg-black/40 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_ph')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 outline-none w-full"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      {query.trim() !== '' ? (
        totalResults > 0 ? (
          <div className="flex flex-col gap-8">
            {matchingMembers.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                  <Users className="w-4 h-4 text-pink-500" />
                  <span>{t('search_members_label')} ({matchingMembers.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matchingMembers.map((m) => (
                    <Link
                      key={m.id}
                      to={`/members/${m.id}`}
                      className="glass-surface p-4 rounded-xl flex items-center gap-3 border hover:border-pink-500/30 transition-all"
                    >
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{m.name}</h4>
                        <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">{m.koreanName}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {matchingAlbums.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                  <Disc className="w-4 h-4 text-pink-500" />
                  <span>{t('search_albums_label')} ({matchingAlbums.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matchingAlbums.map((a) => (
                    <Link
                      key={a.id}
                      to="/discography"
                      className="glass-surface p-4 rounded-xl flex items-center gap-3 border hover:border-pink-500/30 transition-all"
                    >
                      <img src={a.cover} alt={a.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{a.title}</h4>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{a.releaseDate}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-surface p-10 rounded-2xl text-center flex flex-col items-center gap-2 border">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t('search_empty_title')} "{query}"</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('search_empty_sub')}</p>
          </div>
        )
      ) : (
        <div className="glass-surface p-10 rounded-2xl text-center flex flex-col items-center gap-2 border">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{t('search_start_title')}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('search_start_sub')}</p>
        </div>
      )}
    </div>
  );
}
