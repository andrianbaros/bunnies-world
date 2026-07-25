import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import i18n from '../i18n';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    storageService.saveSettings(settings);
    
    // Apply Theme attribute on html root element for Light/Dark CSS modes
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else if (settings.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      // System mode
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    if (settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings]);

  // Check Daily Reward on Mount
  useEffect(() => {
    const { rewarded, streak } = storageService.checkDailyReward();
    if (rewarded) {
      showToast('info', `🎁 Daily Check-in! Streak: ${streak} Days!`);
    }
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      storageService.saveSettings(updated);
      return updated;
    });
  };

  const unlockAchievement = (key, title) => {
    const current = storageService.getSettings();
    if (!current.achievements[key]) {
      const updatedAch = storageService.unlockAchievement(key);
      setSettings((prev) => ({ ...prev, achievements: updatedAch }));
      showToast('success', `🏆 Achievement Unlocked: ${title}!`);
    }
  };

  const toggleFavorite = (category, item) => {
    const updatedFavs = storageService.toggleFavorite(category, item);
    setSettings((prev) => ({ ...prev, favorites: updatedFavs }));
    showToast('info', `Updated Favorites for ${item.name || item.title}!`);
  };

  const addRecentlyViewed = (category, item) => {
    const updatedRecents = storageService.addRecentlyViewed(category, item);
    setSettings((prev) => ({ ...prev, recentlyViewed: updatedRecents }));
  };

  const addCommunityPost = (post) => {
    const updatedPosts = storageService.addCommunityPost(post);
    setSettings((prev) => ({ ...prev, communityPosts: updatedPosts }));
    showToast('success', 'Fan letter posted to Community!');
  };

  const updateCommunityPost = (id, content) => {
    const updatedPosts = storageService.updateCommunityPost(id, content);
    setSettings((prev) => ({ ...prev, communityPosts: updatedPosts }));
    showToast('info', 'Post updated successfully!');
  };

  const deleteCommunityPost = (id) => {
    const updatedPosts = storageService.deleteCommunityPost(id);
    setSettings((prev) => ({ ...prev, communityPosts: updatedPosts }));
    showToast('warning', 'Post deleted.');
  };

  const resetAllSettings = () => {
    const res = storageService.resetAll();
    setSettings(res);
    showToast('info', 'All settings reset to defaults.');
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        toast,
        showToast,
        updateSetting,
        unlockAchievement,
        toggleFavorite,
        addRecentlyViewed,
        addCommunityPost,
        updateCommunityPost,
        deleteCommunityPost,
        resetAllSettings
      }}
    >
      {children}

      {/* Global Toast Display */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 glass-surface-pink px-4 py-3 rounded-2xl border border-pink-300/40 text-xs font-bold text-white shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toast.message}</span>
        </div>
      )}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
