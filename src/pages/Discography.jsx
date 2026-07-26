import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Disc, Music, X, ExternalLink, Heart, Sparkles } from 'lucide-react';
import albumsData from '../data/json/albums.json';
import songsData from '../data/json/songs.json';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';

export default function Discography() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeTab, setActiveTab] = useState('albums');
  const { playSongById, currentTrack } = useAudio();
  const { settings, toggleFavorite, addRecentlyViewed } = useSettings();

  useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedAlbum]);

  const filteredAlbums = albumsData.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.concept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSongs = songsData.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAlbumModal = (album) => {
    setSelectedAlbum(album);
    addRecentlyViewed('albums', album);
  };

  const getSongLink = (title) => {
    return songsData.find((s) => s.title.toLowerCase() === title.toLowerCase());
  };

  return (
    <div className="flex flex-col gap-8 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Hero Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DISCOGRAPHY & MUSIC</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          NEWJEANS DISCOGRAPHY
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          Explore official EPs, singles, tracklists, and audio previews.
        </p>
      </div>

      {/* iPhone Frosted Glass Search & Filter Bar */}
      <div className="glass-surface p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-pink-500/20 focus-within:border-pink-500 flex-grow max-w-md shadow-2xs transition-colors">
          <Search className="w-4 h-4 text-pink-500" />
          <input
            type="text"
            placeholder="Search album or song title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-pink-500/20 shadow-2xs">
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'albums'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Albums & EPs ({albumsData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'songs'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-pink-500'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>All Tracks ({songsData.length})</span>
          </button>
        </div>
      </div>

      {/* Content Section: Albums vs Songs */}
      {activeTab === 'albums' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album, idx) => {
            const isFav = settings.favorites?.albums?.some((a) => a.id === album.id);

            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => openAlbumModal(album)}
                className="glass-surface p-6 rounded-3xl flex flex-col gap-4 border border-pink-500/25 hover:border-pink-500/60 transition-all hover:-translate-y-1.5 group cursor-pointer shadow-md"
              >
                <div className="aspect-square rounded-2xl overflow-hidden relative shadow-xs border border-pink-500/20">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('albums', album);
                      }}
                      className={`p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-black/60 text-white hover:bg-pink-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col text-left gap-1">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-extrabold">{album.releaseDate} • {album.tracks.length} Tracks</span>
                  <h3 className="font-black text-base text-slate-950 dark:text-white leading-snug group-hover:text-pink-500 transition-colors">{album.title}</h3>
                  <span className="text-xs text-pink-600 dark:text-pink-400 font-extrabold line-clamp-1">Concept: {album.concept}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-surface p-6 rounded-3xl flex flex-col gap-3 border border-pink-500/25 shadow-md">
          {filteredSongs.map((track) => {
            const isPlaying = currentTrack.title === track.title;
            const isFav = settings.favorites?.songs?.some((s) => (s.id && track.id ? s.id === track.id : s.title === track.title));

            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isPlaying
                    ? 'bg-pink-500/15 border-pink-500/50'
                    : 'bg-slate-100/80 dark:bg-zinc-800/80 border-pink-500/20 hover:border-pink-500/60 hover:bg-pink-50 dark:hover:bg-pink-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => playSongById(track.title)}
                    className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md hover:bg-pink-600 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">{track.title}</h4>
                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">{track.album} • {track.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite('songs', track)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isFav ? 'text-pink-500' : 'text-slate-500 dark:text-zinc-400 hover:text-pink-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <a
                    href={track.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Album Detail Modal - Rendered via React Portal directly into body */}
      {selectedAlbum &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlbum(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-pink-500/30 z-10 flex flex-col gap-6 shadow-2xl max-h-[85vh] overflow-y-auto my-auto"
            >
              <button
                onClick={() => setSelectedAlbum(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-pink-500 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-pink-500/20 pb-6">
                <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="w-32 h-32 rounded-2xl object-cover shadow-md border border-pink-500/30" />
                <div className="flex flex-col gap-1.5 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">{selectedAlbum.title}</h2>
                  <span className="text-xs text-slate-600 dark:text-zinc-400 font-extrabold">{selectedAlbum.releaseDate} • {selectedAlbum.tracks.length} Songs</span>
                  <span className="text-xs text-pink-600 dark:text-pink-400 font-extrabold">Concept: {selectedAlbum.concept}</span>
                </div>
              </div>

              {/* Tracklist inside Modal */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-slate-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Music className="w-4 h-4 text-pink-500" />
                  <span>Tracklist & Music Videos</span>
                </h4>

                <div className="flex flex-col gap-2">
                  {selectedAlbum.tracks.map((track, idx) => {
                    const isCurrent = currentTrack.title === track.title;
                    const songInfo = getSongLink(track.title);
                    const youtubeUrl = track.youtube || (songInfo ? songInfo.youtube : '#');

                    return (
                      <div
                        key={idx}
                        className={`flex flex-wrap items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-pink-500/15 border-pink-500/50'
                            : 'bg-slate-100/80 dark:bg-zinc-800/80 border-pink-500/20 hover:border-pink-500/60 hover:bg-pink-50 dark:hover:bg-pink-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playSongById(track.title)}
                            className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs hover:bg-pink-600 transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <div>
                            <h5 className="font-extrabold text-xs text-slate-950 dark:text-white">{track.title}</h5>
                            <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium">{track.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {youtubeUrl !== '#' && (
                            <a
                              href={youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}
