import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share2, Filter } from 'lucide-react';
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
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          {t('members_title')}
        </span>
        <h1 className="text-hero">
          NEWJEANS PROFILE
        </h1>
        <p className="text-sm text-slate-700 dark:text-gray-400 max-w-md">
          {t('members_sub')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-surface p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border">
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-black/40 px-4 py-2 rounded-xl border border-slate-300/80 dark:border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('members_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-medium text-gray-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-300/80 dark:border-white/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={mbtiFilter}
              onChange={(e) => setMbtiFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-zinc-900">All MBTI</option>
              <option value="ESTJ" className="dark:bg-zinc-900">ESTJ</option>
              <option value="INFP" className="dark:bg-zinc-900">INFP</option>
              <option value="ISTP" className="dark:bg-zinc-900">ISTP</option>
              <option value="ENFP" className="dark:bg-zinc-900">ENFP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Members Grid */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase">
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
                className="glass-surface p-6 rounded-2xl flex flex-col items-center text-center gap-4 border hover:border-pink-500/30 transition-all group relative"
              >
                <Link to={`/members/${member.id}`} className="w-full flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-pink-500/20 p-1 group-hover:border-pink-500 transition-colors shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{member.name}</h3>
                    <span className="text-xs text-pink-600 dark:text-pink-400 font-semibold">{member.koreanName}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2">{member.position}</p>
                </Link>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-black/5 dark:border-white/10 w-full justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('members', member);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isFav
                        ? 'bg-pink-500 text-white'
                        : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-pink-500'
                    }`}
                    title="Bookmark Member"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleShare(e, member)}
                    className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/members/${member.id}`}
                    className="px-4 py-1.5 rounded-full bg-pink-500 text-white font-semibold text-xs hover:bg-pink-600 transition-colors ml-auto"
                  >
                    {t('members_details')}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Former Member Section */}
      {filteredFormer.length > 0 && (
        <div className="flex flex-col gap-5 mt-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase">
              {t('former_members')} ({filteredFormer.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFormer.map((member) => (
              <motion.div
                key={member.id}
                className="glass-surface p-6 rounded-2xl flex flex-col items-center text-center gap-4 border relative"
              >
                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t('former_member_badge')}
                </div>

                <Link to={`/members/${member.id}`} className="w-full flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500/30 p-1 shadow-sm">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{member.name}</h3>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{member.koreanName}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2">{member.position}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
