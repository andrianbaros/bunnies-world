import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white p-6"
      >
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-black uppercase tracking-widest text-white">
              BUNNIES WORLD
            </h1>
          </div>


          {/* Minimal Progress Bar */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-zinc-500 tracking-wider">{progress}%</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
