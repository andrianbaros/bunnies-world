import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share2, Filter, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import membersData from '../data/json/members.json';
import { useSettings } from '../contexts/SettingsContext';

export default function Members() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [mbtiFilter, setMbtiFilter] = useState('All');
  const { settings, toggleFavorite } = useSettings();

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
      alert(`Copied link for ${member.name}!`);
    }
  };

  return (
    <div className="flex flex-col gap-12 py-8 px-4 max-w-6xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-pink-400/10 border border-pink-300/30 text-pink-300 text-xs font-bold tracking-widest uppercase">
          {t('members_title')}
        </span>
        <h1 className="text-hero font-black bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          NEWJEANS PROFILE
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md">
          {t('members_sub')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-surface-pink p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-pink-300/30">
        <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-2xl border border-white/10 flex-grow max-w-md">
          <Search className="w-4 h-4 text-pink-300" />
          <input
            type="text"
            placeholder="Search member by name or MBTI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs font-bold text-white outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-purple-300" />
            <select
              value={mbtiFilter}
              onChange={(e) => setMbtiFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="All" className="bg-gray-900">All MBTI</option>
              <option value="ESTJ" className="bg-gray-900">ESTJ</option>
              <option value="INFP" className="bg-gray-900">INFP</option>
              <option value="ISTP" className="bg-gray-900">ISTP</option>
              <option value="ENFP" className="bg-gray-900">ENFP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Members Grid */}
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-pink-300 flex items-center gap-2 border-b border-white/10 pb-2">
          <span>✨</span>
          <span>{t('active_members')} ({filteredActive.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActive.map((member, idx) => {
            const isFav = settings.favorites?.members?.some((m) => m.id === member.id);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-surface p-6 rounded-3xl flex flex-col items-center text-center gap-4 border border-white/10 hover:border-pink-300/40 transition-all cursor-pointer relative group"
              >
                <Link to={`/members/${member.id}`} className="w-full flex flex-col items-center gap-4">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-pink-300/30 p-1 group-hover:border-pink-300 transition-colors shadow-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-card-title font-extrabold text-white tracking-wide">{member.name}</h3>
                    <span className="text-xs text-pink-300 font-bold">{member.koreanName}</span>
                  </div>
                  <p className="text-caption-custom text-gray-300 line-clamp-2">{member.position}</p>
                </Link>

                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/10 w-full justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('members', member);
                    }}
                    className={`p-2 rounded-full border transition-all ${
                      isFav
                        ? 'bg-pink-400/20 border-pink-300 text-pink-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-300' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleShare(e, member)}
                    className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/members/${member.id}`}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs hover:scale-105 transition-transform"
                  >
                    Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Former Member Section (Danielle) */}
      {filteredFormer.length > 0 && (
        <div className="flex flex-col gap-6 mt-6">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2 border-b border-white/10 pb-2">
            <span>🌸</span>
            <span>{t('former_members')} ({filteredFormer.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFormer.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -6 }}
                className="glass-surface p-6 rounded-3xl flex flex-col items-center text-center gap-4 border border-yellow-300/30 relative"
              >
                {/* Former Member Badge */}
                <div className="absolute top-4 right-4 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {t('former_member_badge')}
                </div>

                <Link to={`/members/${member.id}`} className="w-full flex flex-col items-center gap-4">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-yellow-300/40 p-1 shadow-2xl">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-card-title font-extrabold text-white tracking-wide">{member.name}</h3>
                    <span className="text-xs text-yellow-300 font-bold">{member.koreanName}</span>
                  </div>
                  <p className="text-caption-custom text-gray-300 line-clamp-2">{member.position}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
