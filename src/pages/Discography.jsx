import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Disc, ExternalLink, Heart, Share2, Music, Filter, X, Tv } from 'lucide-react';
import albumsData from '../data/json/albums.json';
import songsData from '../data/json/songs.json';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';

export default function Discography() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' | 'songs'
  const { playTrack, currentTrack } = useAudio();
  const { settings, toggleFavorite, addRecentlyViewed } = useSettings();

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
    return songsData.find(s => s.title.toLowerCase() === title.toLowerCase());
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Hero Banner with getup.jpg */}
      <div className="text-center flex flex-col items-center gap-3 relative rounded-3xl p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img src="/assets/getup.jpg" alt="Get Up Album Hero" className="w-full h-full object-cover opacity-25 filter blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14] via-[#0d0b14]/75 to-transparent" />
        </div>

        <span className="px-4 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/30 text-cyan-300 text-xs font-bold tracking-widest uppercase z-10">
          DISCOGRAPHY & YOUTUBE VAULT
        </span>
        <h1 className="text-hero font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent z-10">
          NEWJEANS DISCOGRAPHY
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md z-10">
          Explore official EPs, Singles, tracklists, 30s audio previews & official YouTube music videos.
        </p>
      </div>

      {/* Tab Controls & Search Bar */}
      <div className="glass-surface-blue p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-cyan-300/30">
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-cyan-300" />
          <input
            type="text"
            placeholder="Search album or song title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-bold text-white outline-none w-full"
          />
        </div>

        {/* Tab Switcher: Albums vs All Songs */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'albums'
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Albums & EPs ({albumsData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'songs'
                ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>All YouTube Songs ({songsData.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ALBUMS GRID */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAlbums.map((album, idx) => {
            const isFav = settings.favorites?.albums?.some((a) => a.id === album.id);
            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => openAlbumModal(album)}
                className="glass-surface p-5 rounded-3xl flex flex-col gap-4 border border-white/10 hover:border-cyan-300/40 transition-all cursor-pointer relative group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Disc className="w-12 h-12 text-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-white truncate">{album.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('albums', album);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isFav ? 'text-pink-300' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-300' : ''}`} />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{album.releaseDate} • {album.tracks.length} Tracks</span>
                  <span className="text-[11px] text-cyan-300 font-semibold truncate mt-1">Concept: {album.concept}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB 2: VERIFIED YOUTUBE SONGS VAULT */}
      {activeTab === 'songs' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSongs.map((song, idx) => (
              <motion.div
                key={song.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="glass-surface p-4 rounded-2xl flex items-center justify-between gap-4 border border-white/10 hover:border-cyan-300/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => playTrack({ title: song.title, url: song.previewUrl, artist: "NewJeans" })}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{song.title}</h4>
                    <span className="text-[10px] text-pink-300 font-bold uppercase">Official 30s Audio Preview</span>
                  </div>
                </div>

                {/* YouTube Link Button */}
                <a
                  href={song.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <span>Watch YouTube</span>
                  <Tv className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Album Detail Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlbum(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-surface-blue p-6 sm:p-8 rounded-3xl border border-cyan-300/30 z-10 flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedAlbum(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-6">
                <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="w-36 h-36 rounded-2xl object-cover shadow-2xl border-2 border-cyan-300/40" />
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold text-white">{selectedAlbum.title}</h2>
                  <span className="text-xs text-gray-400 font-bold">{selectedAlbum.releaseDate} • {selectedAlbum.tracks.length} Songs</span>
                  <span className="text-xs text-cyan-300 font-semibold">Concept: {selectedAlbum.concept}</span>
                </div>
              </div>

              {/* Tracklist inside Modal */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                  <Music className="w-4 h-4 text-cyan-300" />
                  <span>Tracklist & Official Music Video</span>
                </h4>

                <div className="flex flex-col gap-2">
                  {selectedAlbum.tracks.map((track, idx) => {
                    const isCurrent = currentTrack.title === track.title;
                    const songInfo = getSongLink(track.title);
                    const previewAudioUrl = track.previewUrl || (songInfo ? songInfo.previewUrl : null);
                    const youtubeUrl = track.youtube || (songInfo ? songInfo.youtube : '#');

                    return (
                      <div
                        key={idx}
                        className={`flex flex-wrap items-center justify-between p-3 rounded-2xl border transition-all ${
                          isCurrent ? 'bg-pink-400/20 border-pink-300/50' : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playTrack({ title: track.title, url: previewAudioUrl, artist: "NewJeans" }, selectedAlbum.cover)}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
                          >
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          </button>
                          <div>
                            <h5 className="font-bold text-xs text-white">{track.title}</h5>
                            <span className="text-[10px] text-gray-400">{track.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {youtubeUrl !== '#' && (
                            <a
                              href={youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold hover:scale-105 transition-transform flex items-center gap-1"
                            >
                              <span>Watch YouTube</span>
                              <Tv className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
