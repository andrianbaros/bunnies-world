import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, ListMusic, Disc, ExternalLink, Heart, ChevronUp, ChevronDown, Tv } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function FloatingAudioPlayer() {
  const {
    playlist,
    currentTrack,
    currentTrackIdx,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    isMinimized,
    setIsMinimized,
    isPlaylistOpen,
    setIsPlaylistOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    playSongById
  } = useAudio();

  const { settings, toggleFavorite } = useSettings();

  const isFav = settings.favorites?.songs?.some((s) => s.id === currentTrack.id);

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  const youtubeUrl = currentTrack.youtubeUrl || "https://www.youtube.com/results?search_query=" + encodeURIComponent(`NewJeans ${currentTrack.title} official MV`);

  return (
    <div
      className={`fixed right-3 sm:right-6 z-50 glass-surface-pink rounded-3xl transition-all duration-300 shadow-2xl border border-pink-300/30 ${
        isMinimized 
          ? 'bottom-20 sm:bottom-6 w-[calc(100%-1.5rem)] max-w-[280px] p-2.5 sm:p-3' 
          : 'bottom-20 sm:bottom-6 w-[calc(100%-1.5rem)] max-w-sm sm:w-96 p-4 sm:p-5'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          {/* CD Spinning Disc */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className={`w-full h-full rounded-full object-cover border-2 border-pink-300/40 shadow-md ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '8s' }}
            />
            <div className="absolute inset-0 m-auto w-3 h-3 sm:w-3.5 sm:h-3.5 bg-black rounded-full border border-pink-300" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{currentTrack.title}</h4>
            <p className="text-[10px] text-gray-400 truncate">{currentTrack.artist} • {currentTrack.album}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Play/Pause Button in Minimized Mode */}
          {isMinimized && (
            <button
              onClick={togglePlay}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform mr-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>
          )}

          <button
            onClick={() => toggleFavorite('songs', currentTrack)}
            className={`p-1 sm:p-1.5 rounded-full text-xs transition-colors ${
              isFav ? 'text-pink-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-pink-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-pink-300 transition-colors p-1"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded iPod / CD Controls */}
      {!isMinimized && (
        <div className="mt-3 sm:mt-4 flex flex-col gap-2.5 sm:gap-3">
          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 h-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)} (Preview)</span>
          </div>

          {/* Main Playback Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                isShuffle ? 'text-pink-300' : 'text-gray-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button onClick={prevTrack} className="text-gray-300 hover:text-white transition-colors p-1">
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button onClick={nextTrack} className="text-gray-300 hover:text-white transition-colors p-1">
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                isRepeat ? 'text-cyan-300' : 'text-gray-400 hover:text-white'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Controls Bar */}
          <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
            <button
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                isPlaylistOpen ? 'text-pink-300' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Queue ({playlist.length})</span>
            </button>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>Watch YouTube</span>
              <Tv className="w-3 h-3" />
            </a>
          </div>

          {/* Playlist Queue Drawer */}
          {isPlaylistOpen && (
            <div className="max-h-40 overflow-y-auto bg-black/40 rounded-2xl p-2 flex flex-col gap-1 border border-white/10">
              {playlist.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playSongById(track.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    currentTrack.id === track.id
                      ? 'bg-pink-400/20 text-pink-300 font-bold border border-pink-300/30'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{track.title}</span>
                  <span className="text-[10px] text-gray-400">{track.duration}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
