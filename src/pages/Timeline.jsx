import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import timelineData from '../data/json/timeline.json';

export default function Timeline() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10 py-8 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          {t('timeline_title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md">
          {t('timeline_sub')}
        </p>
      </div>

      <div className="relative border-l-2 border-pink-300/30 ml-4 sm:ml-32 flex flex-col gap-10 py-4">
        {timelineData.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative pl-6 sm:pl-8"
          >
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-pink-300 border-4 border-black shadow-[0_0_10px_rgba(255,166,207,0.8)]" />
            <div className="hidden sm:block absolute -left-32 top-1 text-right w-24">
              <span className="font-extrabold text-sm text-pink-300 block">{item.year}</span>
              <span className="text-[10px] text-gray-400 block">{item.date}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row gap-4 border border-white/10 hover:border-pink-300/40 transition-all">
              <img src={item.image} alt={item.title} className="w-full sm:w-32 h-32 object-cover rounded-xl flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-bold border border-purple-400/30">
                    {item.tag}
                  </span>
                  <span className="sm:hidden text-[10px] text-gray-400">{item.date}</span>
                </div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
