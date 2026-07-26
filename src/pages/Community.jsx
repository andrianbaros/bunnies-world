import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Heart, Shield, Lock, Pin, Filter, RefreshCw, MessageCircle, CornerDownRight, Code, X, Sparkles } from 'lucide-react';
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

  // Comment section state
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentAuthors, setCommentAuthors] = useState({});
  const [commentWarnings, setCommentWarnings] = useState({});

  // Dev Passcode Verification Modal state
  const [showDevModal, setShowDevModal] = useState(false);
  const [devPasscode, setDevPasscode] = useState('');
  const [devPasscodeError, setDevPasscodeError] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(null);

  const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'bunnies2026';

  const isDevNickname = (name) => {
    if (!name) return false;
    const trimmed = name.trim();
    if (/^(dev[iaon]|devin|devan|devon|devi|deva|device)$/i.test(trimmed)) {
      return false;
    }
    return /[\(\[\{\-_.\s]dev[\)\]\}]?$/i.test(trimmed) ||
           /\(dev\)/i.test(trimmed) ||
           /dev$/i.test(trimmed) ||
           /^dev$/i.test(trimmed);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    let fetchedPosts = [];

    if (isSupabaseConfigured()) {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('community_posts')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        let commentsData = [];
        try {
          const { data: cData, error: cErr } = await supabase
            .from('community_comments')
            .select('*')
            .order('created_at', { ascending: false });
          if (!cErr && cData) commentsData = cData;
        } catch (cFetchErr) {
          console.warn('community_comments table query note:', cFetchErr.message);
        }

        const commentsByPost = {};
        (commentsData || []).forEach((c) => {
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
        console.warn('Supabase fetch error, fallback to local:', err.message);
        fetchedPosts = storageService.getCommunityPosts();
      }
    } else {
      fetchedPosts = storageService.getCommunityPosts();
    }

    setPosts(fetchedPosts);
    setLoading(false);
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setProfanityWarning(hasProfanity(text));
  };

  const handleCommentContentChange = (postId, text) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
    setCommentWarnings((prev) => ({ ...prev, [postId]: hasProfanity(text) }));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    const name = authorName.trim() || 'Anonymous Bunny';

    // STRICT PROFANITY CHECK: Block upload if Nickname OR Message contains profanity!
    if (hasProfanity(name) || hasProfanity(content)) {
      showToast('error', t('community_profanity_blocked', { defaultValue: 'Post/Comment or Nickname contains toxic language & cannot be sent!' }));
      setProfanityWarning(true);
      return;
    }

    const sanitized = cleanText(content);
    const postPayload = { author: name, memberTag, content: sanitized };

    if (isDevNickname(name)) {
      setPendingSubmit({ type: 'post', payload: postPayload });
      setShowDevModal(true);
      return;
    }

    await executeAddPost(postPayload);
  };

  const executeAddPost = async (payload) => {
    setIsSubmitting(true);
    const { author, memberTag, content: sanitized } = payload;

    const newPost = {
      id: `local-${Date.now()}`,
      author_name: author,
      member_tag: memberTag,
      content: sanitized,
      likes: 0,
      is_pinned: false,
      created_at: new Date().toISOString(),
      comments: []
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .insert([
            {
              author_name: author,
              member_tag: memberTag,
              content: sanitized,
              likes: 0,
              is_pinned: false,
              comments: []
            }
          ])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          newPost.id = data[0].id;
        }
      } catch (err) {
        console.warn('Supabase insert error, saved locally:', err.message);
      }
    }

    storageService.addCommunityPost(newPost);
    setPosts((prev) => [newPost, ...prev]);
    setContent('');
    setProfanityWarning(false);
    setIsSubmitting(false);
    showToast('success', t('community_post_sent', { defaultValue: 'Post published successfully!' }));
  };

  const handleLike = async (post) => {
    const updatedLikes = (post.likes || 0) + 1;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, likes: updatedLikes } : p))
    );

    storageService.likeCommunityPost(post.id);

    if (isSupabaseConfigured() && typeof post.id === 'string' && !post.id.startsWith('local-')) {
      try {
        await supabase
          .from('community_posts')
          .update({ likes: updatedLikes })
          .eq('id', post.id);
      } catch (err) {
        console.warn('Supabase like error:', err.message);
      }
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId) => {
    const rawComment = commentInputs[postId] || '';
    if (!rawComment.trim()) return;

    const name = (commentAuthors[postId] || authorName || 'Anonymous Bunny').trim();

    // STRICT PROFANITY CHECK: Block upload if Nickname OR Comment contains profanity!
    if (hasProfanity(name) || hasProfanity(rawComment)) {
      showToast('error', t('community_profanity_blocked', { defaultValue: 'Post/Comment or Nickname contains toxic language & cannot be sent!' }));
      return;
    }

    const sanitized = cleanText(rawComment);
    const commentPayload = { postId, author: name, content: sanitized };

    if (isDevNickname(name)) {
      setPendingSubmit({ type: 'comment', payload: commentPayload });
      setShowDevModal(true);
      return;
    }

    await executeAddComment(commentPayload);
  };

  const executeAddComment = async (payload) => {
    const { postId, author, content: sanitized } = payload;
    const newComment = {
      id: `comment-${Date.now()}`,
      post_id: postId,
      author_name: author,
      content: sanitized,
      created_at: new Date().toISOString()
    };

    const targetPost = posts.find((p) => p.id === postId);
    const existingComments = targetPost?.comments || [];
    const updatedComments = [newComment, ...existingComments];

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      })
    );

    storageService.addCommunityComment(postId, newComment);

    if (isSupabaseConfigured() && typeof postId === 'string' && !postId.startsWith('local-')) {
      try {
        const { error: updateErr } = await supabase
          .from('community_posts')
          .update({ comments: updatedComments })
          .eq('id', postId);

        if (updateErr) {
          console.warn('Supabase post.comments column sync note:', updateErr.message);
          await supabase.from('community_comments').insert([{
            post_id: postId,
            author_name: author,
            content: sanitized,
            created_at: newComment.created_at
          }]);
        }
      } catch (err) {
        console.warn('Supabase comment sync error:', err.message);
      }
    }

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setCommentWarnings((prev) => ({ ...prev, [postId]: false }));
    showToast('success', t('community_comment_sent', { defaultValue: 'Comment posted successfully!' }));
  };

  const handleDevModalSubmit = async (e) => {
    e.preventDefault();
    if (devPasscode === ADMIN_PASSCODE) {
      setDevPasscodeError(false);
      setShowDevModal(false);
      const task = pendingSubmit;
      setPendingSubmit(null);
      setDevPasscode('');

      if (task?.type === 'post') {
        await executeAddPost(task.payload);
      } else if (task?.type === 'comment') {
        await executeAddComment(task.payload);
      }
      showToast('success', t('dev_modal_toast_success', { defaultValue: 'Developer Tag Verified!' }));
    } else {
      setDevPasscodeError(true);
      showToast('info', t('dev_modal_toast_error', { defaultValue: 'Incorrect Admin Passcode!' }));
    }
  };

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-4xl mx-auto z-10 relative">
      {/* Header Banner */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('community_tag')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('community_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('community_sub')}
        </p>
      </div>

      {/* Post Submission Form (iPhone Frost Glass Style) */}
      <form onSubmit={handleAddPost} className="glass-surface p-6 sm:p-8 rounded-3xl border border-pink-500/25 hover:border-pink-500/50 shadow-md flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('community_nickname_ph')}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="bg-slate-100 dark:bg-zinc-800/80 border border-pink-500/20 rounded-2xl px-4 py-3 text-xs font-extrabold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none focus:border-pink-500 shadow-2xs"
          />

          <select
            value={memberTag}
            onChange={(e) => setMemberTag(e.target.value)}
            className="bg-slate-100 dark:bg-zinc-800/80 border border-pink-500/20 rounded-2xl px-4 py-3 text-xs font-extrabold text-slate-950 dark:text-white outline-none cursor-pointer focus:border-pink-500 shadow-2xs"
          >
            <option value="NewJeans" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">NewJeans Overall</option>
            <option value="Minji" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">Minji</option>
            <option value="Hanni" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">Hanni</option>
            <option value="Haerin" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">Haerin</option>
            <option value="Hyein" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">Hyein</option>
            <option value="Bunnies" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">Bunnies Fandom</option>
          </select>
        </div>

        <div className="relative">
          <textarea
            rows="3"
            placeholder={t('community_message_ph')}
            value={content}
            onChange={handleContentChange}
            required
            className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-pink-500/20 rounded-2xl p-4 text-xs font-bold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none focus:border-pink-500 resize-none shadow-2xs"
          />
          {profanityWarning && (
            <span className="absolute right-3 bottom-3 text-[10px] text-pink-600 dark:text-pink-400 font-extrabold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{t('community_censored')}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-zinc-400 font-bold">
            <Shield className="w-3.5 h-3.5 text-pink-500" />
            <span>{t('community_shield')}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-full bg-pink-500 text-white font-extrabold text-xs hover:bg-pink-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? t('community_publishing') : t('community_post_btn')}</span>
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-950 dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-pink-500" />
            <span>{t('community_fan_posts')} ({posts.length})</span>
          </h3>

          <button onClick={fetchPosts} className="p-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-pink-500 transition-colors shadow-2xs cursor-pointer" title="Refresh Feed">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs font-bold text-slate-600 dark:text-zinc-400">{t('community_loading')}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-xs font-bold text-slate-600 dark:text-zinc-400 glass-surface rounded-3xl border border-pink-500/25">{t('community_no_posts')}</div>
        ) : (
          posts.map((post) => {
            const rawName = post.author_name || post.author || 'Anonymous Bunny';
            const name = hasProfanity(rawName) ? cleanText(rawName) : rawName;
            const isDev = isDevNickname(rawName);
            const postContent = cleanText(post.content || '');
            const postLikes = post.likes || 0;
            const postDate = post.created_at || post.date || new Date().toISOString();
            const postTag = post.member_tag || 'NewJeans';
            const commentsList = post.comments || [];
            const isCommentsOpen = !!openComments[post.id];

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-surface p-6 rounded-3xl flex flex-col gap-4 border border-pink-500/25 hover:border-pink-500/60 shadow-md transition-all ${
                  post.is_pinned ? 'border-pink-500/50 bg-pink-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center font-black text-xs text-white shadow-xs">
                      {name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-950 dark:text-white flex items-center gap-1.5">
                        <span>{name}</span>
                        {isDev && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 text-[10px] font-black border border-pink-500/40">
                            <Code className="w-3 h-3" />
                            <span>DEV</span>
                          </span>
                        )}
                        {post.is_pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black shadow-2xs">
                            <Pin className="w-3 h-3" />
                            <span>PINNED</span>
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                        {new Date(postDate).toLocaleDateString()} • Tagged: <span className="font-bold text-pink-600 dark:text-pink-400">{postTag}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-900 dark:text-zinc-100 leading-relaxed font-bold">
                  {postContent}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-pink-500/20">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(post)}
                      className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-zinc-300 hover:text-pink-500 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${postLikes > 0 ? 'text-pink-500 fill-current' : ''}`} />
                      <span>{postLikes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-zinc-300 hover:text-pink-500 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-pink-500" />
                      <span>{commentsList.length} Comments</span>
                    </button>
                  </div>
                </div>

                {/* Comment Drawer */}
                {isCommentsOpen && (
                  <div className="flex flex-col gap-3 pt-3 border-t border-pink-500/20">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Your Nickname"
                          value={commentAuthors[post.id] || ''}
                          onChange={(e) =>
                            setCommentAuthors((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          className="bg-slate-100 dark:bg-zinc-800/80 border border-pink-500/20 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white outline-none focus:border-pink-500 font-bold"
                        />
                        <div className="sm:col-span-2 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentContentChange(post.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-pink-500/20 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white outline-none focus:border-pink-500 font-bold"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pt-1">
                      {commentsList.map((c) => {
                        const rawCAuthor = c.author_name || c.author || 'Bunny';
                        const cAuthor = hasProfanity(rawCAuthor) ? cleanText(rawCAuthor) : rawCAuthor;
                        const cContent = cleanText(c.content || '');
                        return (
                          <div
                            key={c.id}
                            className="p-3 rounded-2xl bg-slate-100/90 dark:bg-zinc-800/90 border border-pink-500/20 flex flex-col gap-1 text-xs"
                          >
                            <div className="flex items-center justify-between font-black text-slate-950 dark:text-white">
                              <span>{cAuthor}</span>
                              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-800 dark:text-zinc-200 font-bold leading-relaxed">{cContent}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Dev Passcode Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 p-6 rounded-3xl border-2 border-pink-500 flex flex-col gap-4 shadow-2xl">
            <button
              onClick={() => setShowDevModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-pink-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-pink-500 font-black text-sm uppercase">
              <Code className="w-5 h-5" />
              <span>Developer Verification</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-zinc-300 font-bold">
              Entering a Developer nickname requires entering the Admin Passcode.
            </p>
            <form onSubmit={handleDevModalSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={devPasscode}
                onChange={(e) => setDevPasscode(e.target.value)}
                className="w-full bg-slate-100 dark:bg-zinc-800 border border-pink-500/30 rounded-2xl px-4 py-2.5 text-xs font-black text-slate-950 dark:text-white outline-none focus:border-pink-500"
              />
              {devPasscodeError && <span className="text-[10px] text-rose-500 font-bold">Incorrect passcode. Try again.</span>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-pink-500 text-white font-extrabold text-xs hover:bg-pink-600 transition-colors shadow-xs cursor-pointer"
              >
                Verify & Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
