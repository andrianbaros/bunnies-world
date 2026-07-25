import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Disc, Music, X, ExternalLink, Heart } from 'lucide-react';
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          DISCOGRAPHY & MUSIC
        </span>
        <h1 className="text-hero">
          NEWJEANS DISCOGRAPHY
        </h1>
        <p className="text-sm text-slate-700 dark:text-gray-400 max-w-md">
          Explore official EPs, singles, tracklists, and audio previews.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-surface p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-black/40 px-4 py-2 rounded-xl border border-slate-300/80 dark:border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search album or song title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-black/40 p-1.5 rounded-xl border border-slate-300/80 dark:border-white/10">
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'albums'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Albums & EPs ({albumsData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'songs'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
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
                className="glass-surface p-5 rounded-2xl flex flex-col gap-4 border hover:border-pink-500/30 transition-all hover:-translate-y-1 group cursor-pointer"
              >
                <div className="aspect-square rounded-xl overflow-hidden relative shadow-sm border">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('albums', album);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-pink-500 text-white' : 'bg-black/50 text-white hover:bg-pink-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col text-left gap-1">
                  <span className="text-[10px] text-slate-600 dark:text-gray-400 font-semibold">{album.releaseDate} • {album.tracks.length} Tracks</span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug group-hover:text-pink-500 transition-colors">{album.title}</h3>
                  <span className="text-xs text-pink-600 dark:text-pink-400 font-semibold line-clamp-1">Concept: {album.concept}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-surface p-6 rounded-2xl flex flex-col gap-3 border">
          {filteredSongs.map((track) => {
            const isPlaying = currentTrack.title === track.title;
            const isFav = settings.favorites?.songs?.some((s) => s.id === track.id);

            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isPlaying
                    ? 'bg-pink-500/15 border-pink-500/30'
                    : 'bg-slate-100 dark:bg-white/5 border-transparent hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => playSongById(track.title)}
                    className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md hover:bg-pink-600 transition-colors flex-shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{track.title}</h4>
                    <span className="text-xs text-slate-600 dark:text-gray-400">{track.album} • {track.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite('songs', track)}
                    className={`p-2 rounded-full transition-colors ${
                      isFav ? 'text-pink-500' : 'text-slate-400 dark:text-gray-400 hover:text-pink-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <a
                    href={track.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1.5"
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
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 z-10 flex flex-col gap-6 shadow-2xl max-h-[85vh] overflow-y-auto my-auto"
            >
              <button
                onClick={() => setSelectedAlbum(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
                <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="w-32 h-32 rounded-xl object-cover shadow-md border" />
                <div className="flex flex-col gap-1.5 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{selectedAlbum.title}</h2>
                  <span className="text-xs text-slate-600 dark:text-gray-400 font-semibold">{selectedAlbum.releaseDate} • {selectedAlbum.tracks.length} Songs</span>
                  <span className="text-xs text-pink-600 dark:text-pink-400 font-semibold">Concept: {selectedAlbum.concept}</span>
                </div>
              </div>

              {/* Tracklist inside Modal */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
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
                        className={`flex flex-wrap items-center justify-between p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-pink-500/15 border-pink-500/30'
                            : 'bg-slate-100 dark:bg-white/5 border-transparent hover:border-slate-300 dark:hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playSongById(track.title)}
                            className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm hover:bg-pink-600 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">{track.title}</h5>
                            <span className="text-[10px] text-slate-600 dark:text-gray-400">{track.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {youtubeUrl !== '#' && (
                            <a
                              href={youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
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
