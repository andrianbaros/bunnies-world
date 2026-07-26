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
    <footer className="mt-auto border-t border-pink-500/25 glass-surface rounded-none border-x-0 border-b-0 py-8 text-xs text-slate-700 dark:text-zinc-300 z-10 relative pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="Bunnies World Logo" className="w-6 h-6 object-contain rounded-md shadow-2xs" />
          <span className="font-black text-slate-950 dark:text-white tracking-wider text-sm uppercase">
            BUNNIES WORLD
          </span>
        </div>

        <p className="text-slate-500 dark:text-zinc-400 text-center font-extrabold">
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
                className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 border border-pink-500/20 text-slate-700 dark:text-zinc-300 hover:text-pink-500 hover:border-pink-500/60 transition-all cursor-pointer shadow-2xs"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}

          <button
            onClick={scrollToTop}
            className="ml-1 p-2 rounded-full bg-slate-100 dark:bg-zinc-800 border border-pink-500/20 text-slate-700 dark:text-zinc-300 hover:text-pink-500 transition-all cursor-pointer shadow-2xs"
            title="Back To Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
