import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import musicData from '../data/json/music.json';
import { storageService } from '../services/storageService';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [playlist] = useState(musicData);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = playlist[currentTrackIdx] || playlist[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
    storageService.updateField('lastSongId', currentTrack.id);
  }, [currentTrackIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const nextTrack = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIdx(randomIdx);
    } else {
      setCurrentTrackIdx((prev) => (prev + 1) % playlist.length);
    }
  };

  const prevTrack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const playSongById = (idOrTitle) => {
    const idx = playlist.findIndex(
      (s) => s.id === idOrTitle || s.title.toLowerCase() === idOrTitle.toString().toLowerCase()
    );
    if (idx !== -1) {
      setCurrentTrackIdx(idx);
      setIsPlaying(true);
    }
  };


  const handleAudioEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  return (
    <AudioContext.Provider
      value={{
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
        playSongById,
        audioRef,
        setCurrentTime,
        setDuration
      }}
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={(e) => {
          setCurrentTime(e.target.currentTime);
          storageService.updateField('playbackPosition', e.target.currentTime);
        }}
        onLoadedMetadata={(e) => setDuration(e.target.duration || 30)}
        onEnded={handleAudioEnded}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
