import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Users, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Favorites() {
  const { t } = useTranslation();
  const { settings, toggleFavorite } = useSettings();
  const favs = settings.favorites || {};

  const totalFavs =
    (favs.members?.length || 0) +
    (favs.songs?.length || 0);

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('fav_tag')}
        </span>
        <h1 className="text-hero">
          {t('fav_title')}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {t('fav_sub')}
        </p>
      </div>

      {totalFavs > 0 ? (
        <div className="flex flex-col gap-8">
          {favs.members?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span>{t('fav_members')} ({favs.members.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favs.members.map((m) => (
                  <div key={m.id} className="glass-surface p-4 rounded-xl flex items-center justify-between gap-3 border">
                    <Link to={`/members/${m.id}`} className="flex items-center gap-3">
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-[var(--text-heading)]">{m.name}</h4>
                        <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">{m.koreanName}</span>
                      </div>
                    </Link>
                    <button onClick={() => toggleFavorite('members', m)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favs.songs?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                <Disc className="w-4 h-4 text-pink-500" />
                <span>{t('fav_songs')} ({favs.songs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favs.songs.map((s) => (
                  <div key={s.id} className="glass-surface p-4 rounded-xl flex items-center justify-between gap-3 border">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-[var(--text-heading)] truncate">{s.title}</h4>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">{s.artist}</span>
                    </div>
                    <button onClick={() => toggleFavorite('songs', s)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-surface p-10 rounded-2xl text-center flex flex-col items-center gap-2 border">
          <h3 className="text-base font-bold text-[var(--text-heading)]">{t('fav_empty_title')}</h3>
          <p className="text-xs text-[var(--text-muted)]">{t('fav_empty_sub')}</p>
        </div>
      )}
    </div>
  );
}
