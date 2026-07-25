import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import timelineData from '../data/json/timeline.json';

export default function Timeline() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 py-6 px-4 max-w-4xl mx-auto z-10 relative">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase">
          TIMELINE
        </span>
        <h1 className="text-hero">
          {t('timeline_title')}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {t('timeline_sub')}
        </p>
      </div>

      <div className="relative border-l-2 border-pink-500/30 ml-4 sm:ml-32 flex flex-col gap-8 py-4">
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
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-pink-500 border-2 border-white dark:border-zinc-950 shadow-sm" />
              <div className="hidden sm:block absolute -left-32 top-1 text-right w-24">
                <span className="font-bold text-sm text-pink-600 dark:text-pink-400 block">{item.year}</span>
                <span className="text-[11px] text-[var(--text-muted)] block font-semibold">{item.date}</span>
              </div>
              <div className="glass-surface p-5 rounded-2xl flex flex-col sm:flex-row gap-4 border hover:border-pink-500/30 transition-all">
                <img src={item.image} alt={itemTitle} className="w-full sm:w-32 h-32 object-cover rounded-xl flex-shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-bold border border-pink-500/20 uppercase">
                      {itemTag}
                    </span>
                    <span className="sm:hidden text-[11px] text-[var(--text-muted)] font-semibold">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-heading)]">{itemTitle}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{itemDesc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
