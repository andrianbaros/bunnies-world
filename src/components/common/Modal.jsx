import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[var(--bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] z-10 flex flex-col gap-4 shadow-2xl my-auto"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h3 className="text-base font-extrabold text-[var(--text-heading)] uppercase tracking-wider">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
