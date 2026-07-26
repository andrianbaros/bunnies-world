import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, Pin, RefreshCw, Database, MessageCircle, X, Bot } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { storageService } from '../services/storageService';
import { useSettings } from '../contexts/SettingsContext';
import { BYNARA_MODELS } from '../services/aiService';

export default function Admin() {
  const { settings, updateSetting, showToast } = useSettings();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

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
    let fetchedPosts = [];

    if (isSupabaseConfigured()) {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (postsError) throw postsError;

        let commentsData = [];
        try {
          const { data: cData } = await supabase
            .from('community_comments')
            .select('*')
            .order('created_at', { ascending: false });
          if (cData) commentsData = cData;
        } catch (e) {}

        const commentsByPost = {};
        commentsData.forEach((c) => {
          if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
          commentsByPost[c.post_id].push(c);
        });

        fetchedPosts = (postsData || []).map((p) => {
          let parsedComments = [];
          if (Array.isArray(p.comments)) {
            parsedComments = p.comments;
          } else if (typeof p.comments === 'string') {
            try { parsedComments = JSON.parse(p.comments); } catch (e) { parsedComments = []; }
          }
          const tableComments = commentsByPost[p.id] || [];
          return {
            ...p,
            comments: [...parsedComments, ...tableComments]
          };
        });
      } catch (err) {
        console.error('Error fetching admin posts:', err.message);
        fetchedPosts = storageService.getSettings().communityPosts || [];
      }
    } else {
      fetchedPosts = storageService.getSettings().communityPosts || [];
    }

    // Merge comments from local storage
    const localPosts = storageService.getSettings().communityPosts || [];
    const localCommentsMap = {};
    localPosts.forEach((lp) => {
      if (lp.comments && lp.comments.length > 0) {
        localCommentsMap[lp.id] = lp.comments;
      }
    });

    const postsWithComments = fetchedPosts.map((p) => {
      const remoteComments = p.comments || [];
      const localComments = localCommentsMap[p.id] || [];
      const combined = [...remoteComments];
      localComments.forEach((lc) => {
        if (!combined.some((rc) => rc.id === lc.id || (rc.content === lc.content && rc.author_name === lc.author_name))) {
          combined.push(lc);
        }
      });
      return { ...p, comments: combined };
    });

    setPosts(postsWithComments);
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

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    const targetPost = posts.find((p) => p.id === postId);
    const updatedComments = (targetPost?.comments || []).filter((c) => c.id !== commentId);

    // 1. Update React state
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: updatedComments } : p)));

    // 2. LocalStorage delete
    storageService.deleteCommunityComment(postId, commentId);

    // 3. Supabase delete sync
    if (isSupabaseConfigured() && typeof postId === 'string' && !postId.startsWith('local-')) {
      try {
        await supabase
          .from('community_posts')
          .update({ comments: updatedComments })
          .eq('id', postId);

        try {
          await supabase.from('community_comments').delete().eq('id', commentId);
        } catch (e) {}
      } catch (err) {
        console.error('Error deleting comment in Supabase:', err.message);
      }
    }

    showToast('info', 'Komentar berhasil dihapus!');
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
            <h1 className="text-lg font-bold text-[var(--text-heading)] uppercase tracking-wider">ADMIN MANAGEMENT PORTAL</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Enter admin passcode to moderate community posts & comments.</p>
          </div>

          <input
            type="password"
            placeholder="Admin Passcode (default: bunnies2026)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500 text-center font-medium"
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
            <h1 className="text-lg font-bold text-[var(--text-heading)] uppercase tracking-wider">ADMIN MODERATION CONTROL</h1>
            <p className="text-xs text-[var(--text-muted)]">Full admin privileges to delete posts & moderate comments.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminPosts}
            className="px-4 py-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-heading)] hover:bg-[var(--bg-subtle-hover)] transition-colors flex items-center gap-1.5 font-semibold"
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

      {/* AI Model Routing Control */}
      <div className="glass-surface p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-heading)] uppercase tracking-wider">BUNNY AI MODEL ROUTING</h2>
            <p className="text-xs text-[var(--text-muted)]">Select active Bynara AI model used by Bunny AI chatbot across the app.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] font-medium">Active Model:</span>
          <select
            value={settings.aiModel || 'mistral-medium-3-5'}
            onChange={(e) => {
              updateSetting('aiModel', e.target.value);
              showToast('info', `Bunny AI model switched to: ${e.target.value}`);
            }}
            className="bg-[var(--bg-card)] text-xs font-bold text-[var(--text-heading)] border border-[var(--border-color)] rounded-xl px-4 py-2 outline-none cursor-pointer focus:border-pink-500 transition-colors shadow-xs"
          >
            {BYNARA_MODELS.map((m) => (
              <option key={m} value={m} className="bg-[var(--bg-popover)]">
                {m} {m === 'mistral-medium-3-5' ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Connection Status */}
      <div className="glass-surface p-4 rounded-xl border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-pink-500" />
          <span className="text-[var(--text-muted)]">Database Driver:</span>
          <span className="font-bold text-[var(--text-heading)]">{isSupabaseConfigured() ? 'Supabase Live PostgreSQL' : 'LocalStorage Offline Fallback'}</span>
        </div>
        <span className="text-[11px] text-[var(--text-muted)] font-medium">Total Posts: {posts.length}</span>
      </div>


      {/* Admin Posts & Comments Moderation Cards */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => {
          const commentsList = post.comments || [];
          const isCommentsExpanded = !!expandedComments[post.id];

          return (
            <div key={post.id} className="glass-surface p-4 sm:p-5 rounded-xl border flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--text-heading)]">{post.author_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold">{post.member_tag}</span>
                    {post.is_pinned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold">PINNED</span>}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate max-w-xl">{post.content}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-medium">
                    <span>{new Date(post.created_at).toLocaleString()}</span>
                    <span>• {post.likes} Likes</span>
                    <span>• {commentsList.length} Comments</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="p-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-transparent hover:border-[var(--border-color)] text-xs font-semibold flex items-center gap-1"
                    title="View & Moderate Comments"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-pink-500" />
                    <span>Comments ({commentsList.length})</span>
                  </button>

                  <button
                    onClick={() => handleTogglePin(post.id, post.is_pinned)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border ${
                      post.is_pinned ? 'bg-pink-500 text-white border-pink-500' : 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border-transparent hover:border-[var(--border-color)]'
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

              {/* Admin Comments Moderation List */}
              {isCommentsExpanded && (
                <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] p-3 rounded-xl">
                  <span className="text-[11px] font-bold text-[var(--text-heading)] uppercase tracking-wider">MODERATE COMMENTS</span>
                  {commentsList.length > 0 ? (
                    commentsList.map((c) => (
                      <div key={c.id || c.created_at} className="flex items-center justify-between bg-[var(--bg-card)] p-2.5 rounded-lg border border-[var(--border-color)] text-xs">
                        <div className="flex flex-col text-left gap-0.5 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[11px] text-[var(--text-heading)]">{c.author_name}</span>
                            <span className="text-[9px] text-[var(--text-muted)]">{new Date(c.created_at || Date.now()).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-primary)] truncate">{c.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(post.id, c.id)}
                          className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0"
                          title="Delete Comment"
                        >
                          <X className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] italic">No comments on this post.</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
