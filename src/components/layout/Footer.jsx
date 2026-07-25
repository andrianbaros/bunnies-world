import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'Facebook', url: 'https://web.facebook.com/official.newjeans', icon: Facebook },
    { name: 'YouTube', url: 'https://www.youtube.com/c/NewJeans_official', icon: Youtube },
    { name: 'X / Twitter', url: 'https://x.com/NewJeans_ADOR', icon: Twitter },
    { name: 'Instagram', url: 'https://www.instagram.com/newjeans_official/', icon: Instagram }
  ];

  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10 glass-surface rounded-none border-x-0 border-b-0 py-8 text-xs text-slate-700 dark:text-gray-400 z-10 relative pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="Bunnies World Logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="font-bold text-gray-900 dark:text-white tracking-wider text-sm uppercase">
            BUNNIES WORLD
          </span>
        </div>


        <p className="text-slate-600 dark:text-gray-400 text-center">
          © 2026 BUNNIES WORLD — Interactive Fan Portal
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-500/30 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}

          <button
            onClick={scrollToTop}
            className="ml-1 p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-all"
            title="Back To Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
