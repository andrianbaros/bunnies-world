import React, { useState, useRef, useEffect } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const progressContainerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Previews are typically 30s
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Minimized by default
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); // Playlist drawer

  const tracks = [
    { 
      title: "Magnetic", 
      artist: "ILLIT", 
      url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/7e/67/e87e6795-4ada-2f65-d562-1fd2a3eddfdf/mzaf_11263458879279601822.plus.aac.p.m4a", 
      spotifyUrl: "https://open.spotify.com/track/0h2J0r8j546dG2qZ78zP0c",
      image: "assets/wonhee.jpg" 
    },
    { 
      title: "Cherish (My Love)", 
      artist: "ILLIT", 
      url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/c5/9d/ffc59d63-bd5d-0b93-4592-2dd7d797de8e/mzaf_7002868842246643213.plus.aac.p.m4a", 
      spotifyUrl: "https://open.spotify.com/track/62u43G8L16H7tJ0j86P88W",
      image: "assets/minju.jpg" 
    },
    { 
      title: "Lucky Girl Syndrome", 
      artist: "ILLIT", 
      url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/b7/4e/22b74e6f-8297-bcef-7a97-042fd80fb10e/mzaf_10835128423678862503.plus.aac.p.m4a", 
      spotifyUrl: "https://open.spotify.com/track/6UaR10VzHn2lS0L3Y9e3pI",
      image: "assets/moka.jpg" 
    }
  ];

  const currentTrack = tracks[currentTrackIdx];

  // Initialize playback state when changing tracks
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Auto-play blocked by browser policy");
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIdx]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.log("Audio play blocked until user interaction.");
      });
    }
  };

  // Skip tracks
  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  // Select track from playlist drawer
  const selectTrack = (idx) => {
    setCurrentTrackIdx(idx);
    setIsPlaying(true);
  };

  // Toggle Playlist Drawer
  const togglePlaylist = () => {
    if (isMinimized) {
      setIsMinimized(false);
    }
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  // Audio Event Listeners
  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration || 30);
  };

  const handleAudioEnded = () => {
    handleNext();
  };

  // Progress click seek
  const handleProgressSeek = (e) => {
    if (!audioRef.current || !progressContainerRef.current) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Volume & Mute control
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const mutedState = !isMuted;
    audioRef.current.muted = mutedState;
    setIsMuted(mutedState);
    if (mutedState) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = volume;
    }
  };

  // Time format helper
  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  // Determine volume icon class
  let volumeIconClass = "fas fa-volume-up";
  if (isMuted || volume === 0) volumeIconClass = "fas fa-volume-mute";
  else if (volume < 0.5) volumeIconClass = "fas fa-volume-down";

  return (
    <div className={`music-player-widget glass ${isMinimized ? 'minimized' : ''}`} id="global-music-player">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <div className="player-header">
        <div className="disc-container">
          <img 
            src={currentTrack.image} 
            className={`disc ${isPlaying ? 'spinning' : ''}`} 
            id="player-disc" 
            alt="Album Art" 
          />
          <div className="disc-center"></div>
        </div>
        <div className="track-info">
          <div className="track-title" id="player-title">{currentTrack.title}</div>
          <div className="track-artist" id="player-artist">{currentTrack.artist}</div>
        </div>
        <button 
          className="toggle-player-btn" 
          id="player-toggle-view"
          onClick={() => {
            setIsMinimized(!isMinimized);
            if (isMinimized === false) {
              setIsPlaylistOpen(false); // Close playlist drawer on minimize
            }
          }}
          aria-label="Minimize/Maximize Player"
        >
          <i className={isMinimized ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
        </button>
      </div>

      <div className="player-body">
        {/* Progress Timeline */}
        <div 
          className="progress-container" 
          ref={progressContainerRef}
          onClick={handleProgressSeek}
        >
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          <div className="time-stamp">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons Controls */}
        <div className="player-controls">
          <button className="ctrl-btn" onClick={handlePrev} title="Previous Track"><i className="fas fa-step-backward"></i></button>
          <button className="ctrl-btn play-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button className="ctrl-btn" onClick={handleNext} title="Next Track"><i className="fas fa-step-forward"></i></button>
          
          {/* Playlist toggle button */}
          <button 
            className={`ctrl-btn playlist-toggle-btn ${isPlaylistOpen ? 'active' : ''}`} 
            onClick={togglePlaylist} 
            title="Toggle Playlist"
          >
            <i className="fas fa-list"></i>
          </button>

          {/* YouTube redirect for full track */}
          <a 
            href={currentTrack.youtubeUrl || "https://www.youtube.com"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ctrl-btn youtube-btn text-red-400"
            title="Watch on YouTube"
          >
            <i className="fab fa-youtube"></i>
          </a>

          <div className="volume-container">
            <button className="ctrl-btn" onClick={toggleMute} title="Mute">
              <i className={volumeIconClass}></i>
            </button>
            <input 
              type="range" 
              className="volume-slider" 
              min="0" 
              max="1" 
              step="0.05" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange}
            />
          </div>
        </div>

        {/* Sliding Playlist Drawer */}
        <div className={`player-playlist-drawer ${isPlaylistOpen ? 'active' : ''}`}>
          {tracks.map((track, index) => (
            <div 
              key={index}
              className={`playlist-item ${currentTrackIdx === index ? 'active' : ''}`}
              onClick={() => selectTrack(index)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentTrackIdx === index && isPlaying ? (
                  <i className="fas fa-volume-up" style={{ fontSize: '0.75rem', animation: 'pulse 1s infinite' }}></i>
                ) : (
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>0{index + 1}</span>
                )}
                <span>{track.title}</span>
              </div>
              <a 
                href={track.spotifyUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="playlist-spotify-link"
                onClick={(e) => e.stopPropagation()} // Prevent selecting track on link click
                title="Open on Spotify"
              >
                <i className="fab fa-spotify"></i>
              </a>
            </div>
          ))}
        </div>

        {/* Dynamic visualizer bars */}
        <div className={`equalizer ${isPlaying ? 'active' : ''}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
}
