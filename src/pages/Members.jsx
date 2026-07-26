import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share2, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import { useSettings } from '../contexts/SettingsContext';

export default function Members() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [mbtiFilter, setMbtiFilter] = useState('All');
  const { settings, toggleFavorite, showToast } = useSettings();

  const activeMembers = membersData.filter((m) => m.status === 'active');
  const formerMembers = membersData.filter((m) => m.status === 'former');

  const filterMember = (m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMbti = mbtiFilter === 'All' || m.mbti === mbtiFilter;
    return matchesSearch && matchesMbti;
  };

  const filteredActive = activeMembers.filter(filterMember);
  const filteredFormer = formerMembers.filter(filterMember);

  const handleShare = (e, member) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `NewJeans ${member.name}`,
        text: member.bio,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('info', `Copied link for ${member.name}!`);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-6 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Header Banner */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('members_title')}</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          NEWJEANS PROFILE
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('members_sub')}
        </p>
      </div>

      {/* iPhone Frosted Glass Search & Filter Bar */}
      <div className="glass-surface p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-pink-500/25 shadow-md">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-pink-500/20 focus-within:border-pink-500 flex-grow max-w-md shadow-2xs transition-colors">
          <Search className="w-4 h-4 text-pink-500" />
          <input
            type="text"
            placeholder={t('members_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/80 px-3.5 py-2 rounded-2xl border border-pink-500/20 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-pink-500" />
            <select
              value={mbtiFilter}
              onChange={(e) => setMbtiFilter(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-950 dark:text-white outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">All MBTI</option>
              <option value="ESTJ" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">ESTJ</option>
              <option value="INFP" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">INFP</option>
              <option value="ISTP" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">ISTP</option>
              <option value="ENFP" className="bg-white dark:bg-zinc-900 text-slate-950 dark:text-white">ENFP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Members Grid */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
          <h2 className="text-sm font-black text-slate-950 dark:text-white tracking-wider uppercase">
            {t('active_members')} ({filteredActive.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActive.map((member, idx) => {
            const isFav = settings.favorites?.members?.some((m) => m.id === member.id);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="glass-surface p-6 rounded-3xl flex flex-col items-center text-center gap-4 border border-pink-500/25 hover:border-pink-500/60 transition-all hover:-translate-y-1.5 group relative shadow-md"
              >
                <Link to={`/members/${member.id}`} className="w-full flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-pink-500/30 p-1 group-hover:border-pink-500 transition-colors shadow-xs">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{member.name}</h3>
                    <span className="text-xs text-pink-600 dark:text-pink-400 font-extrabold">{member.koreanName}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 font-medium">{member.position}</p>
                </Link>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-pink-500/20 w-full justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('members', member);
                    }}
                    className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                      isFav
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-pink-500 hover:bg-pink-500/10'
                    }`}
                    title="Bookmark Member"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleShare(e, member)}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-pink-500 hover:bg-pink-500/10 transition-colors cursor-pointer"
                    title="Share Member"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/members/${member.id}`}
                    className="px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-bold hover:bg-pink-600 transition-colors shadow-xs"
                  >
                    Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Former Members Section */}
      {filteredFormer.length > 0 && (
        <div className="flex flex-col gap-5 mt-4">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
            <h2 className="text-sm font-black text-slate-950 dark:text-white tracking-wider uppercase">
              {t('former_members')} ({filteredFormer.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFormer.map((member) => (
              <div
                key={member.id}
                className="glass-surface p-6 rounded-3xl flex flex-col items-center text-center gap-3 border border-pink-500/20 opacity-80"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-300 dark:border-zinc-700 p-1">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full filter grayscale" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-950 dark:text-white">{member.name}</h3>
                  <span className="text-[11px] text-pink-600 dark:text-pink-400 font-extrabold">{member.koreanName}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">{member.position}</p>
                <Link
                  to={`/members/${member.id}`}
                  className="mt-2 text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
                >
                  View Archive →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
