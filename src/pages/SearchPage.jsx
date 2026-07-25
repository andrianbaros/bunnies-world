import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Disc, Users, Image as ImageIcon, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import membersData from '../data/json/members.json';
import albumsData from '../data/json/albums.json';
import galleryData from '../data/json/gallery.json';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const matchingMembers = query.trim()
    ? membersData.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.koreanName.toLowerCase().includes(query.toLowerCase()) ||
        m.role.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingAlbums = query.trim()
    ? albumsData.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.concept.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingGallery = query.trim()
    ? galleryData.filter((g) =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalResults = matchingMembers.length + matchingAlbums.length + matchingGallery.length;

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-4 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/30 text-cyan-300 text-xs font-bold tracking-widest uppercase">
          REALTIME DISCOVERY
        </span>
        <h1 className="text-hero font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          GLOBAL UNIVERSE SEARCH
        </h1>
        <p className="text-body-custom text-gray-300 max-w-md">
          Search members, albums, tracks, photocards & gallery instantly.
        </p>
      </div>

      {/* Realtime Search Bar */}
      <div className="glass-surface-blue p-5 rounded-3xl border border-cyan-300/30 shadow-2xl">
        <div className="flex items-center gap-3 bg-black/40 px-5 py-3.5 rounded-2xl border border-white/10">
          <Search className="w-5 h-5 text-cyan-300" />
          <input
            type="text"
            placeholder="Type member name, song title, or album concept..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm font-bold text-white outline-none w-full"
            autoFocus
          />
        </div>
      </div>

      {/* Results Overview */}
      {query.trim() !== '' ? (
        totalResults > 0 ? (
          <div className="flex flex-col gap-8">
            {/* Matching Members */}
            {matchingMembers.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-pink-300 flex items-center gap-2 border-b border-white/10 pb-2">
                  <Users className="w-4 h-4" />
                  <span>MEMBERS ({matchingMembers.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matchingMembers.map((m) => (
                    <Link
                      key={m.id}
                      to={`/members/${m.id}`}
                      className="glass-surface p-4 rounded-2xl flex items-center gap-3 hover:border-pink-300/40 transition-all"
                    >
                      <img src={m.image} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{m.name}</h4>
                        <span className="text-[10px] text-pink-300">{m.koreanName}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Albums */}
            {matchingAlbums.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 border-b border-white/10 pb-2">
                  <Disc className="w-4 h-4" />
                  <span>ALBUMS ({matchingAlbums.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matchingAlbums.map((a) => (
                    <Link
                      key={a.id}
                      to="/discography"
                      className="glass-surface p-4 rounded-2xl flex items-center gap-3 hover:border-cyan-300/40 transition-all"
                    >
                      <img src={a.cover} alt={a.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-white truncate">{a.title}</h4>
                        <span className="text-[10px] text-gray-400">{a.releaseDate}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty Search Results */
          <div className="glass-surface p-12 rounded-3xl text-center flex flex-col items-center gap-4">
            <span className="text-5xl">🔍🐰</span>
            <h3 className="text-xl font-bold text-white">No Result Found for "{query}"</h3>
            <p className="text-xs text-gray-400">Try searching for 'Ditto', 'Minji', 'Super Shy', or 'Attention'.</p>
          </div>
        )
      ) : (
        /* Default Search Screen */
        <div className="glass-surface p-12 rounded-3xl text-center flex flex-col items-center gap-4">
          <span className="text-5xl">✨</span>
          <h3 className="text-xl font-bold text-white">Start Searching Universe</h3>
          <p className="text-xs text-gray-400">Type any keyword above to search through members, albums, and songs in real time.</p>
        </div>
      )}
    </div>
  );
}
