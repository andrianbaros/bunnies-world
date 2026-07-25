import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 py-20 px-4 my-auto z-10 relative">
      <div className="text-6xl sm:text-8xl">🐰</div>
      <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
        404 - LOST IN UNIVERSE
      </h1>
      <p className="text-xs sm:text-sm text-gray-300 max-w-sm">
        Oops! The page you are looking for has floated away into the Y2K digital clouds.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home Universe</span>
      </Link>
    </div>
  );
}
