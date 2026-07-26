import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Users, Trash2, Sparkles, Image, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Favorites() {
  const { t } = useTranslation();
  const { settings, toggleFavorite } = useSettings();
  const favs = settings.favorites || {};

  const totalFavs =
    (favs.members?.length || 0) +
    (favs.albums?.length || 0) +
    (favs.songs?.length || 0) +
    (favs.gallery?.length || 0);

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('fav_tag')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('fav_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('fav_sub')}
        </p>
      </div>

      {totalFavs > 0 ? (
        <div className="flex flex-col gap-8">
          {/* Favorite Members */}
          {favs.members?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span>{t('fav_members', { defaultValue: 'FAVORITE MEMBERS' })} ({favs.members.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favs.members.map((m) => (
                  <div key={m.id || m.name} className="glass-surface p-4 rounded-3xl flex items-center justify-between gap-3 border border-pink-500/25 hover:border-pink-500/60 shadow-xs transition-all">
                    <Link to={`/members/${m.id || m.name.toLowerCase()}`} className="flex items-center gap-3">
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-pink-500/20 shadow-2xs" />
                      <div>
                        <h4 className="font-black text-xs text-slate-950 dark:text-white">{m.name}</h4>
                        <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold">{m.koreanName || m.position}</span>
                      </div>
                    </Link>
                    <button onClick={() => toggleFavorite('members', m)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Albums */}
          {favs.albums?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span>FAVORITE ALBUMS ({favs.albums.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favs.albums.map((a) => (
                  <div key={a.id || a.title} className="glass-surface p-4 rounded-3xl flex items-center justify-between gap-3 border border-pink-500/25 hover:border-pink-500/60 shadow-xs transition-all">
                    <div className="flex items-center gap-3">
                      <img src={a.cover} alt={a.title} className="w-10 h-10 rounded-2xl object-cover border border-pink-500/20 shadow-2xs" />
                      <div>
                        <h4 className="font-black text-xs text-slate-950 dark:text-white">{a.title}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">{a.releaseDate}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleFavorite('albums', a)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Songs */}
          {favs.songs?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <Disc className="w-4 h-4 text-pink-500" />
                <span>{t('fav_songs', { defaultValue: 'FAVORITE SONGS' })} ({favs.songs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favs.songs.map((s) => (
                  <div key={s.id || s.title} className="glass-surface p-4 rounded-3xl flex items-center justify-between gap-3 border border-pink-500/25 hover:border-pink-500/60 shadow-xs transition-all">
                    <div className="flex items-center gap-3">
                      <img src={s.cover || '/assets/logo.png'} alt={s.title} className="w-10 h-10 rounded-2xl object-cover border border-pink-500/20 shadow-2xs" />
                      <div>
                        <h4 className="font-black text-xs text-slate-950 dark:text-white">{s.title}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">{s.album || 'NewJeans Single'}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleFavorite('songs', s)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Photocards / Gallery */}
          {favs.gallery?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <Image className="w-4 h-4 text-pink-500" />
                <span>FAVORITE PHOTOCARDS ({favs.gallery.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {favs.gallery.map((g) => (
                  <div key={g.id || g.title} className="glass-surface p-3 rounded-3xl flex flex-col gap-2 border border-pink-500/25 hover:border-pink-500/60 shadow-xs transition-all relative group">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-pink-500/20 relative">
                      <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite('gallery', g)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-500 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-950 dark:text-white truncate px-1">{g.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 glass-surface rounded-3xl p-8 border border-pink-500/25 shadow-md flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-pink-500" />
          <h3 className="text-base font-black text-slate-950 dark:text-white">
            {t('fav_empty_title', { defaultValue: 'No Favorites Yet' })}
          </h3>
          <p className="text-xs text-slate-700 dark:text-zinc-300 font-bold max-w-sm">
            {t('fav_empty_sub', { defaultValue: 'Click the heart icon on members, songs, albums, or photocards to bookmark them here.' })}
          </p>
        </div>
      )}
    </div>
  );
}
