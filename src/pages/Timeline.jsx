import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import timelineData from '../data/json/timeline.json';

export default function Timeline() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-700 dark:text-pink-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TIMELINE</span>
        </span>
        <h1 className="text-hero font-black text-slate-950 dark:text-white">
          {t('timeline_title')}
        </h1>
        <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-md font-bold">
          {t('timeline_sub')}
        </p>
      </div>

      <div className="relative border-l-2 border-pink-500/40 ml-4 sm:ml-32 flex flex-col gap-8 py-4">
        {timelineData.map((item, idx) => {
          const itemTitle = t(`${item.id}_title`, { defaultValue: item.title });
          const itemDesc = t(`${item.id}_desc`, { defaultValue: item.description });
          const itemTag = t(`${item.id}_tag`, { defaultValue: item.tag });

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="relative pl-6 sm:pl-8"
            >
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-pink-500 border-2 border-white dark:border-zinc-950 shadow-xs" />
              <div className="hidden sm:block absolute -left-32 top-1 text-right w-24">
                <span className="font-black text-sm text-pink-600 dark:text-pink-400 block">{item.year}</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-bold">{item.date}</span>
              </div>
              <div className="glass-surface p-6 rounded-3xl flex flex-col sm:flex-row gap-5 border border-pink-500/25 hover:border-pink-500/60 shadow-md transition-all">
                <img src={item.image} alt={itemTitle} className="w-full sm:w-32 h-32 object-cover rounded-2xl flex-shrink-0 shadow-2xs border border-pink-500/20" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-black border border-pink-500/20 uppercase">
                      {itemTag}
                    </span>
                    <span className="sm:hidden text-[11px] text-slate-500 dark:text-zinc-400 font-bold">{item.date}</span>
                  </div>
                  <h3 className="font-black text-base text-slate-950 dark:text-white">{itemTitle}</h3>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{itemDesc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
