import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0b14] text-white p-6"
      >
        {/* Grain / Noise Overlay Effect */}
        <div className="absolute inset-0 bg-radial from-pink-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col items-center gap-6 z-10">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-7xl filter drop-shadow-[0_0_20px_rgba(255,234,245,0.8)]"
          >
            🐰
          </motion.div>

          <div className="text-center flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-widest">
              BUNNIES UNIVERSE
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-wider">ENTERING NEWJEANS WORLD...</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-pink-300/30 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(255,234,245,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-xs font-extrabold text-pink-300 tracking-widest">{progress}%</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
