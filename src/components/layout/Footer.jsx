import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'Facebook', url: 'https://web.facebook.com/official.newjeans', icon: Facebook, color: 'hover:text-blue-400' },
    { name: 'YouTube', url: 'https://www.youtube.com/c/NewJeans_official', icon: Youtube, color: 'hover:text-red-500' },
    { name: 'X / Twitter', url: 'https://x.com/NewJeans_ADOR', icon: Twitter, color: 'hover:text-cyan-400' },
    { name: 'Instagram', url: 'https://www.instagram.com/newjeans_official/', icon: Instagram, color: 'hover:text-pink-400' }
  ];

  return (
    <footer className="mt-auto border-t border-pink-300/10 bg-[#0d0b14]/90 backdrop-blur-md py-8 text-center text-xs text-gray-400 z-10 relative pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐰</span>
          <span className="font-extrabold text-pink-300 tracking-wider text-sm">BUNNIES UNIVERSE</span>
        </div>

        <p className="text-gray-400">© 2026 BUNNIES UNIVERSE - Designed with Love for NewJeans & Bunnies</p>

        {/* Official Social Links */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className={`p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 transition-all hover:scale-110 ${social.color}`}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}

          <button
            onClick={scrollToTop}
            className="ml-2 p-2 rounded-full bg-pink-400/20 border border-pink-300/40 text-pink-300 hover:text-white hover:bg-pink-400/30 transition-all flex items-center gap-1 font-bold text-xs"
            title="Back To Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
