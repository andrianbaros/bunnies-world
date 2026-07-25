import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    // Detect mobile / touch device
    const checkIsMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isTouchMedia = window.matchMedia('(any-hover: none)').matches;
      return hasTouch || isTouchMedia;
    };

    const mobileCheck = checkIsMobile();
    setIsMobile(mobileCheck);

    if (settings.reducedMotion || mobileCheck) return;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [settings.reducedMotion]);

  if (settings.reducedMotion || isMobile) return null;

  return (
    <div
      className={`fixed pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 ${
        isHovered
          ? 'w-10 h-10 bg-pink-300/30 border-2 border-pink-300 shadow-[0_0_20px_rgba(255,234,245,0.8)] scale-125'
          : 'w-6 h-6 bg-cyan-300/20 border border-cyan-300/60 shadow-[0_0_12px_rgba(191,234,255,0.6)]'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full" />
    </div>
  );
}
