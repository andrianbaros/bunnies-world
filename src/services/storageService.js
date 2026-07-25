const STORAGE_PREFIX = 'bunnies_universe_';
const CURRENT_SCHEMA_VERSION = 1;

const DEFAULT_SETTINGS = {
  version: CURRENT_SCHEMA_VERSION,
  theme: 'dark', // 'dark', 'light', 'system'
  language: 'en',
  reducedMotion: false,
  soundEffects: true,
  musicVolume: 0.7,
  particleQuality: 'high',
  lastRoute: '/',
  lastDailyCheckin: null,
  dailyStreak: 0,
  quizHighScore: 0,
  quizSoulResult: null,
  playbackPosition: 0,
  lastSongId: 'track-1',
  achievements: {
    visitHome: false,
    openMember: false,
    finishQuiz: false,
    openGallery: false,
    playMusic: false
  },
  recentSearches: ['Ditto', 'Minji', 'Super Shy'],
  favorites: {
    members: [],
    albums: [],
    songs: [],
    gallery: [],
    news: []
  },
  recentlyViewed: {
    members: [],
    albums: [],
    gallery: [],
    news: []
  },
  communityPosts: [
    {
      id: 'post-1',
      author: 'BunniesLeader',
      avatar: '🐰',
      content: 'Welcome to BUNNIES UNIVERSE! Super Shy is on repeat forever ✨',
      date: '2026-07-25',
      likes: 42
    },
    {
      id: 'post-2',
      author: 'DittoLover',
      avatar: '🎧',
      content: 'Ditto side A + side B still gives me goosebumps every single time.',
      date: '2026-07-24',
      likes: 38
    }
  ]
};

export const storageService = {
  getSettings() {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}data`);
      if (!data) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(data);
      if (!parsed.version || parsed.version < CURRENT_SCHEMA_VERSION) {
        const migrated = { ...DEFAULT_SETTINGS, ...parsed, version: CURRENT_SCHEMA_VERSION };
        this.saveSettings(migrated);
        return migrated;
      }
      return parsed;
    } catch (e) {
      console.error('LocalStorage fallback error:', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}data`, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  updateField(key, value) {
    const current = this.getSettings();
    current[key] = value;
    this.saveSettings(current);
    return current;
  },

  unlockAchievement(key) {
    const current = this.getSettings();
    if (!current.achievements[key]) {
      current.achievements[key] = true;
      this.saveSettings(current);
    }
    return current.achievements;
  },

  checkDailyReward() {
    const current = this.getSettings();
    const today = new Date().toISOString().split('T')[0];
    let rewarded = false;

    if (current.lastDailyCheckin !== today) {
      current.lastDailyCheckin = today;
      current.dailyStreak = (current.dailyStreak || 0) + 1;
      rewarded = true;
      this.saveSettings(current);
    }
    return { rewarded, streak: current.dailyStreak };
  },

  toggleFavorite(category, item) {
    const current = this.getSettings();
    const list = current.favorites[category] || [];
    const exists = list.some((i) => i.id === item.id);

    if (exists) {
      current.favorites[category] = list.filter((i) => i.id !== item.id);
    } else {
      current.favorites[category] = [item, ...list];
    }
    this.saveSettings(current);
    return current.favorites;
  },

  addRecentlyViewed(category, item) {
    const current = this.getSettings();
    const list = current.recentlyViewed[category] || [];
    const filtered = list.filter((i) => i.id !== item.id);
    current.recentlyViewed[category] = [item, ...filtered].slice(0, 6);
    this.saveSettings(current);
    return current.recentlyViewed;
  },

  addCommunityPost(post) {
    const current = this.getSettings();
    const newPost = {
      id: `post-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      ...post
    };
    current.communityPosts = [newPost, ...(current.communityPosts || [])];
    this.saveSettings(current);
    return current.communityPosts;
  },

  updateCommunityPost(id, newContent) {
    const current = this.getSettings();
    current.communityPosts = (current.communityPosts || []).map((p) =>
      p.id === id ? { ...p, content: newContent } : p
    );
    this.saveSettings(current);
    return current.communityPosts;
  },

  deleteCommunityPost(id) {
    const current = this.getSettings();
    current.communityPosts = (current.communityPosts || []).filter((p) => p.id !== id);
    this.saveSettings(current);
    return current.communityPosts;
  },

  resetAll() {
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
};
