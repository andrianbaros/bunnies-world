import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Heart, Shield, Lock, Pin, Filter, RefreshCw, MessageCircle, CornerDownRight, Code, X } from 'lucide-react';
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
  const [pendingSubmit, setPendingSubmit] = useState(null); // { type: 'post' | 'comment', payload: ... }

  const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'bunnies2026';

  // Smart Dev Nickname Detection:
  // Catches (dev), [dev], _dev, -dev, .dev, " dev", or ending with "dev"
  // But EXCLUDES real names starting with Dev (Devi, Devon, Devin, Devan, Deva)
  const isDevNickname = (name) => {
    if (!name) return false;
    const trimmed = name.trim();

    // Ignore legitimate real names starting with Dev
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
        console.warn('Supabase fetch failed, falling back to local storage:', err.message);
        fetchedPosts = storageService.getSettings().communityPosts || [];
      }
    } else {
      fetchedPosts = storageService.getSettings().communityPosts || [];
    }

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

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    setProfanityWarning(hasProfanity(val));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalAuthor = authorName.trim() || 'Anonymous Bunny';

    // 1. Strict Profanity Check on Nickname & Content
    if (hasProfanity(finalAuthor) || hasProfanity(content)) {
      showToast('info', t('community_profanity_blocked', { defaultValue: 'Post/Comment or Nickname contains toxic language & cannot be sent!' }));
      return;
    }


    const postPayload = {
      author_name: finalAuthor,
      member_tag: memberTag,
      content: cleanText(content)
    };

    if (isDevNickname(finalAuthor)) {
      setPendingSubmit({ type: 'post', payload: postPayload });
      setShowDevModal(true);
      return;
    }

    await executeAddPost(postPayload);
  };

  const executeAddPost = async (payload) => {
    setIsSubmitting(true);
    const newPost = {
      ...payload,
      likes: 0,
      is_pinned: false,
      comments: [],
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('community_posts').insert([newPost]).select();
        if (error) throw error;
        if (data) setPosts([{ ...data[0], comments: [] }, ...posts]);
        showToast('info', 'Post published successfully!');
      } catch (err) {
        console.error('Supabase insert error:', err.message);
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
    showToast('info', 'Post saved locally!');
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

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentTextChange = (postId, val) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: val }));
    setCommentWarnings((prev) => ({ ...prev, [postId]: hasProfanity(val) }));
  };

  const handleCommentAuthorChange = (postId, val) => {
    setCommentAuthors((prev) => ({ ...prev, [postId]: val }));
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const author = (commentAuthors[postId] || '').trim() || 'Anonymous Bunny';

    // 1. Strict Profanity Check on Comment Nickname & Content
    if (hasProfanity(author) || hasProfanity(text)) {
      showToast('info', t('community_profanity_blocked', { defaultValue: 'Post/Comment or Nickname contains toxic language & cannot be sent!' }));
      return;
    }

    const commentPayload = {
      postId,
      author,
      content: cleanText(text)
    };

    if (isDevNickname(author)) {
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('community_tag')}
        </span>
        <h1 className="text-hero">
          {t('community_title')}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {t('community_sub')}
        </p>
      </div>

      {/* Post Submission Form */}
      <form onSubmit={handleAddPost} className="glass-surface p-6 rounded-2xl border flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('community_nickname_ph')}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500"
          />

          <select
            value={memberTag}
            onChange={(e) => setMemberTag(e.target.value)}
            className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-heading)] outline-none cursor-pointer focus:border-pink-500"
          >
            <option value="NewJeans" className="bg-[var(--bg-popover)]">NewJeans Overall</option>
            <option value="Minji" className="bg-[var(--bg-popover)]">Minji</option>
            <option value="Hanni" className="bg-[var(--bg-popover)]">Hanni</option>
            <option value="Haerin" className="bg-[var(--bg-popover)]">Haerin</option>
            <option value="Hyein" className="bg-[var(--bg-popover)]">Hyein</option>
            <option value="Bunnies" className="bg-[var(--bg-popover)]">Bunnies Fandom</option>
          </select>
        </div>

        <div className="relative">
          <textarea
            rows="3"
            placeholder={t('community_message_ph')}
            value={content}
            onChange={handleContentChange}
            required
            className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl p-4 text-xs text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500 resize-none"
          />
          {profanityWarning && (
            <span className="absolute right-3 bottom-3 text-[10px] text-pink-600 dark:text-pink-400 font-semibold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{t('community_censored')}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <Shield className="w-3.5 h-3.5 text-pink-500" />
            <span>{t('community_shield')}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? t('community_publishing') : t('community_post_btn')}</span>
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--text-heading)] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-500" />
            <span>{t('community_fan_posts')} ({posts.length})</span>
          </h3>

          <button onClick={fetchPosts} className="p-2 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-heading)] transition-colors" title="Refresh Feed">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-[var(--text-muted)]">{t('community_loading')}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-xs text-[var(--text-muted)] glass-surface rounded-2xl">{t('community_no_posts')}</div>
        ) : (
          posts.map((post) => {
            const authorName = post.author_name || post.author || 'Anonymous Bunny';
            const isDev = isDevNickname(authorName);
            const postContent = post.content || '';
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
                className={`glass-surface p-5 rounded-2xl flex flex-col gap-3 border transition-all ${
                  post.is_pinned ? 'border-pink-500/40 bg-pink-500/5' : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xs text-white">
                      {authorName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-heading)] flex items-center gap-1.5">
                        <span>{authorName}</span>
                        {isDev && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-extrabold flex items-center gap-0.5 shadow-xs">
                            <Code className="w-2.5 h-2.5" /> DEV
                          </span>
                        )}
                        {post.is_pinned && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[9px] font-bold flex items-center gap-0.5 border border-pink-500/20">
                            <Pin className="w-2.5 h-2.5" /> {t('community_pinned')}
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">
                        {new Date(postDate).toLocaleDateString()} • {postTag}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]" title="Regular users cannot delete posts">
                    <Lock className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('community_admin_protected')}</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed font-sans">{postContent}</p>

                {/* Post Footer Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id, postLikes)}
                      className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-pink-500 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-pink-500 hover:fill-current" />
                      <span>{postLikes} {t('community_likes')}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        isCommentsOpen ? 'text-pink-500 font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{commentsList.length} {t('community_comments', { defaultValue: 'Comments' })}</span>
                    </button>
                  </div>
                </div>

                {/* Comment Section (Expandable Drawer) */}
                <AnimatePresence>
                  {isCommentsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-3 pt-3 border-t border-[var(--border-color)] overflow-hidden"
                    >
                      {/* Responsive Add Comment Form */}
                      <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex flex-col gap-2.5 bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-color)]">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            placeholder={t('community_nickname_ph', { defaultValue: 'Nickname...' })}
                            value={commentAuthors[post.id] || ''}
                            onChange={(e) => handleCommentAuthorChange(post.id, e.target.value)}
                            className="w-full sm:w-1/3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl sm:rounded-lg px-3 py-2 sm:py-1.5 text-xs sm:text-[11px] text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500"
                          />
                          <div className="flex items-center gap-2 flex-grow">
                            <input
                              type="text"
                              placeholder={t('community_add_comment', { defaultValue: 'Tulis komentar...' })}
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                              required
                              className="flex-grow bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl sm:rounded-lg px-3 py-2 sm:py-1.5 text-xs sm:text-[11px] text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 sm:py-1.5 rounded-full bg-pink-500 text-white font-bold text-xs sm:text-[11px] hover:bg-pink-600 transition-colors flex items-center justify-center gap-1 flex-shrink-0 shadow-sm"
                            >
                              <span>{t('community_reply_btn', { defaultValue: 'Kirim' })}</span>
                              <CornerDownRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {commentWarnings[post.id] && (
                          <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            <span>{t('community_censored')}</span>
                          </span>
                        )}
                      </form>

                      {/* Comments List */}
                      <div className="flex flex-col gap-2">
                        {commentsList.length > 0 ? (
                          commentsList.map((c) => {
                            const isCommentDev = isDevNickname(c.author_name || '');
                            return (
                              <div
                                key={c.id || c.created_at}
                                className="flex items-start gap-2.5 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] shadow-xs"
                              >
                                <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-pink-500/30">
                                  {(c.author_name || 'B')[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left gap-0.5 flex-grow">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[11px] text-[var(--text-heading)] flex items-center gap-1">
                                      <span>{c.author_name || 'Anonymous Bunny'}</span>
                                      {isCommentDev && (
                                        <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[8px] font-extrabold flex items-center gap-0.5 shadow-xs">
                                          <Code className="w-2 h-2" /> DEV
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-[9px] text-[var(--text-muted)]">{new Date(c.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-[11px] text-[var(--text-primary)] leading-relaxed">{c.content}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-3 text-[11px] text-[var(--text-muted)] italic">
                            {t('community_no_comments', { defaultValue: 'Belum ada komentar. Jadilah yang pertama membalas!' })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Dev Passcode Verification Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-surface p-6 sm:p-8 rounded-2xl border border-pink-500/40 max-w-md w-full flex flex-col gap-4 shadow-2xl relative bg-[var(--bg-card)]"
          >
            <button
              onClick={() => { setShowDevModal(false); setPendingSubmit(null); setDevPasscode(''); setDevPasscodeError(false); }}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-heading)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-pink-500">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-heading)] uppercase tracking-wider">{t('dev_modal_title', { defaultValue: 'DEVELOPER TAG VERIFICATION' })}</h3>
                <span className="text-[10px] text-pink-500 font-bold">{t('dev_modal_subtitle', { defaultValue: 'Restricted Name Filter' })}</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('dev_modal_desc', { defaultValue: 'You are using the reserved tag "dev" in your nickname. Please enter the Admin Passcode to verify your developer identity.' })}
            </p>

            <form onSubmit={handleDevModalSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder={t('dev_modal_placeholder', { defaultValue: 'Enter Admin Passcode...' })}
                value={devPasscode}
                onChange={(e) => setDevPasscode(e.target.value)}
                autoFocus
                required
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none focus:border-pink-500 text-center font-medium"
              />

              {devPasscodeError && (
                <span className="text-[11px] text-red-500 font-bold text-center">
                  {t('dev_modal_error', { defaultValue: '❌ Incorrect Admin Passcode! You cannot use the (dev) tag.' })}
                </span>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowDevModal(false); setPendingSubmit(null); setDevPasscode(''); setDevPasscodeError(false); }}
                  className="px-4 py-2 rounded-full bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-heading)] font-semibold"
                >
                  {t('dev_modal_cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-pink-500 text-white text-xs font-bold hover:bg-pink-600 transition-colors shadow-sm"
                >
                  {t('dev_modal_submit', { defaultValue: 'Verify & Submit' })}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
