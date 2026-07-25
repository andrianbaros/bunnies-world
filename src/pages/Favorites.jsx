import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Disc, Users, Trash2 } from 'lucide-react';
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
    <div className="flex flex-col gap-10 py-8 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300 text-xs font-bold tracking-widest uppercase">
          {t('fav_tag')}
        </span>
        <h1 className="text-hero font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          {t('fav_title')}
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md">
          {t('fav_sub')}
        </p>
      </div>

      {totalFavs > 0 ? (
        <div className="flex flex-col gap-10">
          {favs.members?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-pink-300 flex items-center gap-2 border-b border-white/10 pb-2">
                <Users className="w-4 h-4" />
                <span>{t('fav_members')} ({favs.members.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favs.members.map((m) => (
                  <div key={m.id} className="glass-surface p-4 rounded-2xl flex items-center justify-between gap-3 border border-pink-300/20">
                    <Link to={`/members/${m.id}`} className="flex items-center gap-3">
                      <img src={m.image} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{m.name}</h4>
                        <span className="text-[10px] text-pink-300">{m.koreanName}</span>
                      </div>
                    </Link>
                    <button onClick={() => toggleFavorite('members', m)} className="p-1.5 text-pink-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {favs.songs?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 border-b border-white/10 pb-2">
                <Disc className="w-4 h-4" />
                <span>{t('fav_songs')} ({favs.songs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favs.songs.map((s) => (
                  <div key={s.id} className="glass-surface p-4 rounded-2xl flex items-center justify-between gap-3 border border-cyan-300/20">
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-white truncate">{s.title}</h4>
                      <span className="text-[10px] text-gray-400">{s.artist}</span>
                    </div>
                    <button onClick={() => toggleFavorite('songs', s)} className="p-1.5 text-pink-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-surface p-12 rounded-3xl text-center flex flex-col items-center gap-4">
          <span className="text-5xl">💖</span>
          <h3 className="text-xl font-bold text-white">{t('fav_empty_title')}</h3>
          <p className="text-xs text-gray-400">{t('fav_empty_sub')}</p>
        </div>
      )}
    </div>
  );
}
