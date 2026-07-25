import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Trash2, Pin, RefreshCw, AlertCircle, CheckCircle, Database } from 'lucide-react';
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
      showToast('info', '🔓 Admin Access Granted!');
      fetchAdminPosts();
    } else {
      showToast('info', '❌ Incorrect Admin Passcode!');
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
        showToast('info', '🗑️ Post deleted from Supabase live database!');
      } catch (err) {
        console.error('Error deleting post:', err.message);
        showToast('info', `❌ Delete error: ${err.message}`);
      }
    } else {
      // Local storage delete
      const updated = posts.filter((p) => p.id !== postId);
      setPosts(updated);
      storageService.saveCommunityPosts(updated);
      showToast('info', '🗑️ Post deleted locally!');
    }
  };

  const handleTogglePin = async (postId, currentPinState) => {
    const nextState = !currentPinState;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, is_pinned: nextState } : p)));

    if (isSupabaseConfigured() && typeof postId === 'string' && !postId.startsWith('local-')) {
      try {
        await supabase.from('community_posts').update({ is_pinned: nextState }).eq('id', postId);
        showToast('info', `📌 Post ${nextState ? 'Pinned' : 'Unpinned'}!`);
      } catch (err) {
        console.error('Error toggling pin:', err.message);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-4 max-w-md mx-auto z-10 relative">
        <form onSubmit={handleLogin} className="w-full glass-surface-pink p-8 rounded-3xl border border-pink-300/30 flex flex-col items-center gap-5 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-pink-400/20 flex items-center justify-center text-pink-300 border border-pink-300/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">ADMIN MANAGEMENT PORTAL</h1>
            <p className="text-xs text-gray-300 mt-1">Enter your admin passcode to moderate community posts.</p>
          </div>

          <input
            type="password"
            placeholder="Admin Passcode (default: bunnies2026)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-400 outline-none focus:border-pink-300 text-center"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-transform"
          >
            Authenticate Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 px-4 max-w-5xl mx-auto z-10 relative">
      {/* Admin Header */}
      <div className="glass-surface p-6 rounded-3xl border border-cyan-300/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-300" />
          <div>
            <h1 className="text-xl font-extrabold text-white">SUPABASE ADMIN MODERATION CONTROL</h1>
            <p className="text-xs text-gray-300">You have full admin privileges to delete or pin community posts.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchAdminPosts} className="px-4 py-2 rounded-full bg-black/40 border border-white/10 text-xs text-white hover:bg-white/10 flex items-center gap-1.5 font-bold">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-xs text-red-300 font-bold hover:bg-red-500/30">
            Lock Portal
          </button>
        </div>
      </div>

      {/* Database Connection Status Card */}
      <div className="glass-surface p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-300" />
          <span className="text-gray-300">Database Driver:</span>
          <span className="font-bold text-pink-300">{isSupabaseConfigured() ? 'Supabase Live PostgreSQL' : 'LocalStorage Offline Fallback'}</span>
        </div>
        <span className="text-[10px] text-gray-400">Total Posts: {posts.length}</span>
      </div>

      {/* Admin Posts Moderation Table / Cards */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="glass-surface p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{post.author_name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-bold">{post.member_tag}</span>
                {post.is_pinned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-400/20 text-pink-300 font-bold">PINNED</span>}
              </div>
              <p className="text-xs text-gray-300 truncate max-w-xl">{post.content}</p>
              <span className="text-[10px] text-gray-500">{new Date(post.created_at).toLocaleString()} • {post.likes} Likes</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleTogglePin(post.id, post.is_pinned)}
                className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  post.is_pinned ? 'bg-pink-400/20 text-pink-300 border border-pink-300/30' : 'bg-white/5 text-gray-300 hover:text-white'
                }`}
                title="Toggle Pin"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{post.is_pinned ? 'Unpin' : 'Pin'}</span>
              </button>

              <button
                onClick={() => handleDeletePost(post.id)}
                className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-all flex items-center gap-1"
                title="Delete Post (Admin Only)"
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
