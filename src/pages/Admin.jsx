import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, Pin, RefreshCw, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { storageService } from '../services/storageService';
import { useSettings } from '../contexts/SettingsContext';

export default function Admin() {
  const { showToast } = useSettings();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'bunnies2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      showToast('info', 'Admin Access Granted');
      fetchAdminPosts();
    } else {
      showToast('info', 'Incorrect Admin Passcode');
    }
  };

  const fetchAdminPosts = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching admin posts:', err.message);
        setPosts(storageService.getSettings().communityPosts || []);
      }
    } else {
      setPosts(storageService.getSettings().communityPosts || []);
    }
    setLoading(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this community post?')) return;

    if (isSupabaseConfigured() && typeof postId === 'string' && !postId.startsWith('local-')) {
      try {
        const { error } = await supabase.from('community_posts').delete().eq('id', postId);
        if (error) throw error;
        setPosts(posts.filter((p) => p.id !== postId));
        showToast('info', 'Post deleted from database!');
      } catch (err) {
        console.error('Error deleting post:', err.message);
        showToast('info', `Delete error: ${err.message}`);
      }
    } else {
      const updated = posts.filter((p) => p.id !== postId);
      setPosts(updated);
      storageService.saveCommunityPosts(updated);
      showToast('info', 'Post deleted locally!');
    }
  };

  const handleTogglePin = async (postId, currentPinState) => {
    const nextState = !currentPinState;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, is_pinned: nextState } : p)));

    if (isSupabaseConfigured() && typeof postId === 'string' && !postId.startsWith('local-')) {
      try {
        await supabase.from('community_posts').update({ is_pinned: nextState }).eq('id', postId);
        showToast('info', `Post ${nextState ? 'Pinned' : 'Unpinned'}`);
      } catch (err) {
        console.error('Error toggling pin:', err.message);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-4 max-w-md mx-auto z-10 relative">
        <form onSubmit={handleLogin} className="w-full glass-surface p-8 rounded-2xl border flex flex-col items-center gap-5 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">ADMIN MANAGEMENT PORTAL</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter admin passcode to moderate community posts.</p>
          </div>

          <input
            type="password"
            placeholder="Admin Passcode (default: bunnies2026)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            className="w-full bg-slate-100/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-pink-500 text-center font-medium"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition-colors shadow-sm"
          >
            Authenticate Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 px-4 max-w-5xl mx-auto z-10 relative">
      {/* Admin Header */}
      <div className="glass-surface p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-pink-500" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">ADMIN MODERATION CONTROL</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Full admin privileges to delete or pin community posts.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminPosts}
            className="px-4 py-2 rounded-full bg-slate-100/80 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors flex items-center gap-1.5 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-colors"
          >
            Lock Portal
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="glass-surface p-4 rounded-xl border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-pink-500" />
          <span className="text-gray-500 dark:text-gray-400">Database Driver:</span>
          <span className="font-bold text-gray-900 dark:text-white">{isSupabaseConfigured() ? 'Supabase Live PostgreSQL' : 'LocalStorage Offline Fallback'}</span>
        </div>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Total Posts: {posts.length}</span>
      </div>

      {/* Admin Posts Moderation Cards */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="glass-surface p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-900 dark:text-white">{post.author_name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold">{post.member_tag}</span>
                {post.is_pinned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold">PINNED</span>}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-xl">{post.content}</p>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{new Date(post.created_at).toLocaleString()} • {post.likes} Likes</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleTogglePin(post.id, post.is_pinned)}
                className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border ${
                  post.is_pinned ? 'bg-pink-500 text-white border-pink-500' : 'bg-slate-100/80 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-transparent hover:border-black/10'
                }`}
                title="Toggle Pin"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{post.is_pinned ? 'Unpin' : 'Pin'}</span>
              </button>

              <button
                onClick={() => handleDeletePost(post.id)}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
                title="Delete Post"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
