import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-20 px-4 my-auto z-10 relative">
      <span className="text-5xl font-black text-pink-500 tracking-tighter">404</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
        PAGE NOT FOUND
      </h1>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm hover:bg-pink-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
