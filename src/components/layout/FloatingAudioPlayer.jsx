import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, ListMusic, Heart, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function FloatingAudioPlayer() {
  const {
    playlist,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
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
      className={`fixed right-3 sm:right-6 z-50 bg-[rgba(255,255,255,0.80)] dark:bg-[rgba(15,10,25,0.80)] backdrop-blur-2xl rounded-2xl transition-all duration-300 shadow-xl border border-pink-500/30 ${
        isMinimized
          ? 'bottom-20 sm:bottom-6 w-[calc(100%-1.5rem)] max-w-[280px] p-3'
          : 'bottom-20 sm:bottom-6 w-[calc(100%-1.5rem)] max-w-sm sm:w-96 p-4 sm:p-5'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative w-10 h-10 flex-shrink-0">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className={`w-full h-full rounded-full object-cover border border-[var(--border-color)] ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '8s' }}
            />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-[var(--text-heading)] truncate">{currentTrack.title}</h4>
            <p className="text-[11px] text-[var(--text-muted)] truncate">{currentTrack.artist} • {currentTrack.album}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isMinimized && (
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm hover:bg-pink-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          )}

          <button
            onClick={() => toggleFavorite('songs', currentTrack)}
            className={`p-1.5 rounded-full text-xs transition-colors ${
              isFav ? 'text-pink-500' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors p-1"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls */}
      {!isMinimized && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Progress Bar */}
          <div className="w-full bg-[var(--bg-subtle)] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-pink-500 h-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-semibold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Main Playback Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                isShuffle ? 'text-pink-500 font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button onClick={prevTrack} className="text-[var(--text-secondary)] hover:text-black hover:text-[var(--text-heading)] transition-colors p-1">
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md hover:bg-pink-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button onClick={nextTrack} className="text-[var(--text-secondary)] hover:text-black hover:text-[var(--text-heading)] transition-colors p-1">
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                isRepeat ? 'text-pink-500 font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Controls Bar */}
          <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-2.5 text-xs">
            <button
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isPlaylistOpen ? 'text-pink-500' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span>Queue ({playlist.length})</span>
            </button>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              <span>Watch Video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Playlist Queue Drawer */}
          {isPlaylistOpen && (
            <div className="max-h-40 overflow-y-auto bg-[var(--bg-subtle)] rounded-xl p-1.5 flex flex-col gap-1 border border-[var(--border-color)] dark:border-[var(--border-color)]">
              {playlist.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playSongById(track.id)}
                  className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    currentTrack.id === track.id
                      ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle-hover)]'
                  }`}
                >
                  <span className="truncate">{track.title}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{track.duration}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
