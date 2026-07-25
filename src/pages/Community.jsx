import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Heart, Shield, Lock, Trash2, Pin, Sparkles, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { storageService } from '../services/storageService';
import { cleanText, hasProfanity } from '../utils/profanityFilter';
import { useSettings } from '../contexts/SettingsContext';

export default function Community() {
  const { t } = useTranslation();
  const { showToast } = useSettings();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [memberTag, setMemberTag] = useState('NewJeans');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profanityWarning, setProfanityWarning] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err.message);
        setPosts(storageService.getSettings().communityPosts || []);
      }
    } else {
      // Fallback local storage
      setPosts(storageService.getSettings().communityPosts || []);
    }
    setLoading(false);
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (hasProfanity(val)) {
      setProfanityWarning(true);
    } else {
      setProfanityWarning(false);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const sanitizedContent = cleanText(content);
    const finalAuthor = authorName.trim() || 'Anonymous Bunny';

    const newPost = {
      author_name: finalAuthor,
      member_tag: memberTag,
      content: sanitizedContent,
      likes: 0,
      is_pinned: false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('community_posts').insert([newPost]).select();
        if (error) throw error;
        if (data) setPosts([data[0], ...posts]);
        showToast('info', '✨ Post published to Supabase live database!');
      } catch (err) {
        console.error('Supabase insert error:', err.message);
        // Fallback local
        saveLocalPost(newPost);
      }
    } else {
      saveLocalPost(newPost);
    }

    setContent('');
    setProfanityWarning(false);
    setIsSubmitting(false);
  };

  const saveLocalPost = (post) => {
    const localPost = { ...post, id: 'local-' + Date.now() };
    const updated = [localPost, ...posts];
    setPosts(updated);
    storageService.saveCommunityPosts(updated);
    showToast('info', '✨ Post saved locally!');
  };

  const handleLike = async (postId, currentLikes) => {
    const newLikes = currentLikes + 1;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p)));

    if (isSupabaseConfigured() && typeof postId === 'string' && !postId.startsWith('local-')) {
      try {
        await supabase.from('community_posts').update({ likes: newLikes }).eq('id', postId);
      } catch (err) {
        console.error('Error updating likes:', err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-4xl mx-auto z-10 relative">
      {/* Header Banner */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300 text-xs font-bold tracking-widest uppercase">
          {t('community_tag')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          {t('community_title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md">
          {t('community_sub')}
        </p>
      </div>

      {/* Supabase Status Alert */}
      {!isSupabaseConfigured() && (
        <div className="glass-surface p-4 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-between text-xs text-yellow-300 gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-400" />
            <span>Supabase credentials pending in <code>.env</code>. Running in offline LocalStorage mode.</span>
          </div>
        </div>
      )}

      {/* Post Submission Form */}
      <form onSubmit={handleAddPost} className="glass-surface-pink p-6 rounded-3xl border border-pink-300/30 flex flex-col gap-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('community_nickname_ph')}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-pink-300"
          />

          <select
            value={memberTag}
            onChange={(e) => setMemberTag(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-pink-300"
          >
            <option value="NewJeans" className="bg-gray-900">✨ NewJeans Overall</option>
            <option value="Minji" className="bg-gray-900">🐻 Minji</option>
            <option value="Hanni" className="bg-gray-900">🐰 Hanni</option>
            <option value="Haerin" className="bg-gray-900">🐱 Haerin</option>
            <option value="Hyein" className="bg-gray-900">🐥 Hyein</option>
            <option value="Bunnies" className="bg-gray-900">💖 Bunnies Fandom</option>
          </select>
        </div>

        <div className="relative">
          <textarea
            rows="3"
            placeholder={t('community_message_ph')}
            value={content}
            onChange={handleContentChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-400 outline-none focus:border-pink-300 resize-none"
          />
          {profanityWarning && (
            <span className="absolute right-3 bottom-3 text-[10px] text-pink-300 font-bold bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-300/30 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{t('community_censored')}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <Shield className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t('community_shield')}</span>
            </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? t('community_publishing') : t('community_post_btn')}</span>
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-300" />
            <span>{t('community_fan_posts')} ({posts.length})</span>
          </h3>

          <button onClick={fetchPosts} className="p-1.5 rounded-full bg-white/5 text-gray-300 hover:text-white transition-colors" title="Refresh Feed">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-gray-400">{t('community_loading')}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-400 glass-surface rounded-3xl">{t('community_no_posts')}</div>
        ) : (
          posts.map((post) => {
            // Normalize: support both old localStorage format (author) and Supabase format (author_name)
            const authorName = post.author_name || post.author || 'Anonymous Bunny';
            const postContent = post.content || '';
            const postLikes = post.likes || 0;
            const postDate = post.created_at || post.date || new Date().toISOString();
            const postTag = post.member_tag || 'NewJeans';
            return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-surface p-5 rounded-3xl flex flex-col gap-3 border transition-all ${
                post.is_pinned ? 'border-pink-300/50 bg-pink-500/10' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center font-bold text-xs text-white">
                    {authorName[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{authorName}</span>
                      {post.is_pinned && (
                        <span className="px-2 py-0.2 rounded-full bg-pink-400/20 text-pink-300 text-[9px] font-extrabold flex items-center gap-0.5 border border-pink-300/30">
                          <Pin className="w-2.5 h-2.5" /> {t('community_pinned')}
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      {new Date(postDate).toLocaleDateString()} • {postTag}
                    </span>
                  </div>
                </div>

                {/* Regular User Protected Indicator */}
                <div className="flex items-center gap-1 text-[10px] text-gray-500" title="Regular users cannot delete posts">
                  <Lock className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('community_admin_protected')}</span>
                </div>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed font-sans">{postContent}</p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={() => handleLike(post.id, postLikes)}
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-pink-300 transition-colors"
                >
                  <Heart className="w-4 h-4 text-pink-300 fill-pink-300/30 hover:fill-pink-300" />
                  <span>{postLikes} {t('community_likes')}</span>
                </button>
              </div>
            </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
